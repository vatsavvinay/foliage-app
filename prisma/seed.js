const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// In some hosted Postgres setups (e.g., PgBouncer transaction pooling), prepared statements can conflict.
// Adding pgbouncer=true disables prepared statements for this client to avoid "prepared statement already exists".
const baseUrl = process.env.DATABASE_URL || '';
const seedUrl = baseUrl.includes('?') ? `${baseUrl}&pgbouncer=true` : `${baseUrl}?pgbouncer=true`;
const prisma = new PrismaClient({
  datasources: { db: { url: seedUrl } },
});

async function main() {
  console.log('Seeding database...');

  // Remove obsolete demo products
  try {
    await prisma.product.deleteMany({
      where: { slug: { in: ['snake-plant', 'terracotta-planter', 'succulent-mix'] } },
    });
  } catch (err) {
    console.warn('Cleanup skip (could not delete old demo products):', err?.message || err);
  }

  // Admin user
  const adminEmail = 'admin@foliage.local';
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: adminPassword, role: 'admin' },
    create: { email: adminEmail, password: adminPassword, role: 'admin', name: 'Admin' },
  });

  // Create categories
  const houseplants = await prisma.category.upsert({
    where: { slug: 'houseplants' },
    update: {},
    create: {
      name: 'Leafy Greens',
      slug: 'houseplants',
      description: 'Crisp, pesticide-free greens grown indoors year-round',
      image: '/images/lettuce.jpg',
    },
  });

  const planters = await prisma.category.upsert({
    where: { slug: 'planters' },
    update: {},
    create: {
      name: 'Herbs',
      slug: 'planters',
      description: 'Aromatic herbs harvested at peak flavor',
      image: '/images/basil.jpg',
    },
  });

  // Create sample products
  const products = [
    {
      name: 'Lettuce',
      slug: 'lettuce',
      description: 'Frilled, crunchy lettuce harvested daily for salads, wraps, and bowls.',
      price: '1.50',
      stock: 12,
      image: '/images/lettuce.jpg',
      images: ['/images/lettuce.jpg'],
      categoryId: houseplants.id,
      published: true,
    },
    {
      name: 'Basil',
      slug: 'basil',
      description: 'Sweet, aromatic basil perfect for pesto, pizza, and pasta.',
      price: '1.50',
      stock: 30,
      image: '/images/basil.jpg',
      images: ['/images/basil.jpg'],
      categoryId: planters.id,
      published: true,
    },
    {
      name: 'Baby Spinach',
      slug: 'baby-spinach',
      description: 'Tender baby spinach leaves for smoothies, sautéing, or salads.',
      price: '1.50',
      stock: 20,
      image: '/images/spinach.jpeg',
      images: ['/images/spinach.jpeg'],
      categoryId: houseplants.id,
      published: true,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
