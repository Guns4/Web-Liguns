# 🎨 UX Polishing Guide

## Overview

This guide shows how to implement skeleton loading, empty states, and 404 pages for a polished user experience.

---

## 📦 Components Created

### 1. **Skeleton Components** (`src/components/Skeleton.tsx`)
- `SkeletonCard` - For stats cards
- `SkeletonTable` - For data tables
- `SkeletonChart` - For chart placeholders
- `SkeletonText` - For text placeholders
- `SkeletonAvatar` - For profile pictures

### 2. **Empty State Components** (`src/components/EmptyState.tsx`)
- `EmptyState` - Full empty state with icon, title, description, action
- `EmptyTableState` - Compact empty state for tables

### 3. **404 Page** (`src/app/not-found.tsx`)
- Gradient 404 number
- Back button & Home button
- Quick links to common pages
- Smooth animations

---

## 💻 Implementation Examples

### Example 1: Dashboard with Skeleton Loading

**Before:**
```tsx
export default function Dashboard() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // ... fetch data
    
    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>  // ❌ Bad UX
            ) : (
                <StatsCards data={data} />
            )}
        </div>
    );
}
```

**After:**
```tsx
import { SkeletonCard, SkeletonTable } from '@/components/Skeleton';

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // ... fetch data
    
    return (
        <div>
            {isLoading ? (
                // ✅ Good UX - Show skeleton
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : (
                <StatsCards data={data} />
            )}
        </div>
    );
}
```

### Example 2: Table with Empty State

**Before:**
```tsx
<table>
    <thead>...</thead>
    <tbody>
        {data.map(item => <tr key={item.id}>...</tr>)}
    </tbody>
</table>
// ❌ Empty table shows nothing
```

**After:**
```tsx
import { SkeletonTable } from '@/components/Skeleton';
import { EmptyTableState } from '@/components/EmptyState';
import { FileText } from 'lucide-react';

<div className="glass rounded-xl overflow-hidden">
    {isLoading ? (
        // Show skeleton while loading
        <SkeletonTable rows={5} columns={6} />
    ) : data.length === 0 ? (
        // Show empty state when no data
        <EmptyTableState 
            icon={FileText}
            message="Belum ada data absensi"
            description="Data absensi akan muncul setelah Anda check-in"
        />
    ) : (
        // Show actual table
        <table>
            <thead>...</thead>
            <tbody>
                {data.map(item => <tr key={item.id}>...</tr>)}
            </tbody>
        </table>
    )}
</div>
```

### Example 3: Chart with Skeleton

**Before:**
```tsx
{isLoading ? (
    <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="animate-spin" />  // ❌ Basic loader
    </div>
) : (
    <BarChart data={chartData} />
)}
```

**After:**
```tsx
import { SkeletonChart } from '@/components/Skeleton';

{isLoading ? (
    <SkeletonChart />  // ✅ Skeleton maintains layout
) : (
    <div className="p-8 rounded-3xl ...">
        <h2>Absensi Harian</h2>
        <BarChart data={chartData} />
    </div>
)}
```

---

## 🎯 Usage Patterns

### Pattern 1: Three-State Loading

```tsx
const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

return (
    <div>
        {isLoading ? (
            // STATE 1: Loading
            <SkeletonTable rows={5} columns={4} />
        ) : error ? (
            // STATE 2: Error
            <EmptyState 
                icon={AlertCircle}
                title="Gagal Memuat Data"
                description={error.message}
                action={{ 
                    label: "Coba Lagi", 
                    onClick: loadData 
                }}
            />
        ) : data.length === 0 ? (
            // STATE 3: Empty
            <EmptyTableState 
                icon={Inbox}
                message="Belum ada data"
            />
        ) : (
            // STATE 4: Success with data
            <DataTable data={data} />
        )}
    </div>
);
```

### Pattern 2: Progressive Loading

```tsx
// Show immediate skeleton
const [stats, setStats] = useState(null);
const [table, setTable] = useState(null);

return (
    <>
        {/* Stats load first */}
        {stats ? (
            <StatsCards data={stats} />
        ) : (
            <div className="grid grid-cols-4 gap-6">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        )}
        
        {/* Table loads second */}
        {table ? (
            <DataTable data={table} />
        ) : (
            <SkeletonTable />
        )}
    </>
);
```

---

## 🎨 Styling Consistency

### Skeleton Animation:
```css
.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
```

### Empty State Colors:
```tsx
Icon background: bg-white/5
Icon color: text-gray-500
Title: text-white, font-bold
Description: text-gray-400
Action button: bg-purple-500
```

---

## 📋 Checklist

### For Every Page with Data:

- [ ] **Loading State**
  - [ ] Replace spinner with skeleton
  - [ ] Match skeleton to actual layout
  - [ ] Use appropriate skeleton type

