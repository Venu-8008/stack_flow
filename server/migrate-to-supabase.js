const { PrismaClient } = require('@prisma/client');

// SQLite client (current database)
const sqliteClient = new PrismaClient({
  datasources: {
    db: {
      url: "file:./dev.db"
    }
  }
});

// PostgreSQL client (Supabase)
const postgresClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function migrateData() {
  try {
    console.log('🔄 Starting data migration from SQLite to Supabase...');

    // 1. Migrate Organizations
    console.log('📋 Migrating organizations...');
    const organizations = await sqliteClient.organization.findMany();
    
    for (const org of organizations) {
      await postgresClient.organization.upsert({
        where: { id: org.id },
        update: {},
        create: {
          id: org.id,
          name: org.name,
          createdAt: org.createdAt,
          updatedAt: org.updatedAt
        }
      });
    }
    console.log(`✅ Migrated ${organizations.length} organizations`);

    // 2. Migrate Users
    console.log('👥 Migrating users...');
    const users = await sqliteClient.user.findMany();
    
    for (const user of users) {
      await postgresClient.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          email: user.email,
          password: user.password,
          name: user.name,
          organizationId: user.organizationId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    }
    console.log(`✅ Migrated ${users.length} users`);

    // 3. Migrate Products
    console.log('📦 Migrating products...');
    const products = await sqliteClient.product.findMany();
    
    for (const product of products) {
      await postgresClient.product.upsert({
        where: { id: product.id },
        update: {},
        create: {
          id: product.id,
          organizationId: product.organizationId,
          name: product.name,
          sku: product.sku,
          description: product.description,
          quantity: product.quantity,
          costPrice: product.costPrice,
          sellingPrice: product.sellingPrice,
          lowStockThreshold: product.lowStockThreshold,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }
      });
    }
    console.log(`✅ Migrated ${products.length} products`);

    console.log('🎉 Data migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sqliteClient.$disconnect();
    await postgresClient.$disconnect();
  }
}

// Run migration
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('✨ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateData };