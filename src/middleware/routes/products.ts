import { Router } from "express";
import { prismaWithCache } from "../server";

export const productsRouter = Router();

// sem nenhuma menção ao Redis — o extension cuida tudo automaticamente
productsRouter.get("/", async (req, res) => {
  const products = await prismaWithCache.product.findMany();
  res.json(products);
});

productsRouter.post("/", async (req, res) => {
  const product = await prismaWithCache.product.create({ data: req.body });
  res.json(product);
});

productsRouter.put("/:id", async (req, res) => {
  const product = await prismaWithCache.product.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(product);
});