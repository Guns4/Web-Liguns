# 🗄️ Supabase Database Setup Guide

## Overview

This guide will help you set up the complete database schema for Liguns Entertainment platform.

---

## 📋 Database Schema Overview

### Tables (8 Total)

1. **profiles** - User profiles with role-based access
2. **jobs** - Job listings and opportunities
3. **job_applications** - Application tracking
4. **attendance** - Daily attendance records
5. **financial_records** - Payroll and financial transactions
6. **gamification** - Performance ranking system
7. **store_items** - Internal store products
8. **store_purchases** - Purchase history

---

## 🚀 Step-by-Step Setup

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: Liguns Entertainment
   - **Database Password**: (Save this securely!)
   - **Region**: Southeast Asia (Singapore) - closest to Indonesia
4. Wait for project to be provisioned (~2 minutes)

### Step 2: Get API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. Paste these into your `.env.local` file

### Step 3: Run SQL Schema

1. In Supabase dashboard → **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `/supabase/schema.sql`
4. Paste into the SQL Editor
5. Click **RUN** (or press Ctrl+Enter)
6. Wait for "Success. No rows returned" message

### Step 4: Verify Tables

1. Go to **Table Editor**
2. You should see 8 tables:
   - ✅ profiles
   - ✅ jobs
   - ✅ job_applications
   - ✅ attendance
   - ✅ financial_records
   - ✅ gamification
   - ✅ store_items
   - ✅ store_purchases

3. Click on each table to verify columns exist

### Step 5: Enable Row Level Security (RLS)

RLS is already enabled in the schema! Verify by:

1. Go to **Authentication** → **Policies**
2. Each table should have policies like:
   - "Users can view own profile"
   - "Admins can view all profiles"
   - etc.

---

## 🔐 Row Level Security (RLS) Explained

### What is RLS?

Row Level Security ensures users can only access data they're allowed to see.

### Key Policies Implemented:

#### Profiles Table
- ✅ Users can view their own profile
- ✅ Admins can view ALL profiles
- ✅ Users can update their own profile (except sensitive fields)
- ✅ Admins can update ANY profile

#### Jobs Table
- ✅ Everyone can view active jobs (public access)
- ✅ Only admins can create/edit/delete jobs

#### Job Applications
- ✅ Users can view their own applications
- ✅ Users can create applications
- ✅ Admins can view and manage ALL applications

#### Financial Records
- ✅ Talents can view their own financial records
- ✅ Only admins can create/edit financial records

#### And more...

**Privacy Guarantee**: Public users CANNOT see phone numbers or addresses!

---

## 🧪 Testing Your Database

### Test 1: Create a Test User

1. Go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Enter:
   - Email: `test@example.com`
   - Password: `TestPassword123!`
4. Click "Create user"

### Test 2: Add User Profile

1. Go to **Table Editor** → **profiles**
2. Click "Insert" → "Insert row"
3. Fill in:
   ```
   id: [paste the user ID from step above]
   role: user
   full_name: Test User
   email: test@example.com
   join_date: 2026-01-07
   status: active
   ```
4. Click "Save"

### Test 3: Create Sample Job

1. Go to **Table Editor** → **jobs**
2. Click "Insert row"
3. Fill in:
   ```json
   {
     "title": "Lady Companion Premium",
     "category": "LC",
     "salary_display": "Rp 6.000.000 - Rp 10.000.000",
     "description": "Mencari talent berkualitas untuk melayani klien VIP di lokasi premium Jakarta Selatan.",
     "location": "Jakarta Selatan",
     "city": "Jakarta",
     "is_active": true,
     "facilities": {
       "mess": true,
       "makeup_artist": true,
       "daily_salary": true,
       "security": true
     }
   }
   ```
4. Click "Save"

### Test 4: Verify in App

1. In your Next.js app, create a test page:
   ```tsx
   // src/app/test-db/page.tsx
   import { getActiveJobs } from '@/lib/supabase';
   
   export default async function TestDB() {
     const jobs = await getActiveJobs();
     return (
       <div className="p-8">
         <h1>Database Test</h1>
         <pre>{JSON.stringify(jobs, null, 2)}</pre>
       </div>
     );
   }
   ```

