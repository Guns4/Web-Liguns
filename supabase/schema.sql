-- =============================================
-- LIGUNS ENTERTAINMENT - DATABASE SCHEMA
-- Premium Talent Agency Platform
-- =============================================
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- =============================================
-- 1. PROFILES TABLE
-- User profiles with role-based access
-- =============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'talent', 'user')),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    -- Sensitive data (Admin only)
    phone VARCHAR(20),
    -- Encrypted in application layer
    address TEXT,
    -- Admin only
    -- Talent physical attributes
    height NUMERIC(5, 2),
    -- in cm (e.g., 165.50)
    weight NUMERIC(5, 2),
    -- in kg (e.g., 55.00)
    -- Photo gallery
    photos TEXT [] DEFAULT '{}',
    -- Array of photo URLs
    profile_photo TEXT,
    -- Main profile photo
    -- Employment info
    join_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) CHECK (
        status IN ('active', 'contract', 'interview', 'inactive')
    ) DEFAULT 'interview',
    -- Additional fields
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    education VARCHAR(100),
    experience TEXT,
    bio TEXT,
    -- Audit timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Index for performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_email ON profiles(email);
-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR
SELECT USING (auth.uid() = id);
-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
-- Policy: Users can update their own profile (except role and sensitive fields)
CREATE POLICY "Users can update own profile" ON profiles FOR
UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- Policy: Admins can update any profile
CREATE POLICY "Admins can update all profiles" ON profiles FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
-- Policy: New users can insert their profile
CREATE POLICY "Users can insert own profile" ON profiles FOR
INSERT WITH CHECK (auth.uid() = id);
-- =============================================
-- 2. JOBS TABLE
-- Job listings and opportunities
-- =============================================
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (
        category IN ('LC', 'Spa', 'Model', 'Entertainer', 'Other')
    ),
    -- Salary information
    salary_min NUMERIC(12, 2),
    salary_max NUMERIC(12, 2),
    salary_display VARCHAR(100),
    -- e.g., "Rp 5.000.000 - Rp 8.000.000"
    -- Job details
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    -- Facilities (JSON for flexibility)
    facilities JSONB DEFAULT '{}',
    -- e.g., {"mess": true, "makeup_artist": true, "daily_salary": true}
    -- Location
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    province VARCHAR(100),
    map_url TEXT,
    -- Google Maps embed URL
    -- Images
    image_url TEXT,
    gallery TEXT [] DEFAULT '{}',
    -- Status
    is_active BOOLEAN DEFAULT true,
    slots_available INTEGER DEFAULT 1,
    slots_filled INTEGER DEFAULT 0,
    -- Audit
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deadline DATE
);
-- Index
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_is_active ON jobs(is_active);
CREATE INDEX idx_jobs_city ON jobs(city);
-- RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
-- Policy: Everyone can view active jobs
CREATE POLICY "Public can view active jobs" ON jobs FOR
SELECT USING (is_active = true);
-- Policy: Admins can manage all jobs
CREATE POLICY "Admins can manage jobs" ON jobs FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- =============================================
-- 3. JOB APPLICATIONS TABLE
-- Track who applied to which job
-- =============================================
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    -- Application data
    cover_letter TEXT,
    resume_url TEXT,
    additional_info JSONB DEFAULT '{}',
    -- Status tracking
    status VARCHAR(50) CHECK (
        status IN (
            'pending',
            'reviewed',
            'interview',
            'accepted',
            'rejected'
        )
    ) DEFAULT 'pending',
    admin_notes TEXT,
    -- Timestamps
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);
-- Index
CREATE INDEX idx_applications_job ON job_applications(job_id);
CREATE INDEX idx_applications_user ON job_applications(user_id);
CREATE INDEX idx_applications_status ON job_applications(status);
-- RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
-- Policy: Users can view their own applications
CREATE POLICY "Users can view own applications" ON job_applications FOR
SELECT USING (auth.uid() = user_id);
-- Policy: Users can create their own applications
CREATE POLICY "Users can create applications" ON job_applications FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- Policy: Admins can view all applications
CREATE POLICY "Admins can view all applications" ON job_applications FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
-- Policy: Admins can update applications
CREATE POLICY "Admins can update applications" ON job_applications FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
-- =============================================
-- 4. ATTENDANCE TABLE
-- Daily attendance tracking
-- =============================================
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    -- Attendance status
    status VARCHAR(20) CHECK (
        status IN ('present', 'sick', 'alpha', 'permit', 'leave')
    ) NOT NULL,
    -- Time tracking
    check_in_time TIME,
    check_out_time TIME,
    -- Additional info
    notes TEXT,
    approved_by UUID REFERENCES profiles(id),
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);
-- Index
CREATE INDEX idx_attendance_user ON attendance(user_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_status ON attendance(status);
-- RLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
-- Policy: Talents can view their own attendance
CREATE POLICY "Talents can view own attendance" ON attendance FOR
SELECT USING (auth.uid() = user_id);
-- Policy: Admins can manage all attendance
CREATE POLICY "Admins can manage attendance" ON attendance FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- =============================================
-- 5. FINANCIAL RECORDS TABLE
-- Complex payroll and financial tracking
-- =============================================
CREATE TABLE financial_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    -- Transaction type
    type VARCHAR(50) CHECK (
        type IN (
            'voucher_income',
            -- Daily vouchers earned
            'bonus',
            -- Performance bonus
            'deduction_loan',
            -- Kasbon/loan repayment
            'deduction_saving',
            -- Mandatory savings
            'deduction_health',
            -- Health insurance
            'deduction_store',
            -- Internal store purchase
            'adjustment' -- Manual adjustment by admin
        )
    ) NOT NULL,
    -- Amount
    amount NUMERIC(12, 2) NOT NULL,
    -- Details
    description TEXT,
    reference_id UUID,
    -- Link to related record (e.g., store purchase ID)
    -- Date and period
    date DATE DEFAULT CURRENT_DATE,
    period_month INTEGER,
    -- 1-12
    period_year INTEGER,
    -- Payment status
    is_paid BOOLEAN DEFAULT false,
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50),
    -- e.g., 'cash', 'transfer'
    -- Audit
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Index
CREATE INDEX idx_financial_user ON financial_records(user_id);
CREATE INDEX idx_financial_type ON financial_records(type);
CREATE INDEX idx_financial_date ON financial_records(date);
CREATE INDEX idx_financial_period ON financial_records(period_year, period_month);
-- RLS
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
-- Policy: Talents can view their own records
CREATE POLICY "Talents can view own financial records" ON financial_records FOR
SELECT USING (auth.uid() = user_id);
-- Policy: Admins can manage all records
CREATE POLICY "Admins can manage financial records" ON financial_records FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- =============================================
-- 6. GAMIFICATION TABLE
-- Performance ranking and feedback
-- =============================================
CREATE TABLE gamification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    -- Period
    month INTEGER NOT NULL CHECK (
        month BETWEEN 1 AND 12
    ),
    year INTEGER NOT NULL,
    -- Scores (0-100)
    rank_score NUMERIC(5, 2) DEFAULT 0 CHECK (
        rank_score BETWEEN 0 AND 100
    ),
    attendance_score NUMERIC(5, 2) DEFAULT 0,
    performance_score NUMERIC(5, 2) DEFAULT 0,
    customer_rating NUMERIC(3, 2) DEFAULT 0 CHECK (
        customer_rating BETWEEN 0 AND 5
    ),
    -- Metrics
    total_vouchers NUMERIC(12, 2) DEFAULT 0,
    total_hours NUMERIC(8, 2) DEFAULT 0,
    -- Feedback
    feedback_notes TEXT,
    achievements JSONB DEFAULT '[]',
    -- Array of achievement badges
    -- Rank position
    rank_position INTEGER,
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month, year)
);
-- Index
CREATE INDEX idx_gamification_user ON gamification(user_id);
CREATE INDEX idx_gamification_period ON gamification(year, month);
CREATE INDEX idx_gamification_rank ON gamification(rank_score DESC);
-- RLS
ALTER TABLE gamification ENABLE ROW LEVEL SECURITY;
-- Policy: Talents can view their own gamification data
CREATE POLICY "Talents can view own gamification" ON gamification FOR
SELECT USING (auth.uid() = user_id);
-- Policy: Admins can manage all gamification
CREATE POLICY "Admins can manage gamification" ON gamification FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- =============================================
-- 7. INTERNAL STORE TABLE
-- Items available for purchase
-- =============================================
CREATE TABLE store_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (
        category IN (
            'pulsa',
            'fashion',
            'makeup',
            'accessories',
            'other'
        )
    ),
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    image_url TEXT,
    stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Index
