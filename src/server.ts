import app from './app';

import dotenv from 'dotenv';
dotenv.config();

const PORT = Number(process.env.PORT || 3001);

const starServer = async () => {
  try {
    await app.listen({ port: PORT }).then(() => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

starServer();
