const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  const users = [];
  
  for (let i = 1; i <= 20; i++) {
    const passwordbiasa = `alvent${i}`;
    const hashs = await bcrypt.hash(passwordbiasa,10);
    
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        username: `User ${i}`,
        isActive: true,
        // password: `alvent${i}`, hashs,
        password: hashs,
        profilePhoto: `photos${i}.jpg`,
      },
    });
    users.push(user);
  }

  console.log('Users created:', users.length);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
