import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clients = await prisma.clientProfile.findMany({
      include: {
        user: true,
        process: true,
        payment: true,
        documents: true
      },
      orderBy: {
        id: 'desc'
      }
    });

    const formattedClients = clients.map(client => ({
      id: client.id,
      name: client.user.name,
      email: client.user.email,
      phone: client.phone || 'Não inf.',
      cpf: client.cpf,
      status: client.process?.status || 'ANALYZING',
      docs: client.documents.length > 0 ? 'Completo' : 'Termo Assinado',
      pay: client.payment?.status === 'PAID' ? 'Pago' : 'Aguardando'
    }));

    return NextResponse.json(formattedClients);

  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
