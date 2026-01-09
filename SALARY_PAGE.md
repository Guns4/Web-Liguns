# Salary & Commission Page Implementation

## 📋 Summary

Implemented complete **Gaji & Komisi (Salary & Commission)** page with month/year filtering, financial summary cards, and detailed transaction history.

## ✅ Features Implemented

### **1. Month & Year Selector** 📅
- Dropdown for month selection (Januari - Desember)
- Dropdown for year selection (last 5 years)
- Automatic data reload on selection change
- Calendar icon for visual clarity

### **2. Three Summary Cards** 💰

**a) Total Pendapatan (Income)**
- Green gradient background
- Up arrow icon
- Sum of: `voucher_income` + `bonus`
- Currency format: Rp X,XXX,XXX

**b) Total Potongan (Deduction)**
- Red gradient background
- Down arrow icon
- Sum of: `deduction_loan` + `deduction_saving` + `deduction_health` + `deduction_store`
- Currency format: Rp X,XXX,XXX

**c) Gaji Bersih (Net Salary)**
- Purple gradient background with animation
- Wallet icon
- Formula: Total Income - Total Deduction
- Currency format with gradient text

### **3. Transaction History Table** 📊
- Columns: Tanggal, Tipe Transaksi, Keterangan, Nominal
- Color-coded: Green for income, Red for deduction
- Icon indicators (↑ for income, ↓ for deduction)
- Sorted by date (newest first)
- Footer with net total
- Export button (UI ready)

### **4. Rupiah Formatting** 💵
- Indonesian locale format
- Currency symbol: Rp
- Thousand separators: dot (.)
- No decimal places

### **5. Info Box** ℹ️
- Payment schedule information
- Important notes for employees
- Help text about calculations

---

## 🎨 **UI Components**

### **Summary Cards:**

```
┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────────┐
│ ↑                    ↗   │  │ ↓                    ↘   │  │ 💰                   $   │
│                          │  │                          │  │                          │
│ TOTAL PENDAPATAN         │  │ TOTAL POTONGAN           │  │ GAJI BERSIH              │
│ Rp 8,500,000             │  │ Rp 1,200,000             │  │ Rp 7,300,000             │
└──────────────────────────┘  └──────────────────────────┘  └──────────────────────────┘
    (Green gradient)              (Red gradient)                (Purple gradient)
```

### **Transaction Table:**

```
┌────────────────────────────────────────────────────────────────────────────┐
│ 📋 Riwayat Transaksi                                      [Export]         │
├────────────────────────────────────────────────────────────────────────────┤
│ Tanggal     │ Tipe Transaksi        │ Keterangan       │ Nominal          │
├─────────────┼───────────────────────┼──────────────────┼──────────────────┤
│ 8 Jan 2026  │ ↑ Pendapatan Voucher  │ Voucher harian   │ + Rp 250,000     │
│ 7 Jan 2026  │ ↑ Pendapatan Voucher  │ Voucher harian   │ + Rp 275,000     │
│ 5 Jan 2026  │ ↑ Bonus               │ Bonus performa   │ + Rp 500,000     │
│ 5 Jan 2026  │ ↓ Potongan Kasbon     │ Cicilan ke-2     │ - Rp 200,000     │
│ 5 Jan 2026  │ ↓ Potongan Toko       │ Beli produk      │ - Rp 150,000     │
├─────────────┴───────────────────────┴──────────────────┼──────────────────┤
│                                            Total Bersih │ Rp 7,300,000     │
└─────────────────────────────────────────────────────────┴──────────────────┘
```

---

## 💻 **Implementation Details**

### **1. Data Structure**

```typescript
interface FinancialRecord {
    id: string;
    type: string;                  // Transaction type
    amount: number;                // Amount in IDR
    description: string | null;    // Optional description
    date: string;                  // Transaction date
    period_month: number;          // 1-12
    period_year: number;           // e.g., 2026
}

interface MonthlySummary {
    totalIncome: number;
    totalDeduction: number;
    netSalary: number;
    transactions: FinancialRecord[];
}
```

### **2. Load Financial Data**

```typescript
const loadFinancialData = async () => {
    // Query financial_records for selected month/year
    const { data } = await supabase
        .from('financial_records')
        .select('*')
        .eq('user_id', profile.id)
        .eq('period_month', selectedMonth)  // 1-12
        .eq('period_year', selectedYear)    // e.g., 2026
        .order('date', { ascending: false });

    const records = data as FinancialRecord[];

    // Categorize
    const incomeTypes = ['voucher_income', 'bonus'];
    const deductionTypes = ['deduction_loan', 'deduction_saving', 
                           'deduction_health', 'deduction_store'];

    // Calculate totals
    const totalIncome = records
        .filter(r => incomeTypes.includes(r.type))
        .reduce((sum, r) => sum + Number(r.amount), 0);

    const totalDeduction = records
        .filter(r => deductionTypes.includes(r.type))
        .reduce((sum, r) => sum + Number(r.amount), 0);

    const netSalary = totalIncome - totalDeduction;

    setSummary({
        totalIncome,
        totalDeduction,
        netSalary,
        transactions: records
    });
};
```

