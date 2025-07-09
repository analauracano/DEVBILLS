import type { FastifyReply, FastifyRequest } from 'fastify';
import type { getTransactionsSummarySchemaQuery } from '../../schemas/transaction.schema';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import prisma from '../../config/prisma';
import type { CategorySummary } from '../../types/category.types';
import { TransactionType } from '@prisma/client';
import { checkPrime } from 'crypto';
import { TransactionsSummary } from '../../types/transaction.type';
dayjs.extend(utc);

export const getTransactionsSummary = async (
  request: FastifyRequest<{ Querystring: getTransactionsSummarySchemaQuery }>,
  reply: FastifyReply,
): Promise<void> => {
    const userId = 'ANALAURA';

    if (!userId) {
        reply.status(401).send({ error: 'Usuário não autenticado' });
        return;
    }

    const { month, year } = request.query;

    if (!month || !year) {
        reply.status(400).send({ error: 'Mês e ano são obrigatórios' });
        return;
    }

    const startDate = dayjs.utc(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = dayjs.utc(startDate).endOf('month').toDate();

    try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      }, 
        include: {
            Category: true,
        },
  });

  let totalExpenses = 0;
  let totalIncomes = 0;
  const groupedExpenses = new Map<string, CategorySummary>();

  for(const transaction of transactions){
    if (transaction.type === TransactionType.expense){

      const categoryId = transaction.categoryId ?? '';
      const existing = groupedExpenses.get(categoryId) ?? {
        categoryId: categoryId,
        categoryName: transaction.Category?.name ?? '',
        categoryColor: transaction.Category?.color ?? '',
        amount: 0,
        percentage: 0,
      }
      existing.amount += transaction.amount;

      groupedExpenses.set(categoryId, existing);

      totalExpenses += transaction.amount

    } else {
      totalIncomes += transaction.amount
    }
  } 

  console.log(Array.from(groupedExpenses.values()));

const summary: TransactionsSummary ={
  totalExpenses,
  totalIncomes,
  balance: totalIncomes - totalExpenses,
  expensesByCategory: Array.from(groupedExpenses.values()).map((entry) => ({
    ...entry,
    percentage: Number.parseFloat(((entry.amount / totalExpenses) * 100).toFixed(2))
  })).sort((a, b) => b.amount - a.amount)
}
  reply.send(summary);
} catch (err) {
    request.log.error('Erro ao buscar transações', err);
    reply.status(500).send({ error: 'Erro do servidor' });
  }
};
