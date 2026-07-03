import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
  }

  const formData = await request.formData();
  const productId = formData.get('productId') as string;
  const price = parseFloat(formData.get('price') as string);
  const deliverySlot = formData.get('deliverySlot') as string;
  
  const order = await prisma.order.create({
    data: {
      consumerId: userId,
      totalAmount: price,
      status: 'PENDING',
      deliverySlot,
      orderItems: {
        create: {
          productId,
          quantity: 1,
          price
        }
      }
    }
  });

  return NextResponse.redirect(new URL('/dashboard/consumer', request.url), { status: 303 });
}
