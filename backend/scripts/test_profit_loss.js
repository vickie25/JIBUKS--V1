/**
 * Diagnostic Script for Profit & Loss Report
 * Run this to test the P&L function directly
 */

import { PrismaClient } from '@prisma/client';
import { getProfitAndLoss } from '../src/services/accountingService.js';

const prisma = new PrismaClient();

async function testProfitAndLoss() {
    try {
        console.log('🔍 Testing Profit & Loss Report Generation\n');

        // Step 1: Find a tenant
        const tenant = await prisma.tenant.findFirst();
        if (!tenant) {
            console.error('❌ No tenant found in database');
            console.log('💡 Create a family first by registering a user');
            return;
        }
        console.log(`✅ Found tenant: ${tenant.name} (ID: ${tenant.id})\n`);

        // Step 2: Check for INCOME accounts
        const incomeAccounts = await prisma.account.findMany({
            where: { tenantId: tenant.id, type: 'INCOME', isActive: true }
        });
        console.log(`📊 INCOME Accounts: ${incomeAccounts.length}`);
        incomeAccounts.forEach(acc => {
            console.log(`   - ${acc.code}: ${acc.name}`);
        });

        // Step 3: Check for EXPENSE accounts
        const expenseAccounts = await prisma.account.findMany({
            where: { tenantId: tenant.id, type: 'EXPENSE', isActive: true }
        });
        console.log(`\n📊 EXPENSE Accounts: ${expenseAccounts.length}`);
        expenseAccounts.forEach(acc => {
            console.log(`   - ${acc.code}: ${acc.name}`);
        });

        // Step 4: Check for journal entries
        const journals = await prisma.journal.findMany({
            where: { tenantId: tenant.id, status: 'POSTED' },
            include: { lines: { include: { account: true } } }
        });
        console.log(`\n📝 Posted Journal Entries: ${journals.length}`);

        // Count entries affecting income/expense accounts
        let incomeEntries = 0;
        let expenseEntries = 0;
        journals.forEach(journal => {
            journal.lines.forEach(line => {
                if (line.account.type === 'INCOME') incomeEntries++;
                if (line.account.type === 'EXPENSE') expenseEntries++;
            });
        });
        console.log(`   - Lines affecting INCOME accounts: ${incomeEntries}`);
        console.log(`   - Lines affecting EXPENSE accounts: ${expenseEntries}`);

        // Step 5: Test the P&L function
        console.log('\n🧪 Testing getProfitAndLoss function...\n');

        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        console.log(`Period: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}\n`);

        const result = await getProfitAndLoss(tenant.id, startDate, endDate);

        console.log('✅ P&L Report Generated Successfully!\n');
        console.log('📈 INCOME:');
        console.log(`   Total: KES ${result.income.total.toLocaleString()}`);
        console.log(`   Lines: ${result.income.lines.length}`);
        result.income.lines.forEach(line => {
            console.log(`      ${line.code} ${line.name}: KES ${line.amount.toLocaleString()}`);
        });

        console.log('\n📉 EXPENSES:');
        console.log(`   Total: KES ${result.expenses.total.toLocaleString()}`);
        console.log(`   Lines: ${result.expenses.lines.length}`);
        result.expenses.lines.forEach(line => {
            console.log(`      ${line.code} ${line.name}: KES ${line.amount.toLocaleString()}`);
        });

        console.log('\n💰 NET INCOME:');
        console.log(`   Amount: KES ${result.netIncome.toLocaleString()}`);
        console.log(`   Savings Rate: ${result.savingsRate}%`);

        if (result.income.lines.length === 0 && result.expenses.lines.length === 0) {
            console.log('\n⚠️  WARNING: No income or expense transactions found for this period');
            console.log('💡 Add some income or expense transactions to see data in the report');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await prisma.$disconnect();
    }
}

testProfitAndLoss();
