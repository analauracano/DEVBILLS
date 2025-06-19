import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    PORT: z.string().transform(Number).default("3001"),
    DATABASE_URL: z.string().min(5, "DATABASE_URL é obrigatória"),
    NODE_ENV: z.enum(["dev", "prod", "test"], {
        message: "node ENV deve ser dev, prod ou test",
}),
});

const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error("❌ Erro ao carregar variáveis de ambiente")
    process.exit(1);
}

export const env = _env.data;