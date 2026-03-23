import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const usersCount = await prisma.user.count();
    const profilesCount = await prisma.clientProfile.count();
    
    const users = await prisma.user.findMany({ include: { clientProfile: true } });

    return NextResponse.json({
      usersCount,
      profilesCount,
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        profileId: u.clientProfile?.id || null,
        cpf: u.clientProfile?.cpf || null
      }))
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
