import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueId = Date.now();
    const extension = path.extname(file.name) || '.jpg';
    const fileName = `promo_${uniqueId}${extension}`;

    const relativePath = `/uploads/promotions/${fileName}`;
    const absolutePath = path.join(process.cwd(), 'public', 'uploads', 'promotions', fileName);

    await writeFile(absolutePath, buffer);

    return NextResponse.json({ url: relativePath });
  } catch (error) {
    console.error('Promo upload error:', error);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
