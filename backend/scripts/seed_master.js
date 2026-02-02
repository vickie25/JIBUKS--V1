/**
 * MASTER SEED SCRIPT
 * 
 * This script runs ALL individual seed scripts in the correct order to set up
 * a complete, World-Class Chart of Accounts and Common Suppliers.
 * 
 * Usage: node scripts/seed_master.js
 */
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scripts = [
    { name: 'ASSETS', file: 'seed_assets.js' },
    { name: 'LIABILITIES', file: 'seed_liabilities_update.js' }, // Uses the updated professional names
    { name: 'EQUITY', file: 'seed_equity.js' },
    { name: 'REVENUE', file: 'seed_revenue.js' },
    { name: 'EXPENSES', file: 'seed_expenses.js' },
    { name: 'SUPPLIERS', file: 'seed_kenyan_suppliers.js' },
];

console.log('🚀 INITIALIZING MASTER SEED SEQUENCE...\n');

for (const script of scripts) {
    try {
        console.log(`\n============================================================`);
        console.log(`▶️  RUNNING: ${script.name} (${script.file})`);
        console.log(`============================================================`);

        const scriptPath = path.join(__dirname, script.file);

        // Execute the script synchronously
        execSync(`node "${scriptPath}"`, { stdio: 'inherit' });

        console.log(`\n✅ ${script.name} COMPLETED SUCCESSFULLY.`);
    } catch (error) {
        console.error(`\n❌ FAILED TO RUN ${script.name}:`, error.message);
        process.exit(1); // Stop execution on failure
    }
}

console.log(`\n\n============================================================`);
console.log(`🎉 MASTER SEED SEQUENCE COMPLETE!`);
console.log(`============================================================`);
console.log(`Your database is now populated with:`);
console.log(`   - World-Class Chart of Accounts (Assets, Liabilities, Equity, Income, Expenses)`);
console.log(`   - Comprehensive Hierarchy & Professional Naming`);
console.log(`   - Common Kenyan Suppliers (Naivas, KPLC, Safaricom, etc.)`);
console.log(`\nReady for development! 🚀`);
