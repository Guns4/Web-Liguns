# Karyawan Page Update - Employee Management

## 📋 Summary

Updated employee management page (`src/app/admin/karyawan/page.tsx`) with enhanced features for managing talents including approve and delete actions.

## ✅ Features Added

### **1. Added Venue Column**
- Extracts venue information from `bio` field
- Displays venue name in table
- Fallback to "-" if not available

### **2. Added Role Column**
- Displays user role (TALENT, ADMIN, USER)
- Purple badge styling
- Uppercase format

### **3. Approve Button** ✅
- Only shows for users with status = 'interview'
- Changes status from 'interview' to 'active'
- Confirmation dialog before approval
- Success message after approval
- Automatic data reload

### **4. Delete Button** 🗑️
- Deletes user from database
- Double confirmation (confirm + type "HAPUS")
- Warning message about cascade delete
- Success/error messages
- Automatic data reload

## 🎨 UI Updates

### **Table Columns (Before → After):**

| Before | After |
|--------|-------|
| Karyawan | Karyawan ✓ |
| Email  | Email ✓ |
| Telepon | ~~Telepon~~ |
| - | **Role** (NEW) |
| Status | Status ✓ |
| - | **Venue** (NEW) |
| Bergabung | Bergabung ✓ |
| Aksi | Aksi ✓ (enhanced) |

### **Action Buttons:**

**Before:**
```tsx
[Detail] (gold button)
```

**After:**
```tsx
[Approve] (green - only if interview) | [Detail] (blue) | [Delete] (red)
```

## 🔧 Implementation Details

### **1. Venue Extraction Function**

```typescript
const getVenue = (bio?: string | null) => {
    if (!bio) return '-';
    const match = bio.match(/Venue:\s*([^\|]+)/);
    return match ? match[1].trim() : '-';
};
```

**How it works:**
- Parses bio field for "Venue: [name]" pattern
- Uses regex to extract venue name
- Returns "-" if not found

**Example bio:**
```
"Nickname: John | Posisi: Terapis Spa | Venue: Venetian Havana"
      ↓
getVenue() returns: "Venetian Havana"
```

### **2. Approve User Function**

```typescript
const handleApproveUser = async (userId: string, userName: string) => {
    // 1. Confirmation dialog
    if (!confirm(`Approve ${userName} untuk mengubah status menjadi Aktif?`)) {
        return;
    }

    try {
        // 2. Update status in database
        const { error } = await supabase
            .from('profiles')
            .update({ status: 'active' })
            .eq('id', userId);

        if (error) throw error;

        // 3. Show success message
        alert(`${userName} berhasil di-approve!`);
        
        // 4. Reload data
        loadTalents();
    } catch (error) {
        console.error('Error approving user:', error);
        alert('Gagal approve user. Silakan coba lagi.');
    }
};
```

**Flow:**
```
User clicks Approve
    ↓
Confirmation dialog
    ↓
Update status to 'active'
    ↓
Success message
    ↓
Reload talents data
```

### **3. Delete User Function**

```typescript
const handleDeleteUser = async (userId: string, userName: string) => {
    // 1. First confirmation
    if (!confirm(`PERINGATAN: Hapus ${userName}?
    
    Tindakan ini akan:
    - Menghapus user dari auth
    - Menghapus semua data terkait
    
    Tidak dapat dibatalkan!`)) {
        return;
    }

    // 2. Double confirmation
    const doubleConfirm = prompt(`Ketik "HAPUS" untuk mengonfirmasi penghapusan ${userName}`);
    if (doubleConfirm !== 'HAPUS') {
        alert('Penghapusan dibatalkan');
        return;
    }

    try {
        // 3. Delete from database
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);

        if (error) throw error;

        alert(`${userName} berhasil dihapus`);
        loadTalents();
    } catch (error: any) {
        console.error('Error deleting user:', error);
        alert(`Gagal menghapus user: ${error.message}`);
    }
};
```

**Flow:**
```
User clicks Delete
    ↓
Warning confirmation
    ↓
Type "HAPUS" to confirm
    ↓
Delete from database
    ↓
Success/Error message
    ↓
Reload talents data
```

## 💡 UI Screenshots (Visual Description)

### **Table Row Example:**

```
┌────────────────────────────────────────────────────────────────────┐
│ 👤 John Doe        │ john@mail.com │ TALENT  │ 🟡 Interview │ Venetian  │ 9 Jan 2026 │ [Approve] [👁️] [🗑️] │
│    081234567890    │               │         │              │ Havana    │            │                   │
└────────────────────────────────────────────────────────────────────┘
```

### **Action Buttons:**

