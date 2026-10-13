const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return salt + ':' + hash;
}

const prisma = new PrismaClient();

async function main() {
  const staffPass = hashPassword('102030');
  const user = await prisma.user.upsert({
    where: { email: 'khalidekbal03@gmail.com' },
    update: {
      passwordHash: staffPass,
      role: 'STAFF',
      name: 'Khalid Ekbal',
    },
    create: {
      email: 'khalidekbal03@gmail.com',
      passwordHash: staffPass,
      name: 'Khalid Ekbal',
      role: 'STAFF',
      phone: '+20 101 234 5678',
    },
  });
  console.log('Successfully configured staff user:', user.email, 'Role:', user.role);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
