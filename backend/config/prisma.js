require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ 
  connectionString,
  max: 10,                 // Keep connection limit at 10 to support parallel queries but avoid Neon exhaustion
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 15000 // Match maxWait timeout to ensure connections can be established
});
const adapter = new PrismaPg(pool);

// Use a singleton pattern to ensure we don't create multiple connections in dev mode
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter });
  }
  prisma = global.prisma;
}

// Clean up connections on process termination/nodemon restart to prevent Neon connection leaks
const cleanUp = async () => {
  console.log('Shutting down database connections...');
  try {
    if (global.prisma) {
      await global.prisma.$disconnect();
    }
    await pool.end();
    console.log('Database connections closed cleanly.');
  } catch (err) {
    console.error('Error closing database connections:', err.message);
  }
};

process.once('SIGUSR2', async () => {
  await cleanUp();
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', async () => {
  await cleanUp();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await cleanUp();
  process.exit(0);
});

module.exports = prisma;
