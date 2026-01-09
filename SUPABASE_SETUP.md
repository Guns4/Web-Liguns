# =============================================
# LIGUNS ENTERTAINMENT - ENVIRONMENT VARIABLES
# Complete Guide for Supabase Configuration
# =============================================

## IMPORTANT SETUP INSTRUCTIONS

### 1. Configure Supabase Connection

**Required Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**How to get your credentials:**

1. Go to https://app.supabase.com/
2. Select your project (or create a new one)
3. Go to Settings → API
4. Copy:
   - **Project URL** → use as NEXT_PUBLIC_SUPABASE_URL
   - **anon/public key** → use as NEXT_PUBLIC_SUPABASE_ANON_KEY

### 2. Verify Your .env.local File

Make sure your `.env.local` file exists in the root directory with the following content:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Service Role Key (ADMIN ONLY - DO NOT EXPOSE TO CLIENT)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Application Configuration
NEXT_PUBLIC_APP_NAME=Liguns Entertainment
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Schema

Make sure your Supabase database has been initialized with the schema from:
- `supabase/schema.sql` - Main database schema

To initialize your database:
1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Paste and run the SQL script

### 4. Type Definitions

The TypeScript type definitions are automatically generated and available at:
- `src/lib/database.types.ts` - Complete database type definitions
- `src/lib/supabase.ts` - Typed Supabase client with helper functions

These types are based on the database schema and include:
- **Tables**: profiles, jobs, job_applications, attendance, financial_records, gamification, store_items, store_purchases
- **Enums**: role, status, category, gender, attendance_status, financial_record_type, etc.
- **Functions**: calculate_net_salary
- **Relationships**: All foreign key relationships are typed

### 5. Type Safety Features

You now have full TypeScript autocomplete and type safety for:
✅ All database queries
✅ All table columns and their types
✅ All enum values
✅ All foreign key relationships
✅ Insert/Update/Row operations

Example usage:
```typescript
import { supabase } from '@/lib/supabase'
import type { Profile, Job, AttendanceInsert } from '@/lib/database.types'

// Fully typed queries
const { data: profiles } = await supabase
  .from('profiles')  // Autocomplete available
  .select('*')
  .eq('role', 'admin')  // Type-checked enum value

// Type-safe inserts
const newAttendance: AttendanceInsert = {
  user_id: 'uuid-here',
  status: 'present',  // Only valid enum values accepted
  // TypeScript will warn if required fields are missing
}
```

### 6. Security Notes

⚠️ **NEVER commit `.env.local` to Git** - It's already in `.gitignore`
⚠️ **NEVER expose SUPABASE_SERVICE_ROLE_KEY to client-side code**
⚠️ **Always use NEXT_PUBLIC_ prefix for client-side variables**

### 7. Restart Development Server

After updating `.env.local`, restart your development server:
```bash
npm run dev
```

## Testing Your Connection

You can verify your Supabase connection is working by checking:
1. No console errors related to Supabase
2. Supabase Dashboard shows your project is active
3. Run a test query (e.g., fetch profiles)

---

For more information, see:
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
