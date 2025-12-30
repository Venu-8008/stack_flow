const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verify() {
    try {
        console.log('☁️  Verifying Aiven Cloud Database...');

        // Check connection
        await prisma.$connect();
        console.log('✅ Connection established.');

        // Write test
        const org = await prisma.organization.create({
            data: { name: 'Aiven Verification Test' }
        });
        console.log('✅ Write success: Organization created (ID: ' + org.id + ')');

        // Read test
        const count = await prisma.organization.count();
        console.log('✅ Read success: Organization count is ' + count);

        // Cleanup
        await prisma.organization.delete({ where: { id: org.id } });
        console.log('✅ Cleanup success');

        console.log('🎉 Deployment Verified! Your backend is fully connected to the cloud.');

    } catch (error) {
        console.error('❌ Verification Failed:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

require('dotenv').config();
verify();
