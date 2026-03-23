import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'public', 'settings.json');

export async function GET() {
  try {
    const data = await fs.readFile(settingsPath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    // Se não existir, retorna o padrão
    return NextResponse.json({ chargePrice: '150.00' });
  }
}

export async function POST(req: Request) {
  try {
    const { chargePrice } = await req.json();

    if (!chargePrice) {
      return NextResponse.json({ error: 'Preço é obrigatório.' }, { status: 400 });
    }

    await fs.writeFile(settingsPath, JSON.stringify({ chargePrice }));

    return NextResponse.json({ success: true, message: 'Configurações salvas!' });

  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
  }
}
