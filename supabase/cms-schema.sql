-- =============================================
-- CMS TABLES FOR ADMIN PANEL MANAGEMENT
-- All website content manageable from admin panel
-- =============================================
-- =============================================
-- 1. SITE SETTINGS TABLE
-- Company info, contact, social media, SEO
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Company Information
    company_name VARCHAR(255) DEFAULT 'Liguns Entertainment',
    company_tagline TEXT,
    company_description TEXT,
    company_logo_url TEXT,
    company_favicon_url TEXT,
    -- Contact Information
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_whatsapp VARCHAR(50),
    contact_address TEXT,
    -- Social Media Links
    social_instagram VARCHAR(255),
    social_tiktok VARCHAR(255),
    social_facebook VARCHAR(255),
    social_twitter VARCHAR(255),
    social_youtube VARCHAR(255),
    social_linkedin VARCHAR(255),
    -- SEO Settings
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    google_analytics_id VARCHAR(100),
    -- Website Settings
    maintenance_mode BOOLEAN DEFAULT false,
    maintenance_message TEXT,
    -- Audit
    updated_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Ensure only one settings record exists
CREATE UNIQUE INDEX IF NOT EXISTS idx_site_settings_singleton ON site_settings ((1));
-- Insert default settings
INSERT INTO site_settings (
        company_name,
        company_tagline,
        company_description,
        contact_whatsapp
    )
VALUES (
        'Liguns Entertainment',
        'Agency Profesional untuk Karaoke & Spa',
        'Liguns Entertainment adalah agency profesional yang menyediakan talent berkualitas untuk industri hiburan malam di Indonesia.',
        '6289669094929'
    ) ON CONFLICT DO NOTHING;
-- RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
-- Everyone can view settings
CREATE POLICY "Public can view site settings" ON site_settings FOR
SELECT USING (true);
-- Only admins can modify
CREATE POLICY "Admins can manage site settings" ON site_settings FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- =============================================
-- 2. NAVIGATION MENU TABLE
-- Dynamic navigation menu items
-- =============================================
CREATE TABLE IF NOT EXISTS navigation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Menu Item Info
    label VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    -- Display Options
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    open_new_tab BOOLEAN DEFAULT false,
    -- Parent/Child relationship (for dropdown menus)
    parent_id UUID REFERENCES navigation_items(id) ON DELETE CASCADE,
    -- Access Control
    visibility VARCHAR(20) CHECK (visibility IN ('public', 'member', 'admin')) DEFAULT 'public',
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_navigation_active ON navigation_items(is_active);
CREATE INDEX IF NOT EXISTS idx_navigation_order ON navigation_items(display_order);
-- Insert default menu items
INSERT INTO navigation_items (label, url, display_order, is_active)
VALUES ('Beranda', '/', 1, true),
    ('Lowongan Kerja', '/lowongan', 2, true),
    ('Layanan', '/layanan', 3, true),
    ('Tentang', '/tentang', 4, true) ON CONFLICT DO NOTHING;
-- RLS
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
-- Everyone can view active menu items
CREATE POLICY "Public can view active navigation" ON navigation_items FOR
SELECT USING (is_active = true);
-- Only admins can manage
CREATE POLICY "Admins can manage navigation" ON navigation_items FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- =============================================
-- 3. CONTENT SECTIONS TABLE
-- Editable content blocks for homepage
-- =============================================
CREATE TABLE IF NOT EXISTS content_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Section Identifier
    section_key VARCHAR(100) UNIQUE NOT NULL,
    -- e.g., 'hero', 'about', 'services'
    section_name VARCHAR(255) NOT NULL,
    -- Display name
    -- Content
    title TEXT,
    subtitle TEXT,
    description TEXT,
    content JSONB DEFAULT '{}',
    -- Flexible content storage
    -- Media
    image_url TEXT,
    video_url TEXT,
    background_image_url TEXT,
    -- Display Options
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    -- Styling
    background_color VARCHAR(50),
    text_color VARCHAR(50),
    -- Audit
    updated_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_content_sections_key ON content_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_content_sections_active ON content_sections(is_active);
