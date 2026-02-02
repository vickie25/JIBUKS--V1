// Load environment variables BEFORE initializing Prisma
import dotenv from 'dotenv';
dotenv.config({ override: true });

import { PrismaClient } from '@prisma/client';

// Verify DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL is not set in environment variables!');
  console.error('Please check your .env file.');
  process.exit(1);
}

console.log('✅ Prisma connecting to database...');

// Create Prisma client with connection pool settings to prevent connection issues
const prisma = new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Test database connection on startup
async function testConnection() {
  let retries = 3;
  while (retries > 0) {
    try {
      await prisma.$connect();
      console.log('✅ Database connection established successfully');
      return true;
    } catch (error) {
      retries--;
      console.error(`❌ Database connection failed (${3 - retries}/3 attempts):`, error.message);
      if (retries > 0) {
        console.log('⏳ Retrying in 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  console.error('❌ Failed to connect to database after 3 attempts');
  return false;
}

// Connect on module load
testConnection().catch(console.error);

// Handle graceful shutdown
process.on('beforeExit', async () => {
  console.log('🔌 Disconnecting from database...');
  await prisma.$disconnect();
});

/**
 * Get Prisma client instance
 */
function getPrismaClient() {
  return prisma;
}

export {
  prisma,
  getPrismaClient,
};
