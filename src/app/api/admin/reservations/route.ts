import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        room: {
          include: {
            site: true,
            roomType: true,
          }
        },
        client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Fetch reservations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, reservation });
  } catch (error) {
    console.error('Update reservation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
