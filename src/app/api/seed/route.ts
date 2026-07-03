import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  // Create Admin
  await prisma.user.upsert({
    where: { email: 'admin@agrimarket.local' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@agrimarket.local',
      role: 'ADMIN',
      isVerified: true
    }
  });

  // Create Farmer 1
  await prisma.user.upsert({
    where: { email: 'farmer.john@example.com' },
    update: {},
    create: {
      name: 'John\'s Organic Farm',
      email: 'farmer.john@example.com',
      role: 'FARMER',
      location: 'Green Valley, CA',
      farmingMethod: 'Organic',
      isVerified: true,
      products: {
        create: [
          { name: 'Organic Tomatoes', category: 'Vegetables', price: 3.50, availability: 100 },
          { name: 'Fresh Carrots', category: 'Vegetables', price: 2.00, availability: 50 },
          { name: 'Crisp Lettuce', category: 'Vegetables', price: 1.50, availability: 40 },
        ]
      }
    }
  });

  // Create Farmer 2
  await prisma.user.upsert({
    where: { email: 'dairy.mary@example.com' },
    update: {},
    create: {
      name: 'Mary\'s Dairy',
      email: 'dairy.mary@example.com',
      role: 'FARMER',
      location: 'Sunny Meadows, TX',
      farmingMethod: 'Conventional',
      isVerified: true,
      products: {
        create: [
          { name: 'Whole Milk (1 Gal)', category: 'Dairy', price: 4.50, availability: 20 },
          { name: 'Farm Fresh Eggs (Dozen)', category: 'Dairy', price: 5.00, availability: 30 },
          { name: 'Cheddar Cheese (1 lb)', category: 'Dairy', price: 8.00, availability: 15 },
        ]
      }
    }
  });
  
  // Create Farmer 3
  await prisma.user.upsert({
    where: { email: 'orchard.pete@example.com' },
    update: {},
    create: {
      name: 'Pete\'s Apple Orchard',
      email: 'orchard.pete@example.com',
      role: 'FARMER',
      location: 'Crisp Hills, WA',
      farmingMethod: 'Organic',
      isVerified: false,
      products: {
        create: [
          { name: 'Fuji Apples (1 lb)', category: 'Fruits', price: 2.50, availability: 200 },
          { name: 'Apple Cider (1 Gal)', category: 'Fruits', price: 6.00, availability: 40 },
        ]
      }
    }
  });

  // Create Consumer
  await prisma.user.upsert({
    where: { email: 'consumer.alice@example.com' },
    update: {},
    create: {
      name: 'Alice Consumer',
      email: 'consumer.alice@example.com',
      role: 'CONSUMER',
      location: 'City Center, CA'
    }
  });

  return NextResponse.json({ message: 'Seeded successfully' });
}
