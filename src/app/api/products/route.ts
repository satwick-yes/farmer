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
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;
  const price = parseFloat(formData.get('price') as string);
  const availability = parseInt(formData.get('availability') as string, 10);
  const harvestDateString = formData.get('harvestDate') as string;
  const harvestDate = harvestDateString ? new Date(harvestDateString) : new Date();

  await prisma.product.create({
    data: {
      name,
      category,
      price,
      availability,
      harvestDate,
      farmerId: userId
    }
  });

  return NextResponse.redirect(new URL('/dashboard/farmer', request.url), { status: 303 });
}
