import type { FastifyInstance } from 'fastify';
import createTransaction from '../controllers/transactions/createTransaction.controller';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { createTransactionSchema, getTransactionsSchema } from '../schemas/transaction.schema';
import { getTransactions } from '../controllers/transactions/getTransactions.controller';

const transactionRoutes = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
        body:  zodToJsonSchema(createTransactionSchema),
    },
    handler: createTransaction,
  });

  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
        querystring: zodToJsonSchema(getTransactionsSchema),
    },
    handler: getTransactions
  })
};

export default transactionRoutes;
