import type { FastifyInstance } from 'fastify';
import createTransaction from '../controllers/transactions/createTransaction.controller';

const transactionRoutes = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
        body: {
            type: 'object',
            required: ['description', 'amount', 'date', 'categoryId', 'type'],
            properties: {
                description: { type: 'string' },
                amount: { type: 'number' },
                date: { type: 'string', format: 'date-time' },
                categoryId: { type: 'string' },
                type: { type: 'string', enum: ['income', 'expense'] },
            },
        },
    },
    handler: createTransaction,
  });
};

export default transactionRoutes;
