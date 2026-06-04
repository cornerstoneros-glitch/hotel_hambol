import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

/**
 * ONE-TIME SETUP ENDPOINT
 * Visit /api/setup once to initialize the database on the production server.
 * After running, the database will be fully seeded and ready to use.
 */
export async function GET(request: NextRequest) {
  try {
    const reset = request.nextUrl.searchParams.get('reset') === 'true';
    if (reset) {
      // Drop all tables in reverse order of foreign key constraints
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "DishComponent"`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Dish"`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "InventoryItem"`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Service"`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Staff"`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Review"`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "ConciergeRequest"`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "GuestPreferences"`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "KycData"`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Reservation"`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Room"`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Transaction"`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "LoyaltyProgram"`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "User"`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "RoomType"`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Site"`);
      console.log('[Setup] Database reset: all tables dropped.');
    }

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
        "checkInStatus" TEXT NOT NULL DEFAULT 'NOT_STARTED',
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
      CREATE TABLE IF NOT EXISTS "KycData" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "idType" TEXT NOT NULL,
        "idNumber" TEXT NOT NULL,
        "idExpiry" DATETIME,
        "idImage" TEXT,
        "reservationId" TEXT NOT NULL UNIQUE,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "GuestPreferences" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "pillowType" TEXT,
        "beverages" TEXT,
        "cleaningTime" TEXT,
        "dietaryNotes" TEXT,
        "userId" TEXT NOT NULL UNIQUE,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
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

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Dish" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "description" TEXT,
        "price" REAL,
        "image" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "siteId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("siteId") REFERENCES "Site"("id")
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "DishComponent" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "optional" BOOLEAN NOT NULL DEFAULT 0,
        "dishId" TEXT NOT NULL,
        FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE
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

    // New Tariffs (Room Types) based on Image
    const tariffs = [
      { id: 'rt-passage', name: 'Passage 1h30', desc: 'Passage rapide 1h30', price: 10000, cap: 2 },
      { id: 'rt-longrepos', name: 'Long Repos (10h)', desc: 'Repos prolongé 10h', price: 15000, cap: 2 },
      { id: 'rt-nuitee', name: 'Nuitée (22h-12h)', desc: '22H au lendemain midi', price: 15000, cap: 2 },
      { id: 'rt-sejour-20', name: 'Séjour 24h (Standard)', desc: '24H + Petit Déjeuner + Eau', price: 20000, cap: 2 },
      { id: 'rt-sejour-25', name: 'Séjour 24h (Complet)', desc: '24H + P.Dej (2) + Dej (1)', price: 25000, cap: 2 },
    ];

    for (const t of tariffs) {
      await prisma.$executeRawUnsafe(`
        INSERT OR IGNORE INTO "RoomType" (id, name, description, price, capacity)
        VALUES ('${t.id}', '${t.name}', '${t.desc}', ${t.price}, ${t.cap})
      `);
    }

    // Rooms initialization: 11 rooms per site (Azaguie: 101-111, Yopougon: 201-211)
    for (let i = 1; i <= 11; i++) {
      // Azaguie rooms
      const azNum = 100 + i;
      await prisma.$executeRawUnsafe(`
        INSERT OR IGNORE INTO "Room" (id, number, status, siteId, roomTypeId)
        VALUES ('az-r${azNum}', '${azNum}', 'AVAILABLE', 'azaguie', 'rt-nuitee')
      `);
      // Yopougon rooms
      const yopNum = 200 + i;
      await prisma.$executeRawUnsafe(`
        INSERT OR IGNORE INTO "Room" (id, number, status, siteId, roomTypeId)
        VALUES ('yop-r${yopNum}', '${yopNum}', 'AVAILABLE', 'yopougon', 'rt-nuitee')
      `);
    }

    // Dishes (Initial Menu)
    await prisma.$executeRawUnsafe(`
      INSERT OR IGNORE INTO "Dish" (id, name, category, image, siteId)
      VALUES 
        ('d1', 'Carpes & Poissons Braisés', 'Signature', '/images/food/dish_1.png', 'azaguie'),
        ('d2', 'Alloco & Bananes Fraîches', 'Terroir', '/images/food/dish_2.png', 'azaguie'),
        ('d3', 'Spécialités de Riz & Soupes', 'Tradition', '/images/food/dish_3.png', 'azaguie'),
        ('d4', 'Gastronomie Fine', 'L Excellence', '/images/yopougon/food/cuisine_1.png', 'yopougon'),
        ('d5', 'Spécialités du Chef', 'Signature', '/images/yopougon/food/cuisine_2.png', 'yopougon'),
        ('d6', 'Saveurs d Antan', 'Tradition', '/images/yopougon/food/cuisine_3.png', 'yopougon')
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
      message: '✅ Base de données et TARIFS HOTEL initialisés avec succès !',
      counts: {
        sites: 2,
        tariffs: tariffs.length,
        rooms: 22
      },
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
