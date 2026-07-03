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
  const action = formData.get('action') as string;
  
  if (action === 'create') {
    const name = formData.get('name') as string;
    if (name) {
      await prisma.category.create({ data: { name } }).catch(() => {});
    }
  } else if (action === 'delete') {
    const id = formData.get('categoryId') as string;
    await prisma.category.delete({ where: { id } }).catch(() => {});
  }

  return NextResponse.redirect(new URL('/dashboard/admin', request.url), { status: 303 });
}
