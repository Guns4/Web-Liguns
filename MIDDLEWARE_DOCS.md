# Middleware Implementation - Route Protection

## 📋 Overview

Middleware untuk proteksi route menggunakan Supabase Auth yang melindungi halaman `/admin/*` dan `/member/*` dari akses yang tidak diotorisasi.

## 🎯 Features

### **1. Authentication Check**
- ✅ Cek session user sebelum akses protected routes
- ✅ Redirect ke `/login` jika belum login
- ✅ Preserve redirect URL untuk kembali setelah login

### **2. Role-Based Access Control (RBAC)**
- ✅ Proteksi `/admin/*` hanya untuk role `admin`
- ✅ Redirect non-admin ke `/unauthorized` jika coba akses admin routes
- ✅ Allow akses `/member/*` untuk semua authenticated users

### **3. Status Check**
- ✅ Block inactive users dari mengakses protected routes
- ✅ Redirect inactive users ke `/account-inactive`

### **4. Smart Redirects**
- ✅ Redirect logged-in users dari `/login` dan `/register` ke dashboard mereka
- ✅ Admin → `/admin`
- ✅ Non-admin → `/member`

## 📂 Files Created

1. **`middleware.ts`** - Main middleware file
2. **`src/app/unauthorized/page.tsx`** - Unauthorized access page (403)
3. **`src/app/account-inactive/page.tsx`** - Inactive account page

## 🔧 Implementation Details

### **Middleware Logic Flow**

```mermaid
User Request
    ↓
Check Session
    ↓
  ┌─────────────┐
  │ Not Logged  │
  │    In?      │───Yes──→ Accessing /admin or /member? ──Yes──→ Redirect to /login
  └─────────────┘
        │ No
        ↓
  ┌─────────────┐
  │  Fetch      │
  │  Profile    │
  │  from DB    │
  └─────────────┘
        ↓
  ┌─────────────┐
  │  Check      │
  │  Route      │
  └─────────────┘
        ↓
  ┌────────────────────────┐
  │ Accessing /admin?      │───Yes──→ Is Admin? ──No──→ Redirect to /unauthorized
  └────────────────────────┘
        │ No
        ↓
  ┌────────────────────────┐
  │ Status Inactive?       │───Yes──→ Accessing protected? ──Yes──→ Redirect to /account-inactive
  └────────────────────────┘
        │ No
        ↓
  ┌────────────────────────┐
  │ Accessing /login or    │───Yes──→ Redirect to dashboard based on role
  │ /register?             │
  └────────────────────────┘
        │ No
        ↓
     Allow Access
```

### **Code Structure**

```typescript
// middleware.ts

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Create Supabase client for middleware
  const supabase = createServerClient(...)

  // 2. Get session
  const { data: { session } } = await supabase.auth.getSession()

  // 3. Check if accessing protected routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isMemberRoute = request.nextUrl.pathname.startsWith('/member')

  // 4. Redirect if not authenticated
  if (!session && (isAdminRoute || isMemberRoute)) {
    return NextResponse.redirect('/login')
  }

  // 5. If authenticated, check role and status
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', session.user.id)
      .single()

    // Check admin access
    if (isAdminRoute && profile?.role !== 'admin') {
      return NextResponse.redirect('/unauthorized')
    }

    // Check inactive status
    if (profile?.status === 'inactive') {
      return NextResponse.redirect('/account-inactive')
    }
  }

  return NextResponse.next()
}
```

## 🛡️ Protected Routes

### **Admin Routes (`/admin/*`)**
- **Access:** Admin only
- **Redirect if not logged in:** `/login`
- **Redirect if not admin:** `/unauthorized`

### **Member Routes (`/member/*`)**
- **Access:** All authenticated users
- **Redirect if not logged in:** `/login`
- **Redirect if inactive:** `/account-inactive`

## 📄 Pages Created

### **1. Unauthorized Page (`/unauthorized`)**

**Features:**
- Error message based on reason parameter
- Error code display (403 - FORBIDDEN)
- Action buttons (Dashboard, Back)
- Support contact link

**Usage:**
```typescript
// Automatic redirect from middleware
redirectUrl.pathname = '/unauthorized'
redirectUrl.searchParams.set('reason', 'admin_only')
```

**Screenshot/Display:**
```
┌─────────────────────────────────┐
│           🛡️                    │
│      Akses Ditolak              │
│                                 │
│  Halaman ini hanya dapat        │
│  diakses oleh Administrator     │
│                                 │
│  Kode Error: 403 - FORBIDDEN    │
│                                 │
│  [Kembali ke Dashboard]         │
│  [Kembali ke Halaman Sebelumnya]│
└─────────────────────────────────┘
```

### **2. Account Inactive Page (`/account-inactive`)**

**Features:**
- Display user account information
- Show inactive status badge
- Admin contact information
- Logout button
- Return to homepage option

**Usage:**
```typescript
// Automatic redirect from middleware
if (profile?.status === 'inactive') {
  redirectUrl.pathname = '/account-inactive'
}
```

