import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const cuisines = [
    "Italian",
    "Chinese",
    "Indian",
    "Mexican",
    "Japanese",
    "American",
    "Thai",
    "Mediterranean",
  ];

  console.log("Seeding cuisines...");

  for (const name of cuisines) {
    await prisma.cuisine.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Cuisines seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
