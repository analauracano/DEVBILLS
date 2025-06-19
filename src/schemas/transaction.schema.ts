import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { TransactionType } from '@prisma/client';

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTransactionSchema = z.object({
  description: z.string().min(1, 'Descrição obrigatória'),
  amount: z.number().positive('Valor deve ser positivo'),
  date: z.coerce.date({
    errorMap: () => ({ message: 'Data inválida' }),
  }),
  categoryId: z.string().refine(isValidObjectId, {
    message: 'Categoria inválida',
  }),
  type: z.enum([TransactionType.expense, TransactionType.income], {
    errorMap: () => ({ message: 'Data inválida' }),
  }),
});

export const getTransactionsSchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
  type: z
    .enum([TransactionType.expense, TransactionType.income], {
      errorMap: () => ({ message: 'Tipo inválido' }),
    })
    .optional(),
  categoryId: z
    .string()
    .refine(isValidObjectId, {
      message: 'Categoria inválida',
    })
    .optional(),
});

export const getTransactionsSummarySchema = z.object({
  month: z.string({message: 'O mês é obrigatório'}),
  year: z.string({message: 'O ano é obrigatório'}),
})

export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;

export type getTransactionsSummarySchemaQuery = z.infer<typeof getTransactionsSummarySchema>;




