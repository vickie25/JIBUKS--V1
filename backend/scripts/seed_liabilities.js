/**
 * Seed Script: Update Chart of Accounts with NEW LIABILITY ACCOUNTS
 * 
 * This script adds the comprehensive liability accounts to the database
 * Run: node scripts/seed_liabilities.js
 */

import { PrismaClient } from '@prisma/client';
import { FAMILY_COA_TEMPLATE } from '../src/services/accountingService.js';

const prisma = new PrismaClient();

async function seedLiabilityAccounts() {
    try {
        console.log('🔄 Starting LIABILITY Account Seeding...\n');

        // Get tenant
        const tenant = await prisma.tenant.findFirst();
        if (!tenant) {
            console.error('❌ No tenant found. Please create a family first.');
            return;
        }
        console.log(`✅ Found tenant: ${tenant.name} (ID: ${tenant.id})\n`);

        // Filter only LIABILITY accounts from the template
        const liabilityAccounts = FAMILY_COA_TEMPLATE.filter(acc => acc.type === 'LIABILITY');
        console.log(`📦 Found ${liabilityAccounts.length} LIABILITY accounts to seed\n`);

        let created = 0;
        let updated = 0;
        let skipped = 0;

        for (const account of liabilityAccounts) {
            // Check if account already exists
            const existing = await prisma.account.findFirst({
                where: {
                    tenantId: tenant.id,
                    code: account.code
                }
            });

            if (existing) {
                // Update existing account with new properties
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
                console.log(`   ⬆️  Updated: ${account.code} - ${account.name}`);
            } else {
                // Create new account
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
                console.log(`   ✅ Created: ${account.code} - ${account.name}`);
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 SEEDING SUMMARY');
        console.log('='.repeat(60));
        console.log(`   ✅ Created: ${created} accounts`);
        console.log(`   ⬆️  Updated: ${updated} accounts`);
        console.log(`   ⏭️  Skipped: ${skipped} accounts`);
        console.log(`   📦 Total LIABILITY accounts: ${liabilityAccounts.length}`);
        console.log('='.repeat(60));

        // Show summary by subtype
        console.log('\n📋 LIABILITY ACCOUNT SUBTYPES:\n');

        const subtypes = [...new Set(liabilityAccounts.map(acc => acc.subtype).filter(Boolean))];
        for (const subtype of subtypes) {
            const count = liabilityAccounts.filter(acc => acc.subtype === subtype).length;
            console.log(`   📁 ${subtype}: ${count} accounts`);
        }

        console.log('\n✅ LIABILITY seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding liability accounts:', error.message);
        console.error(error.stack);
    } finally {
        await prisma.$disconnect();
    }
}

seedLiabilityAccounts();
