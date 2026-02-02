/**
 * Check when existing transactions were recorded
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTransactionDates() {
    try {
        console.log('🔍 Checking existing transaction dates...\n');

        const tenant = await prisma.tenant.findFirst();
        if (!tenant) {
            console.error('❌ No tenant found');
            return;
        }

        const journals = await prisma.journal.findMany({
            where: { tenantId: tenant.id, status: 'POSTED' },
            include: {
                lines: {
                    include: {
                        account: { select: { code: true, name: true, type: true } }
                    }
                }
            },
            orderBy: { date: 'desc' }
        });

        console.log(`📝 Found ${journals.length} posted journal entries:\n`);

        journals.forEach((journal, index) => {
            console.log(`${index + 1}. Journal #${journal.id} - ${journal.description}`);
            console.log(`   Date: ${journal.date.toISOString().split('T')[0]}`);
            console.log(`   Reference: ${journal.reference || 'N/A'}`);
            console.log(`   Lines:`);

            journal.lines.forEach(line => {
                const dr = line.debit > 0 ? `DR ${line.debit.toLocaleString()}` : '';
                const cr = line.credit > 0 ? `CR ${line.credit.toLocaleString()}` : '';
                console.log(`      ${line.account.code} ${line.account.name} (${line.account.type}): ${dr}${cr}`);
            });
            console.log('');
        });

        // Show date range summary
        if (journals.length > 0) {
            const dates = journals.map(j => j.date);
            const oldest = new Date(Math.min(...dates.map(d => d.getTime())));
            const newest = new Date(Math.max(...dates.map(d => d.getTime())));

            console.log(`📅 Transaction Date Range:`);
            console.log(`   Oldest: ${oldest.toISOString().split('T')[0]}`);
            console.log(`   Newest: ${newest.toISOString().split('T')[0]}`);
            console.log(`\n💡 To see data in the P&L report, select a period that includes these dates`);
            console.log(`   OR add new transactions for the current month (February 2026)`);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkTransactionDates();