-- Insert default sections
INSERT INTO content_sections (
        section_key,
        section_name,
        title,
        subtitle,
        description,
        is_active,
        display_order
    )
VALUES (
        'hero',
        'Hero Section',
        'Bergabunglah dengan Liguns Entertainment',
        'Agency Profesional untuk Karaoke & Spa',
        'Kami menyediakan peluang karir terbaik di industri hiburan malam',
        true,
        1
    ),
    (
        'about',
        'About Us',
        'Tentang Liguns Entertainment',
        'Partner Terpercaya untuk Karir Anda',
        'Liguns Entertainment telah dipercaya oleh berbagai venue ternama di Indonesia untuk menyediakan talent berkualitas tinggi.',
        true,
        2
    ),
    (
        'cta',
        'Call to Action',
        'Siap Memulai Karir Baru?',
        'Daftarkan diri Anda sekarang!',
        'Bergabunglah dengan ratusan talent yang sudah merasakan pengalaman bekerja dengan kami.',
        true,
        3
    ) ON CONFLICT (section_key) DO NOTHING;
-- RLS
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
-- Everyone can view active sections
CREATE POLICY "Public can view active content sections" ON content_sections FOR
SELECT USING (is_active = true);
-- Only admins can manage
CREATE POLICY "Admins can manage content sections" ON content_sections FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- =============================================
-- 4. SERVICES TABLE (Layanan)
-- Manageable services/layanan list
-- =============================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Service Info
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    -- Media
    icon VARCHAR(100),
    -- Icon name (lucide-react)
    image_url TEXT,
    -- Features/Highlights
    features JSONB DEFAULT '[]',
    -- Array of feature objects
    -- Pricing (optional)
    starting_price NUMERIC(12, 2),
    price_display VARCHAR(100),
    -- Display
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    -- CTA
    cta_text VARCHAR(100) DEFAULT 'Pelajari Lebih Lanjut',
    cta_url TEXT,
    -- Audit
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(is_featured);
-- Insert default services
INSERT INTO services (
        name,
        slug,
        short_description,
        icon,
        is_featured,
        is_active,
        display_order
    )
VALUES (
        'Penyaluran Tenaga Kerja',
        'penyaluran-tenaga-kerja',
        'Kami menyalurkan talent profesional untuk berbagai posisi di industri karaoke dan spa',
        'Users',
        false,
        true,
        1
    ),
    (
        'Pelatihan Profesional',
        'pelatihan-profesional',
        'Program pelatihan komprehensif untuk meningkatkan skill dan profesionalisme',
        'GraduationCap',
        false,
        true,
        2
    ),
    (
        'Manajemen Sosial Media',
        'manajemen-sosial-media',
        'Layanan manajemen media sosial khusus untuk venue entertainment',
        'Share2',
        true,
        true,
        3
    ) ON CONFLICT (slug) DO NOTHING;
-- RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
-- Everyone can view active services
CREATE POLICY "Public can view active services" ON services FOR
SELECT USING (is_active = true);
-- Only admins can manage
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- =============================================
-- 5. TESTIMONIALS TABLE
-- Customer/talent testimonials
-- =============================================
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Person Info
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    -- e.g., "Talent", "Venue Owner"
    company VARCHAR(255),
    avatar_url TEXT,
    -- Testimonial Content
    content TEXT NOT NULL,
    rating INTEGER CHECK (
        rating BETWEEN 1 AND 5
    ),
    -- Display
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
-- RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
-- Everyone can view active testimonials
CREATE POLICY "Public can view active testimonials" ON testimonials FOR
SELECT USING (is_active = true);
-- Only admins can manage
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- =============================================
-- TRIGGERS
-- =============================================
CREATE TRIGGER update_site_settings_updated_at BEFORE
UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_navigation_items_updated_at BEFORE
UPDATE ON navigation_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_sections_updated_at BEFORE
UPDATE ON content_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE
UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE
UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- =============================================
-- END OF CMS SCHEMA
-- =============================================