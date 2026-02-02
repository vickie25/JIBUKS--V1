/**
 * Seed Script: Update LIABILITY Accounts with Professional Names (Removing 'Control')
 * Run: node scripts/seed_liabilities_update.js
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LIABILITY_ACCOUNTS = [
    // ----------------------------------------
    // ACCOUNTS PAYABLE (2000-2049)
    // ----------------------------------------
    { code: '2000', name: 'Accounts Payable (Total)', type: 'LIABILITY', description: 'Total trade payables', isSystem: true, isContra: false, subtype: 'accounts_payable', isParent: true },
    { code: '2001', name: 'Supplier - General', type: 'LIABILITY', description: 'General supplier payables', isSystem: false, isContra: false, subtype: 'accounts_payable', parentCode: '2000' },
    { code: '2002', name: 'Supplier - Inventory', type: 'LIABILITY', description: 'Payables for inventory purchases', isSystem: false, isContra: false, subtype: 'accounts_payable', parentCode: '2000' },
    { code: '2003', name: 'Supplier - Services', type: 'LIABILITY', description: 'Payables for services received', isSystem: false, isContra: false, subtype: 'accounts_payable', parentCode: '2000' },
    { code: '2004', name: 'Supplier - Utilities', type: 'LIABILITY', description: 'Utility bills payable (Kenya Power, Water)', isSystem: false, isContra: false, subtype: 'accounts_payable', parentCode: '2000' },
    { code: '2005', name: 'Supplier - Rent', type: 'LIABILITY', description: 'Rent payable to landlord', isSystem: false, isContra: false, subtype: 'accounts_payable', parentCode: '2000' },
    { code: '2006', name: 'Supplier - Professional Services', type: 'LIABILITY', description: 'Payables to lawyers, accountants, consultants', isSystem: false, isContra: false, subtype: 'accounts_payable', parentCode: '2000' },
    { code: '2007', name: 'Supplier - Insurance', type: 'LIABILITY', description: 'Insurance premiums payable', isSystem: false, isContra: false, subtype: 'accounts_payable', parentCode: '2000' },
    { code: '2008', name: 'Supplier - Maintenance & Repairs', type: 'LIABILITY', description: 'Payables for maintenance services', isSystem: false, isContra: false, subtype: 'accounts_payable', parentCode: '2000' },
    { code: '2009', name: 'Supplier - Marketing & Advertising', type: 'LIABILITY', description: 'Marketing costs payable', isSystem: false, isContra: false, subtype: 'accounts_payable', parentCode: '2000' },
    { code: '2010', name: 'Supplier - Fuel & Transport', type: 'LIABILITY', description: 'Fuel and transportation payables', isSystem: false, isContra: false, subtype: 'accounts_payable', parentCode: '2000' },
    { code: '2011', name: 'Supplier - Subscriptions', type: 'LIABILITY', description: 'Software, media subscriptions payable', isSystem: false, isContra: false, subtype: 'accounts_payable', parentCode: '2000' },
    { code: '2012', name: 'Supplier - Medical', type: 'LIABILITY', description: 'Medical and healthcare payables', isSystem: false, isContra: false, subtype: 'accounts_payable', parentCode: '2000' },

    // ----------------------------------------
    // CREDIT CARDS (2050-2099)
    // ----------------------------------------
    { code: '2050', name: 'Credit Cards', type: 'LIABILITY', description: 'Total credit card liabilities', isSystem: true, isContra: false, isPaymentEligible: true, subtype: 'credit_card', isParent: true },
    { code: '2051', name: 'Visa Credit Card', type: 'LIABILITY', description: 'Visa card balance', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'credit_card', parentCode: '2050' },
    { code: '2052', name: 'Mastercard', type: 'LIABILITY', description: 'Mastercard balance', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'credit_card', parentCode: '2050' },
    { code: '2053', name: 'American Express', type: 'LIABILITY', description: 'Amex card balance', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'credit_card', parentCode: '2050' },
    { code: '2054', name: 'Store Credit Card', type: 'LIABILITY', description: 'Retail store credit cards', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'credit_card', parentCode: '2050' },
    { code: '2055', name: 'Business Credit Card', type: 'LIABILITY', description: 'Corporate/business credit card', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'credit_card', parentCode: '2050' },

    // ----------------------------------------
    // TAXES PAYABLE (2100-2199)
    // ----------------------------------------
    { code: '2100', name: 'Taxes Payable', type: 'LIABILITY', description: 'Total tax liabilities', isSystem: true, isContra: false, subtype: 'taxes_payable', isParent: true },

    // VAT Breakdown
    { code: '2110', name: 'VAT Payable (Output VAT)', type: 'LIABILITY', description: 'VAT collected on sales - Standard Rate 16%', isSystem: true, isContra: false, subtype: 'vat_payable', isParent: false, parentCode: '2100' },
    { code: '2111', name: 'VAT Payable - Zero Rated', type: 'LIABILITY', description: 'VAT on zero-rated supplies (0%)', isSystem: true, isContra: false, subtype: 'vat_payable', isParent: false, parentCode: '2100' },
    { code: '2112', name: 'VAT Payable - Exempt', type: 'LIABILITY', description: 'VAT exempt supplies tracking', isSystem: true, isContra: false, subtype: 'vat_payable', isParent: false, parentCode: '2100' },

    // Other Tax Payables
    { code: '2120', name: 'Income Tax Payable', type: 'LIABILITY', description: 'Corporate/Business income tax', isSystem: true, isContra: false, subtype: 'taxes_payable', parentCode: '2100' },
    { code: '2121', name: 'Withholding Tax Payable', type: 'LIABILITY', description: 'WHT on payments to suppliers (5%)', isSystem: true, isContra: false, subtype: 'taxes_payable', parentCode: '2100' },
    { code: '2122', name: 'Turnover Tax Payable', type: 'LIABILITY', description: 'TOT for small businesses (1%)', isSystem: true, isContra: false, subtype: 'taxes_payable', parentCode: '2100' },
    { code: '2123', name: 'Excise Duty Payable', type: 'LIABILITY', description: 'Excise tax on specific goods', isSystem: false, isContra: false, subtype: 'taxes_payable', parentCode: '2100' },
    { code: '2124', name: 'Import Duty Payable', type: 'LIABILITY', description: 'Customs duty on imports', isSystem: false, isContra: false, subtype: 'taxes_payable', parentCode: '2100' },
    { code: '2125', name: 'Property Rates Payable', type: 'LIABILITY', description: 'County/municipal property rates', isSystem: false, isContra: false, subtype: 'taxes_payable', parentCode: '2100' },
    { code: '2126', name: 'Digital Service Tax Payable', type: 'LIABILITY', description: 'DST on digital services (1.5%)', isSystem: false, isContra: false, subtype: 'taxes_payable', parentCode: '2100' },
    { code: '2127', name: 'Minimum Tax Payable', type: 'LIABILITY', description: 'Minimum tax on gross turnover', isSystem: false, isContra: false, subtype: 'taxes_payable', parentCode: '2100' },
    { code: '2128', name: 'Capital Gains Tax Payable', type: 'LIABILITY', description: 'CGT on sale of assets (5%)', isSystem: false, isContra: false, subtype: 'taxes_payable', parentCode: '2100' },
    { code: '2129', name: 'Stamp Duty Payable', type: 'LIABILITY', description: 'Stamp duty on documents/transfers', isSystem: false, isContra: false, subtype: 'taxes_payable', parentCode: '2100' },
    { code: '2130', name: 'Presumptive Tax Payable', type: 'LIABILITY', description: 'Tax for matatu/PSV operators', isSystem: false, isContra: false, subtype: 'taxes_payable', parentCode: '2100' },
    { code: '2131', name: 'Rental Income Tax Payable', type: 'LIABILITY', description: 'Tax on rental income (10%)', isSystem: false, isContra: false, subtype: 'taxes_payable', parentCode: '2100' },

    // ----------------------------------------
    // PAYROLL LIABILITIES (2200-2299)
    // ----------------------------------------
    { code: '2200', name: 'Payroll Liabilities', type: 'LIABILITY', description: 'Total employee-related payables', isSystem: true, isContra: false, subtype: 'payroll_liability', isParent: true },
    { code: '2201', name: 'Salaries & Wages Payable', type: 'LIABILITY', description: 'Net salaries owed to employees', isSystem: true, isContra: false, subtype: 'payroll_liability', parentCode: '2200' },
    { code: '2202', name: 'PAYE Payable', type: 'LIABILITY', description: 'Pay As You Earn tax withheld', isSystem: true, isContra: false, subtype: 'payroll_liability', parentCode: '2200' },
    { code: '2203', name: 'NSSF Payable', type: 'LIABILITY', description: 'National Social Security Fund contributions', isSystem: true, isContra: false, subtype: 'payroll_liability', parentCode: '2200' },
    { code: '2204', name: 'NHIF Payable', type: 'LIABILITY', description: 'National Hospital Insurance Fund', isSystem: true, isContra: false, subtype: 'payroll_liability', parentCode: '2200' },
    { code: '2205', name: 'Housing Levy Payable', type: 'LIABILITY', description: 'Affordable Housing Levy (1.5%)', isSystem: true, isContra: false, subtype: 'payroll_liability', parentCode: '2200' },
    { code: '2206', name: 'NITA Levy Payable', type: 'LIABILITY', description: 'National Industrial Training Authority levy', isSystem: true, isContra: false, subtype: 'payroll_liability', parentCode: '2200' },
    { code: '2207', name: 'Pension Fund Contributions Payable', type: 'LIABILITY', description: 'Private pension scheme deductions', isSystem: false, isContra: false, subtype: 'payroll_liability', parentCode: '2200' },
    { code: '2208', name: 'Sacco Deductions Payable', type: 'LIABILITY', description: 'Employee Sacco contributions', isSystem: false, isContra: false, subtype: 'payroll_liability', parentCode: '2200' },
    { code: '2209', name: 'Union Dues Payable', type: 'LIABILITY', description: 'Trade union deductions', isSystem: false, isContra: false, subtype: 'payroll_liability', parentCode: '2200' },
    { code: '2210', name: 'Staff Loans Deductions Payable', type: 'LIABILITY', description: 'Deductions for staff loan repayments', isSystem: false, isContra: false, subtype: 'payroll_liability', parentCode: '2200' },
    { code: '2211', name: 'Bonus & Commissions Payable', type: 'LIABILITY', description: 'Accrued bonuses and commissions', isSystem: false, isContra: false, subtype: 'payroll_liability', parentCode: '2200' },
    { code: '2212', name: 'Leave Accrual Payable', type: 'LIABILITY', description: 'Accrued annual leave liability', isSystem: false, isContra: false, subtype: 'payroll_liability', parentCode: '2200' },
    { code: '2213', name: 'Gratuity Payable', type: 'LIABILITY', description: 'End of contract gratuity accrual', isSystem: false, isContra: false, subtype: 'payroll_liability', parentCode: '2200' },
    { code: '2214', name: 'Severance Payable', type: 'LIABILITY', description: 'Redundancy/severance pay liability', isSystem: false, isContra: false, subtype: 'payroll_liability', parentCode: '2200' },

    // ----------------------------------------
    // SHORT-TERM LOANS (2300-2349)
    // ----------------------------------------
    { code: '2300', name: 'Short-Term Loans', type: 'LIABILITY', description: 'Loans and facilities due within 1 year', isSystem: true, isContra: false, subtype: 'loans_current', isParent: true },
    { code: '2301', name: 'Bank Overdraft', type: 'LIABILITY', description: 'Bank overdraft facility', isSystem: true, isContra: false, isPaymentEligible: true, subtype: 'loans_current', parentCode: '2300' },
    { code: '2302', name: 'M-Shwari Loan', type: 'LIABILITY', description: 'M-Shwari mobile money loan', isSystem: false, isContra: false, subtype: 'loans_current', parentCode: '2300' },
    { code: '2303', name: 'Fuliza Overdraft', type: 'LIABILITY', description: 'M-PESA Fuliza overdraft', isSystem: false, isContra: false, subtype: 'loans_current', parentCode: '2300' },
    { code: '2304', name: 'KCB M-PESA Loan', type: 'LIABILITY', description: 'KCB mobile loan facility', isSystem: false, isContra: false, subtype: 'loans_current', parentCode: '2300' },
    { code: '2305', name: 'Tala Loan', type: 'LIABILITY', description: 'Tala digital loan', isSystem: false, isContra: false, subtype: 'loans_current', parentCode: '2300' },
    { code: '2306', name: 'Branch Loan', type: 'LIABILITY', description: 'Branch digital loan', isSystem: false, isContra: false, subtype: 'loans_current', parentCode: '2300' },
    { code: '2307', name: 'Zenka Loan', type: 'LIABILITY', description: 'Zenka mobile loan', isSystem: false, isContra: false, subtype: 'loans_current', parentCode: '2300' },
    { code: '2308', name: 'Hustle Loan', type: 'LIABILITY', description: 'Safaricom Hustle loan', isSystem: false, isContra: false, subtype: 'loans_current', parentCode: '2300' },
    { code: '2309', name: 'Timiza Loan', type: 'LIABILITY', description: 'Absa Timiza mobile loan', isSystem: false, isContra: false, subtype: 'loans_current', parentCode: '2300' },
    { code: '2310', name: 'Family/Friends Loan - Short Term', type: 'LIABILITY', description: 'Informal loans from family/friends', isSystem: false, isContra: false, subtype: 'loans_current', parentCode: '2300' },
    { code: '2311', name: 'Chama/Group Loan', type: 'LIABILITY', description: 'Loan from investment group/chama', isSystem: false, isContra: false, subtype: 'loans_current', parentCode: '2300' },
    { code: '2312', name: 'Short-Term Bank Loan', type: 'LIABILITY', description: 'Bank loan due within 1 year', isSystem: true, isContra: false, subtype: 'loans_current', parentCode: '2300' },
    { code: '2313', name: 'Trade Finance Facility', type: 'LIABILITY', description: 'Short-term trade financing', isSystem: false, isContra: false, subtype: 'loans_current', parentCode: '2300' },
    { code: '2314', name: 'Invoice Financing', type: 'LIABILITY', description: 'Advance against receivables', isSystem: false, isContra: false, subtype: 'loans_current', parentCode: '2300' },
    { code: '2315', name: 'Lipa Later Facility', type: 'LIABILITY', description: 'Buy now pay later obligations', isSystem: false, isContra: false, subtype: 'loans_current', parentCode: '2300' },

    // ----------------------------------------
    // DEFERRED REVENUE (2350-2399)
    // ----------------------------------------
    { code: '2350', name: 'Deferred Revenue', type: 'LIABILITY', description: 'Total unearned income', isSystem: true, isContra: false, subtype: 'deferred_revenue', isParent: true },
    { code: '2351', name: 'Customer Deposits', type: 'LIABILITY', description: 'Advance deposits from customers', isSystem: true, isContra: false, subtype: 'deferred_revenue', parentCode: '2350' },
    { code: '2352', name: 'Unearned Service Revenue', type: 'LIABILITY', description: 'Prepaid services not yet delivered', isSystem: false, isContra: false, subtype: 'deferred_revenue', parentCode: '2350' },
    { code: '2353', name: 'Subscription Revenue Deferred', type: 'LIABILITY', description: 'Prepaid subscription income', isSystem: false, isContra: false, subtype: 'deferred_revenue', parentCode: '2350' },
    { code: '2354', name: 'Rent Received in Advance', type: 'LIABILITY', description: 'Prepaid rent from tenants', isSystem: false, isContra: false, subtype: 'deferred_revenue', parentCode: '2350' },
    { code: '2355', name: 'Insurance Premium Advance', type: 'LIABILITY', description: 'Insurance premiums received in advance', isSystem: false, isContra: false, subtype: 'deferred_revenue', parentCode: '2350' },
    { code: '2356', name: 'Retainer Fees Deferred', type: 'LIABILITY', description: 'Professional retainer fees in advance', isSystem: false, isContra: false, subtype: 'deferred_revenue', parentCode: '2350' },
    { code: '2357', name: 'Gift Card Liability', type: 'LIABILITY', description: 'Unredeemed gift cards/vouchers', isSystem: false, isContra: false, subtype: 'deferred_revenue', parentCode: '2350' },
    { code: '2358', name: 'Loyalty Points Liability', type: 'LIABILITY', description: 'Unredeemed customer loyalty points', isSystem: false, isContra: false, subtype: 'deferred_revenue', parentCode: '2350' },

    // ----------------------------------------
    // ACCRUED EXPENSES (2400-2449)
    // ----------------------------------------
    { code: '2400', name: 'Accrued Expenses', type: 'LIABILITY', description: 'Total expenses incurred but not paid', isSystem: true, isContra: false, subtype: 'accrued_expense', isParent: true },
    { code: '2401', name: 'Accrued Interest Expense', type: 'LIABILITY', description: 'Interest expense not yet paid', isSystem: true, isContra: false, subtype: 'accrued_expense', parentCode: '2400' },
    { code: '2402', name: 'Accrued Rent Expense', type: 'LIABILITY', description: 'Rent expense not yet paid', isSystem: false, isContra: false, subtype: 'accrued_expense', parentCode: '2400' },
    { code: '2403', name: 'Accrued Utilities', type: 'LIABILITY', description: 'Utility bills not yet received/paid', isSystem: false, isContra: false, subtype: 'accrued_expense', parentCode: '2400' },
    { code: '2404', name: 'Accrued Professional Fees', type: 'LIABILITY', description: 'Legal/accounting fees incurred not paid', isSystem: false, isContra: false, subtype: 'accrued_expense', parentCode: '2400' },
    { code: '2405', name: 'Accrued Audit Fees', type: 'LIABILITY', description: 'Audit fees for year-end', isSystem: false, isContra: false, subtype: 'accrued_expense', parentCode: '2400' },
    { code: '2406', name: 'Accrued Insurance', type: 'LIABILITY', description: 'Insurance expense not yet paid', isSystem: false, isContra: false, subtype: 'accrued_expense', parentCode: '2400' },
    { code: '2407', name: 'Accrued Warranty Expense', type: 'LIABILITY', description: 'Estimated warranty claims liability', isSystem: false, isContra: false, subtype: 'accrued_expense', parentCode: '2400' },
    { code: '2408', name: 'Accrued Repairs & Maintenance', type: 'LIABILITY', description: 'Maintenance costs incurred not paid', isSystem: false, isContra: false, subtype: 'accrued_expense', parentCode: '2400' },

    // ----------------------------------------
    // OTHER CURRENT LIABILITIES (2450-2499)
    // ----------------------------------------
    { code: '2450', name: 'Other Current Liabilities', type: 'LIABILITY', description: 'Miscellaneous current liabilities', isSystem: true, isContra: false, subtype: 'other_liability', isParent: true },
    { code: '2451', name: 'Dividends Payable', type: 'LIABILITY', description: 'Declared dividends not yet paid', isSystem: false, isContra: false, subtype: 'other_liability', parentCode: '2450' },
    { code: '2452', name: 'Current Portion of Long-Term Debt', type: 'LIABILITY', description: 'LT debt due within 12 months', isSystem: true, isContra: false, subtype: 'other_liability', parentCode: '2450' },
    { code: '2453', name: 'Director Loans Payable', type: 'LIABILITY', description: 'Amounts owed to directors', isSystem: false, isContra: false, subtype: 'other_liability', parentCode: '2450' },
    { code: '2454', name: 'Related Party Payables', type: 'LIABILITY', description: 'Amounts owed to related parties', isSystem: false, isContra: false, subtype: 'other_liability', parentCode: '2450' },
    { code: '2455', name: 'Deposits Held', type: 'LIABILITY', description: 'Security deposits from tenants/customers', isSystem: false, isContra: false, subtype: 'other_liability', parentCode: '2450' },
    { code: '2456', name: 'Suspense Account - Liability', type: 'LIABILITY', description: 'Temporary holding for unclassified items', isSystem: true, isContra: false, subtype: 'other_liability', parentCode: '2450' },

    // ----------------------------------------
    // LONG-TERM LOANS (2500-2599)
    // ----------------------------------------
    { code: '2500', name: 'Long-Term Loans', type: 'LIABILITY', description: 'Loans due after 1 year', isSystem: true, isContra: false, subtype: 'loans_long_term', isParent: true },
    { code: '2501', name: 'Bank Term Loan', type: 'LIABILITY', description: 'Long-term bank loan facility', isSystem: true, isContra: false, subtype: 'loans_long_term', parentCode: '2500' },
    { code: '2502', name: 'Mortgage Loan', type: 'LIABILITY', description: 'Home/property mortgage', isSystem: true, isContra: false, subtype: 'loans_long_term', parentCode: '2500' },
    { code: '2503', name: 'Asset Finance Loan', type: 'LIABILITY', description: 'Vehicle/equipment financing', isSystem: false, isContra: false, subtype: 'loans_long_term', parentCode: '2500' },
    { code: '2504', name: 'Sacco Loan', type: 'LIABILITY', description: 'Long-term Sacco loan', isSystem: false, isContra: false, subtype: 'loans_long_term', parentCode: '2500' },
    { code: '2505', name: 'Microfinance Loan', type: 'LIABILITY', description: 'Loan from MFI institution', isSystem: false, isContra: false, subtype: 'loans_long_term', parentCode: '2500' },
    { code: '2506', name: 'Hire Purchase Liability', type: 'LIABILITY', description: 'HP agreement obligations', isSystem: false, isContra: false, subtype: 'loans_long_term', parentCode: '2500' },
    { code: '2507', name: 'Lease Liability', type: 'LIABILITY', description: 'Finance lease obligations (IFRS 16)', isSystem: false, isContra: false, subtype: 'loans_long_term', parentCode: '2500' },
    { code: '2508', name: 'Development Finance Loan', type: 'LIABILITY', description: 'Loan from development finance institution', isSystem: false, isContra: false, subtype: 'loans_long_term', parentCode: '2500' },
    { code: '2509', name: 'Family/Friends Loan - Long Term', type: 'LIABILITY', description: 'Informal long-term loans', isSystem: false, isContra: false, subtype: 'loans_long_term', parentCode: '2500' },
    { code: '2510', name: 'Government Loan/Grant', type: 'LIABILITY', description: 'Youth/SME fund loans', isSystem: false, isContra: false, subtype: 'loans_long_term', parentCode: '2500' },

    // ----------------------------------------
    // BONDS & DEBENTURES (2600-2649)
    // ----------------------------------------
    { code: '2600', name: 'Bonds & Debentures', type: 'LIABILITY', description: 'Long-term debt securities', isSystem: true, isContra: false, subtype: 'bonds', isParent: true },
    { code: '2601', name: 'Corporate Bonds Payable', type: 'LIABILITY', description: 'Issued corporate bonds', isSystem: false, isContra: false, subtype: 'bonds', parentCode: '2600' },
    { code: '2602', name: 'Debentures Payable', type: 'LIABILITY', description: 'Issued debentures', isSystem: false, isContra: false, subtype: 'bonds', parentCode: '2600' },
    { code: '2603', name: 'Commercial Paper', type: 'LIABILITY', description: 'Short-term debt securities', isSystem: false, isContra: false, subtype: 'bonds', parentCode: '2600' },

    // ----------------------------------------
    // OTHER LONG-TERM LIABILITIES (2700-2799)
    // ----------------------------------------
    { code: '2700', name: 'Other Long-Term Liabilities', type: 'LIABILITY', description: 'Misc long-term obligations', isSystem: true, isContra: false, subtype: 'other_lt_liability', isParent: true },
    { code: '2701', name: 'Deferred Tax Liability', type: 'LIABILITY', description: 'Future tax obligations from timing differences', isSystem: true, isContra: false, subtype: 'other_lt_liability', parentCode: '2700' },
    { code: '2702', name: 'Pension Liability', type: 'LIABILITY', description: 'Defined benefit pension obligations', isSystem: false, isContra: false, subtype: 'other_lt_liability', parentCode: '2700' },
    { code: '2703', name: 'Provision for Litigation', type: 'LIABILITY', description: 'Potential legal claims/lawsuits', isSystem: false, isContra: false, subtype: 'other_lt_liability', parentCode: '2700' },
    { code: '2704', name: 'Provision for Restructuring', type: 'LIABILITY', description: 'Expected restructuring costs', isSystem: false, isContra: false, subtype: 'other_lt_liability', parentCode: '2700' },
    { code: '2705', name: 'Asset Retirement Obligation', type: 'LIABILITY', description: 'Decommissioning costs for assets', isSystem: false, isContra: false, subtype: 'other_lt_liability', parentCode: '2700' },
    { code: '2706', name: 'Long-Term Deferred Revenue', type: 'LIABILITY', description: 'Unearned income due after 1 year', isSystem: false, isContra: false, subtype: 'other_lt_liability', parentCode: '2700' },
    { code: '2707', name: 'Security Deposits Held - LT', type: 'LIABILITY', description: 'Long-term tenant/customer deposits', isSystem: false, isContra: false, subtype: 'other_lt_liability', parentCode: '2700' },
];

async function seedLiabilityAccounts() {
    try {
        console.log('🔄 Starting LIABILITY Account Seeding (Name Update)...\n');
        const tenant = await prisma.tenant.findFirst();
        if (!tenant) { console.error('❌ No tenant found.'); return; }
        console.log(`✅ Found tenant: ${tenant.name} (ID: ${tenant.id})\n`);

        console.log(`📦 Found ${LIABILITY_ACCOUNTS.length} LIABILITY accounts to seed/update\n`);

        let updated = 0;
        let created = 0;

        for (const account of LIABILITY_ACCOUNTS) {
            const existing = await prisma.account.findFirst({
                where: { tenantId: tenant.id, code: account.code }
            });

            if (existing) {
                // Update name and description to be "Control"-free
                await prisma.account.update({
                    where: { id: existing.id },
                    data: {
                        name: account.name,
                        description: account.description || null,
                        isSystem: account.isSystem ?? false,
                        isContra: account.isContra ?? false,
                        isPaymentEligible: account.isPaymentEligible ?? false,
                        subtype: account.subtype || null,
                        parentId: existing.parentId // Keep existing parent relationship if any
                    }
                });
                updated++;
            } else {
                // Should generally exist, but create if not
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
                        // Not setting parentId here easily without lookups, but assuming structure mostly exists
                    }
                });
                created++;
                console.log(`   ✅ Created: ${account.code} - ${account.name}`);
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 SEEDING SUMMARY');
        console.log('='.repeat(60));
        console.log(`   ⬆️  Updated: ${updated} accounts`);
        console.log(`   ✅ Created: ${created} accounts`);
        console.log(`   📦 Total LIABILITY accounts: ${LIABILITY_ACCOUNTS.length}`);

        console.log('\n✅ LIABILITY name updates completed!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}
seedLiabilityAccounts();
