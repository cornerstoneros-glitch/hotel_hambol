import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueId = Date.now();
    const extension = path.extname(file.name) || '.jpg';
    const fileName = `promo_${uniqueId}${extension}`;

    const dir = path.join(process.cwd(), 'public', 'uploads', 'promotions');
    const absolutePath = path.join(dir, fileName);
    const relativePath = `/uploads/promotions/${fileName}`;

    // Ensure directory exists
    await mkdir(dir, { recursive: true });
    await writeFile(absolutePath, buffer);

    console.log(`[promo-upload] Saved: ${absolutePath}`);
    return NextResponse.json({ url: relativePath });
  } catch (error) {
    console.error('[promo-upload] Error:', error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload", detail: String(error) },
      { status: 500 }
    );
  }
}