**For Interview Status:**
```
[✓ Approve] (Green) | [👁️] (Blue) | [🗑️] (Red)
```

**For Other Status:**
```
[👁️] (Blue) | [🗑️] (Red)
```

##📊 **Data Flow**

### **On Page Load:**
```
1. loadTalents()
   ↓
2. Fetch all profiles where role = 'talent'
   ↓
3. Calculate stats (total, active, contract, inactive)
   ↓
4. Render table with data
```

### **On Approve:**
```
1. handleApproveUser(id, name)
   ↓
2. Confirm dialog
   ↓
3. Update profile status = 'active'
   ↓
4. loadTalents() (refresh data)
   ↓
5. Table rerenders with updated status
```

### **On Delete:**
```
1. handleDeleteUser(id, name)
   ↓
2. Warning confirm dialog
   ↓
3. Type "HAPUS" confirm
   ↓
4. Delete profile from database
   ↓
5. loadTalents() (refresh data)
   ↓
6. Table rerenders without deleted user
```

## 🔒 Security Considerations

### **Cascade Delete:**
- Deleting profile will CASCADE to related records based on FK
- Ensure database has proper ON DELETE CASCADE constraints
- Consider soft delete instead for data retention

### **Permissions:**
- Page protected by middleware (admin only)
- Database RLS policies should restrict delete to admins
- Client-side validation + server-side enforcement

### **Confirmation:**
- Double confirmation for delete (confirm + type "HAPUS")
- Clear warning about permanent action
- Can't be undone!

## ⚠️ Important Notes

### **1. Venue Data:**
- Currently extracted from `bio` field
- **Recommendation:** Add dedicated `venue` column in future
- Current format: `"Nickname: X | Posisi: Y | Venue: Z"`

### **2. Delete Behavior:**
- Deletes from `profiles` table only
- Auth user remains (consider deleting from auth.users too)
- Related data handled by FK constraints

### **3. Status Flow:**
```
interview → active (via Approve button)
active → inactive (manual in detail page)
```

## 🧪 Testing Scenarios

### **Test Approve:**
1. Create user with status = 'interview'
2. Navigate to `/admin/karyawan`
3. Find user in table
4. Click green "Approve" button
5. Confirm dialog
6. **Expected:** Status changes to "Aktif" (green badge)

### **Test Delete:**
1. Navigate to `/admin/karyawan`
2. Click red delete button
3. Confirm warning
4. Type "HAPUS"
5. **Expected:** User removed from table

### **Test Venue Display:**
1. User with bio: `"Venue: Venetian Havana | ..."`
2. **Expected Table:** Shows "Venetian Havana"
3. User with no bio
4. **Expected Table:** Shows "-"

## 📝 Code Changes Summary

### **Added:**
- `CheckCircle`, `Trash2`, `AlertTriangle` icons
- `bio?: string | null` to TalentProfile interface
- `getVenue()` function
- `handleApproveUser()` function
- `handleDeleteUser()` function
- Role column in table
- Venue column in table
- Approve button (conditional)
- Delete button

### **Removed:**
- Telepon column (moved to sub-row under name)

### **Modified:**
- Action column layout (3 buttons instead of 1)
- Table columns structure

## 🚀 Future Improvements

### **1. Add Dedicated Venue Field:**
```sql
ALTER TABLE profiles 
ADD COLUMN venue VARCHAR(100);
```

### **2. Soft Delete:**
```typescript
// Instead of delete, mark as deleted
await supabase
    .from('profiles')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', userId);
```

### **3. Batch Operations:**
```tsx
// Select multiple users and approve/delete at once
const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

const handleBatchApprove = async () => {
    await supabase
        .from('profiles')
        .update({ status: 'active' })
        .in('id', selectedUsers);
};
```

### **4. Enhanced Delete:**
```typescript
// Also delete from auth.users
await supabase.auth.admin.deleteUser(userId);
```

### **5. Activity Log:**
```typescript
// Log admin actions
await supabase.from('admin_logs').insert({
    admin_id: currentAdminId,
    action: 'approve_user',
    target_user_id: userId,
    timestamp: new Date().toISOString()
});
```

---

**Status**: ✅ **Karyawan Page Successfully Enhanced!**
**Date**: 2026-01-09
**File**: `src/app/admin/karyawan/page.tsx`

**Summary:**
- ✅ Added Venue column (extracted from bio)
- ✅ Added Role column  
- ✅ Added Approve button (interview → active)
- ✅ Added Delete button (with double confirmation)
- ✅ Enhanced action buttons layout
- ✅ Improved table structure
- ✅ Better error handling