2. Visit `http://localhost:3000/test-db`
3. You should see your test job data!

---

## 📊 Sample Data Script

To populate with more realistic data, run this SQL:

```sql
-- Insert sample jobs
INSERT INTO jobs (title, category, salary_display, description, location, city, facilities, is_active)
VALUES
  ('Lady Companion Premium', 'LC', 'Rp 6.000.000 - Rp 10.000.000', 
   'Mencari talent berkualitas untuk melayani klien VIP', 
   'Jakarta Selatan', 'Jakarta', 
   '{"mess": true, "makeup_artist": true, "daily_salary": true, "security": true}'::jsonb, 
   true),
  
  ('Spa Therapist', 'Spa', 'Rp 4.500.000 - Rp 7.000.000', 
   'Terapis profesional untuk spa premium', 
   'Seminyak, Bali', 'Bali', 
   '{"mess": true, "training": true, "uniform": true}'::jsonb, 
   true),
  
  ('Model for Events', 'Model', 'Rp 5.000.000 - Rp 12.000.000', 
   'Model untuk berbagai acara dan promosi brand ternama', 
   'Surabaya City Center', 'Surabaya', 
   '{"transportation": true, "meal": true, "portfolio": true}'::jsonb, 
   true);

-- Insert sample store items
INSERT INTO store_items (name, category, description, price, stock, is_active)
VALUES
  ('Pulsa Telkomsel 100k', 'pulsa', 'Pulsa Telkomsel senilai Rp 100.000', 95000, 100, true),
  ('Dress Malam Elegant', 'fashion', 'Dress malam untuk acara formal', 450000, 10, true),
  ('Makeup Set Professional', 'makeup', 'Set makeup lengkap untuk talent', 850000, 5, true),
  ('Kalung Fashion', 'accessories', 'Kalung cantik untuk pelengkap penampilan', 150000, 20, true);
```

---

## 🔧 Database Functions

### Calculate Net Salary

The schema includes a PostgreSQL function to calculate net salary:

```sql
SELECT * FROM calculate_net_salary(
  'user-uuid-here',  -- user_id
  1,                 -- month (January)
  2026               -- year
);
```

Returns:
```json
{
  "total_income": 8500000,
  "total_deductions": 1200000,
  "net_salary": 7300000
}
```

This is used in the Admin Payroll Calculator.

---

## 🔒 Security Best Practices

### DO ✅
- Use RLS policies for all tables
- Always use `anon` key on frontend
- Store `service_role` key in server-side only
- Validate input before inserting
- Use prepared statements (automatic with Supabase)

### DON'T ❌
- Expose `service_role` key to client
- Disable RLS in production
- Store sensitive data unencrypted
- Allow public insert/update without auth
- Share database credentials in public repos

---

## 📝 Database Maintenance

### Backup Strategy

Supabase automatically backs up your database daily. To create manual backup:

1. Go to **Database** → **Backups**
2. Click "Create backup"
3. Wait for completion
4. Download if needed

### Monitoring

Check database health:
1. **Database** → **Logs** - view query logs
2. **Database** → **Reports** - performance metrics

---

## 🆘 Troubleshooting

### Error: "relation does not exist"
**Solution**: Schema not run. Go back to Step 3.

### Error: "permission denied for table"
**Solution**: RLS policy issue. Check policies in Authentication → Policies.

### Error: "duplicate key value violates unique constraint"
**Solution**: Trying to insert duplicate data. Check UNIQUE constraints (e.g., email).

### Connection Issues
**Solution**: 
1. Verify `.env.local` has correct URL and key
2. Restart Next.js dev server
3. Check Supabase project is not paused

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JS Reference](https://supabase.com/docs/reference/javascript)

---

## ✅ Checklist

Before proceeding to frontend development:

- [ ] Supabase project created
- [ ] Schema SQL executed successfully
- [ ] All 8 tables visible in Table Editor
- [ ] RLS policies enabled
- [ ] Environment variables configured
- [ ] Test user created
- [ ] Sample job inserted
- [ ] Database connection tested in app

---

**Next Step**: Return to `docs/QUICK_START.md` and proceed with building the public frontend!
