import { supabase } from './supabase';

// =============================================
// TYPE DEFINITIONS
// =============================================

export interface SiteSettings {
    id: string;
    company_name: string;
    company_tagline?: string;
    company_description?: string;
    company_logo_url?: string;
    company_favicon_url?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_whatsapp?: string;
    contact_address?: string;
    social_instagram?: string;
    social_tiktok?: string;
    social_facebook?: string;
    social_twitter?: string;
    social_youtube?: string;
    social_linkedin?: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    google_analytics_id?: string;
    maintenance_mode: boolean;
    maintenance_message?: string;
    updated_at: string;
}

export interface NavigationItem {
    id: string;
    label: string;
    url: string;
    icon?: string;
    display_order: number;
    is_active: boolean;
    open_new_tab: boolean;
    parent_id?: string;
    visibility: 'public' | 'member' | 'admin';
}

export interface ContentSection {
    id: string;
    section_key: string;
    section_name: string;
    title?: string;
    subtitle?: string;
    description?: string;
    content?: Record<string, any>;
    image_url?: string;
    video_url?: string;
    background_image_url?: string;
    is_active: boolean;
    display_order: number;
    background_color?: string;
    text_color?: string;
}

export interface Service {
    id: string;
    name: string;
    slug: string;
    description?: string;
    short_description?: string;
    icon?: string;
    image_url?: string;
    features?: Array<{ title: string; description: string }>;
    starting_price?: number;
    price_display?: string;
    is_featured: boolean;
    is_active: boolean;
    display_order: number;
    cta_text: string;
    cta_url?: string;
}

export interface Testimonial {
    id: string;
    name: string;
    position?: string;
    company?: string;
    avatar_url?: string;
    content: string;
    rating?: number;
    is_featured: boolean;
    is_active: boolean;
    display_order: number;
}

// =============================================
// SITE SETTINGS
// =============================================

export async function getSiteSettings(): Promise<SiteSettings | null> {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .single();

        if (error) {
            console.error('Error fetching site settings:', error);
            return null;
        }
        return data as SiteSettings;
    } catch (err) {
        console.error('Failed to fetch site settings:', err);
        return null;
    }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings | null> {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .update(settings)
            .select()
            .single();

        if (error) {
            console.error('Error updating site settings:', error);
            return null;
        }
        return data as SiteSettings;
    } catch (err) {
        console.error('Failed to update site settings:', err);
        return null;
    }
}

// =============================================
// NAVIGATION ITEMS
// =============================================

export async function getNavigationItems(): Promise<NavigationItem[]> {
    try {
        const { data, error } = await supabase
            .from('navigation_items')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching navigation items:', error);
            return [];
        }
        return (data as NavigationItem[]) || [];
    } catch (err) {
        console.error('Failed to fetch navigation items:', err);
        return [];
    }
}

export async function getAllNavigationItems(): Promise<NavigationItem[]> {
    try {
        const { data, error } = await supabase
            .from('navigation_items')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching all navigation items:', error);
            return [];
        }
        return (data as NavigationItem[]) || [];
    } catch (err) {
        console.error('Failed to fetch all navigation items:', err);
        return [];
    }
}

export async function createNavigationItem(item: Partial<NavigationItem>): Promise<NavigationItem | null> {
    try {
        const { data, error } = await supabase
            .from('navigation_items')
            .insert(item)
            .select()
            .single();

        if (error) {
            console.error('Error creating navigation item:', error);
            return null;
        }
        return data as NavigationItem;
    } catch (err) {
        console.error('Failed to create navigation item:', err);
        return null;
    }
}

export async function updateNavigationItem(id: string, item: Partial<NavigationItem>): Promise<NavigationItem | null> {
    try {
        const { data, error } = await supabase
            .from('navigation_items')
            .update(item)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating navigation item:', error);
            return null;
        }
        return data as NavigationItem;
    } catch (err) {
        console.error('Failed to update navigation item:', err);
        return null;
    }
}

export async function deleteNavigationItem(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('navigation_items')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting navigation item:', error);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Failed to delete navigation item:', err);
        return false;
    }
}

