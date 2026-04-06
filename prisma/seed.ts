import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // limpa o banco antes de seedar
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();

  // cria usuários
  const alice = await prisma.user.create({
    data: {
      name: "Alice Silva",
      email: "alice@email.com",
      posts: {
        create: [
          { title: "Introdução ao Redis", content: "Redis é um banco de dados em memória..." },
          { title: "Cache com Prisma", content: "Como usar cache com Prisma e Redis..." },
        ],
      },
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob Santos",
      email: "bob@email.com",
      posts: {
        create: [
          { title: "Node.js na prática", content: "Construindo APIs com Node.js e Express..." },
        ],
      },
    },
  });

  const carol = await prisma.user.create({
    data: {
      name: "Carol Oliveira",
      email: "carol@email.com",
      posts: {
        create: [
          { title: "PostgreSQL avançado", content: "Índices, views e performance no PostgreSQL..." },
          { title: "Docker para devs", content: "Containerizando sua aplicação Node.js..." },
        ],
      },
    },
  });

  // cria produtos
  await prisma.product.createMany({
    data: [
      { name: "Teclado Mecânico", price: 350.00 },
      { name: "Mouse Gamer", price: 180.00 },
      { name: "Monitor 27\"", price: 1200.00 },
      { name: "Headset USB", price: 250.00 },
      { name: "Webcam Full HD", price: 320.00 },
    ],
  });

  console.log("✅ Seed concluído!");
  console.log(`👤 Usuários criados: ${alice.name}, ${bob.name}, ${carol.name}`);
  console.log("📦 5 produtos criados");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });