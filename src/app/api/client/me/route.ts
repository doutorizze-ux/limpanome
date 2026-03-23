import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'ID do usuário é obrigatório.' }, { status: 400 });
    }

    const client = await prisma.clientProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        process: true,
        payment: true
      }
    });

    if (!client) {
      // Se não houver perfil ainda, o status é "documentos pendentes"
      return NextResponse.json({ 
        status: 'docs', 
        processStatus: 'analyzing',
        paid: false 
      });
    }

    const isDocFilled = client.cpf && !client.cpf.startsWith('PENDENTE_');

    return NextResponse.json({
      status: client.payment?.status === 'PAID' ? 'track' : isDocFilled ? 'payment' : 'docs',
      processStatus: client.process?.status.toLowerCase() || 'analyzing',
      paid: client.payment?.status === 'PAID',
      fullName: client.user?.name || '',
      cpf: isDocFilled ? client.cpf : '',
      phone: client.phone || '',
      releasePdfUrl: client.process?.releasePdfUrl || null
    });

  } catch (error: any) {
    console.error('Erro ao buscar dados do cliente:', error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
