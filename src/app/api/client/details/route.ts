import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, fullName, cpf, phone, signature } = await req.json();

    if (!userId || !cpf) {
      return NextResponse.json({ error: 'ID do usuário e CPF são obrigatórios.' }, { status: 400 });
    }

    // Upsert Profile
    const profile = await prisma.clientProfile.upsert({
      where: { userId },
      update: {
        cpf,
        phone,
        signature
      },
      create: {
        userId,
        cpf,
        phone,
        signature
      }
    });

    // Se o nome no User também mudou, atualiza
    if (fullName) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: fullName }
      });
    }

    return NextResponse.json({ success: true, profileId: profile.id });

  } catch (error: any) {
    console.error('Erro ao salvar detalhes:', error);
    return NextResponse.json({ error: 'Erro ao salvar os dados no banco.' }, { status: 500 });
  }
}
