const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // 1. Create Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rimpy.com' },
    update: {},
    create: {
      email: 'admin@rimpy.com',
      passwordHash: hashedPassword,
      role: 'ADMIN'
    },
  });
  console.log('Admin created: admin@rimpy.com / admin123');

  // 2. Create Shop Categories
  const cat1 = await prisma.productCategory.upsert({
    where: { name: 'Wedding Frames' },
    update: {},
    create: { name: 'Wedding Frames' },
  });
  const cat2 = await prisma.productCategory.upsert({
    where: { name: '3D Crystals' },
    update: {},
    create: { name: '3D Crystals' },
  });

  // 3. Create Sample Products
  await prisma.product.create({
    data: {
      title: 'Premium Gold Wedding Frame',
      description: 'Elegant 12x18 gold-plated frame for your special moments.',
      price: 2500,
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=800',
      categoryId: cat1.id
    }
  });

  // 4. Create Portfolio Categories
  const pCat1 = await prisma.portfolioCategory.upsert({
    where: { name: 'Weddings' },
    update: {},
    create: { name: 'Weddings' },
  });

  // 5. Create Sample Album
  await prisma.portfolioAlbum.create({
    data: {
      title: 'Aman & Sneha Wedding',
      coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800',
      categoryId: pCat1.id,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800' },
          { imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800' }
        ]
      }
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
