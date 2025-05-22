import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { TransactionType } from '@prisma/client';

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTransaction = z.object({
    description: z.string().min(1, "Descrição obrigatória"),
    amount: z.number().positive("Valor deve ser positivo"),
    date: z.coerce.date({
        errorMap: () => ({ message: "Data inválida" }),
    }),
    categoryId: z.string().refine(isValidObjectId, {
        message: "ID de categoria inválido",
    }),
    type: z.enum([TransactionType.expense, TransactionType.income], {
        errorMap: () => ({ message: "Tipo inválido" }),
    })
})