- [ ] **Empty State**
  - [ ] Show meaningful message
  - [ ] Include helpful icon
  - [ ] Provide action if applicable

- [ ] **Error State**
  - [ ] Show error message
  - [ ] Provide retry action
  - [ ] Log error for debugging

### For Tables:

- [ ] **Header**
  - [ ] Always show table headers
  - [ ] Use SkeletonTable for loading
  
- [ ] **Empty**
  - [ ] Use EmptyTableState
  - [ ] Contextual message
  - [ ] Suggest next action

- [ ] **Error**
  - [ ] Show inline error
  - [ ] Keep table structure
  - [ ] Provide retry

---

## 🚀 Quick Implementation Guide

### Step 1: Import Components
```tsx
import { SkeletonCard, SkeletonTable } from '@/components/Skeleton';
import { EmptyState, EmptyTableState } from '@/components/EmptyState';
```

### Step 2: Add Loading State
```tsx
const [isLoading, setIsLoading] = useState(true);
```

### Step 3: Replace Loading UI
```tsx
// Old
{isLoading && <Loader2 className="animate-spin" />}

// New
{isLoading && <SkeletonCard />}
```

### Step 4: Add Empty State
```tsx
// After loading check
{!isLoading && data.length === 0 && (
    <EmptyTableState 
        icon={Inbox}
        message="Belum ada data"
    />
)}
```

---

## 📊 Common Use Cases

### 1. **Dashboard Stats**
```tsx
{isLoading ? (
    <>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
    </>
) : (
    stats.map(stat => <StatsCard key={stat.id} {...stat} />)
)}
```

### 2. **Attendance Table**
```tsx
{isLoading ? (
    <SkeletonTable rows={7} columns={5} />
) : attendanceData.length === 0 ? (
    <EmptyTableState 
        icon={Calendar}
        message="Belum ada data absensi"
        description="Mulai check-in untuk melihat riwayat"
    />
) : (
    <table>...</table>
)}
```

### 3. **Salary Records**
```tsx
{isLoading ? (
    <SkeletonTable rows={10} columns={4} />
) : transactions.length === 0 ? (
    <EmptyTableState 
        icon={DollarSign}
        message="Belum ada transaksi"
        description="Transaksi akan muncul di bulan aktif"
    />
) : (
    <table>...</table>
)}
```

### 4. **Profile Page**
```tsx
{isLoading ? (
    <div className="flex items-center gap-4">
        <SkeletonAvatar size="xl" />
        <div className="flex-1">
            <SkeletonText width="48" />
            <SkeletonText width="32" />
        </div>
    </div>
) : (
    <ProfileHeader profile={profile} />
)}
```

---

## 🎯 Best Practices

### ✅ DO:
- Match skeleton to actual content layout
- Use contextual empty states
- Provide helpful actions
- Keep consistent styling
- Test on slow connections

### ❌ DON'T:
- Show blank screens while loading
- Use generic "No data" messages
- Forget error states
- Make skeletons too different from content
- Overuse animations

---

## 🔍 Testing

### Test Loading States:
```tsx
// Simulate slow network
useEffect(() => {
    setTimeout(() => {
        setIsLoading(false);
    }, 3000); // 3 second delay
}, []);
```

### Test Empty States:
```tsx
// Force empty data
const data = []; // Empty array
```

### Test Error States:
```tsx
// Force error
throw new Error('Test error');
```

---

## 📱 Responsive Considerations

### Mobile:
```tsx
// Fewer skeleton items on mobile
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <SkeletonCard /> {/* Always shows */}
    <SkeletonCard className="hidden sm:block" />
    <SkeletonCard className="hidden lg:block" />
    <SkeletonCard className="hidden lg:block" />
</div>
```

### Tablet:
```tsx
// Adjust skeleton columns
{isLoading ? (
    <SkeletonTable rows={5} columns={isMobile ? 3 : 6} />
) : (
    <table>...</table>
)}
```

---

## 🎨 Custom Skeletons

### Create Custom Skeleton:
```tsx
export function SkeletonProductCard() {
    return (
        <div className="p-4 rounded-xl bg-white/5 animate-pulse">
            <div className="h-48 bg-white/10 rounded-lg mb-4" />
            <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
            <div className="h-4 w-1/2 bg-white/10 rounded mb-4" />
            <div className="h-10 w-full bg-white/10 rounded-lg" />
        </div>
    );
}
```

---

## 📚 Resources

- [Loading Best Practices](https://www.nngroup.com/articles/progress-indicators/)
- [Empty States Design](https://emptystat.es/)
- [Skeleton Screens](https://www.lukew.com/ff/entry.asp?1797)

---

**Status**: ✅ Ready to implement across all pages
**Priority**: High - Significantly improves perceived performance
**Effort**: Low - Reusable components make it easy
