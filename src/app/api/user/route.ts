import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prismaUser = new PrismaClient();

export async function GET() {
  const users = await prismaUser.user.findMany({
    where: { role: 'User' },
    select: { id: true, name: true, email: true },
  });
  return NextResponse.json(users);
}
