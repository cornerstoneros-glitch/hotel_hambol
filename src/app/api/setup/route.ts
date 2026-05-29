import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

/**
 * ONE-TIME SETUP ENDPOINT
 * Visit /api/setup once to initialize the database on the production server.
 * After running, the database will be fully seeded and ready to use.
 */
export async function GET() {
  try {
    // 1. Automatically create database directory if it does not exist
    const dbUrl = process.env.DATABASE_URL || '';
    if (dbUrl.startsWith('file:')) {
      const dbPath = dbUrl.replace('file:', '');
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created database directory: ${dir}`);
      }
    }

    // Create all tables using raw SQL (works even if Prisma migration hasn't been run)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Site" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "location" TEXT,
        "description" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "RoomType" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "price" REAL NOT NULL DEFAULT 25000,
        "capacity" INTEGER NOT NULL DEFAULT 2,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "name" TEXT,
        "password" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'CLIENT',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "LoyaltyProgram" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "points" INTEGER NOT NULL DEFAULT 0,
        "tier" TEXT NOT NULL DEFAULT 'STANDARD',
        "userId" TEXT NOT NULL UNIQUE,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Transaction" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "amount" REAL NOT NULL,
        "type" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "description" TEXT,
        "userId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Room" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "number" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
        "roomTypeId" TEXT NOT NULL,
        "siteId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("siteId") REFERENCES "Site"("id"),
        FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id")
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Reservation" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "checkIn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "checkOut" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "totalPrice" REAL NOT NULL DEFAULT 0,
        "roomId" TEXT NOT NULL,
        "clientId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("clientId") REFERENCES "User"("id"),
        FOREIGN KEY ("roomId") REFERENCES "Room"("id")
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ConciergeRequest" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "type" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "description" TEXT,
        "roomNumber" TEXT NOT NULL DEFAULT '101',
        "site" TEXT NOT NULL DEFAULT 'Azaguié',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Review" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "rating" INTEGER NOT NULL DEFAULT 5,
        "comment" TEXT,
        "category" TEXT,
        "userId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Staff" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL UNIQUE,
        "siteId" TEXT NOT NULL,
        "position" TEXT NOT NULL DEFAULT 'STAFF',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"("id"),
        FOREIGN KEY ("siteId") REFERENCES "Site"("id")
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Service" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "price" REAL,
        "siteId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("siteId") REFERENCES "Site"("id")
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "InventoryItem" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "category" TEXT NOT NULL DEFAULT 'Divers',
        "quantity" REAL NOT NULL DEFAULT 0,
        "unit" TEXT NOT NULL DEFAULT 'unité',
        "minThreshold" REAL NOT NULL DEFAULT 5,
        "siteId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("siteId") REFERENCES "Site"("id")
      )
    `);

    // ─── SEED DATA ───────────────────────────────────────────────────────────

    // Sites
    await prisma.$executeRawUnsafe(`
      INSERT OR IGNORE INTO "Site" (id, name, location, description)
      VALUES 
        ('azaguie', 'Azaguié', 'Ahoua', 'L Évasion Naturelle'),
        ('yopougon', 'Yopougon', 'Ananeraie', 'L Élégance Urbaine')
    `);

    // Room Types
    const rt1 = 'rt-standard'; const rt2 = 'rt-suite'; const rt3 = 'rt-famille';
    await prisma.$executeRawUnsafe(`
      INSERT OR IGNORE INTO "RoomType" (id, name, description, price, capacity)
      VALUES
        ('${rt1}', 'Chambre Standard', 'Chambre élégante et confortable', 25000, 2),
        ('${rt2}', 'Suite Deluxe', 'Suite luxueuse avec vue panoramique', 45000, 2),
        ('${rt3}', 'Chambre Familiale', 'Espace généreux pour toute la famille', 35000, 4)
    `);

    // Admin & Super Admin Users
    await prisma.$executeRawUnsafe(`
      INSERT OR IGNORE INTO "User" (id, email, name, password, role)
      VALUES 
        ('usr-super', 'admin@hambol.com', 'Super Admin Hambol', 'hambol2025', 'SUPER_ADMIN'),
        ('usr-admin', 'direction@hambol.com', 'Direction Hambol', 'hambol2025', 'ADMIN')
    `);

    // Staff Profiles
    await prisma.$executeRawUnsafe(`
      INSERT OR IGNORE INTO "Staff" (id, userId, siteId, position)
      VALUES
        ('stf-super', 'usr-super', 'azaguie', 'SUPER_ADMIN'),
        ('stf-admin', 'usr-admin', 'azaguie', 'ADMIN')
    `);

    return NextResponse.json({
      success: true,
      message: '✅ Base de données initiale de production générée avec succès !',
      comptes: {
        superAdmin: { email: 'admin@hambol.com', password: 'hambol2025', role: 'SUPER_ADMIN' },
        direction: { email: 'direction@hambol.com', password: 'hambol2025', role: 'ADMIN' }
      }
    });

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Setup error:', msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
