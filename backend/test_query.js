const prisma = require('./config/prisma');
prisma.travellers.findMany({ where: { user_id: 3 } })
    .then(res => console.log('Travellers:', res))
    .catch(err => console.error(err))
    .finally(() => prisma.$disconnect());
