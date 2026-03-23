import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { execSync } from 'child_process';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list: any[] = await prisma.$queryRaw`SELECT * FROM Settings LIMIT 1`;
    const settings = list[0];
    return NextResponse.json(settings || { chargePrice: '150.00', logoBase64: null });
  } catch (error: any) {
    if (error.message?.includes('no such table')) {
       try {
          await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS Settings (id TEXT PRIMARY KEY NOT NULL, chargePrice TEXT NOT NULL DEFAULT '150.00', logoBase64 TEXT)`;
          return NextResponse.json({ chargePrice: '150.00', logoBase64: null, message: 'Criando tabela...' });
       } catch (e) {}
    }
    return NextResponse.json({ chargePrice: '150.00', logoBase64: null });
  }
}

export async function POST(req: Request) {
  try {
    const { chargePrice, logoBase64 } = await req.json();

    let existingList: any[] = [];
    try {
      existingList = await prisma.$queryRaw`SELECT * FROM Settings LIMIT 1`;
    } catch (error: any) {
      if (error.message?.includes('no such table')) {
        await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS Settings (id TEXT PRIMARY KEY NOT NULL, chargePrice TEXT NOT NULL DEFAULT '150.00', logoBase64 TEXT)`;
      }
    }
    
    const existing = existingList[0];

    if (existing) {
      const price = chargePrice !== undefined ? chargePrice : existing.chargePrice;
      const logo = logoBase64 !== undefined ? logoBase64 : existing.logoBase64;
      
      await prisma.$executeRaw`UPDATE Settings SET chargePrice = ${price}, logoBase64 = ${logo} WHERE id = ${existing.id}`;
    } else {
      const price = chargePrice || '150.00';
      const logo = logoBase64 || '';
      // Cria ID aleatório se precisar
      const newId = Math.random().toString(36).substring(2);
      
      await prisma.$executeRaw`INSERT INTO Settings (id, chargePrice, logoBase64) VALUES (${newId}, ${price}, ${logo})`;
    }

    return NextResponse.json({ success: true, message: 'Configurações salvas!' });

  } catch (error: any) {
    console.error('Erro ao salvar settings:', error);
    return NextResponse.json({ error: error.message || 'Erro ao salvar' }, { status: 500 });
  }
}
