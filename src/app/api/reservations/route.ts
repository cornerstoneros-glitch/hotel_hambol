import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      siteName, 
      roomTypeId, 
      checkIn, 
      checkOut, 
      clientName, 
      clientEmail, 
      guestCount,
      totalPrice 
    } = body;

    // 1. Find or Create User
    let user = await prisma.user.findUnique({
      where: { email: clientEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: clientEmail,
          name: clientName,
          password: 'password_placeholder', // In a real app, handle auth properly
          role: 'CLIENT',
        },
      });
    }

    // 2. Find an available room of the requested type for the site
    const site = await prisma.site.findFirst({
      where: { name: siteName },
    });

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 400 });
    }

    const availableRoom = await prisma.room.findFirst({
      where: {
        siteId: site.id,
        roomTypeId: roomTypeId,
        status: 'AVAILABLE',
      },
    });

    if (!availableRoom) {
      return NextResponse.json({ error: 'No rooms available for these criteria' }, { status: 400 });
    }

    // 3. Create Reservation
    const reservation = await prisma.reservation.create({
      data: {
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        status: 'PENDING',
        totalPrice: parseFloat(totalPrice),
        roomId: availableRoom.id,
        clientId: user.id,
      },
    });

    return NextResponse.json({ success: true, reservation });
  } catch (error) {
    console.error('Reservation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
