-- =============================================
-- VENUES TABLE FOR LOWONGAN KERJA
-- This table stores job listings (venues) for the website
-- =============================================
-- Create venues table
CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    position VARCHAR(255) NOT NULL,
    -- Display Options
    featured BOOLEAN DEFAULT false,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    -- Image
    image_url TEXT,
    logo_url TEXT,
    -- SEO & Links
    slug VARCHAR(255) UNIQUE,
    detail_page_url TEXT,
    -- Additional Info (JSON for flexibility)
    metadata JSONB DEFAULT '{}',
    -- Audit
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Order for display
    display_order INTEGER DEFAULT 0
);
-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);
CREATE INDEX IF NOT EXISTS idx_venues_status ON venues(status);
CREATE INDEX IF NOT EXISTS idx_venues_featured ON venues(featured);
CREATE INDEX IF NOT EXISTS idx_venues_slug ON venues(slug);
CREATE INDEX IF NOT EXISTS idx_venues_display_order ON venues(display_order);
-- Row Level Security
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
-- Policy: Everyone can view active venues (public website)
CREATE POLICY "Public can view active venues" ON venues FOR
SELECT USING (status = 'active');
-- Policy: Admins can manage all venues
CREATE POLICY "Admins can manage all venues" ON venues FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- Trigger for updated_at
CREATE TRIGGER update_venues_updated_at BEFORE
UPDATE ON venues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Insert sample data (Bandung venues)
INSERT INTO venues (
        name,
        city,
        position,
        featured,
        status,
        slug,
        display_order
    )
VALUES (
        'Venetian Havana',
        'Bandung',
        'Terapis Spa',
        true,
        'active',
        'venetian-havana',
        1
    ),
    (
        'Denver Club',
        'Bandung',
        'Ladies Karaoke',
        false,
        'active',
        'denver-club',
        2
    ),
    (
        'Denver Spa',
        'Bandung',
        'Terapis Spa',
        false,
        'active',
        'denver-spa',
        3
    ),
    (
        'Vender Club',
        'Bandung',
        'Ladies Karaoke',
        false,
        'active',
        'vender-club',
        4
    ),
    (
        '80 Spa',
        'Bandung',
        'Terapis Spa',
        false,
        'active',
        '80-spa',
        5
    ),
    (
        'Saga Vigour',
        'Bandung',
        'Terapis Spa',
        false,
        'active',
        'saga-vigour',
        6
    ),
    (
        'Sultan Spa',
        'Bandung',
        'Terapis Spa',
        false,
        'active',
        'sultan-spa',
        7
    ),
    (
        'LIV Club',
        'Bandung',
        'Ladies Karaoke',
        false,
        'active',
        'liv-club',
        8
    ),
    (
        'Heritage',
        'Bandung',
        'Terapis Spa • Ladies Karaoke',
        false,
        'active',
        'heritage',
        9
    ) ON CONFLICT (slug) DO NOTHING;
-- =============================================
-- END OF VENUES SCHEMA
-- =============================================