### **3. Rupiah Formatting**

```typescript
const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};
```

**Examples:**
```javascript
formatRupiah(8500000)   // "Rp 8.500.000"
formatRupiah(1200000)   // "Rp 1.200.000"
formatRupiah(7300000)   // "Rp 7.300.000"
```

### **4. Transaction Type Labels**

```typescript
const getTransactionTypeLabel = (type: string): string => {
    const labels: { [key: string]: string } = {
        'voucher_income': 'Pendapatan Voucher',
        'bonus': 'Bonus',
        'deduction_loan': 'Potongan Kasbon',
        'deduction_saving': 'Potongan Tabungan',
        'deduction_health': 'Potongan Kesehatan',
        'deduction_store': 'Potongan Toko',
        'adjustment': 'Penyesuaian'
    };
    return labels[type] || type;
};
```

### **5. Income/Deduction Check**

```typescript
const isIncome = (type: string): boolean => {
    return ['voucher_income', 'bonus'].includes(type);
};

// Usage in table:
const income = isIncome(transaction.type);
const textColor = income ? 'text-green-400' : 'text-red-400';
const prefix = income ? '+' : '-';
```

---

## 🔄 **Data Flow**

### **Page Load:**
```
Component Mount
    ↓
useAuth() → Get profile
    ↓
useEffect() triggers (with profile.id, month, year)
    ↓
loadFinancialData()
    ↓
Query financial_records
  - WHERE user_id = profile.id
  - AND period_month = selectedMonth
  - AND period_year = selectedYear
    ↓
Categorize transactions
    ↓
Calculate totals
    ↓
Update state (summary)
    ↓
Render UI with data
```

### **Month/Year Change:**
```
User selects new month/year
    ↓
useState updates (selectedMonth/selectedYear)
    ↓
useEffect() triggers again
    ↓
loadFinancialData() runs with new filters
    ↓
UI re-renders with new data
```

---

## 📊 **Transaction Types**

### **Income Types (Green):**

| Type | Label | Description |
|------|-------|-------------|
| `voucher_income` | Pendapatan Voucher | Daily vouchers collected |
| `bonus` | Bonus | Performance/monthly bonus |

### **Deduction Types (Red):**

| Type | Label | Description |
|------|-------|-------------|
| `deduction_loan` | Potongan Kasbon | Loan/kasbon repayment |
| `deduction_saving` | Potongan Tabungan | Mandatory savings |
| `deduction_health` | Potongan Kesehatan | Health insurance |
| `deduction_store` | Potongan Toko | Internal store purchase |

### **Adjustment (Neutral):**

| Type | Label | Description |
|------|-------|-------------|
| `adjustment` | Penyesuaian | Manual adjustment by admin |

---

## 🎯 **Calculation Examples**

### **Example 1: Full Month Salary**

**Income:**
- Voucher income (30 days × Rp 250,000) = Rp 7,500,000
- Bonus performa = Rp 1,000,000
- **Total Income: Rp 8,500,000**

**Deductions:**
- Kasbon (cicilan) = Rp 500,000
- Tabungan wajib = Rp 200,000
- Kesehatan = Rp 150,000
- Potongan toko = Rp 350,000
- **Total Deduction: Rp 1,200,000**

**Net Salary:**
```
Rp 8,500,000 - Rp 1,200,000 = Rp 7,300,000
```

### **Example 2: Partial Month (New Employee)**

**Income:**
- Voucher income (10 days × Rp 250,000) = Rp 2,500,000
- **Total Income: Rp 2,500,000**

**Deductions:**
- None
- **Total Deduction: Rp 0**

**Net Salary:**
```
Rp 2,500,000 - Rp 0 = Rp 2,500,000
```

---

## 🧪 **Testing Scenarios**

### **Test 1: View Current Month**
1. Open `/member/salary`
2. Default: Current month & year selected
3. **Expected:**
   - ✅ Dropdowns show current month/year
   - ✅ Summary cards show totals
   - ✅ Transaction table shows records
   - ✅ All amounts in Rupiah format

### **Test 2: Change Month**
1. Select different month (e.g., December)
2. **Expected:**
   - ✅ Data reloads automatically
   - ✅ Summary cards update
   - ✅ Transaction table shows December records
   - ✅ Loading indicator appears briefly

### **Test 3: Empty Month**
1. Select month with no transactions
2. **Expected:**
   - ✅ Summary cards show Rp 0
   - ✅ Empty state message in table
   - ✅ "Tidak ada transaksi" message
   - ✅ Suggestion to select other period

### **Test 4: Income Only**
1. Month with only income (no deductions)
2. **Expected:**
   - ✅ Total Income > 0
   - ✅ Total Deduction = Rp 0
   - ✅ Net Salary = Total Income
   - ✅ Table shows green rows only

### **Test 5: Mixed Transactions**
1. Month with income and deductions
2. **Expected:**
   - ✅ Green rows for income (+ prefix)
   - ✅ Red rows for deductions (- prefix)
   - ✅ Icons match type (↑ or ↓)
   - ✅ Footer total = income - deduction

