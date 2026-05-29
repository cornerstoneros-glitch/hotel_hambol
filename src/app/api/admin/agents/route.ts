import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const agents = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'STAFF'] }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        staffProfile: {
          select: { position: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Get agents error:', error);
    return NextResponse.json({ agents: [] });
  }
}
