# Profit & Loss Report Debugging Guide

## Issue
The Income Statement (Profit & Loss) is not populating data while the Balance Sheet is working fine.

## Backend Analysis

### 1. Route Registration ✅
- File: `backend/src/app.js` (line 111)
- Route: `/api/reports` is properly registered
- Handler: `reportsRoutes` from `./routes/reports.js`

### 2. Profit & Loss Endpoint ✅
- File: `backend/src/routes/reports.js` (lines 71-94)
- Endpoint: `GET /api/reports/profit-loss`
- Handler: Calls `getProfitAndLoss(tenantId, startDate, endDate)`

### 3. Service Function ✅
- File: `backend/src/services/accountingService.js` (lines 1022-1116)
- Function: `getProfitAndLoss(tenantId, startDate, endDate)`
- Logic:
  - Fetches INCOME accounts
  - Fetches EXPENSE accounts
  - Calculates totals using journal lines
  - Returns structured data with income/expenses/netIncome

## Frontend Analysis

### 1. API Service Method ✅
- File: `FRONTEND/services/api.ts` (lines 919-926)
- Method: `getProfitLoss(startDate?, endDate?)`
- Endpoint: `/reports/profit-loss`

### 2. Component Usage ✅
- File: `FRONTEND/app/reports/profit-loss.tsx`
- Line 73: `const data = await apiService.getProfitLoss(startDate, endDate);`
- Displays: income.lines, expenses.lines, netIncome, savingsRate

## Possible Issues to Check

### 1. **No INCOME or EXPENSE Accounts**
   - The Chart of Accounts may not have any INCOME or EXPENSE accounts seeded
   - Check: Run seed script or verify accounts exist

### 2. **No Journal Entries for Income/Expenses**
   - Even if accounts exist, there may be no posted journal entries
   - Check: Verify transactions have been recorded

### 3. **Date Range Issues**
   - The date range might not match any existing transactions
   - Check: Verify the period selection matches transaction dates

### 4. **Backend Not Running**
   - The backend server may not be running
   - Check: Start backend with `npm run dev`

### 5. **Network/CORS Issues**
   - Frontend may not be connecting to backend
   - Check: Verify IP addresses match in .env files

## Debugging Steps

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test the Endpoint Directly**
   ```bash
   # Get current month's P&L
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://192.168.1.68:4400/api/reports/profit-loss"
   ```

3. **Check Database for Accounts**
   - Verify INCOME accounts exist (type = 'INCOME')
   - Verify EXPENSE accounts exist (type = 'EXPENSE')

4. **Check Database for Journal Entries**
   - Verify journal entries exist with status = 'POSTED'
   - Verify journal lines link to INCOME/EXPENSE accounts

5. **Check Frontend Console**
   - Look for API errors
   - Check network tab for failed requests
   - Verify response data structure

## Expected Response Format

```json
{
  "report": "Profit & Loss Statement",
  "period": {
    "startDate": "2026-02-01T00:00:00.000Z",
    "endDate": "2026-02-28T23:59:59.999Z"
  },
  "income": {
    "lines": [
      {
        "accountId": 123,
        "code": "4000",
        "name": "Salary Income",
        "amount": 50000
      }
    ],
    "total": 50000
  },
  "expenses": {
    "lines": [
      {
        "accountId": 456,
        "code": "5000",
        "name": "Rent Expense",
        "amount": 15000
      }
    ],
    "total": 15000
  },
  "netIncome": 35000,
  "savingsRate": "70.0",
  "generatedAt": "2026-02-02T05:53:27.000Z"
}
```

## Next Steps

1. Start the backend server
2. Check if INCOME/EXPENSE accounts are seeded
3. Verify journal entries exist for the selected period
4. Test the API endpoint directly
5. Check frontend console for errors
