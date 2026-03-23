import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    return NextResponse.json(settings || { chargePrice: '150.00', logoBase64: null });
  } catch (error) {
    return NextResponse.json({ chargePrice: '150.00', logoBase64: null });
  }
}

export async function POST(req: Request) {
  try {
    const { chargePrice, logoBase64 } = await req.json();

    const existing = await prisma.settings.findFirst();

    if (existing) {
      await prisma.settings.update({
        where: { id: existing.id },
        data: {
          chargePrice: chargePrice !== undefined ? chargePrice : existing.chargePrice,
          logoBase64: logoBase64 !== undefined ? logoBase64 : existing.logoBase64
        }
      });
    } else {
      await prisma.settings.create({
        data: {
          chargePrice: chargePrice || '150.00',
          logoBase64: logoBase64 || ''
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Configurações salvas!' });

  } catch (error: any) {
    console.error('Erro ao salvar settings:', error);
    return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
  }
}
