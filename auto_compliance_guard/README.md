# Auto-Compliance Guard – Vendor Payments

A single-file offline web application for compliance scanning of vendor payment data.

## Bug Fixes Applied

### 1. Discount Rule Logic (Line 449)
**Original Issue**: The regex pattern `/(discount (?:not )?taken/` made "not" optional, causing it to match both "discount taken" and "discount not taken".

**Fix**: Changed to specifically match "discount not taken":
```javascript
// Before (BUGGY):
m = L.match(/discount (?:not )?taken.*(?:amount|payment).*?(?:>|over|greater than)\s*([\d,\.]+)/);

// After (FIXED):
m = L.match(/discount not taken.*(?:amount|payment).*?(?:>|over|greater than)\s*([\d,\.]+)/);
```

### 2. Simple Field Comparison - Field Name Mapping (Lines 463-483)
**Original Issue**: The code tried to convert lowercase field names like `payment_amount` to camelCase (`PaymentAmount`), but the actual data uses underscore notation (`Payment_Amount`).

**Fix**: Added explicit field mapping:
```javascript
// Before (BUGGY):
const field = simple[1].replace(/\s+/g,'_');
const v = toNumber(row[field.replace(/(^|_)([a-z])/g,(m,p1,p2)=>p1+p2.toUpperCase())]);

// After (FIXED):
const fieldMap = {
  'payment_amount': 'Payment_Amount',
  'historical_average_amount': 'Historical_Average_Amount',
  'payment_term_days': 'Payment_Term_Days'
};
const rawField = simple[1];
const actualField = fieldMap[rawField];
const v = toNumber(row[actualField]);
```

### 3. Operator Comparison Safety (Line 478)
**Original Issue**: Used `==` for strict comparison instead of `===`.

**Fix**: Changed to strict equality and added fallback:
```javascript
// Before:
case "==": return v==val;

// After:
case "==": return v===val;
// Also added:
return false; // at end of switch
```

## Testing the Fixes

### Test Case 1: Discount Not Taken Rule
**Input Rule**:
```
Flag if discount not taken and amount > 200000
```

**Expected Behavior**:
- Should flag rows where `Discount_Taken === 'N'` AND `Payment_Amount > 200000`
- Should NOT flag rows where `Discount_Taken === 'Y'`

**How to Test**:
1. Open `index.html` in a browser
2. Click "🧩 Define Rules"
3. Enter the rule above
4. Click "🧠 Interpret Rules"
5. Verify the preview shows: `IF Discount_Taken==N AND Payment_Amount > 200000 → Flag: Discount Not Taken`
6. Click "🔎 Run Scan"
7. Check that only vendors with Discount_Taken='N' AND high amounts are flagged

### Test Case 2: Simple Field Comparison
**Input Rule**:
```
payment_amount > 500000
```

**Expected Behavior**:
- Should flag all rows where `Payment_Amount > 500000`

**How to Test**:
1. Open the Rules drawer
2. Enter: `payment_amount > 500000`
3. Click "🧠 Interpret Rules"
4. Verify preview shows: `IF Payment_Amount > 500000 → Flag`
5. Run scan and verify it flags payments above 500K

### Test Case 3: Historical Average Comparison
**Input Rule**:
```
historical_average_amount < 50000
```

**Expected Behavior**:
- Should flag vendors with low historical averages

**How to Test**:
1. Enter the rule
2. Interpret it
3. Run scan
4. Verify it correctly identifies vendors with `Historical_Average_Amount < 50000`

## All Supported Rules

The system now correctly supports:

1. **High Amount**: `Flag any payment over 500000 INR`
2. **New Vendor**: `Alert if vendor is new and amount > 100000`
3. **Duplicate Bank**: `Highlight duplicate vendor bank accounts in this run`
4. **Aged Invoice**: `Flag if invoice older than 90 days`
5. **Country Watchlist**: `Alert if vendor country is RU or IR`
6. **Discount Not Taken**: `Flag if discount not taken and amount > 200000` ✅ FIXED
7. **Payment Method**: `payment method is BANK_TRANSFER`
8. **Field Comparisons**: ✅ FIXED
   - `payment_amount > 500000`
   - `historical_average_amount < 100000`
   - `payment_term_days >= 60`

## Usage

1. Open `index.html` in any modern web browser
2. The app generates synthetic payment data on load
3. Import your own CSV (optional) with the "📥 Import CSV" button
4. Define rules using natural language
5. Click "🔎 Run Scan" to execute all rules
6. Review flagged items in the right drawer
7. Export results with "⬇️ Download Report CSV"

## Features

- **100% Offline**: No server required, works from local filesystem
- **Single File**: Entire app in one HTML file
- **Persistent State**: Rules and reviews saved in localStorage
- **Multi-sort**: Shift+click column headers to sort by multiple fields
- **Search**: Filter payments by any field value
- **Review Workflow**: Escalate or clear each flagged item with comments

## Browser Compatibility

Tested and working in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
