import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');

  try {
    const dishes = await prisma.dish.findMany({
      where: siteId ? { siteId } : {},
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ dishes });
  } catch (error) {
    console.error('Get dishes error:', error);
    return NextResponse.json({ dishes: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dish = await prisma.dish.create({
      data: {
        name: body.name,
        category: body.category,
        description: body.description,
        price: body.price ? parseFloat(body.price) : null,
        image: body.image || '/images/food/dish_default.png',
        siteId: body.siteId,
      }
    });
    return NextResponse.json({ dish }, { status: 201 });
  } catch (error) {
    console.error('Create dish error:', error);
    return NextResponse.json({ error: 'Erreur lors de la création.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

  try {
    await prisma.dish.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
