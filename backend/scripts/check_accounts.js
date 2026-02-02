// Quick check script to verify account counts
import { prisma } from '../src/lib/prisma.js';

async function checkAccounts() {
    try {
        const counts = await prisma.account.groupBy({
            by: ['type'],
            _count: true
        });

        console.log('📊 Account counts by type:');
        counts.forEach(c => console.log(`   ${c.type}: ${c._count}`));

        const total = await prisma.account.count();
        console.log(`\n   TOTAL: ${total} accounts`);

        // Check LIABILITY breakdown
        const liabilities = await prisma.account.groupBy({
            by: ['subtype'],
            where: { type: 'LIABILITY' },
            _count: true
        });

        console.log('\n📋 LIABILITY accounts by subtype:');
        liabilities.forEach(l => {
            if (l.subtype) {
                console.log(`   ${l.subtype}: ${l._count}`);
            }
        });

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkAccounts();
