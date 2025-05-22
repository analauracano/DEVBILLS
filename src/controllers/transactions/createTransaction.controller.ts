import type { FastifyReply, FastifyRequest } from 'fastify';

const createTransaction = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const userId = 'ANALAURA';

  if (!userId) {
    reply.status(401).send({ error: 'Usuário não autenticado' });
  }
};

export default createTransaction;
