# 🔒 Row Level Security (RLS) Implementation Guide

## 📋 Overview

This document explains the Row Level Security policies implemented for the database to ensure data privacy and security.

---

## 🎯 Security Objectives

1. **Data Isolation**: Users can only access their own sensitive data
2. **Admin Privileges**: Admins have full access to all data
3. **Social Features**: Enable leaderboards and social features with safe public reads
4. **Prevent Data Leaks**: Block unauthorized access attempts

---

## 🛡️ Policy Summary

### **1. financial_records**
| Action | User Access | Admin Access |
|--------|-------------|--------------|
| SELECT | ✅ Own records only | ✅ All records |
| INSERT | ❌ No | ✅ Yes |
| UPDATE | ❌ No | ✅ Yes |
| DELETE | ❌ No | ✅ Yes |

**Use Case**: Protect salary and commission data

### **2. attendance**
| Action | User Access | Admin Access |
|--------|-------------|--------------|
| SELECT | ✅ Own records only | ✅ All records |
| INSERT | ✅ Own records only | ✅ All records |
| UPDATE | ✅ Own records only | ✅ All records |
| DELETE | ❌ No | ✅ Yes |

**Use Case**: Members can check in/out, admins manage attendance

### **3. profiles**
| Action | User Access | Admin Access |
|--------|-------------|--------------|
| SELECT | ✅ All profiles (public) | ✅ All profiles |
| INSERT | ❌ No | ✅ Yes |
| UPDATE | ✅ Own profile only | ✅ All profiles |
| DELETE | ❌ No | ✅ Yes |

**Use Case**: Enable leaderboards while protecting edit access

### **4. gamification**
| Action | User Access | Admin Access |
|--------|-------------|--------------|
| SELECT | ✅ All (leaderboard) | ✅ All |
| INSERT | ❌ No | ✅ Yes |
| UPDATE | ❌ No | ✅ Yes |
| DELETE | ❌ No | ✅ Yes |

**Use Case**: Public leaderboard, admin-managed scores

### **5. store_purchases**
| Action | User Access | Admin Access |
|--------|-------------|--------------|
| SELECT | ✅ Own purchases only | ✅ All purchases |
| INSERT | ✅ Own purchases only | ✅ All purchases |
| UPDATE | ❌ No | ✅ Yes |
| DELETE | ❌ No | ✅ Yes |

**Use Case**: Members buy items, admins manage orders

### **6. store_items**
| Action | User Access | Admin Access |
|--------|-------------|--------------|
| SELECT | ✅ Active items only | ✅ All items |
| INSERT | ❌ No | ✅ Yes |
| UPDATE | ❌ No | ✅ Yes |
| DELETE | ❌ No | ✅ Yes |

**Use Case**: Public store catalog, admin-managed inventory

### **7. jobs**
| Action | User Access | Admin Access |
|--------|-------------|--------------|
| SELECT | ✅ Active jobs (public) | ✅ All jobs |
| INSERT | ❌ No | ✅ Yes |
| UPDATE | ❌ No | ✅ Yes |
| DELETE | ❌ No | ✅ Yes |

**Use Case**: Public job board, admin-managed postings

### **8. job_applications**
| Action | User Access | Admin Access |
|--------|-------------|--------------|
| SELECT | ✅ Own applications | ✅ All applications |
| INSERT | ✅ Can apply | ✅ All applications |
| UPDATE | ❌ No | ✅ Yes |
| DELETE | ❌ No | ✅ Yes |

**Use Case**: Users apply for jobs, admins review

---

## 🔧 Helper Functions

### `is_admin()`
```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Purpose**: Check if current user is an admin
**Usage**: Used in all admin-only policies
**Security**: SECURITY DEFINER allows querying profiles table

---

## 📝 Policy Examples

### Example 1: User Self-Access
```sql
CREATE POLICY "Users can view own financial records"
ON financial_records
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

**Explanation**:
- `FOR SELECT`: Only applies to read operations
- `TO authenticated`: Must be logged in
- `USING (auth.uid() = user_id)`: Filter to match user ID

### Example 2: Admin Full Access
```sql
CREATE POLICY "Admins can manage gamification"
ON gamification
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());
```

**Explanation**:
- `FOR ALL`: Applies to all operations (SELECT, INSERT, UPDATE, DELETE)
- `USING (is_admin())`: Check on existing rows
- `WITH CHECK (is_admin())`: Check on new/updated rows

### Example 3: Public Read
```sql
CREATE POLICY "All users can view profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);
```

**Explanation**:
- `USING (true)`: No restrictions, all authenticated users can read
- Enables features like leaderboards and team directories

---

## 🧪 Testing RLS

