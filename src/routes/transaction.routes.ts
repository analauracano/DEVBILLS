import type { FastifyInstance } from 'fastify';
import createTransaction from '../controllers/transactions/createTransaction.controller';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { createTransactionSchema, getTransactionsSchema, getTransactionsSummarySchema } from '../schemas/transaction.schema';
import { getTransactions } from '../controllers/transactions/getTransactions.controller';
import { getTransactionsSummary } from '../controllers/transactions/getTransactionsSummary.controller';

const transactionRoutes = async (fastify: FastifyInstance) => {
  // Criação de rotas para transações
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
        body:  zodToJsonSchema(createTransactionSchema),
    },
    handler: createTransaction,
  });

  // Buscar transações com filtros
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
        querystring: zodToJsonSchema(getTransactionsSchema),
    },
    handler: getTransactions,
  });

  fastify.route({
    method: 'GET',
    url: '/summary',
    schema: {
      querystring: zodToJsonSchema(getTransactionsSummarySchema),
    },
    handler: getTransactionsSummary
  });
};

export default transactionRoutes;
