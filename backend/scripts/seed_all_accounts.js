/**
 * Master Seed Script: Full Chart of Accounts
 * 
 * This script seeds ALL accounts from FAMILY_COA_TEMPLATE to the database.
 * Run this on any new environment to set up the complete Chart of Accounts.
 * 
 * Usage: node scripts/seed_all_accounts.js
 *        node scripts/seed_all_accounts.js --force  (to reset all accounts)
 */

import { PrismaClient } from '@prisma/client';
import { FAMILY_COA_TEMPLATE } from '../src/services/accountingService.js';

const prisma = new PrismaClient();
const forceUpdate = process.argv.includes('--force');

async function seedAllAccounts() {
    try {
        console.log('🔄 Starting FULL Chart of Accounts Seeding...');
        console.log(`📦 Template contains ${FAMILY_COA_TEMPLATE.length} accounts\n`);

        if (forceUpdate) {
            console.log('⚠️  FORCE MODE: Will update all existing accounts\n');
        }

        // Get all tenants
        const tenants = await prisma.tenant.findMany();
        if (tenants.length === 0) {
            console.error('❌ No tenants found. Create a family first.');
            return;
        }

        console.log(`👥 Found ${tenants.length} tenant(s)\n`);

        for (const tenant of tenants) {
            console.log(`\n${'='.repeat(60)}`);
            console.log(`📁 Processing Tenant: ${tenant.name} (ID: ${tenant.id})`);
            console.log('='.repeat(60));

            let created = 0;
            let updated = 0;
            let skipped = 0;

            for (const account of FAMILY_COA_TEMPLATE) {
                const existing = await prisma.account.findFirst({
                    where: { tenantId: tenant.id, code: account.code }
                });

                if (existing) {
                    if (forceUpdate) {
                        await prisma.account.update({
                            where: { id: existing.id },
                            data: {
                                name: account.name,
                                description: account.description || null,
                                isSystem: account.isSystem ?? false,
                                isContra: account.isContra ?? false,
                                isPaymentEligible: account.isPaymentEligible ?? false,
                                subtype: account.subtype || null,
                            }
                        });
                        updated++;
                    } else {
                        skipped++;
                    }
                } else {
                    await prisma.account.create({
                        data: {
                            tenantId: tenant.id,
                            code: account.code,
                            name: account.name,
                            type: account.type,
                            description: account.description || null,
                            isSystem: account.isSystem ?? false,
                            isContra: account.isContra ?? false,
                            isPaymentEligible: account.isPaymentEligible ?? false,
                            subtype: account.subtype || null,
                            isActive: true,
                        }
                    });
                    created++;
                }
            }

            console.log(`   ✅ Created: ${created}`);
            console.log(`   ⬆️  Updated: ${updated}`);
            console.log(`   ⏭️  Skipped: ${skipped}`);
        }

        // Summary by type
        console.log('\n' + '='.repeat(60));
        console.log('📊 CHART OF ACCOUNTS SUMMARY');
        console.log('='.repeat(60));

        const types = ['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE'];
        for (const type of types) {
            const count = FAMILY_COA_TEMPLATE.filter(acc => acc.type === type).length;
            console.log(`   ${type}: ${count} accounts`);
        }
        console.log(`   TOTAL: ${FAMILY_COA_TEMPLATE.length} accounts`);

        console.log('\n✅ Seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    } finally {
        await prisma.$disconnect();
    }
}

seedAllAccounts();
