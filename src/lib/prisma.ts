import { PrismaClient } from '@prisma/client'
import path from 'path';

const prismaClientSingleton = () => {
  // Enforce absolute path for SQLite on production
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl || databaseUrl.startsWith('file:')) {
    const filename = databaseUrl ? databaseUrl.replace(/^file:\/?\/?/, '') : './dev.db';
    
    // Check if the provided path is already absolute (e.g., in Hostinger public_html)
    // If not, resolve it relative to the process root (nodejs folder)
    let absolutePath = filename;
    
    // Windows paths or Unix absolute paths
    const isAbsolute = path.isAbsolute(filename) || filename.startsWith('/');
    
    if (!isAbsolute) {
      absolutePath = path.join(/* turbopackIgnore: true */ process.cwd(), filename);
    } else {
      // Re-add root slash if it was removed by replace
      if (!absolutePath.startsWith('/') && !absolutePath.match(/^[a-zA-Z]:\\/)) {
        absolutePath = '/' + absolutePath;
      }
    }
    
    console.log(`[Prisma] Enforcing database path: ${absolutePath}`);
    
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
