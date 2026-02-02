/**
 * Seed Script: Update Chart of Accounts with NEW ASSET ACCOUNTS
 * Run: node scripts/seed_assets.js
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ASSET_ACCOUNTS = [
    // ----------------------------------------
    // CASH & CASH EQUIVALENTS (1000-1099)
    // ----------------------------------------
    { code: '1000', name: 'Cash & Cash Equivalents', type: 'ASSET', description: 'Total physical cash and equivalents', isSystem: true, isContra: false, subtype: 'cash', isParent: true },

    // Physical Cash (1001-1009)
    { code: '1001', name: 'Cash on Hand (Wallet)', type: 'ASSET', description: 'Physical cash carried daily', isSystem: true, isContra: false, isPaymentEligible: true, subtype: 'cash', systemTag: 'CASH', parentCode: '1000' },
    { code: '1002', name: 'Petty Cash (Home Safe)', type: 'ASSET', description: 'Emergency cash kept at home', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'cash', parentCode: '1000' },
    { code: '1003', name: 'Petty Cash (Office)', type: 'ASSET', description: 'Small office expenses cash', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'cash', parentCode: '1000' },
    { code: '1004', name: 'Cash Register', type: 'ASSET', description: 'Shop/business till cash', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'cash', parentCode: '1000' },
    { code: '1005', name: 'Undeposited Funds', type: 'ASSET', description: 'Cash received not yet banked', isSystem: true, isContra: false, subtype: 'cash', parentCode: '1000' },

    // Bank Accounts (1010-1049)
    { code: '1010', name: 'Commercial Bank Accounts', type: 'ASSET', description: 'Total holdings in commercial banks', isSystem: true, isContra: false, subtype: 'bank', isParent: true },

    // Tier 1 Banks
    { code: '1011', name: 'Equity Bank', type: 'ASSET', description: 'Tier 1 Bank', isSystem: true, isContra: false, isPaymentEligible: true, subtype: 'bank', systemTag: 'BANK', parentCode: '1010' },
    { code: '1012', name: 'KCB Bank', type: 'ASSET', description: 'Tier 1 Bank', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'bank', parentCode: '1010' },
    { code: '1013', name: 'Co-operative Bank', type: 'ASSET', description: 'Tier 1 Bank', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'bank', parentCode: '1010' },
    { code: '1014', name: 'NCBA Bank', type: 'ASSET', description: 'Tier 1 Bank', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'bank', parentCode: '1010' },
    { code: '1015', name: 'Standard Chartered', type: 'ASSET', description: 'Tier 1 Bank', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'bank', parentCode: '1010' },
    { code: '1016', name: 'Absa Bank', type: 'ASSET', description: 'Tier 1 Bank', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'bank', parentCode: '1010' },
    { code: '1017', name: 'I&M Bank', type: 'ASSET', description: 'Tier 1 Bank', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'bank', parentCode: '1010' },
    { code: '1018', name: 'DTB (Diamond Trust)', type: 'ASSET', description: 'Tier 1 Bank', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'bank', parentCode: '1010' },
    { code: '1019', name: 'Stanbic Bank', type: 'ASSET', description: 'Tier 1 Bank', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'bank', parentCode: '1010' },
    // Tier 2 Banks
    { code: '1020', name: 'Family Bank', type: 'ASSET', description: 'Tier 2 Bank', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'bank', parentCode: '1010' },
    { code: '1021', name: 'Kingdom Bank', type: 'ASSET', description: 'Tier 2 Bank', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'bank', parentCode: '1010' },
    { code: '1022', name: 'Postbank', type: 'ASSET', description: 'Tier 2 Bank', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'bank', parentCode: '1010' },
    { code: '1023', name: 'Credit Bank', type: 'ASSET', description: 'Tier 2 Bank', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'bank', parentCode: '1010' },
    { code: '1024', name: 'Bank of Africa', type: 'ASSET', description: 'Tier 2 Bank', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'bank', parentCode: '1010' },
    { code: '1025', name: 'Prime Bank', type: 'ASSET', description: 'Tier 2 Bank', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'bank', parentCode: '1010' },
    { code: '1026', name: 'HFC (Housing Finance)', type: 'ASSET', description: 'Tier 2 Bank', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'bank', parentCode: '1010' },
    { code: '1027', name: 'Sidian Bank', type: 'ASSET', description: 'Tier 2 Bank', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'bank', parentCode: '1010' },

    // Mobile Money (1050-1069)
    { code: '1050', name: 'Mobile Money Wallets', type: 'ASSET', description: 'Total mobile money holdings', isSystem: true, isContra: false, subtype: 'mobile_money', isParent: true },
    { code: '1051', name: 'M-PESA (Personal)', type: 'ASSET', description: 'Main wallet for daily spending', isSystem: true, isContra: false, isPaymentEligible: true, subtype: 'mobile_money', systemTag: 'MPESA', parentCode: '1050' },
    { code: '1052', name: 'M-PESA (Business/Till)', type: 'ASSET', description: 'Side-hustle Till number', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'mobile_money', parentCode: '1050' },
    { code: '1053', name: 'M-Shwari (Savings)', type: 'ASSET', description: 'Locked savings on SIM card', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'mobile_money', parentCode: '1050' },
    { code: '1054', name: 'KCB M-PESA', type: 'ASSET', description: 'Loan/Savings linked to SIM', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'mobile_money', parentCode: '1050' },
    { code: '1055', name: 'Airtel Money', type: 'ASSET', description: 'Alternative mobile wallet', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'mobile_money', parentCode: '1050' },
    { code: '1056', name: 'T-Kash (Telkom)', type: 'ASSET', description: 'Alternative mobile wallet', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'mobile_money', parentCode: '1050' },
    { code: '1057', name: 'Equitel', type: 'ASSET', description: 'Equity Bank mobile money', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'mobile_money', parentCode: '1050' },

    // Sacco FOSA (1070-1089)
    { code: '1070', name: 'Sacco Savings (Withdrawable)', type: 'ASSET', description: 'Total withdrawable Sacco savings', isSystem: true, isContra: false, subtype: 'sacco', isParent: true },
    { code: '1071', name: 'Stima Sacco (FOSA)', type: 'ASSET', description: 'Withdrawable Sacco Savings', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'sacco', parentCode: '1070' },
    { code: '1072', name: 'Mwalimu National (FOSA)', type: 'ASSET', description: 'Teachers Sacco', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'sacco', parentCode: '1070' },
    { code: '1073', name: 'Kenya Police Sacco (FOSA)', type: 'ASSET', description: 'Police Sacco', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'sacco', parentCode: '1070' },
    { code: '1074', name: 'Harambee Sacco (FOSA)', type: 'ASSET', description: 'Government Sacco', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'sacco', parentCode: '1070' },
    { code: '1075', name: 'Hazina Sacco (FOSA)', type: 'ASSET', description: 'Hazina Sacco', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'sacco', parentCode: '1070' },
    { code: '1076', name: 'Unaitas Sacco (FOSA)', type: 'ASSET', description: 'Unaitas Sacco', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'sacco', parentCode: '1070' },
    { code: '1077', name: 'Kenya Bankers Sacco', type: 'ASSET', description: 'Bankers Sacco', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'sacco', parentCode: '1070' },

    // Online Wallets & Crypto (1090-1099)
    { code: '1090', name: 'Digital Wallets & Crypto', type: 'ASSET', description: 'Total digital assets and wallets', isSystem: true, isContra: false, subtype: 'online_wallet', isParent: true },
    { code: '1091', name: 'PayPal', type: 'ASSET', description: 'For online work/freelancing', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'online_wallet', parentCode: '1090' },
    { code: '1092', name: 'Wise (TransferWise)', type: 'ASSET', description: 'For international transfers', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'online_wallet', parentCode: '1090' },
    { code: '1093', name: 'Skrill', type: 'ASSET', description: 'Online payment wallet', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'online_wallet', parentCode: '1090' },
    { code: '1094', name: 'Payoneer', type: 'ASSET', description: 'Freelancer payments', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'online_wallet', parentCode: '1090' },
    { code: '1095', name: 'Binance Wallet', type: 'ASSET', description: 'Crypto exchange wallet', isSystem: false, isContra: false, isPaymentEligible: true, subtype: 'crypto', parentCode: '1090' },
    { code: '1096', name: 'USDT (Tether)', type: 'ASSET', description: 'Stablecoin holdings', isSystem: false, isContra: false, isPaymentEligible: false, subtype: 'crypto', parentCode: '1090' },

    // ----------------------------------------
    // ACCOUNTS RECEIVABLE (1100-1149)
    // ----------------------------------------
    { code: '1100', name: 'Accounts Receivable (Total)', type: 'ASSET', description: 'Total money owed by customers', isSystem: true, isContra: false, subtype: 'accounts_receivable', isParent: true, systemTag: 'AR' },
    { code: '1101', name: 'Trade Receivables', type: 'ASSET', description: 'Customer invoices unpaid', isSystem: true, isContra: false, subtype: 'accounts_receivable', parentCode: '1100' },
    { code: '1102', name: 'Credit Sales Receivable', type: 'ASSET', description: 'Goods sold on credit', isSystem: false, isContra: false, subtype: 'accounts_receivable', parentCode: '1100' },
    { code: '1103', name: 'Service Receivables', type: 'ASSET', description: 'Services rendered, not paid', isSystem: false, isContra: false, subtype: 'accounts_receivable', parentCode: '1100' },
    { code: '1110', name: 'Allowance for Doubtful Debts', type: 'ASSET', description: 'Provision for bad debts', isSystem: true, isContra: true, subtype: 'contra_receivable', parentCode: '1100' },

    // ----------------------------------------
    // OTHER RECEIVABLES (1150-1199)
    // ----------------------------------------
    { code: '1150', name: 'Other Receivables', type: 'ASSET', description: 'Miscellaneous amounts owed', isSystem: true, isContra: false, subtype: 'other_receivable', isParent: true },
    { code: '1151', name: 'Loans to Friends/Family', type: 'ASSET', description: 'Money lent to individuals', isSystem: true, isContra: false, subtype: 'other_receivable', parentCode: '1150' },
    { code: '1152', name: 'Staff Loans & Advances', type: 'ASSET', description: 'Salary advances to employees', isSystem: false, isContra: false, subtype: 'other_receivable', parentCode: '1150' },
    { code: '1153', name: 'Salary Arrears', type: 'ASSET', description: 'Work done but not paid yet', isSystem: false, isContra: false, subtype: 'other_receivable', parentCode: '1150' },
    { code: '1154', name: 'Rent Security Deposits', type: 'ASSET', description: 'Refundable deposit with landlord', isSystem: false, isContra: false, subtype: 'other_receivable', parentCode: '1150' },
    { code: '1155', name: 'Utility Deposits', type: 'ASSET', description: 'Deposit with Kenya Power/Water', isSystem: false, isContra: false, subtype: 'other_receivable', parentCode: '1150' },
    { code: '1156', name: 'Insurance Deposits', type: 'ASSET', description: 'Refundable insurance deposits', isSystem: false, isContra: false, subtype: 'other_receivable', parentCode: '1150' },
    { code: '1157', name: 'VAT Receivable (Input VAT)', type: 'ASSET', description: 'VAT paid on purchases - 16%', isSystem: true, isContra: false, subtype: 'tax_receivable', parentCode: '1150' },
    { code: '1158', name: 'WHT Receivable', type: 'ASSET', description: 'Withholding tax to claim', isSystem: false, isContra: false, subtype: 'tax_receivable', parentCode: '1150' },
    { code: '1159', name: 'Prepaid Expenses', type: 'ASSET', description: 'Services paid in advance', isSystem: false, isContra: false, subtype: 'prepayment', parentCode: '1150' },
    { code: '1160', name: 'Prepaid Rent', type: 'ASSET', description: 'Rent paid in advance', isSystem: false, isContra: false, subtype: 'prepayment', parentCode: '1150' },
    { code: '1161', name: 'Prepaid Insurance', type: 'ASSET', description: 'Insurance paid in advance', isSystem: false, isContra: false, subtype: 'prepayment', parentCode: '1150' },

    // ----------------------------------------
    // INVENTORY (1200-1299)
    // ----------------------------------------
    { code: '1200', name: 'Inventory & Stock', type: 'ASSET', description: 'Total value of items for sale', isSystem: true, isContra: false, subtype: 'inventory', isParent: true, systemTag: 'INVENTORY' },

    // Merchandise Inventory
    { code: '1201', name: 'Merchandise Inventory', type: 'ASSET', description: 'Goods purchased for resale', isSystem: true, isContra: false, subtype: 'inventory', parentCode: '1200' },
    { code: '1202', name: 'Finished Goods', type: 'ASSET', description: 'Manufactured products ready for sale', isSystem: false, isContra: false, subtype: 'inventory', parentCode: '1200' },
    { code: '1203', name: 'Work in Progress (WIP)', type: 'ASSET', description: 'Partially completed products', isSystem: false, isContra: false, subtype: 'inventory_wip', parentCode: '1200' },
    { code: '1204', name: 'Raw Materials', type: 'ASSET', description: 'Materials for manufacturing', isSystem: false, isContra: false, subtype: 'inventory_raw', parentCode: '1200' },
    { code: '1205', name: 'Packaging Materials', type: 'ASSET', description: 'Boxes, bags, labels', isSystem: false, isContra: false, subtype: 'inventory_supplies', parentCode: '1200' },
    { code: '1206', name: 'Supplies Inventory', type: 'ASSET', description: 'Office/shop supplies for use', isSystem: false, isContra: false, subtype: 'inventory_supplies', parentCode: '1200' },
    { code: '1207', name: 'Fuel Inventory', type: 'ASSET', description: 'Fuel stock (petrol stations)', isSystem: false, isContra: false, subtype: 'inventory', parentCode: '1200' },
    { code: '1208', name: 'Spare Parts Inventory', type: 'ASSET', description: 'Auto parts, machine parts', isSystem: false, isContra: false, subtype: 'inventory', parentCode: '1200' },
    { code: '1209', name: 'Food & Beverage Inventory', type: 'ASSET', description: 'Restaurant/bar stock', isSystem: false, isContra: false, subtype: 'inventory', parentCode: '1200' },
    { code: '1210', name: 'Inventory in Transit', type: 'ASSET', description: 'Goods shipped, not received', isSystem: false, isContra: false, subtype: 'inventory', parentCode: '1200' },
    { code: '1220', name: 'Inventory Reserve', type: 'ASSET', description: 'Provision for obsolete stock', isSystem: true, isContra: true, subtype: 'contra_inventory', parentCode: '1200' },

    // ========================================
    // FIXED ASSETS (1300-1599)
    // ========================================

    // Property, Plant & Equipment Control
    { code: '1300', name: 'Fixed Assets (Total)', type: 'ASSET', description: 'Total Property, Plant & Equipment', isSystem: true, isContra: false, subtype: 'fixed_asset', isParent: true },

    // ----------------------------------------
    // LAND & BUILDINGS (1310-1349)
    // ----------------------------------------
    { code: '1310', name: 'Real Estate & Property', type: 'ASSET', description: 'Land and buildings portfolio', isSystem: true, isContra: false, subtype: 'fixed_asset_property', isParent: true, parentCode: '1300' },
    { code: '1311', name: 'Land (Freehold)', type: 'ASSET', description: 'Land - Does not depreciate', isSystem: false, isContra: false, subtype: 'fixed_asset_property', parentCode: '1310' },
    { code: '1312', name: 'Land (Leasehold)', type: 'ASSET', description: 'Leased land - Amortizes', isSystem: false, isContra: false, subtype: 'fixed_asset_property', parentCode: '1310' },
    { code: '1313', name: 'Residential Buildings', type: 'ASSET', description: 'House/home structure', isSystem: false, isContra: false, subtype: 'fixed_asset_property', parentCode: '1310' },
    { code: '1314', name: 'Commercial Buildings', type: 'ASSET', description: 'Office/shop buildings', isSystem: false, isContra: false, subtype: 'fixed_asset_property', parentCode: '1310' },
    { code: '1315', name: 'Rental Properties', type: 'ASSET', description: 'Apartments for rent', isSystem: false, isContra: false, subtype: 'fixed_asset_property', parentCode: '1310' },
    { code: '1316', name: 'Farm/Agricultural Land', type: 'ASSET', description: 'Farming land', isSystem: false, isContra: false, subtype: 'fixed_asset_property', parentCode: '1310' },
    { code: '1317', name: 'Construction WIP', type: 'ASSET', description: 'Building under construction', isSystem: false, isContra: false, subtype: 'fixed_asset_wip', parentCode: '1310' },
    { code: '1318', name: 'Land Improvements', type: 'ASSET', description: 'Fencing, landscaping, paving', isSystem: false, isContra: false, subtype: 'fixed_asset_property', parentCode: '1310' },
    { code: '1319', name: 'Accum. Depr - Buildings', type: 'ASSET', description: 'Buildings depreciation', isSystem: true, isContra: true, subtype: 'contra_asset', parentCode: '1310' },

    // ----------------------------------------
    // VEHICLES & TRANSPORT (1350-1389)
    // ----------------------------------------
    { code: '1350', name: 'Motor Vehicles & Transport', type: 'ASSET', description: 'All transport assets', isSystem: true, isContra: false, subtype: 'fixed_asset_vehicles', isParent: true, parentCode: '1300' },
    { code: '1351', name: 'Motor Vehicles - Cars', type: 'ASSET', description: 'Personal/company cars', isSystem: false, isContra: false, subtype: 'fixed_asset_vehicles', parentCode: '1350' },
    { code: '1352', name: 'Motor Vehicles - SUVs', type: 'ASSET', description: 'SUVs, 4x4 vehicles', isSystem: false, isContra: false, subtype: 'fixed_asset_vehicles', parentCode: '1350' },
    { code: '1353', name: 'Trucks & Lorries', type: 'ASSET', description: 'Commercial trucks', isSystem: false, isContra: false, subtype: 'fixed_asset_vehicles', parentCode: '1350' },
    { code: '1354', name: 'Buses & Matatus', type: 'ASSET', description: 'PSV vehicles', isSystem: false, isContra: false, subtype: 'fixed_asset_vehicles', parentCode: '1350' },
    { code: '1355', name: 'Motorcycles / Boda', type: 'ASSET', description: 'Motorbikes, scooters', isSystem: false, isContra: false, subtype: 'fixed_asset_vehicles', parentCode: '1350' },
    { code: '1356', name: 'Trailers', type: 'ASSET', description: 'Cargo trailers', isSystem: false, isContra: false, subtype: 'fixed_asset_vehicles', parentCode: '1350' },
    { code: '1357', name: 'Boats & Water Vessels', type: 'ASSET', description: 'Boats, fishing vessels', isSystem: false, isContra: false, subtype: 'fixed_asset_vehicles', parentCode: '1350' },
    { code: '1359', name: 'Accum. Depr - Vehicles', type: 'ASSET', description: 'Vehicle depreciation', isSystem: true, isContra: true, subtype: 'contra_asset', parentCode: '1350' },

    // ----------------------------------------
    // FURNITURE & FIXTURES (1390-1419)
    // ----------------------------------------
    { code: '1390', name: 'Furniture & Fittings', type: 'ASSET', description: 'Total furniture assets', isSystem: true, isContra: false, subtype: 'fixed_asset_furniture', isParent: true, parentCode: '1300' },
    { code: '1391', name: 'Office Furniture', type: 'ASSET', description: 'Desks, chairs, cabinets', isSystem: false, isContra: false, subtype: 'fixed_asset_furniture', parentCode: '1390' },
    { code: '1392', name: 'Home Furniture', type: 'ASSET', description: 'Sofas, beds, tables', isSystem: false, isContra: false, subtype: 'fixed_asset_furniture', parentCode: '1390' },
    { code: '1393', name: 'Shop Fittings', type: 'ASSET', description: 'Display units, shelving', isSystem: false, isContra: false, subtype: 'fixed_asset_furniture', parentCode: '1390' },
    { code: '1394', name: 'Restaurant Furniture', type: 'ASSET', description: 'Tables, chairs, counters', isSystem: false, isContra: false, subtype: 'fixed_asset_furniture', parentCode: '1390' },
    { code: '1399', name: 'Accum. Depr - Furniture', type: 'ASSET', description: 'Furniture depreciation', isSystem: true, isContra: true, subtype: 'contra_asset', parentCode: '1390' },

    // ----------------------------------------
    // EQUIPMENT & MACHINERY (1420-1469)
    // ----------------------------------------
    { code: '1420', name: 'Machinery & Equipment', type: 'ASSET', description: 'Total equipment assets', isSystem: true, isContra: false, subtype: 'fixed_asset_equipment', isParent: true, parentCode: '1300' },
    { code: '1421', name: 'Computer Equipment', type: 'ASSET', description: 'Laptops, desktops, servers', isSystem: false, isContra: false, subtype: 'fixed_asset_equipment', parentCode: '1420' },
    { code: '1422', name: 'Mobile Phones & Tablets', type: 'ASSET', description: 'High-value phones', isSystem: false, isContra: false, subtype: 'fixed_asset_equipment', parentCode: '1420' },
    { code: '1423', name: 'Printers & Copiers', type: 'ASSET', description: 'Office printing equipment', isSystem: false, isContra: false, subtype: 'fixed_asset_equipment', parentCode: '1420' },
    { code: '1424', name: 'Home Appliances', type: 'ASSET', description: 'Fridges, washing machines', isSystem: false, isContra: false, subtype: 'fixed_asset_equipment', parentCode: '1420' },
    { code: '1425', name: 'Kitchen Equipment', type: 'ASSET', description: 'Commercial kitchen equipment', isSystem: false, isContra: false, subtype: 'fixed_asset_equipment', parentCode: '1420' },
    { code: '1426', name: 'Farm Machinery', type: 'ASSET', description: 'Tractors, water pumps', isSystem: false, isContra: false, subtype: 'fixed_asset_equipment', parentCode: '1420' },
    { code: '1427', name: 'Manufacturing Equipment', type: 'ASSET', description: 'Factory machines', isSystem: false, isContra: false, subtype: 'fixed_asset_equipment', parentCode: '1420' },
    { code: '1428', name: 'Medical Equipment', type: 'ASSET', description: 'Clinic/hospital equipment', isSystem: false, isContra: false, subtype: 'fixed_asset_equipment', parentCode: '1420' },
    { code: '1429', name: 'Salon/Spa Equipment', type: 'ASSET', description: 'Beauty equipment', isSystem: false, isContra: false, subtype: 'fixed_asset_equipment', parentCode: '1420' },
    { code: '1430', name: 'Security Equipment', type: 'ASSET', description: 'CCTV, alarms, safes', isSystem: false, isContra: false, subtype: 'fixed_asset_equipment', parentCode: '1420' },
    { code: '1431', name: 'Audio/Visual Equipment', type: 'ASSET', description: 'Speakers, projectors, TVs', isSystem: false, isContra: false, subtype: 'fixed_asset_equipment', parentCode: '1420' },
    { code: '1432', name: 'Power Equipment', type: 'ASSET', description: 'Generators, solar panels', isSystem: false, isContra: false, subtype: 'fixed_asset_equipment', parentCode: '1420' },
    { code: '1439', name: 'Accum. Depr - Equipment', type: 'ASSET', description: 'Equipment depreciation', isSystem: true, isContra: true, subtype: 'contra_asset', parentCode: '1420' },

    // ----------------------------------------
    // OTHER FIXED ASSETS (1470-1499)
    // ----------------------------------------
    { code: '1470', name: 'Other Fixed Assets', type: 'ASSET', description: 'Miscellaneous assets - Control', isSystem: true, isContra: false, subtype: 'fixed_asset_other', isParent: true, parentCode: '1300' },
    { code: '1471', name: 'Jewelry & Precious Metals', type: 'ASSET', description: 'Gold, silver, diamonds', isSystem: false, isContra: false, subtype: 'fixed_asset_other', parentCode: '1470' },
    { code: '1472', name: 'Art & Collectibles', type: 'ASSET', description: 'Paintings, antiques', isSystem: false, isContra: false, subtype: 'fixed_asset_other', parentCode: '1470' },
    { code: '1473', name: 'Livestock', type: 'ASSET', description: 'Cows, goats, chickens', isSystem: false, isContra: false, subtype: 'biological_asset', parentCode: '1470' },
    { code: '1474', name: 'Trees & Plantations', type: 'ASSET', description: 'Timber, fruit trees', isSystem: false, isContra: false, subtype: 'biological_asset', parentCode: '1470' },
    { code: '1475', name: 'Intangible Assets', type: 'ASSET', description: 'Software, patents, licenses', isSystem: false, isContra: false, subtype: 'intangible', parentCode: '1470' },
    { code: '1476', name: 'Goodwill', type: 'ASSET', description: 'Business acquisition premium', isSystem: false, isContra: false, subtype: 'intangible', parentCode: '1470' },
    { code: '1479', name: 'Accum. Amort - Intangibles', type: 'ASSET', description: 'Intangible amortization', isSystem: true, isContra: true, subtype: 'contra_asset', parentCode: '1470' },

    // ========================================
    // INVESTMENTS (1500-1599)
    // ========================================
    { code: '1500', name: 'Long-Term Investments', type: 'ASSET', description: 'Total long-term investments', isSystem: true, isContra: false, subtype: 'investment', isParent: true },
    { code: '1501', name: 'Sacco Shares (BOSA)', type: 'ASSET', description: 'Non-withdrawable shares', isSystem: false, isContra: false, subtype: 'investment', parentCode: '1500' },
    { code: '1502', name: 'Money Market Fund (MMF)', type: 'ASSET', description: 'CIC, Britam, Sanlam funds', isSystem: false, isContra: false, subtype: 'investment', parentCode: '1500' },
    { code: '1503', name: 'Treasury Bonds', type: 'ASSET', description: 'Government bonds', isSystem: false, isContra: false, subtype: 'investment', parentCode: '1500' },
    { code: '1504', name: 'Treasury Bills', type: 'ASSET', description: 'Short-term government securities', isSystem: false, isContra: false, subtype: 'investment', parentCode: '1500' },
    { code: '1505', name: 'NSE Stocks (Kenya)', type: 'ASSET', description: 'Safaricom, Equity shares', isSystem: false, isContra: false, subtype: 'investment', parentCode: '1500' },
    { code: '1506', name: 'Offshore Stocks (US/UK)', type: 'ASSET', description: 'Apple, Tesla, Amazon', isSystem: false, isContra: false, subtype: 'investment', parentCode: '1500' },
    { code: '1507', name: 'Cryptocurrency Holdings', type: 'ASSET', description: 'Bitcoin, Ethereum', isSystem: false, isContra: false, subtype: 'investment', parentCode: '1500' },
    { code: '1508', name: 'Pension Fund (RBA)', type: 'ASSET', description: 'Private retirement savings', isSystem: false, isContra: false, subtype: 'investment', parentCode: '1500' },
    { code: '1509', name: 'Life Insurance (Cash Value)', type: 'ASSET', description: 'Policies with surrender value', isSystem: false, isContra: false, subtype: 'investment', parentCode: '1500' },
    { code: '1510', name: 'Unit Trusts', type: 'ASSET', description: 'Mutual fund units', isSystem: false, isContra: false, subtype: 'investment', parentCode: '1500' },
    { code: '1511', name: 'Corporate Bonds', type: 'ASSET', description: 'Company bonds', isSystem: false, isContra: false, subtype: 'investment', parentCode: '1500' },
    { code: '1512', name: 'Real Estate Investment', type: 'ASSET', description: 'REITs, property funds', isSystem: false, isContra: false, subtype: 'investment', parentCode: '1500' },
    { code: '1513', name: 'Chama/Group Investments', type: 'ASSET', description: 'Investment group shares', isSystem: false, isContra: false, subtype: 'investment', parentCode: '1500' },
    { code: '1514', name: 'Business Investment', type: 'ASSET', description: 'Shares in other businesses', isSystem: false, isContra: false, subtype: 'investment', parentCode: '1500' },

    // Clearing Account
    { code: '1599', name: 'Clearing Account', type: 'ASSET', description: 'Temporary clearing account', isSystem: true, isContra: false, subtype: 'other_asset' },
];

async function seedAssetAccounts() {
    try {
        console.log('🔄 Starting ASSET Account Seeding...\n');
        const tenant = await prisma.tenant.findFirst();
        if (!tenant) { console.error('❌ No tenant found.'); return; }
        console.log(`✅ Found tenant: ${tenant.name} (ID: ${tenant.id})\n`);

        console.log(`📦 Found ${ASSET_ACCOUNTS.length} ASSET accounts to seed\n`);

        let created = 0, updated = 0;
        for (const account of ASSET_ACCOUNTS) {
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
                        isPaymentEligible: account.isPaymentEligible ?? false,
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
                        isPaymentEligible: account.isPaymentEligible ?? false,
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
        console.log(`   📦 Total ASSET accounts: ${ASSET_ACCOUNTS.length}`);

        console.log('\n✅ ASSET seeding completed (Updated Names)!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}
seedAssetAccounts();
