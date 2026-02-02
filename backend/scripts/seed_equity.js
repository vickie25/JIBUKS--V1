/**
 * Seed Script: Update EQUITY Accounts with Hierarchical Structure
 * Run: node scripts/seed_equity.js
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EQUITY_ACCOUNTS = [
    // ============================================
    // OWNERS' CAPITAL (3000-3049)
    // Money invested into the business
    // ============================================
    { code: '3000', name: 'Owners\' Capital & Equity', type: 'EQUITY', description: 'Total capital invested', isSystem: true, isContra: false, subtype: 'equity', isParent: true, systemTag: 'EQUITY' },

    // Capital Accounts
    { code: '3001', name: 'Owner\'s Capital (Investment)', type: 'EQUITY', description: 'Initial money invested by owner', isSystem: true, isContra: false, subtype: 'equity', parentCode: '3000' },
    { code: '3002', name: 'Share Capital', type: 'EQUITY', description: 'Value of shares issued', isSystem: false, isContra: false, subtype: 'equity', parentCode: '3000' },
    { code: '3003', name: 'Partner A Capital', type: 'EQUITY', description: 'Capital from Partner A', isSystem: false, isContra: false, subtype: 'equity', parentCode: '3000' },
    { code: '3004', name: 'Partner B Capital', type: 'EQUITY', description: 'Capital from Partner B', isSystem: false, isContra: false, subtype: 'equity', parentCode: '3000' },
    { code: '3005', name: 'Seed Funding / Investor Capital', type: 'EQUITY', description: 'External investment capital', isSystem: false, isContra: false, subtype: 'equity', parentCode: '3000' },

    // ============================================
    // RETAINED EARNINGS & RESERVES (3050-3079)
    // Profits reinvested in the business
    // ============================================
    { code: '3050', name: 'Retained Earnings & Reserves', type: 'EQUITY', description: 'Accumulated profits and reserves', isSystem: true, isContra: false, subtype: 'retained_earnings', isParent: true },

    { code: '3051', name: 'Retained Earnings', type: 'EQUITY', description: 'Accumulated profits from previous years', isSystem: true, isContra: false, subtype: 'retained_earnings', parentCode: '3050' },
    { code: '3052', name: 'General Reserve', type: 'EQUITY', description: 'Profits set aside for general purpose', isSystem: false, isContra: false, subtype: 'retained_earnings', parentCode: '3050' },
    { code: '3053', name: 'Asset Revaluation Reserve', type: 'EQUITY', description: 'Gains from asset revaluation', isSystem: false, isContra: false, subtype: 'retained_earnings', parentCode: '3050' },
    { code: '3054', name: 'Current Year Earnings', type: 'EQUITY', description: 'Profit/Loss for the current year', isSystem: true, isContra: false, subtype: 'retained_earnings', parentCode: '3050' },

    // ============================================
    // DRAWINGS & DIVIDENDS (3080-3099)
    // Money taken out by owners (Contra-Equity)
    // ============================================
    { code: '3080', name: 'Drawings & Distributions', type: 'EQUITY', description: 'Money withdrawn by owners', isSystem: true, isContra: true, subtype: 'drawings', isParent: true },

    { code: '3081', name: 'Owner\'s Drawings', type: 'EQUITY', description: 'Personal cash withdrawals by owner', isSystem: true, isContra: true, subtype: 'drawings', parentCode: '3080' },
    { code: '3082', name: 'Dividends Paid', type: 'EQUITY', description: 'Dividends distributed to shareholders', isSystem: false, isContra: true, subtype: 'drawings', parentCode: '3080' },
    { code: '3083', name: 'Partner A Drawings', type: 'EQUITY', description: 'Withdrawals by Partner A', isSystem: false, isContra: true, subtype: 'drawings', parentCode: '3080' },
    { code: '3084', name: 'Partner B Drawings', type: 'EQUITY', description: 'Withdrawals by Partner B', isSystem: false, isContra: true, subtype: 'drawings', parentCode: '3080' },
];

async function seedEquityAccounts() {
    try {
        console.log('🔄 Starting EQUITY Account Seeding...\n');
        const tenant = await prisma.tenant.findFirst();
        if (!tenant) { console.error('❌ No tenant found.'); return; }
        console.log(`✅ Found tenant: ${tenant.name} (ID: ${tenant.id})\n`);

        console.log(`📦 Found ${EQUITY_ACCOUNTS.length} EQUITY accounts to seed\n`);

        let created = 0, updated = 0;
        for (const account of EQUITY_ACCOUNTS) {
            const existing = await prisma.account.findFirst({
                where: { tenantId: tenant.id, code: account.code }
            });
            if (existing) {
                await prisma.account.update({
                    where: { id: existing.id },
                    data: {
                        name: account.name,
                        description: account.description || null,
                        isSystem: account.isSystem ?? false,
                        isContra: account.isContra ?? false,
                        subtype: account.subtype || null,
                        systemTag: account.systemTag || null,
                    }
                });
                updated++;
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
                        isPaymentEligible: false,
                        subtype: account.subtype || null,
                        systemTag: account.systemTag || null,
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
        console.log(`   📦 Total EQUITY accounts: ${EQUITY_ACCOUNTS.length}`);

        console.log('\n✅ EQUITY seeding completed!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}
seedEquityAccounts();
