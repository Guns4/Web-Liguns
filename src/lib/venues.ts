import { supabase } from './supabase';

// =============================================
// VENUE TYPE DEFINITIONS
// =============================================

export interface Venue {
    id: string;
    name: string;
    city: string;
    position: string;
    featured: boolean;
    status: 'active' | 'inactive';
    image_url?: string;
    logo_url?: string;
    slug?: string;
    detail_page_url?: string;
    metadata?: Record<string, any>;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface VenueInput {
    name: string;
    city: string;
    position: string;
    featured?: boolean;
    status?: 'active' | 'inactive';
    image_url?: string;
    logo_url?: string;
    slug?: string;
    detail_page_url?: string;
    metadata?: Record<string, any>;
    display_order?: number;
}

// =============================================
// VENUE HELPER FUNCTIONS
// =============================================

/**
 * Get all active venues for public display
 */
export async function getActiveVenues(): Promise<Venue[]> {
    try {
        const { data, error } = await supabase
            .from('venues')
            .select('*')
            .eq('status', 'active')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching active venues:', error);
            return [];
        }
        return (data as Venue[]) || [];
    } catch (err) {
        console.error('Failed to fetch active venues:', err);
        return [];
    }
}

/**
 * Get all venues (for admin panel)
 */
export async function getAllVenues(): Promise<Venue[]> {
    try {
        const { data, error } = await supabase
            .from('venues')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching all venues:', error);
            return [];
        }
        return (data as Venue[]) || [];
    } catch (err) {
        console.error('Failed to fetch all venues:', err);
        return [];
    }
}

/**
 * Get venues by city
 */
export async function getVenuesByCity(city: string): Promise<Venue[]> {
    try {
        const { data, error } = await supabase
            .from('venues')
            .select('*')
            .eq('status', 'active')
            .eq('city', city)
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching venues by city:', error);
            return [];
        }
        return (data as Venue[]) || [];
    } catch (err) {
        console.error('Failed to fetch venues by city:', err);
        return [];
    }
}

/**
 * Get a single venue by slug
 */
export async function getVenueBySlug(slug: string): Promise<Venue | null> {
    try {
        const { data, error } = await supabase
            .from('venues')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'active')
            .single();

        if (error) {
            console.error('Error fetching venue by slug:', error);
            return null;
        }
        return data as Venue;
    } catch (err) {
        console.error('Failed to fetch venue by slug:', err);
        return null;
    }
}

/**
 * Get a single venue by ID
 */
export async function getVenueById(id: string): Promise<Venue | null> {
    try {
        const { data, error } = await supabase
            .from('venues')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching venue by ID:', error);
            return null;
        }
        return data as Venue;
    } catch (err) {
        console.error('Failed to fetch venue by ID:', err);
        return null;
    }
}

/**
 * Create a new venue (admin only)
 */
export async function createVenue(venueData: VenueInput): Promise<Venue | null> {
    try {
        // Auto-generate slug if not provided
        const slug = venueData.slug || generateSlug(venueData.name);

        const { data, error } = await supabase
            .from('venues')
            .insert({
                ...venueData,
                slug,
                status: venueData.status || 'active',
                featured: venueData.featured || false,
                display_order: venueData.display_order || 0
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating venue:', error);
            return null;
        }
        return data as Venue;
    } catch (err) {
        console.error('Failed to create venue:', err);
        return null;
    }
}

/**
 * Update a venue (admin only)
 */
export async function updateVenue(id: string, venueData: Partial<VenueInput>): Promise<Venue | null> {
    try {
        const { data, error } = await supabase
            .from('venues')
            .update(venueData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating venue:', error);
            return null;
        }
        return data as Venue;
    } catch (err) {
        console.error('Failed to update venue:', err);
        return null;
    }
}

/**
 * Delete a venue (admin only)
 */
export async function deleteVenue(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('venues')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting venue:', error);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Failed to delete venue:', err);
        return false;
    }
}

/**
 * Upload venue image to Supabase Storage
 */
export async function uploadVenueImage(file: File, venueId: string): Promise<string | null> {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${venueId}-${Date.now()}.${fileExt}`;
        const filePath = `venues/${fileName}`;

        const { data, error } = await supabase.storage
            .from('images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Error uploading image:', error);
            return null;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (err) {
        console.error('Failed to upload venue image:', err);
        return null;
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

/**
 * Convert base64 image to File object
 */
export function base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}
