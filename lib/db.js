import { PrismaClient } from "@prisma/client";

// Evita criar varias instancias do Prisma durante o desenvolvimento (hot reload)
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
