import "dotenv/config";
import express from "express";
import createPrismaRedisCache  from "prisma-redis-extension";
import Redis from "ioredis";
import { prisma } from "../prisma/client";
import { productsRouter } from "./routes/products";

// Cria conexão com o Redis, o ioredis faz ser automaticamente instanciado e passado pra dentro do extension
const redis = new Redis({ host: "localhost", port: 6379 });

export const prismaWithCache = prisma.$extends(
  createPrismaRedisCache({
    // Regras do cache por model
    models: [
      { model: "Product", cacheTime: 60 },
      { model: "User", cacheTime: 60, invalidateRelated: ["Post"] },
      { model: "Post", cacheTime: 180 },
    ],
    storage: {
      type: "redis", // Usa Redis como storage
      options: {
        client: redis, // Passa o cliente redis criado 
        invalidation: { referencesTTL: 300 },
        log: console, /// Loga tudo o que o extension fizer
      },
    },
    cacheTime: 300,
    excludeMethods: ["count"],
    onHit: (key) => console.log("🟢 CACHE HIT", key),
    onMiss: (key) => console.log("🔴 CACHE MISS", key),
    onError: (key) => console.log("❌ CACHE ERROR", key),
  })
);

const app = express();
app.use(express.json());
app.use("/products", productsRouter);

app.listen(3002, () => console.log("🚀 Extension rodando na porta 3002"));