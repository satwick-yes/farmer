const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await bcrypt.hash('password123', 10);

  // Seed Categories
  const categories = ['Vegetables', 'Fruits', 'Dairy', 'Grains'];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@agrimarket.local' },
    update: { password: await bcrypt.hash('admin123', 10) },
    create: {
      name: 'Super Admin',
      email: 'admin@agrimarket.local',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      isVerified: true
    }
  });

  // Create Farmer 1
  const farmer1 = await prisma.user.upsert({
    where: { email: 'farmer.john@example.com' },
    update: { password: defaultPassword, cropTypes: 'Tomatoes, Carrots, Lettuce' },
    create: {
      name: 'John\'s Organic Farm',
      email: 'farmer.john@example.com',
      password: defaultPassword,
      role: 'FARMER',
      location: 'Green Valley, CA',
      farmingMethod: 'Organic',
      cropTypes: 'Tomatoes, Carrots, Lettuce',
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
  const farmer2 = await prisma.user.upsert({
    where: { email: 'dairy.mary@example.com' },
    update: { password: defaultPassword, cropTypes: 'Milk, Eggs, Cheese' },
    create: {
      name: 'Mary\'s Dairy',
      email: 'dairy.mary@example.com',
      password: defaultPassword,
      role: 'FARMER',
      location: 'Sunny Meadows, TX',
      farmingMethod: 'Conventional',
      cropTypes: 'Milk, Eggs, Cheese',
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
  const farmer3 = await prisma.user.upsert({
    where: { email: 'orchard.pete@example.com' },
    update: { password: defaultPassword, cropTypes: 'Apples, Cider' },
    create: {
      name: 'Pete\'s Apple Orchard',
      email: 'orchard.pete@example.com',
      password: defaultPassword,
      role: 'FARMER',
      location: 'Crisp Hills, WA',
      farmingMethod: 'Organic',
      cropTypes: 'Apples, Cider',
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
  const consumer = await prisma.user.upsert({
    where: { email: 'consumer.alice@example.com' },
    update: { password: defaultPassword },
    create: {
      name: 'Alice Consumer',
      email: 'consumer.alice@example.com',
      password: defaultPassword,
      role: 'CONSUMER',
      location: 'City Center, CA'
    }
  });

  console.log('Test data seeded successfully with new schemas!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
