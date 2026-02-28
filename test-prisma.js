import { PrismaClient, Prisma } from './prisma/generated/prisma/client/index.js';
const prisma = new PrismaClient();
const dec = new Prisma.Decimal('10.50');
console.log(JSON.stringify(dec));