**Screenshot/Display:**
```
┌─────────────────────────────────┐
│           👤                    │
│     Akun Tidak Aktif            │
│                                 │
│  Akun Anda saat ini berstatus   │
│  tidak aktif                    │
│                                 │
│  Nama: John Doe                 │
│  Email: john@example.com        │
│  Status: 🟡 Inactive            │
│                                 │
│  📧 Hubungi Administrator       │
│  admin@liguns.com               │
│                                 │
│  [Kembali ke Beranda]           │
│  [Logout]                       │
└─────────────────────────────────┘
```

## 🔍 Matcher Configuration

```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**Excluded from middleware:**
- `_next/static` - Static files
- `_next/image` - Image optimization
- `favicon.ico` - Favicon
- Image files (svg, png, jpg, jpeg, gif, webp)

## 🧪 Testing Scenarios

### **Scenario 1: Not Logged In → Access Admin**
```
Request: GET /admin
Expected: Redirect to /login?redirectTo=/admin
```

### **Scenario 2: Not Logged In → Access Member**
```
Request: GET /member
Expected: Redirect to /login?redirectTo=/member
```

### **Scenario 3: Logged In (Not Admin) → Access Admin**
```
Request: GET /admin
User Role: talent
Expected: Redirect to /unauthorized?reason=admin_only
```

### **Scenario 4: Logged In (Admin) → Access Admin**
```
Request: GET /admin
User Role: admin
Expected: Allow access
```

### **Scenario 5: Logged In (Inactive) → Access Protected**
```
Request: GET /member
User Status: inactive
Expected: Redirect to /account-inactive
```

### **Scenario 6: Logged In → Access Login Page**
```
Request: GET /login
User Role: admin
Expected: Redirect to /admin

Request: GET /login
User Role: talent
Expected: Redirect to /member
```

## 💡 Usage Examples

### **Accessing Protected Page**

```typescript
// pages/admin/dashboard/page.tsx
export default function AdminDashboard() {
  // No need for manual auth check!
  // Middleware already protected this route

  return <div>Admin Dashboard</div>
}
```

### **Getting Redirect URL**

After login, redirect back to original destination:

```typescript
// pages/login/page.tsx
const router = useRouter()
const searchParams = useSearchParams()

const handleLogin = async () => {
  await supabase.auth.signInWithPassword(...)
  
  const redirectTo = searchParams.get('redirectTo') || '/member'
  router.push(redirectTo)
}
```

## ⚙️ Configuration

### **Environment Variables Required**

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### **Database Requirements**

Profile table must have:
- `role` column (enum: 'admin', 'talent', 'user')
- `status` column (enum: 'active', 'contract', 'interview', 'inactive')

## 🔒 Security Features

1. **Server-Side Protection** - Middleware runs on server, can't be bypassed
2. **Session Validation** - Checks actual Supabase session
3. **Role Verification** - Fetches role from database (not client)
4. **Status Check** - Prevents inactive users from accessing system
5. **URL Preservation** - Remembers where user wanted to go

## 🚀 Performance

- **Database Query:** One profile fetch per protected route access
- **Caching:** Cookie-based session caching by Supabase
- **Optimization:** Minimal overhead, only runs on matched routes

## 📊 Route Matrix

| Route | Not Logged In | Talent | Admin | Inactive |
|-------|--------------|--------|-------|----------|
| `/` | ✅ Allow | ✅ Allow | ✅ Allow | ✅ Allow |
| `/login` | ✅ Allow | ↪️ Redirect<br>/member | ↪️ Redirect<br>/admin | ✅ Allow |
| `/register` | ✅ Allow | ↪️ Redirect<br>/member | ↪️ Redirect<br>/admin | ✅ Allow |
| `/member` | ↪️ Redirect<br>/login | ✅ Allow | ✅ Allow | ↪️ Redirect<br>/account-inactive |
| `/admin` | ↪️ Redirect<br>/login | ↪️ Redirect<br>/unauthorized | ✅ Allow | ↪️ Redirect<br>/account-inactive |

## 🐛 Troubleshooting

### **Issue: Redirect Loop**

**Cause:** Protected page redirects to itself
**Solution:** Check matcher config, ensure login page is not protected

### **Issue: 500 Error**

**Cause:** Environment variables not set
**Solution:** Check `.env.local` has NEXT_PUBLIC_SUPABASE_* variables

### **Issue: Always Redirects to Login**

**Cause:** Session not persisted
**Solution:** Check cookie settings in Supabase client config

### **Issue: Profile Not Found**

**Cause:** User exists in Auth but not in profiles table
**Solution:** Ensure profile is created during registration

## 📝 Best Practices

1. **Always Create Profile** - When creating auth user, also create profile
2. **Handle Edge Cases** - What if profile doesn't exist?
3. **Clear Error Messages** - Tell user why they can't access
4. **Preserve Intent** - Remember where user wanted to go
5. **Test All Scenarios** - Test different roles and statuses

---

**Status**: ✅ **Middleware Implementation Complete!**
**Created**: 2026-01-09
**Files**:
- `middleware.ts`
- `src/app/unauthorized/page.tsx`
- `src/app/account-inactive/page.tsx`
- `MIDDLEWARE_DOCS.md` (this file)
