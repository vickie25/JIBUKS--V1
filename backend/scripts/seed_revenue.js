/**
 * Seed Script: Update REVENUE / INCOME Accounts with Hierarchical Structure
 * Run: node scripts/seed_revenue.js
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const REVENUE_ACCOUNTS = [
    // ============================================
    // OPERATING REVENUE (4000-4199)
    // Income from core business activities
    // ============================================
    { code: '4000', name: 'Operating Revenue', type: 'INCOME', description: 'Total revenue from core operations', isSystem: true, isContra: false, subtype: 'sales_revenue', isParent: true, systemTag: 'REVENUE' },

    // ----------------------------------------
    // SALES REVENUE (4100-4189)
    // ----------------------------------------
    { code: '4100', name: 'Sales Revenue', type: 'INCOME', description: 'Gross sales from goods and services', isSystem: true, isContra: false, subtype: 'sales_revenue', isParent: true, parentCode: '4000' },
    { code: '4101', name: 'Product Sales', type: 'INCOME', description: 'Sales of physical inventory', isSystem: false, isContra: false, subtype: 'sales_revenue', parentCode: '4100' },
    { code: '4102', name: 'Service Revenue', type: 'INCOME', description: 'Income from services rendered', isSystem: false, isContra: false, subtype: 'sales_revenue', parentCode: '4100' },
    { code: '4103', name: 'Subscription Revenue', type: 'INCOME', description: 'Recurring subscription income', isSystem: false, isContra: false, subtype: 'sales_revenue', parentCode: '4100' },
    { code: '4104', name: 'Project Income', type: 'INCOME', description: 'Revenue from specific contracts/projects', isSystem: false, isContra: false, subtype: 'sales_revenue', parentCode: '4100' },
    { code: '4105', name: 'Installation Fees', type: 'INCOME', description: 'Charges for setup/installation', isSystem: false, isContra: false, subtype: 'sales_revenue', parentCode: '4100' },
    { code: '4106', name: 'Consulting Income', type: 'INCOME', description: 'Advisory services revenue', isSystem: false, isContra: false, subtype: 'sales_revenue', parentCode: '4100' },
    { code: '4107', name: 'Delivery / Shipping Income', type: 'INCOME', description: 'Shipping charges collected from customers', isSystem: false, isContra: false, subtype: 'sales_revenue', parentCode: '4100' },
    { code: '4108', name: 'Management Fees', type: 'INCOME', description: 'Management fees charged', isSystem: false, isContra: false, subtype: 'sales_revenue', parentCode: '4100' },

    // ----------------------------------------
    // SALES ADJUSTMENTS (4190-4199)
    // Contra-Revenue accounts
    // ----------------------------------------
    { code: '4190', name: 'Sales Adjustments', type: 'INCOME', description: 'Reductions to gross sales', isSystem: true, isContra: true, subtype: 'sales_contra', isParent: true, parentCode: '4000' },
    { code: '4191', name: 'Sales Returns', type: 'INCOME', description: 'Goods returned by customers', isSystem: true, isContra: true, subtype: 'sales_contra', parentCode: '4190' },
    { code: '4192', name: 'Sales Discounts', type: 'INCOME', description: 'Discounts given to customers', isSystem: true, isContra: true, subtype: 'sales_contra', parentCode: '4190' },
    { code: '4193', name: 'Sales Allowances', type: 'INCOME', description: 'Price reductions for defective goods', isSystem: false, isContra: true, subtype: 'sales_contra', parentCode: '4190' },

    // ============================================
    // OTHER INCOME (4200-4999)
    // Non-operating income
    // ============================================
    { code: '4200', name: 'Other Income', type: 'INCOME', description: 'Non-operating revenue', isSystem: true, isContra: false, subtype: 'other_income', isParent: true },

    // Financial Income
    { code: '4210', name: 'Interest Income', type: 'INCOME', description: 'Interest from banks/investments', isSystem: true, isContra: false, subtype: 'other_income', parentCode: '4200' },
    { code: '4220', name: 'Dividend Income', type: 'INCOME', description: 'Dividends from shares/investments', isSystem: false, isContra: false, subtype: 'other_income', parentCode: '4200' },
    { code: '4230', name: 'Forex Gain/(Loss)', type: 'INCOME', description: 'Gain on currency exchange', isSystem: false, isContra: false, subtype: 'other_income', parentCode: '4200' },

    // Misc Income
    { code: '4240', name: 'Commission Income', type: 'INCOME', description: 'Commissions received', isSystem: false, isContra: false, subtype: 'other_income', parentCode: '4200' },
    { code: '4250', name: 'Rental Income', type: 'INCOME', description: 'Income from renting out property', isSystem: false, isContra: false, subtype: 'other_income', parentCode: '4200' },
    { code: '4260', name: 'Grants & Subsidies', type: 'INCOME', description: 'Government or NGO grants', isSystem: false, isContra: false, subtype: 'other_income', parentCode: '4200' },
    { code: '4270', name: 'Insurance Claims', type: 'INCOME', description: 'Payouts from insurance claims', isSystem: false, isContra: false, subtype: 'other_income', parentCode: '4200' },
    { code: '4280', name: 'Late Fee Income', type: 'INCOME', description: 'Fees charged on late payments', isSystem: false, isContra: false, subtype: 'other_income', parentCode: '4200' },
    { code: '4290', name: 'Miscellaneous Income', type: 'INCOME', description: 'Other minor income sources', isSystem: false, isContra: false, subtype: 'other_income', parentCode: '4200' },

    // Asset Disposal
    { code: '4300', name: 'Gain on Asset Disposal', type: 'INCOME', description: 'Profit from selling fixed assets', isSystem: true, isContra: false, subtype: 'other_income', parentCode: '4200' },
];

async function seedRevenueAccounts() {
    try {
        console.log('🔄 Starting REVENUE Account Seeding...\n');
        const tenant = await prisma.tenant.findFirst();
        if (!tenant) { console.error('❌ No tenant found.'); return; }
        console.log(`✅ Found tenant: ${tenant.name} (ID: ${tenant.id})\n`);

        console.log(`📦 Found ${REVENUE_ACCOUNTS.length} REVENUE accounts to seed\n`);

        let created = 0, updated = 0;
        for (const account of REVENUE_ACCOUNTS) {
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
        console.log(`   📦 Total REVENUE accounts: ${REVENUE_ACCOUNTS.length}`);

        console.log('\n✅ REVENUE seeding completed!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}
seedRevenueAccounts();
