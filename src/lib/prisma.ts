import { PrismaClient } from '@prisma/client'
import path from 'path';

const prismaClientSingleton = () => {
  // Enforce absolute path for SQLite on production
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl || databaseUrl.startsWith('file:')) {
    const filename = databaseUrl ? databaseUrl.replace('file:', '') : './dev.db';
    
    // In many hosted environments, we need an absolute path
    // We assume dev.db is in the project root
    const absolutePath = path.join(/* turbopackIgnore: true */ process.cwd(), filename.startsWith('./') ? filename : `./${filename}`);
    
    console.log(`[Prisma] Enforcing absolute path: ${absolutePath}`);
    
    return new PrismaClient({
      datasources: {
        db: {
          url: `file:${absolutePath}`,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
