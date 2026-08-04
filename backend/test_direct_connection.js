const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const directUrl = "postgresql://neondb_owner:npg_AwdXn6uZC5mY@ep-twilight-sky-ayeg2sb8.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const pool = new Pool({ connectionString: directUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
    try {
        console.log("Testing direct connection transaction with increased maxWait...");
        const result = await prisma.$transaction(async (tx) => {
            const bookingsCount = await tx.bookings.count();
            console.log("Current bookings count in transaction:", bookingsCount);
            return bookingsCount;
        }, {
            maxWait: 15000, // Wait up to 15 seconds to acquire a connection from pool
            timeout: 30000  // 30 seconds to complete
        });
        console.log("Transaction succeeded! Result:", result);
    } catch (err) {
        console.error("Direct connection transaction failed:", err);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}
run();