---

## 📱 **Responsive Design**

### **Desktop (MD and up):**
```
┌────────────────────────────────────────┐
│ Header                  [Month] [Year] │
├────────────────────────────────────────┤
│ [Income] [Deduction] [Net Salary]      │
│                                        │
│ Transaction Table (full width)         │
└────────────────────────────────────────┘
```

### **Mobile:**
```
┌──────────────┐
│ Header       │
│ [Month]      │
│ [Year]       │
├──────────────┤
│ [Income]     │
├──────────────┤
│ [Deduction]  │
├──────────────┤
│ [Net Salary] │
├──────────────┤
│ Table        │
│ (scroll →)   │
└──────────────┘
```

---

## ⚠️ **Important Notes**

### **1. Period Fields:**
```sql
-- Database columns
period_month INTEGER  -- 1-12 (1=Jan, 12=Dec)
period_year INTEGER   -- e.g., 2026
```

- Every transaction **must** have period_month and period_year
- Used for filtering by month/year
- Can differ from `date` field (e.g., bonus for Dec paid in Jan)

### **2. Data Categorization:**
```typescript
// Hardcoded categories
const incomeTypes = ['voucher_income', 'bonus'];
const deductionTypes = ['deduction_loan', 'deduction_saving', 
                       'deduction_health', 'deduction_store'];
```

- If new transaction type added, update these arrays
- `adjustment` type not counted in either (admin manual entry)

### **3. Currency Format:**
- Always use `formatRupiah()` function
- Consistent format across all amounts
- No decimal places for salary (whole numbers)

### **4. Month/Year Storage:**
```javascript
// JavaScript months are 0-indexed
const currentMonth = new Date().getMonth() + 1; // 1-12

// Database expects 1-12, not 0-11
```

---

## 🔮 **Future Enhancements**

### **1. Export to PDF:**
```typescript
const exportToPDF = async () => {
    // Generate PDF slip gaji
    // Include: summary cards, transaction table, signature
    // Download as "Slip_Gaji_Jan_2026.pdf"
};
```

### **2. Year-to-Date (YTD) Summary:**
```typescript
// Show cumulative totals for entire year
const ytdIncome = // Sum Jan-Dec income
const ytdDeduction = // Sum Jan-Dec deduction
const ytdNet = ytdIncome - ytdDeduction
```

### **3. Comparison Chart:**
```typescript
// Chart showing income vs deduction over last 6 months
<Chart data={last6Months} />
```

### **4. Payment Status:**
```typescript
// Show if salary has been paid
{record.is_paid ? (
    <span className="text-green-400">✓ Dibayar</span>
) : (
    <span className="text-orange-400">⏳ Pending</span>
)}
```

### **5. Detailed Breakdown:**
```typescript
// Drill-down into voucher income
// Show daily voucher amounts
onClick={() => showVoucherDetail(transaction.id)}
```

### **6. Email Slip:**
```typescript
const emailSlip = async () => {
    // Send slip gaji to employee email
    await sendEmail({
        to: profile.email,
        subject: `Slip Gaji ${months[selectedMonth-1]} ${selectedYear}`,
        attachment: pdfSlip
    });
};
```

---

## 🔒 **Security & Privacy**

### **1. User Data Isolation:**
```typescript
// Only fetch own records
.eq('user_id', profile.id)
```

- Users can only see their own financial data
- RLS policies enforce this at database level

### **2. RLS Policies:**
```sql
-- Users can only view their own records
CREATE POLICY "Users view own financial records"
ON financial_records FOR SELECT
USING (auth.uid() = user_id);
```

### **3. Admin Override:**
- Admins can view/edit all records through admin panel
- Separate admin page, not member area

---

## 📈 **Performance Optimizations**

### **1. Filtered Query:**
```typescript
// Only fetch records for selected month/year
.eq('period_month', selectedMonth)
.eq('period_year', selectedYear)
```

- Limits data transfer
- Faster query execution
- Reduces memory usage

### **2. Client-Side Calculations:**
```typescript
// Calculate totals in browser (not database)
const totalIncome = records
    .filter(r => incomeTypes.includes(r.type))
    .reduce((sum, r) => sum + Number(r.amount), 0);
```

- Single database query
- Fast UI updates
- No additional server load

### **3. Loading State:**
```typescript
{isLoading ? <Spinner /> : <Table />}
```

- Prevents layout shift
- Better UX
- Shows feedback during data fetch

---

**Status**: ✅ **Salary & Commission Page Successfully Implemented!**
**Date**: 2026-01-09
**File**: `src/app/member/salary/page.tsx`

**Summary:**
- ✅ Month & year selector (dropdown)
- ✅ Three summary cards (Income, Deduction, Net)
- ✅ Transaction history table
- ✅ Color-coded income/deduction
- ✅ Rupiah currency formatting
- ✅ Database integration
- ✅ Loading states
- ✅ Empty state handling
- ✅ Responsive design
- ✅ Info box with payment details
