import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const baseUrl = process.env.DATABASE_URL || '';
const prismaUrl = baseUrl.includes('?') ? `${baseUrl}&pgbouncer=true` : `${baseUrl}?pgbouncer=true`;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: { db: { url: prismaUrl } },
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
