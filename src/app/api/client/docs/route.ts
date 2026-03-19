import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const cpf = formData.get('cpf') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const cep = formData.get('cep') as string;

    const rgFront = formData.get('rgFront') as File | null;
    const rgBack = formData.get('rgBack') as File | null;
    const proofOfAddress = formData.get('proofOfAddress') as File | null;

    if (!userId || !cpf) {
      return NextResponse.json({ error: 'UserID e CPF são obrigatórios' }, { status: 400 });
    }

    // Atualizar Perfil
    const client = await prisma.clientProfile.update({
      where: { userId },
      data: {
        cpf,
        address,
        city,
        state,
        cep
      }
    });

    // Função auxiliar upload
    const uploadFile = async (file: File, type: string) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${client.id}_${type}_${Date.now()}${path.extname(file.name) || '.jpg'}`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      await fs.writeFile(filePath, buffer);
      
      await prisma.document.create({
        data: {
          clientId: client.id,
          type,
          fileUrl: `/uploads/${fileName}`
        }
      });
    };

    if (rgFront && rgFront.size > 0) await uploadFile(rgFront, 'RG_FRONT');
    if (rgBack && rgBack.size > 0) await uploadFile(rgBack, 'RG_BACK');
    if (proofOfAddress && proofOfAddress.size > 0) await uploadFile(proofOfAddress, 'ADDRESS');

    return NextResponse.json({ message: 'Documentos salvos com sucesso!', clientId: client.id });

  } catch (error: any) {
    console.error('Erro no upload de documentos:', error);
    return NextResponse.json({ error: 'Falha no upload de documentos do cliente' }, { status: 500 });
  }
}
