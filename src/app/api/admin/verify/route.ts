import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userRole = cookieStore.get('userRole')?.value;

  if (userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
  }

  const formData = await request.formData();
  const farmerId = formData.get('farmerId') as string;

  await prisma.user.update({
    where: { id: farmerId },
    data: { isVerified: true }
  });

  return NextResponse.redirect(new URL('/dashboard/admin', request.url), { status: 303 });
}
