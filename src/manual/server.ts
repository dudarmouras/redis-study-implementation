import "dotenv/config";
import express from "express";
import { createClient } from "redis"; // biblioteca que faz a ponte entre o Node e o servidor Redis
import { productsRouter } from "./routes/products";

export const redis = createClient({ url: process.env.REDIS_URL }); // Cria a instância do cliente Redis apontando pro servidor

const app = express();
app.use(express.json());
app.use("/products", productsRouter);

// O cliente Redis não conecta automaticamente ao ser criado, tem que conectar manualmente
const start = async () => {
  await redis.connect();
  console.log("✅ Redis conectado");
  app.listen(3001, () => console.log("🚀 Manual rodando na porta 3001"));
};

start();