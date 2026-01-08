import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client (will gracefully fail if not configured)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});

// =============================================
// TYPE DEFINITIONS (Manually typed for now)
// =============================================

export interface Job {
    id: string;
    title: string;
    category: 'LC' | 'Spa' | 'Model' | 'Entertainer' | 'Other';
    salary_min: number | null;
    salary_max: number | null;
    salary_display: string | null;
    description: string;
    requirements: string | null;
    responsibilities: string | null;
    facilities: Record<string, boolean> | null;
    location: string;
    city: string | null;
    province: string | null;
    map_url: string | null;
    image_url: string | null;
    gallery: string[];
    is_active: boolean;
    slots_available: number;
    slots_filled: number;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    deadline: string | null;
}

export interface Profile {
    id: string;
    role: 'admin' | 'talent' | 'user';
    full_name: string;
    email: string;
    phone: string | null;
    address: string | null;
    height: number | null;
    weight: number | null;
    photos: string[];
    profile_photo: string | null;
    join_date: string;
    status: 'active' | 'contract' | 'interview' | 'inactive';
    date_of_birth: string | null;
    gender: 'male' | 'female' | null;
    education: string | null;
    experience: string | null;
    bio: string | null;
    created_at: string;
    updated_at: string;
}

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Get current user session
 */
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
}

/**
 * Get user profile with role
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
    return data as Profile;
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
    try {
        const profile = await getUserProfile(userId);
        return profile?.role === 'admin' || false;
    } catch {
        return false;
    }
}

/**
 * Get active jobs
 */
export async function getActiveJobs(): Promise<Job[]> {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching jobs:', error);
            return [];
        }
        return (data as Job[]) || [];
    } catch (err) {
        console.error('Failed to fetch jobs:', err);
        return [];
    }
}

/**
 * Get job by ID with details
 */
export async function getJobById(id: string): Promise<Job | null> {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching job:', error);
            return null;
        }
        return data as Job;
    } catch (err) {
        console.error('Failed to fetch job:', err);
        return null;
    }
}

/**
 * Apply for a job
 */
export async function applyForJob(
    jobId: string,
    userId: string,
    coverLetter?: string,
    resumeUrl?: string
) {
    const { data, error } = await supabase
        .from('job_applications')
        .insert({
            job_id: jobId,
            user_id: userId,
            cover_letter: coverLetter,
            resume_url: resumeUrl,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Get user's applications
 */
export async function getUserApplications(userId: string) {
    const { data, error } = await supabase
        .from('job_applications')
        .select(`
      *,
      jobs (
        title,
        category,
        location,
        salary_display
      )
    `)
        .eq('user_id', userId)
        .order('applied_at', { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Get store items
 */
export async function getStoreItems(category?: string) {
    let query = supabase
        .from('store_items')
        .select('*')
        .eq('is_active', true);

    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;
    return data;
}

/**
 * Get attendance records
 */
export async function getAttendanceRecords(
    userId: string,
    startDate?: string,
    endDate?: string
) {
    let query = supabase
        .from('attendance')
        .select('*')
        .eq('user_id', userId);

    if (startDate) {
        query = query.gte('date', startDate);
    }

    if (endDate) {
        query = query.lte('date', endDate);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw error;
    return data;
}

export default supabase;
