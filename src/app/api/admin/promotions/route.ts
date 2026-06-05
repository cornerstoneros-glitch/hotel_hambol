import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const PERSISTENT_PATH = path.join(process.cwd(), 'prisma', 'promotions.json');
const DEFAULT_PATH = path.join(process.cwd(), 'src', 'data', 'promotions.json');

async function getPromotionsData() {
  try {
    if (existsSync(PERSISTENT_PATH)) {
      const raw = await readFile(PERSISTENT_PATH, 'utf-8');
      return JSON.parse(raw);
    }
    // Auto-migrate from template on first load
    const raw = await readFile(DEFAULT_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    await writeFile(PERSISTENT_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
    return parsed;
  } catch (error) {
    console.error('[promotions-api] Error reading data:', error);
    return {};
  }
}

export async function GET() {
  const data = await getPromotionsData();
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    }
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await writeFile(PERSISTENT_PATH, JSON.stringify(body, null, 2), 'utf-8');
    
    console.log(`[promotions-api] Successfully saved promotions to ${PERSISTENT_PATH}`);
    return NextResponse.json({ success: true }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      }
    });
  } catch (error) {
    console.error('Promotions write error:', error);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 });
  }
}
