import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Credenciais Fixas para o Admin do Escritório
    const ADMIN_EMAIL = 'admin@limpanome.com';
    const ADMIN_PASSWORD = 'admin123';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json({ 
        success: true, 
        role: 'ADMIN',
        message: 'Acesso autorizado' 
      });
    }

    return NextResponse.json(
      { error: 'Credenciais de administrador inválidas!' }, 
      { status: 401 }
    );

  } catch (error: any) {
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
