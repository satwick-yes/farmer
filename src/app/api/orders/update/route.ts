import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userRole = cookieStore.get('userRole')?.value;

  if (userRole !== 'FARMER' && userRole !== 'ADMIN' && userRole !== 'CONSUMER') {
    return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
  }

  const formData = await request.formData();
  const orderId = formData.get('orderId') as string;
  const status = formData.get('status') as string;
  const disputeStatus = formData.get('disputeStatus') as string;

  const dataToUpdate: any = {};
  if (status) dataToUpdate.status = status;
  if (disputeStatus) dataToUpdate.disputeStatus = disputeStatus;

  await prisma.order.update({
    where: { id: orderId },
    data: dataToUpdate
  });

  // Redirect back depending on role
  let redirectUrl = '/';
  if (userRole === 'FARMER') redirectUrl = '/dashboard/farmer';
  if (userRole === 'ADMIN') redirectUrl = '/dashboard/admin';
  if (userRole === 'CONSUMER') redirectUrl = '/dashboard/consumer';
  
  return NextResponse.redirect(new URL(redirectUrl, request.url), { status: 303 });
}
