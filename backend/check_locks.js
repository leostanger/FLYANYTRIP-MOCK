const prisma = require('./config/prisma');

async function checkLocks() {
    try {
        console.log("Checking active queries in PostgreSQL...");
        const activeQueries = await prisma.$queryRaw`
            SELECT pid, state, query, CAST(clock_timestamp() - query_start AS TEXT) AS query_age
            FROM pg_stat_activity 
            WHERE state != 'idle' AND query NOT LIKE '%pg_stat_activity%';
        `;
        console.log("Active Queries:", activeQueries);

        console.log("\nChecking locks in PostgreSQL...");
        const locks = await prisma.$queryRaw`
            SELECT 
                pg_stat_activity.pid,
                pg_stat_activity.query,
                pg_locks.mode,
                pg_locks.granted,
                pg_stat_activity.state
            FROM pg_locks
            JOIN pg_stat_activity ON pg_stat_activity.pid = pg_locks.pid
            WHERE pg_stat_activity.query NOT LIKE '%pg_locks%';
        `;
        console.log("Active Locks:", locks);
    } catch (err) {
        console.error("Error querying PG stats:", err);
    } finally {
        await prisma.$disconnect();
    }
}
checkLocks();
