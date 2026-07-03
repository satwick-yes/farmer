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
  const rating = parseInt(formData.get('rating') as string, 10);

  if (productId && rating) {
    await prisma.review.create({
      data: {
        authorId: userId,
        productId,
        rating,
        comment: ''
      }
    });
  }

  return NextResponse.redirect(new URL('/dashboard/consumer', request.url), { status: 303 });
}
