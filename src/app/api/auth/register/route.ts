import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;
  const location = formData.get('location') as string;
  const cropTypes = formData.get('cropTypes') as string;

  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password || 'password123', 10);
      user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role, location, cropTypes }
      });
    }

    let redirectUrl = '/market';
    if (role === 'FARMER') redirectUrl = '/dashboard/farmer';
    if (role === 'ADMIN') redirectUrl = '/dashboard/admin';
    if (role === 'CONSUMER') redirectUrl = '/dashboard/consumer';

    const response = NextResponse.redirect(new URL(redirectUrl, request.url), { status: 303 });
    response.cookies.set('userId', user.id, { path: '/', httpOnly: true });
    response.cookies.set('userRole', user.role, { path: '/', httpOnly: true });
    return response;
  } catch (error) {
    return NextResponse.redirect(new URL('/register?error=failed', request.url), { status: 303 });
  }
}
