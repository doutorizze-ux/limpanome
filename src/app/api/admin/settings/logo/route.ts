import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const logoFile = formData.get('logo') as File | null;

    if (!logoFile || logoFile.size === 0) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const buffer = Buffer.from(await logoFile.arrayBuffer());
    const filePath = path.join(process.cwd(), 'public', 'logo.png'); // Sobrescreve a logo global
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ message: 'Logo salva com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar logo:', error);
    return NextResponse.json({ error: 'Falha ao salvar logo' }, { status: 500 });
  }
}
