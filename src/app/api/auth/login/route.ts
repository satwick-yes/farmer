import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.password) {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.redirect(new URL('/login?error=invalidpassword', request.url), { status: 303 });
      }
      
      let redirectUrl = '/market';
      if (user.role === 'FARMER') redirectUrl = '/dashboard/farmer';
      if (user.role === 'ADMIN') redirectUrl = '/dashboard/admin';
      if (user.role === 'CONSUMER') redirectUrl = '/dashboard/consumer';

      const response = NextResponse.redirect(new URL(redirectUrl, request.url), { status: 303 });
      response.cookies.set('userId', user.id, { path: '/', httpOnly: true });
      response.cookies.set('userRole', user.role, { path: '/', httpOnly: true });
      return response;
    } else if (user && !user.password) {
      // For seed users who didn't have a password before, allow login with any password temporarily
      let redirectUrl = '/market';
      if (user.role === 'FARMER') redirectUrl = '/dashboard/farmer';
      if (user.role === 'ADMIN') redirectUrl = '/dashboard/admin';
      if (user.role === 'CONSUMER') redirectUrl = '/dashboard/consumer';

      const response = NextResponse.redirect(new URL(redirectUrl, request.url), { status: 303 });
      response.cookies.set('userId', user.id, { path: '/', httpOnly: true });
      response.cookies.set('userRole', user.role, { path: '/', httpOnly: true });
      return response;
    } else {
      return NextResponse.redirect(new URL('/login?error=notfound', request.url), { status: 303 });
    }
  } catch (error) {
    return NextResponse.redirect(new URL('/login?error=failed', request.url), { status: 303 });
  }
}
