import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sites = await prisma.site.findMany({
      include: {
        rooms: {
          include: {
            reservations: {
              where: {
                status: 'CONFIRMED',
                checkIn: { lte: new Date() },
                checkOut: { gte: new Date() },
              }
            }
          }
        },
        _count: {
          select: { rooms: true }
        }
      }
    });

    const stats = sites.map(site => {
      const occupiedRooms = site.rooms.filter(room => room.status === 'OCCUPIED' || room.reservations.length > 0).length;
      const totalRooms = 11; // User requirement: 11 rooms per site
      const occupancyRate = (occupiedRooms / totalRooms) * 100;
      
      return {
        siteId: site.id,
        siteName: site.name,
        occupiedRooms,
        totalRooms,
        occupancyRate: Math.round(occupancyRate),
        revenue: site.rooms.reduce((acc, room) => acc + (room.reservations.reduce((rAcc, r) => rAcc + r.totalPrice, 0)), 0)
      };
    });

    const totalOccupancy = Math.round(stats.reduce((acc, s) => acc + s.occupancyRate, 0) / sites.length);
    const totalRevenue = stats.reduce((acc, s) => acc + s.revenue, 0);

    return NextResponse.json({ 
      overall: {
        occupancy: totalOccupancy,
        revenue: totalRevenue,
        pendingReservations: await prisma.reservation.count({ where: { status: 'PENDING' } })
      },
      sites: stats 
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
