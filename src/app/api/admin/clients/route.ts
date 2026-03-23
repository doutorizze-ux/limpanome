import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const clients = await prisma.clientProfile.findMany({
      include: {
        user: true,
        process: true,
        payment: true
      },
      orderBy: {
        id: 'desc'
      }
    });

    const formattedClients = clients.map(client => ({
      id: client.id,
      name: client.user?.name || 'Sem Nome',
      email: client.user?.email || 'N/A',
      phone: client.phone || 'Não inf.',
      cpf: client.cpf?.startsWith('PENDENTE_') ? 'Aguardando' : client.cpf || '',
      status: client.process?.status || 'ANALYZING',
      docs: 'Termo Assinado',
      pay: client.payment?.status === 'PAID' ? 'Pago' : 'Aguardando',
      signature: client.signature
    }));

    return NextResponse.json(formattedClients);

  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
