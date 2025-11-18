const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get Prisma client instance
 */
function getPrismaClient() {
  return prisma;
}

module.exports = {
  prisma,
  getPrismaClient,
};
