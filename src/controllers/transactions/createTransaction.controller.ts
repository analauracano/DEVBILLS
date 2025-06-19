import type { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../../config/prisma';
import { createTransactionSchema } from '../../schemas/transaction.schema';

const createTransaction = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const userId = 'ANALAURA';

  if (!userId) {
    reply.status(401).send({ error: 'Usuário não autenticado' });
    return;
  }

  const result = createTransactionSchema.safeParse(request.body);

  if (!result.success) {
    const errorMessage = result.error.errors[0].message || 'Validação inválida'

    reply.status(400).send({ error: errorMessage });
    return;
  }

  const transaction = result.data;

  try {
    const category = await prisma.category.findFirst({
        where: {
            id: transaction.categoryId,
            type: transaction.type,
        },
    });
    
    if (!category) {
        reply.status(400).send({ error: 'Categoria inválida ou não encontrada' });
        return;
    }

    const parseDate = new Date(transaction.date);

    const newTransaction = await prisma.transaction.create({
        data: {
            ...transaction,
            userId,
            date: parseDate,
        },
        include: {
            Category: true,
        },
    });

    reply.status(201).send(newTransaction);
  } catch (err) {
    request.log.error('Erro ao criar transação', err);
    reply.status(500).send({ error: 'Erro ao criar transação' });
  }
};

export default createTransaction;
