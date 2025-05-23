import app from './app';
import { prismaConnect } from './config/prisma';
import { initializeGlobalCategories } from './services/globalCategories.service';
import { env } from './config/env';


const PORT = env.PORT

const starServer = async () => {
  try {

    await prismaConnect();

    await initializeGlobalCategories()

    await app.listen({ port: PORT }).then(() => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

starServer();
