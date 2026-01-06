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

  // Create admin user
  const adminEmail = 'admin@foliage.local';
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN', // ✅ Changed from "admin" to "ADMIN"
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample categories
  const leafyGreens = await prisma.category.upsert({
    where: { slug: 'leafy-greens' },
    update: {},
    create: {
      name: 'Leafy Greens',
      slug: 'leafy-greens',
    },
  });

  const herbs = await prisma.category.upsert({
    where: { slug: 'herbs' },
    update: {},
    create: {
      name: 'Herbs',
      slug: 'herbs',
    },
  });

  console.log('✅ Categories created');

  // Create sample products
  const spinach = await prisma.product.upsert({
    where: { slug: 'organic-spinach' },
    update: {},
    create: {
      name: 'Organic Spinach',
      slug: 'organic-spinach',
      description: 'Fresh organic spinach leaves, perfect for salads and smoothies.',
      price: 4.99,
      stock: 50,
      categoryId: leafyGreens.id,
      sku: 'SPH-001',
      isActive: true,
      imageUrl: '/images/spinach.jpg',
    },
  });

  const basil = await prisma.product.upsert({
    where: { slug: 'fresh-basil' },
    update: {},
    create: {
      name: 'Fresh Basil',
      slug: 'fresh-basil',
      description: 'Aromatic fresh basil, ideal for Italian dishes.',
      price: 3.49,
      stock: 30,
      categoryId: herbs.id,
      sku: 'BSL-001',
      isActive: true,
      imageUrl: '/images/basil.jpg',
    },
  });

  const lettuce = await prisma.product.upsert({
    where: { slug: 'butter-lettuce' },
    update: {},
    create: {
      name: 'Butter Lettuce',
      slug: 'butter-lettuce',
      description: 'Tender butter lettuce with a mild, sweet flavor.',
      price: 3.99,
      stock: 40,
      categoryId: leafyGreens.id,
      sku: 'LET-001',
      isActive: true,
      imageUrl: '/images/lettuce.jpg',
    },
  });

  console.log('✅ Products created');

  // Create a sample customer user
  const customerPassword = await bcrypt.hash('customer123', 12);
  
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Test Customer',
      password: customerPassword,
      role: 'CUSTOMER', // ✅ Changed from "customer" to "CUSTOMER"
    },
  });

  console.log('✅ Customer user created:', customer.email);

  console.log('\n🎉 Seeding completed successfully!\n');
  console.log('📧 Admin credentials:');
  console.log('   Email: admin@foliage.local');
  console.log('   Password: admin123\n');
  console.log('📧 Customer credentials:');
  console.log('   Email: customer@example.com');
  console.log('   Password: customer123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
