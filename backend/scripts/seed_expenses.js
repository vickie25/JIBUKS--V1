/**
 * Seed Script: Update EXPENSE Accounts with Hierarchical Structure
 * Run: node scripts/seed_expenses.js
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EXPENSE_ACCOUNTS = [
    // ============================================
    // COST OF GOODS SOLD (5000-5999)
    // Direct costs attributable to the production of goods sold
    // ============================================
    { code: '5000', name: 'Cost of Goods Sold (COGS)', type: 'EXPENSE', description: 'Total direct costs of production', isSystem: true, isContra: false, subtype: 'cogs', isParent: true, systemTag: 'COGS' },
    { code: '5001', name: 'Cost of Sales - Inventory', type: 'EXPENSE', description: 'Cost of items sold from inventory', isSystem: true, isContra: false, subtype: 'cogs', parentCode: '5000' },
    { code: '5002', name: 'Purchase Price Variance', type: 'EXPENSE', description: 'Difference in standard vs actual cost', isSystem: false, isContra: false, subtype: 'cogs', parentCode: '5000' },
    { code: '5003', name: 'Freight & Shipping In', type: 'EXPENSE', description: 'Transport costs for purchasing goods', isSystem: false, isContra: false, subtype: 'cogs', parentCode: '5000' },
    { code: '5004', name: 'Import Duties & Taxes', type: 'EXPENSE', description: 'Customs duties on inventory', isSystem: false, isContra: false, subtype: 'cogs', parentCode: '5000' },
    { code: '5005', name: 'Packaging Materials COGS', type: 'EXPENSE', description: 'Packaging for sold products', isSystem: false, isContra: false, subtype: 'cogs', parentCode: '5000' },
    { code: '5006', name: 'Direct Labor', type: 'EXPENSE', description: 'Wages directly related to production', isSystem: false, isContra: false, subtype: 'cogs', parentCode: '5000' },
    { code: '5007', name: 'Subcontractor Costs', type: 'EXPENSE', description: 'Outsourced production work', isSystem: false, isContra: false, subtype: 'cogs', parentCode: '5000' },
    { code: '5008', name: 'Merchant Transaction Fees', type: 'EXPENSE', description: 'Direct payment processing costs (Stripe/PDQ)', isSystem: false, isContra: false, subtype: 'cogs', parentCode: '5000' },
    { code: '5009', name: 'Sales Commissions', type: 'EXPENSE', description: 'Commissions paid on sales', isSystem: false, isContra: false, subtype: 'cogs', parentCode: '5000' },

    // ============================================
    // OPERATING EXPENSES (6000-7999)
    // Indirect costs of running the business
    // ============================================
    { code: '6000', name: 'Operating Expenses', type: 'EXPENSE', description: 'Total operating expenses', isSystem: true, isContra: false, subtype: 'operating_expense', isParent: true },

    // ----------------------------------------
    // HOUSING & UTILITIES (6010-6099)
    // ----------------------------------------
    { code: '6010', name: 'Housing & Utilities', type: 'EXPENSE', description: 'Rent and facility costs', isSystem: true, isContra: false, subtype: 'operating_expense', isParent: true, parentCode: '6000' },
    { code: '6011', name: 'Rent Expense', type: 'EXPENSE', description: 'Office/Shop rent', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6010' },
    { code: '6012', name: 'Electricity / Power', type: 'EXPENSE', description: 'Kenya Power (KPLC) bills', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6010' },
    { code: '6013', name: 'Water & Sewerage', type: 'EXPENSE', description: 'Water bills', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6010' },
    { code: '6014', name: 'Internet & Connectivity', type: 'EXPENSE', description: 'Fibre, Wi-Fi, Data', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6010' },
    { code: '6015', name: 'Security Services', type: 'EXPENSE', description: 'Guards, Alarm monitoring', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6010' },
    { code: '6016', name: 'Cleaning & Sanitation', type: 'EXPENSE', description: 'Office cleaning, garbage collection', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6010' },
    { code: '6017', name: 'Repairs & Maintenance (Building)', type: 'EXPENSE', description: 'General facility repairs', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6010' },

    // ----------------------------------------
    // SALARIES & PAYROLL (6100-6199)
    // ----------------------------------------
    { code: '6100', name: 'Salaries & Payroll', type: 'EXPENSE', description: 'Total staff costs', isSystem: true, isContra: false, subtype: 'operating_expense', isParent: true, parentCode: '6000' },
    { code: '6101', name: 'Staff Salaries', type: 'EXPENSE', description: 'Monthly permanent staff salaries', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6100' },
    { code: '6102', name: 'Casual Wages', type: 'EXPENSE', description: 'Daily/Weekly casual labor', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6100' },
    { code: '6103', name: 'Director Salaries', type: 'EXPENSE', description: 'Salaries paid to directors', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6100' },
    { code: '6104', name: 'Staff Bonuses', type: 'EXPENSE', description: 'Performance bonuses', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6100' },
    { code: '6105', name: 'Employer NSSF', type: 'EXPENSE', description: 'Employer pension contribution', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6100' },
    { code: '6106', name: 'Employer Housing Levy', type: 'EXPENSE', description: 'Employer portion of housing levy', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6100' },
    { code: '6107', name: 'Staff Welfare & Meals', type: 'EXPENSE', description: 'Tea, lunch, staff events', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6100' },
    { code: '6108', name: 'Staff Training', type: 'EXPENSE', description: 'Workshops and courses', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6100' },
    { code: '6109', name: 'Medical Insurance', type: 'EXPENSE', description: 'Staff health cover', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6100' },

    // ----------------------------------------
    // OFFICE & ADMIN (6200-6299)
    // ----------------------------------------
    { code: '6200', name: 'Office & Admin', type: 'EXPENSE', description: 'General administration', isSystem: true, isContra: false, subtype: 'operating_expense', isParent: true, parentCode: '6000' },
    { code: '6201', name: 'Printing & Stationery', type: 'EXPENSE', description: 'Paper, ink, pens', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6200' },
    { code: '6202', name: 'Software Subscriptions', type: 'EXPENSE', description: 'SaaS (Zoom, Slack, Jibuks)', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6200' },
    { code: '6203', name: 'Licenses & Permits', type: 'EXPENSE', description: 'County council permits', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6200' },
    { code: '6204', name: 'Telephone & Airtime', type: 'EXPENSE', description: 'Office phone expenses', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6200' },
    { code: '6205', name: 'Postage & Courier', type: 'EXPENSE', description: 'Delivery fees, stamps', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6200' },
    { code: '6206', name: 'Small Equipment (< Asset Limit)', type: 'EXPENSE', description: 'Small tools not capitalized', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6200' },

    // ----------------------------------------
    // SALES & MARKETING (6300-6399)
    // ----------------------------------------
    { code: '6300', name: 'Sales & Marketing', type: 'EXPENSE', description: 'Growth contribution costs', isSystem: true, isContra: false, subtype: 'operating_expense', isParent: true, parentCode: '6000' },
    { code: '6301', name: 'Advertising (Online)', type: 'EXPENSE', description: 'Meta, Google, Instagram Ads', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6300' },
    { code: '6302', name: 'Advertising (Offline)', type: 'EXPENSE', description: 'Flyers, radio, billboards', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6300' },
    { code: '6303', name: 'Website Hosting & Domain', type: 'EXPENSE', description: 'Site maintenance', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6300' },
    { code: '6304', name: 'Branding & Design', type: 'EXPENSE', description: 'Logos, t-shirts, branding', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6300' },
    { code: '6305', name: 'Business Entertainment', type: 'EXPENSE', description: 'Client lunches/meetings', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6300' },

    // ----------------------------------------
    // TRANSPORT & TRAVEL (6400-6499)
    // ----------------------------------------
    { code: '6400', name: 'Transport & Travel', type: 'EXPENSE', description: 'Movement costs', isSystem: true, isContra: false, subtype: 'operating_expense', isParent: true, parentCode: '6000' },
    { code: '6401', name: 'Fuel & Oil', type: 'EXPENSE', description: 'Petrol/Diesel for vehicles', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6400' },
    { code: '6402', name: 'Public Transport / Fare', type: 'EXPENSE', description: 'Matatu, bus fare', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6400' },
    { code: '6403', name: 'Taxi / Uber / Bolt', type: 'EXPENSE', description: 'Ride hailing services', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6400' },
    { code: '6404', name: 'Parking & Tolls', type: 'EXPENSE', description: 'Parking fees, Expressway', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6400' },
    { code: '6405', name: 'Vehicle Repairs & Service', type: 'EXPENSE', description: 'Mechanic costs', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6400' },
    { code: '6406', name: 'Vehicle Insurance', type: 'EXPENSE', description: 'Comprehensive/TPO cover', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6400' },
    { code: '6407', name: 'Accommodation & Meals (Travel)', type: 'EXPENSE', description: 'Hotel stays during travel', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6400' },

    // ----------------------------------------
    // FINANCIAL & PROFESSIONAL (6500-6599)
    // ----------------------------------------
    { code: '6500', name: 'Financial & Professional', type: 'EXPENSE', description: 'Bank and legal fees', isSystem: true, isContra: false, subtype: 'operating_expense', isParent: true, parentCode: '6000' },
    { code: '6501', name: 'Bank Service Charges', type: 'EXPENSE', description: 'Monthly ledger fees', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6500' },
    { code: '6502', name: 'M-PESA / Transaction Fees', type: 'EXPENSE', description: 'Sending/withdrawal charges', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6500' },
    { code: '6503', name: 'Legal Fees', type: 'EXPENSE', description: 'Lawyer charges', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6500' },
    { code: '6504', name: 'Accounting & Audit Fees', type: 'EXPENSE', description: 'Bookkeeping/Audit services', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6500' },
    { code: '6505', name: 'Consultancy Fees', type: 'EXPENSE', description: 'Professional advice', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6500' },
    { code: '6506', name: 'Interest Expense', type: 'EXPENSE', description: 'Interest on loans', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6500' },
    { code: '6507', name: 'Bad Debts Expense', type: 'EXPENSE', description: 'Written off receivables', isSystem: false, isContra: false, subtype: 'operating_expense', parentCode: '6500' },

    // ----------------------------------------
    // DEPRECIATION & AMORTIZATION (6900-6999)
    // ----------------------------------------
    { code: '6900', name: 'Depreciation & Amortization', type: 'EXPENSE', description: 'Non-cash asset costs', isSystem: true, isContra: false, subtype: 'depreciation', isParent: true, parentCode: '6000' },
    { code: '6910', name: 'Depreciation - Buildings', type: 'EXPENSE', description: 'Expense', isSystem: true, isContra: false, subtype: 'depreciation', parentCode: '6900' },
    { code: '6920', name: 'Depreciation - Vehicles', type: 'EXPENSE', description: 'Expense', isSystem: true, isContra: false, subtype: 'depreciation', parentCode: '6900' },
    { code: '6930', name: 'Depreciation - Furniture', type: 'EXPENSE', description: 'Expense', isSystem: true, isContra: false, subtype: 'depreciation', parentCode: '6900' },
    { code: '6940', name: 'Depreciation - Equipment', type: 'EXPENSE', description: 'Expense', isSystem: true, isContra: false, subtype: 'depreciation', parentCode: '6900' },
    { code: '6950', name: 'Amortization - Intangibles', type: 'EXPENSE', description: 'Expense', isSystem: true, isContra: false, subtype: 'depreciation', parentCode: '6900' },

    // ============================================
    // OTHER EXPENSES (8000-8999)
    // Non-operating expenses
    // ============================================
    { code: '8000', name: 'Other Expenses', type: 'EXPENSE', description: 'Non-operating expenses', isSystem: true, isContra: false, subtype: 'other_expense', isParent: true },
    { code: '8010', name: 'Loss on Asset Disposal', type: 'EXPENSE', description: 'Loss when selling asset', isSystem: true, isContra: false, subtype: 'other_expense', parentCode: '8000' },
    { code: '8020', name: 'Fines & Penalties', type: 'EXPENSE', description: 'KRA/Traffic fines (Not deductible)', isSystem: false, isContra: false, subtype: 'other_expense', parentCode: '8000' },
    { code: '8030', name: 'Charitable Donations', type: 'EXPENSE', description: 'Donations/CSR', isSystem: false, isContra: false, subtype: 'other_expense', parentCode: '8000' },
    { code: '8040', name: 'Theft / Loss of Funds', type: 'EXPENSE', description: 'Stolen or lost money', isSystem: false, isContra: false, subtype: 'other_expense', parentCode: '8000' },
];

async function seedExpenseAccounts() {
    try {
        console.log('🔄 Starting EXPENSE Account Seeding...\n');
        const tenant = await prisma.tenant.findFirst();
        if (!tenant) { console.error('❌ No tenant found.'); return; }
        console.log(`✅ Found tenant: ${tenant.name} (ID: ${tenant.id})\n`);

        console.log(`📦 Found ${EXPENSE_ACCOUNTS.length} EXPENSE accounts to seed\n`);

        let created = 0, updated = 0;
        for (const account of EXPENSE_ACCOUNTS) {
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
                        subtype: account.subtype || null,
                        systemTag: account.systemTag || null,
                        // We do NOT mess with existing transaction data, just names/structure
                        // If parent connection is new, we verify it exists first? Prisma handles validation usually
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
                        isContra: false,
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
        console.log(`   📦 Total EXPENSE accounts: ${EXPENSE_ACCOUNTS.length}`);

        console.log('\n✅ EXPENSE seeding completed!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}
seedExpenseAccounts();