// =============================================
// CONTENT SECTIONS
// =============================================

export async function getActiveContentSections(): Promise<ContentSection[]> {
    try {
        const { data, error } = await supabase
            .from('content_sections')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching content sections:', error);
            return [];
        }
        return (data as ContentSection[]) || [];
    } catch (err) {
        console.error('Failed to fetch content sections:', err);
        return [];
    }
}

export async function getContentSection(key: string): Promise<ContentSection | null> {
    try {
        const { data, error } = await supabase
            .from('content_sections')
            .select('*')
            .eq('section_key', key)
            .single();

        if (error) {
            console.error('Error fetching content section:', error);
            return null;
        }
        return data as ContentSection;
    } catch (err) {
        console.error('Failed to fetch content section:', err);
        return null;
    }
}

export async function getAllContentSections(): Promise<ContentSection[]> {
    try {
        const { data, error } = await supabase
            .from('content_sections')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching all content sections:', error);
            return [];
        }
        return (data as ContentSection[]) || [];
    } catch (err) {
        console.error('Failed to fetch all content sections:', err);
        return [];
    }
}

export async function updateContentSection(id: string, section: Partial<ContentSection>): Promise<ContentSection | null> {
    try {
        const { data, error } = await supabase
            .from('content_sections')
            .update(section)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating content section:', error);
            return null;
        }
        return data as ContentSection;
    } catch (err) {
        console.error('Failed to update content section:', err);
        return null;
    }
}

// =============================================
// SERVICES
// =============================================

export async function getActiveServices(): Promise<Service[]> {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching services:', error);
            return [];
        }
        return (data as Service[]) || [];
    } catch (err) {
        console.error('Failed to fetch services:', err);
        return [];
    }
}

export async function getAllServices(): Promise<Service[]> {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching all services:', error);
            return [];
        }
        return (data as Service[]) || [];
    } catch (err) {
        console.error('Failed to fetch all services:', err);
        return [];
    }
}

export async function createService(service: Partial<Service>): Promise<Service | null> {
    try {
        const { data, error } = await supabase
            .from('services')
            .insert(service)
            .select()
            .single();

        if (error) {
            console.error('Error creating service:', error);
            return null;
        }
        return data as Service;
    } catch (err) {
        console.error('Failed to create service:', err);
        return null;
    }
}

export async function updateService(id: string, service: Partial<Service>): Promise<Service | null> {
    try {
        const { data, error } = await supabase
            .from('services')
            .update(service)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating service:', error);
            return null;
        }
        return data as Service;
    } catch (err) {
        console.error('Failed to update service:', err);
        return null;
    }
}

export async function deleteService(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting service:', error);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Failed to delete service:', err);
        return false;
    }
}

// =============================================
// TESTIMONIALS
// =============================================

export async function getActiveTestimonials(): Promise<Testimonial[]> {
    try {
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching testimonials:', error);
            return [];
        }
        return (data as Testimonial[]) || [];
    } catch (err) {
        console.error('Failed to fetch testimonials:', err);
        return [];
    }
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
    try {
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching all testimonials:', error);
            return [];
        }
        return (data as Testimonial[]) || [];
    } catch (err) {
        console.error('Failed to fetch all testimonials:', err);
        return [];
    }
}

export async function createTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial | null> {
    try {
        const { data, error } = await supabase
            .from('testimonials')
            .insert(testimonial)
            .select()
            .single();

        if (error) {
            console.error('Error creating testimonial:', error);
            return null;
        }
        return data as Testimonial;
    } catch (err) {
        console.error('Failed to create testimonial:', err);
        return null;
    }
}

export async function updateTestimonial(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial | null> {
    try {
        const { data, error } = await supabase
            .from('testimonials')
            .update(testimonial)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating testimonial:', error);
            return null;
        }
        return data as Testimonial;
    } catch (err) {
        console.error('Failed to update testimonial:', err);
        return null;
    }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting testimonial:', error);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Failed to delete testimonial:', err);
        return false;
    }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Generate URL-friendly slug from name
 */
export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}
