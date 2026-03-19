import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, E-mail e Senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'E-mail já está cadastrado no sistema.' },
        { status: 400 }
      );
    }

    // Hash da Senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar Usuário e Perfil Vazio de Cliente
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CLIENT',
        clientProfile: {
          create: {
            phone: phone || '',
            cpf: 'PENDENTE_' + Date.now(), // Temporário até ele preencher o dashboard
            process: {
              create: {
                status: 'ANALYZING'
              }
            }
          }
        }
      },
      include: {
        clientProfile: {
          include: {
            process: true
          }
        }
      }
    });

    return NextResponse.json(
      { message: 'Cadastro realizado com sucesso!', userId: newUser.id },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Erro no Signup:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar cadastro' },
      { status: 500 }
    );
  }
}
