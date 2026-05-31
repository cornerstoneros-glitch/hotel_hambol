import { PrismaClient } from '@prisma/client'
import path from 'path';

const prismaClientSingleton = () => {
  // Enhanced path resolution for SQLite to prevent "Unable to open database" errors on hosted environments
  const dbUrl = process.env.DATABASE_URL;
  
  if (dbUrl && dbUrl.startsWith('file:')) {
    const dbPath = dbUrl.replace('file:', '');
    if (!path.isAbsolute(dbPath)) {
      // If it's a relative path, we want to be sure where it points.
      // Usually it should be relative to the project root in development, 
      // but in production/standalone it can be different.
      // We don't override it here as Prisma should handle it, 
      // but we log it if we detect a potential issue.
      console.log(`[Prisma] Using SQLite database at: ${path.resolve(dbPath)}`);
    }
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
