// Database seed file (optional)
// Run with: npm run prisma:seed

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: { isEmailVerified: true },
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      isEmailVerified: true,
      settings: {
        create: {
          theme: 'light',
          language: 'en',
        },
      },
    },
  });

  console.log('Created test user:', user.email);
  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
