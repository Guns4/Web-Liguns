import { createClient } from '@supabase/supabase-js';
import { Database, Profile, Job, JobApplication, Attendance, FinancialRecord, StoreItem } from './database.types';

// Export types for easier imports
export type { Database, Profile, Job, JobApplication, Attendance, FinancialRecord, StoreItem };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// =============================================
// SUPABASE CLIENT WITH FULL TYPE SAFETY
// =============================================

// Create Supabase client with Database types
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});

// Type-safe Supabase client
export type TypedSupabaseClient = typeof supabase;

// =============================================
// HELPER FUNCTIONS WITH TYPE SAFETY
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
    return data;
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
        return data || [];
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
        return data;
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
): Promise<JobApplication> {
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
 * Get user's applications with job details
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
 * Get store items with optional category filter
 */
export async function getStoreItems(category?: StoreItem['category']): Promise<StoreItem[]> {
    let query = supabase
        .from('store_items')
        .select('*')
        .eq('is_active', true);

    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;
    return data || [];
}

/**
 * Get attendance records for a user
 */
export async function getAttendanceRecords(
    userId: string,
    startDate?: string,
    endDate?: string
): Promise<Attendance[]> {
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
    return data || [];
}

/**
 * Get financial records for a user
 */
export async function getFinancialRecords(
    userId: string,
    month?: number,
    year?: number
): Promise<FinancialRecord[]> {
    let query = supabase
        .from('financial_records')
        .select('*')
        .eq('user_id', userId);

    if (month !== undefined) {
        query = query.eq('period_month', month);
    }

    if (year !== undefined) {
        query = query.eq('period_year', year);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw error;
    return data || [];
}

/**
 * Calculate net salary using database function
 */
export async function calculateNetSalary(
    userId: string,
    month: number,
    year: number
) {
    const { data, error } = await supabase.rpc('calculate_net_salary', {
        p_user_id: userId,
        p_month: month,
        p_year: year,
    });

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
}

export default supabase;
