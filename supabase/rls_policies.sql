-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- File: rls_policies.sql
-- Purpose: Secure database access with proper policies
-- =====================================================
-- =====================================================
-- HELPER FUNCTION: Check if user is admin
-- =====================================================
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$ BEGIN RETURN EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- =====================================================
-- TABLE: financial_records
-- =====================================================
-- Enable RLS
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if any (for clean slate)
DROP POLICY IF EXISTS "Users can view own financial records" ON financial_records;
DROP POLICY IF EXISTS "Admins can view all financial records" ON financial_records;
DROP POLICY IF EXISTS "Admins can insert financial records" ON financial_records;
DROP POLICY IF EXISTS "Admins can update financial records" ON financial_records;
DROP POLICY IF EXISTS "Admins can delete financial records" ON financial_records;
-- Policy 1: Users can SELECT their own records
CREATE POLICY "Users can view own financial records" ON financial_records FOR
SELECT TO authenticated USING (auth.uid() = user_id);
-- Policy 2: Admins can SELECT all records
CREATE POLICY "Admins can view all financial records" ON financial_records FOR
SELECT TO authenticated USING (is_admin());
-- Policy 3: Admins can INSERT records
CREATE POLICY "Admins can insert financial records" ON financial_records FOR
INSERT TO authenticated WITH CHECK (is_admin());
-- Policy 4: Admins can UPDATE records
CREATE POLICY "Admins can update financial records" ON financial_records FOR
UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
-- Policy 5: Admins can DELETE records
CREATE POLICY "Admins can delete financial records" ON financial_records FOR DELETE TO authenticated USING (is_admin());
-- =====================================================
-- TABLE: attendance
-- =====================================================
-- Enable RLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own attendance" ON attendance;
DROP POLICY IF EXISTS "Users can insert own attendance" ON attendance;
DROP POLICY IF EXISTS "Users can update own attendance" ON attendance;
DROP POLICY IF EXISTS "Admins can view all attendance" ON attendance;
DROP POLICY IF EXISTS "Admins can insert attendance" ON attendance;
DROP POLICY IF EXISTS "Admins can update attendance" ON attendance;
DROP POLICY IF EXISTS "Admins can delete attendance" ON attendance;
-- Policy 1: Users can SELECT their own attendance
CREATE POLICY "Users can view own attendance" ON attendance FOR
SELECT TO authenticated USING (auth.uid() = user_id);
-- Policy 2: Users can INSERT their own attendance
CREATE POLICY "Users can insert own attendance" ON attendance FOR
INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
-- Policy 3: Users can UPDATE their own attendance (for check-out)
CREATE POLICY "Users can update own attendance" ON attendance FOR
UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- Policy 4: Admins can SELECT all attendance
CREATE POLICY "Admins can view all attendance" ON attendance FOR
SELECT TO authenticated USING (is_admin());
-- Policy 5: Admins can INSERT attendance for anyone
CREATE POLICY "Admins can insert attendance" ON attendance FOR
INSERT TO authenticated WITH CHECK (is_admin());
-- Policy 6: Admins can UPDATE any attendance
CREATE POLICY "Admins can update attendance" ON attendance FOR
UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
-- Policy 7: Admins can DELETE attendance
CREATE POLICY "Admins can delete attendance" ON attendance FOR DELETE TO authenticated USING (is_admin());
-- =====================================================
-- TABLE: profiles
-- =====================================================
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if any
DROP POLICY IF EXISTS "All authenticated users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
-- Policy 1: ALL authenticated users can SELECT profiles (for leaderboard, social features)
CREATE POLICY "All authenticated users can view profiles" ON profiles FOR
SELECT TO authenticated USING (true);
-- Policy 2: Users can UPDATE their own profile only
CREATE POLICY "Users can update own profile" ON profiles FOR
UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- Policy 3: Admins can INSERT profiles
CREATE POLICY "Admins can insert profiles" ON profiles FOR
INSERT TO authenticated WITH CHECK (is_admin());
-- Policy 4: Admins can UPDATE any profile
CREATE POLICY "Admins can update all profiles" ON profiles FOR
UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
-- Policy 5: Admins can DELETE profiles
CREATE POLICY "Admins can delete profiles" ON profiles FOR DELETE TO authenticated USING (is_admin());
-- =====================================================
-- ADDITIONAL SECURITY: Other Tables
-- =====================================================
-- TABLE: gamification
ALTER TABLE gamification ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own gamification" ON gamification;
DROP POLICY IF EXISTS "All users can view gamification for leaderboard" ON gamification;
DROP POLICY IF EXISTS "Admins can manage gamification" ON gamification;
-- Users can view their own gamification data
CREATE POLICY "Users can view own gamification" ON gamification FOR
SELECT TO authenticated USING (auth.uid() = user_id);
-- All users can view gamification data (for leaderboard)
CREATE POLICY "All users can view gamification for leaderboard" ON gamification FOR
SELECT TO authenticated USING (true);
-- Admins can do everything
CREATE POLICY "Admins can manage gamification" ON gamification FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
-- TABLE: store_purchases
ALTER TABLE store_purchases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own purchases" ON store_purchases;
DROP POLICY IF EXISTS "Users can insert own purchases" ON store_purchases;
DROP POLICY IF EXISTS "Admins can manage purchases" ON store_purchases;
-- Users can view their own purchases
CREATE POLICY "Users can view own purchases" ON store_purchases FOR
SELECT TO authenticated USING (auth.uid() = user_id);
-- Users can insert their own purchases
CREATE POLICY "Users can insert own purchases" ON store_purchases FOR
INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
-- Admins can do everything
CREATE POLICY "Admins can manage purchases" ON store_purchases FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
-- TABLE: store_items
ALTER TABLE store_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "All users can view active items" ON store_items;
DROP POLICY IF EXISTS "Admins can manage items" ON store_items;
-- All authenticated users can view active store items
CREATE POLICY "All users can view active items" ON store_items FOR
SELECT TO authenticated USING (is_active = true);
-- Admins can manage all store items
CREATE POLICY "Admins can manage items" ON store_items FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
-- TABLE: jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "All users can view active jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can manage jobs" ON jobs;
-- All users (including anonymous) can view active jobs
CREATE POLICY "All users can view active jobs" ON jobs FOR
SELECT TO public USING (is_active = true);
-- Admins can manage jobs
CREATE POLICY "Admins can manage jobs" ON jobs FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
-- TABLE: job_applications
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON job_applications;
DROP POLICY IF EXISTS "Admins can manage applications" ON job_applications;
-- Users can view their own applications
CREATE POLICY "Users can view own applications" ON job_applications FOR
SELECT TO authenticated USING (auth.uid() = user_id);
-- Users can submit applications
CREATE POLICY "Users can insert own applications" ON job_applications FOR
INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
-- Admins can manage all applications
CREATE POLICY "Admins can manage applications" ON job_applications FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify RLS is working:
-- Check if RLS is enabled on tables
SELECT schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
    AND rowsecurity = true