CREATE INDEX idx_store_category ON store_items(category);
CREATE INDEX idx_store_active ON store_items(is_active);
-- RLS
ALTER TABLE store_items ENABLE ROW LEVEL SECURITY;
-- Policy: Everyone can view active items
CREATE POLICY "Everyone can view active store items" ON store_items FOR
SELECT USING (is_active = true);
-- Policy: Admins can manage items
CREATE POLICY "Admins can manage store items" ON store_items FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- =============================================
-- 8. STORE PURCHASES TABLE
-- Track internal store purchases
-- =============================================
CREATE TABLE store_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES store_items(id),
    quantity INTEGER DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) CHECK (
        status IN ('pending', 'approved', 'delivered', 'cancelled')
    ) DEFAULT 'pending',
    -- Payment via salary deduction
    deducted BOOLEAN DEFAULT false,
    financial_record_id UUID REFERENCES financial_records(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Index
CREATE INDEX idx_purchases_user ON store_purchases(user_id);
CREATE INDEX idx_purchases_item ON store_purchases(item_id);
-- RLS
ALTER TABLE store_purchases ENABLE ROW LEVEL SECURITY;
-- Policy: Users can view their own purchases
CREATE POLICY "Users can view own purchases" ON store_purchases FOR
SELECT USING (auth.uid() = user_id);
-- Policy: Users can create purchases
CREATE POLICY "Users can create purchases" ON store_purchases FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- Policy: Admins can manage all purchases
CREATE POLICY "Admins can manage purchases" ON store_purchases FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================
-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Apply triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE
UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE
UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE
UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE
UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_updated_at BEFORE
UPDATE ON financial_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gamification_updated_at BEFORE
UPDATE ON gamification FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_store_items_updated_at BEFORE
UPDATE ON store_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchases_updated_at BEFORE
UPDATE ON store_purchases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Function: Calculate net salary for a user in a given period
CREATE OR REPLACE FUNCTION calculate_net_salary(
        p_user_id UUID,
        p_month INTEGER,
        p_year INTEGER
    ) RETURNS TABLE(
        total_income NUMERIC,
        total_deductions NUMERIC,
        net_salary NUMERIC
    ) AS $$ BEGIN RETURN QUERY
SELECT COALESCE(
        SUM(
            CASE
                WHEN type IN ('voucher_income', 'bonus') THEN amount
                ELSE 0
            END
        ),
        0
    ) as total_income,
    COALESCE(
        SUM(
            CASE
                WHEN type LIKE 'deduction_%' THEN amount
                ELSE 0
            END
        ),
        0
    ) as total_deductions,
    COALESCE(
        SUM(
            CASE
                WHEN type IN ('voucher_income', 'bonus') THEN amount
                ELSE - amount
            END
        ),
        0
    ) as net_salary
FROM financial_records
WHERE user_id = p_user_id
    AND period_month = p_month
    AND period_year = p_year;
END;
$$ LANGUAGE plpgsql;
-- =============================================
-- SAMPLE DATA (FOR TESTING)
-- =============================================
-- Note: Run this only in development
-- INSERT INTO jobs (title, category, salary_display, description, location, city, facilities, is_active)
-- VALUES
-- ('Lady Companion Premium', 'LC', 'Rp 6.000.000 - Rp 10.000.000', 'Mencari talent berkualitas untuk melayani klien VIP', 'Jakarta Selatan', 'Jakarta', '{"mess": true, "makeup_artist": true, "daily_salary": true, "security": true}', true),
-- ('Spa Therapist', 'Spa', 'Rp 4.500.000 - Rp 7.000.000', 'Terapis profesional untuk spa premium', 'Bali', 'Bali', '{"mess": true, "training": true, "uniform": true}', true),
-- ('Model Events', 'Model', 'Rp 5.000.000 - Rp 12.000.000', 'Model untuk berbagai acara dan promosi', 'Surabaya', 'Surabaya', '{"transportation": true, "meal": true}', true);
-- =============================================
-- END OF SCHEMA
-- =============================================