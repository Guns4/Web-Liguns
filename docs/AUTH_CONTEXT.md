# AuthContext - Panduan Penggunaan

## 📋 Deskripsi

`AuthContext` adalah React Context Provider yang mengelola state autentikasi global menggunakan Supabase Auth. Context ini secara otomatis mendengarkan perubahan autentikasi dan mengambil data profile dari database.

## 🎯 Fitur Utama

1. ✅ **Auto-sync dengan Supabase Auth** - Menggunakan `onAuthStateChange`
2. ✅ **Profile Data** - Otomatis fetch dari tabel `profiles` saat login
3. ✅ **Type-Safe** - Menggunakan TypeScript dengan types dari `database.types.ts`
4. ✅ **Loading State** - Indikator loading untuk UI
5. ✅ **Sign Out** - Fungsi logout yang mudah digunakan
6. ✅ **Utility Hooks** - Hooks tambahan untuk role checking dan protected routes

## 🚀 Cara Penggunaan

### Basic Usage

```typescript
import { useAuth } from '@/context/AuthContext'

function MyComponent() {
  const { user, profile, isLoading, signOut } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please login</div>
  }

  return (
    <div>
      <h1>Welcome, {profile?.full_name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {profile?.role}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  )
}
```

### Check User Role

```typescript
import { useAuth, useIsAdmin, useIsTalent } from '@/context/AuthContext'

function Dashboard() {
  const { profile } = useAuth()
  const isAdmin = useIsAdmin()
  const isTalent = useIsTalent()

  return (
    <div>
      <h1>Dashboard</h1>
      
      {isAdmin && (
        <div>
          <h2>Admin Controls</h2>
          {/* Admin-only features */}
        </div>
      )}

      {isTalent && (
        <div>
          <h2>Talent Dashboard</h2>
          {/* Talent-only features */}
        </div>
      )}

      <p>Current Role: {profile?.role}</p>
    </div>
  )
}
```

### Protected Routes

```typescript
import { useRequireAuth } from '@/context/AuthContext'

function ProtectedPage() {
  const { user, isLoading } = useRequireAuth('/login')

  // Will automatically redirect to /login if not authenticated
  
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Only logged-in users can see this</p>
    </div>
  )
}
```

### Admin-Only Routes

```typescript
import { useRequireAdmin } from '@/context/AuthContext'

function AdminPage() {
  const { profile, isLoading } = useRequireAdmin('/')

  // Will automatically redirect to / if not admin
  
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Only admins can see this</p>
    </div>
  )
}
```

### Sign Out

```typescript
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

function LogoutButton() {
  const { signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/') // Redirect to home after logout
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  )
}
```

### Conditional Rendering Based on Auth State

```typescript
import { useAuth } from '@/context/AuthContext'

function Navbar() {
  const { user, profile, isLoading } = useAuth()

  if (isLoading) {
    return <nav>Loading...</nav>
  }

  return (
    <nav>
      {user ? (
        <div>
          <span>Hello, {profile?.full_name || user.email}</span>
          {profile?.role === 'admin' && (
            <a href="/admin">Admin Panel</a>
          )}
          {profile?.role === 'talent' && (
            <a href="/member">Member Dashboard</a>
          )}
          <LogoutButton />
        </div>
      ) : (
        <div>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
      )}
    </nav>
  )
}
```

## 📊 Available Hooks

### 1. `useAuth()`
Main hook untuk mengakses auth context.

**Returns:**
```typescript
{
  user: User | null          // Supabase auth user
  profile: Profile | null    // User profile from database
  isLoading: boolean         // Loading state
  signOut: () => Promise<void> // Logout function
}
```

### 2. `useIsAdmin()`
Check apakah user adalah admin.

**Returns:** `boolean`

### 3. `useIsTalent()`
Check apakah user adalah talent.

**Returns:** `boolean`

### 4. `useRequireAuth(redirectTo?: string)`
Require authentication, redirect jika tidak login.

**Parameters:**
- `redirectTo` (optional): URL untuk redirect (default: `/login`)

**Returns:**
```typescript
{
  user: User | null
  isLoading: boolean
}
```

### 5. `useRequireAdmin(redirectTo?: string)`
Require admin role, redirect jika bukan admin.

**Parameters:**
- `redirectTo` (optional): URL untuk redirect (default: `/`)

**Returns:**
```typescript
{
  profile: Profile | null
  isLoading: boolean
}
```

## 🔄 Auth State Changes

AuthContext secara otomatis mendengarkan perubahan autentikasi:

1. **User Login** → Fetch profile dari database
2. **User Logout** → Clear profile data
3. **Token Refresh** → Update user data
4. **Session Expired** → Otomatis logout

## 🎨 Example: Complete Login Flow

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // AuthContext will automatically:
      // 1. Detect the auth change
      // 2. Fetch the user's profile
      // 3. Update the global state

      // Redirect based on role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile?.role === 'admin') {
        router.push('/admin')
      } else if (profile?.role === 'talent') {
        router.push('/member')
      } else {
        router.push('/')
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  )
}
```

## 🐛 Debugging

AuthContext includes console logs for debugging:

```javascript
// Console output when auth state changes:
Auth state changed: SIGNED_IN
Profile loaded: { name: "John Doe", role: "admin", email: "john@example.com" }

// Or on logout:
Auth state changed: SIGNED_OUT
```

## ⚠️ Important Notes

1. **Context Requirement**: `useAuth()` harus digunakan di dalam `<AuthProvider>`
2. **Client Components**: AuthContext menggunakan `'use client'` directive
3. **Profile Sync**: Profile data di-fetch setiap kali user login
4. **Automatic Updates**: State akan otomatis update saat auth berubah

## 🔒 Security

- ✅ Profile data hanya diambil untuk authenticated users
- ✅ Supabase RLS (Row Level Security) tetap berlaku
- ✅ Token refresh otomatis dihandle oleh Supabase
- ✅ Session persistence diaktifkan

## 📝 Type Safety

Semua types berasal dari `database.types.ts`:

```typescript
import type { Profile, UserRole, UserStatus } from '@/lib/database.types'

// Profile type includes all fields from database
const profile: Profile = {
  id: string
  role: 'admin' | 'talent' | 'user'
  full_name: string
  email: string
  // ... and more
}
```

---

**Created**: 2026-01-09
**Version**: 1.0.0