### Test 1: Regular User Access
```sql
-- Login as user with ID: abc-123

-- Should work (own data)
SELECT * FROM financial_records WHERE user_id = 'abc-123';

-- Should return empty (other user's data)
SELECT * FROM financial_records WHERE user_id = 'xyz-789';

-- Should work (all profiles visible)
SELECT * FROM profiles;

-- Should fail (cannot update other profiles)
UPDATE profiles SET full_name = 'Hacker' WHERE id = 'xyz-789';
```

### Test 2: Admin Access
```sql
-- Login as admin

-- Should work (all financial records)
SELECT * FROM financial_records;

-- Should work (can update any profile)
UPDATE profiles SET status = 'active' WHERE id = 'xyz-789';

-- Should work (can delete)
DELETE FROM attendance WHERE id = 'some-id';
```

### Test 3: Unauthenticated Access
```sql
-- Not logged in

-- Should work (public jobs)
SELECT * FROM jobs WHERE is_active = true;

-- Should fail (requires auth)
SELECT * FROM profiles;
SELECT * FROM financial_records;
```

---

## 🚨 Common Security Pitfalls (AVOIDED)

### ❌ Don't Do This:
```sql
-- BAD: Allows users to see all data
CREATE POLICY "bad_policy"
ON financial_records
FOR SELECT
USING (true);

-- BAD: No admin check
CREATE POLICY "no_admin_check"
ON profiles
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- BAD: Missing WITH CHECK
CREATE POLICY "missing_check"
ON attendance
FOR UPDATE
USING (auth.uid() = user_id);
-- Should also have: WITH CHECK (auth.uid() = user_id)
```

### ✅ Do This Instead:
```sql
-- GOOD: Filtered to user's data
CREATE POLICY "good_policy"
ON financial_records
FOR SELECT
USING (auth.uid() = user_id OR is_admin());

-- GOOD: Admin check included
CREATE POLICY "has_admin_check"
ON profiles
FOR UPDATE
USING (auth.uid() = id OR is_admin())
WITH CHECK (auth.uid() = id OR is_admin());
```

---

## 🔍 Verification Queries

### Check RLS Status
```sql
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true
ORDER BY tablename;
```

**Expected Output**:
```
schemaname | tablename         | rowsecurity
-----------+-------------------+-------------
public     | attendance        | t
public     | financial_records | t
public     | gamification      | t
public     | job_applications  | t
public     | jobs              | t
public     | profiles          | t
public     | store_items       | t
public     | store_purchases   | t
```

### View All Policies
```sql
SELECT 
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 📊 Performance Impact

### RLS Overhead:
- **Minimal**: RLS adds a WHERE clause to queries
- **Indexed**: Policies use indexed columns (user_id, id)
- **Efficient**: PostgreSQL optimizes RLS checks

### Best Practices:
1. ✅ Index columns used in policies (user_id, id)
2. ✅ Keep policy logic simple
3. ✅ Use SECURITY DEFINER sparingly
4. ✅ Test policy performance with EXPLAIN

### Example Performance Check:
```sql
EXPLAIN ANALYZE
SELECT * FROM financial_records
WHERE user_id = auth.uid();
```

---

## 🔄 Migration Process

### Step 1: Apply Policies
```bash
# Run the RLS policies script
psql -h db.project.supabase.co -U postgres -d postgres -f rls_policies.sql
```

### Step 2: Verify
```sql
-- Check all tables have RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### Step 3: Test Access
```javascript
// Frontend test - Regular user
const { data, error } = await supabase
    .from('financial_records')
    .select('*');
// Should only return user's own records

// Frontend test - Admin
const { data, error } = await supabase
    .from('financial_records')
    .select('*');
// Should return all records
```

---

## 🛠️ Troubleshooting

### Issue 1: "Permission Denied"
**Cause**: RLS blocking legitimate access
**Fix**: Check if user is authenticated and policy matches

```sql
-- Debug: Check current user
SELECT auth.uid(), auth.role();

-- Debug: Check if admin
SELECT is_admin();
```

### Issue 2: "Policy Already Exists"
**Cause**: Trying to create duplicate policy
**Fix**: Drop existing policy first

```sql
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

### Issue 3: "No Data Returned"
**Cause**: RLS filtering out all rows
**Fix**: Verify user_id matches auth.uid()

```sql
-- Check user_id in data
SELECT user_id FROM financial_records LIMIT 10;

-- Check current auth.uid()
SELECT auth.uid();
```

---

## 📚 Additional Resources

- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Security Best Practices](https://supabase.com/docs/guides/database/database-security)

---

## ✅ Security Checklist

Before going to production:

- [ ] All tables have RLS enabled
- [ ] All policies tested with user accounts
- [ ] All policies tested with admin accounts
- [ ] Helper functions are SECURITY DEFINER
- [ ] Indexes exist on policy columns
- [ ] No policies use `USING (true)` for sensitive data
- [ ] All `FOR ALL` policies have `WITH CHECK`
- [ ] Public access is intentional and documented
- [ ] Performance tested with realistic data volume

---

**Last Updated**: 2026-01-09
**Status**: ✅ Production Ready
