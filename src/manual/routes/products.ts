import { Router } from "express";
import { redis } from "../server";
import { prisma } from "../../prisma/client";

export const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  // Tenta buscar no Redis o cache com key (chave) "products:all"
  const cached = await redis.get("products:all");

  if (cached) {
    console.log("🟢 CACHE HIT");
    // Desserialização pois redis só armazena em string
    return res.json(JSON.parse(cached));
  }

  console.log("🔴 CACHE MISS — buscando no banco");
  const products = await prisma.product.findMany();

  // Teve que ir no Prisma (demora mais) e salva no Redis novamente o novo valor, colocando TTL (Time to leave) para evitar dados desatualizados no cache
  await redis.set("products:all", JSON.stringify(products), { EX: 60 });
  res.json(products);
});

productsRouter.post("/", async (req, res) => {
  const product = await prisma.product.create({ data: req.body });

  // Ao criar novo produto, tem que apagar cache antigo
  await redis.del("products:all");
  console.log("🗑️ Cache invalidado");
  res.json(product);
});

productsRouter.put("/:id", async (req, res) => {
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: req.body,
  });
  await redis.del("products:all");
  console.log("🗑️ Cache invalidado");
  res.json(product);
});