ORDER BY tablename;
-- View all policies
SELECT schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename,
    policyname;
-- =====================================================
-- NOTES
-- =====================================================
/*
 SECURITY SUMMARY:
 
 1. financial_records:
 - Users: Can only view their own records
 - Admins: Full CRUD access
 
 2. attendance:
 - Users: Can view, insert, and update their own records
 - Admins: Full CRUD access
 
 3. profiles:
 - All authenticated users: Can view all profiles (leaderboard)
 - Users: Can only update their own profile
 - Admins: Full CRUD access
 
 4. gamification:
 - All users: Can view all data (leaderboard)
 - Users: Can view own detailed data
 - Admins: Full CRUD access
 
 5. store_purchases:
 - Users: Can view and create own purchases
 - Admins: Full CRUD access
 
 6. store_items:
 - All users: Can view active items
 - Admins: Full CRUD access
 
 7. jobs:
 - Public: Can view active jobs
 - Admins: Full CRUD access
 
 8. job_applications:
 - Users: Can view own applications and submit new ones
 - Admins: Full CRUD access
 
 TESTING:
 1. Login as regular user → Should only see own data
 2. Login as admin → Should see all data
 3. Try to access other user's data → Should fail
 4. Try to modify without permission → Should fail
 
 SECURITY DEFINER:
 The is_admin() function uses SECURITY DEFINER to allow
 it to query the profiles table even when called from
 a context where the user might not have direct access.
 */