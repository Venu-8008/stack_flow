const { PrismaClient } = require('@prisma/client');

console.log('Testing connection to Aiven...');
console.log('URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@')); // Log masked URL

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

async function check() {
    try {
        await prisma.$connect();
        console.log('✅ Connected to Aiven!');
    } catch (e) {
        console.error('❌ Connection failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

require('dotenv').config();
check();
