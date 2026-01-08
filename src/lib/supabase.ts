import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});

// =============================================
// TYPE DEFINITIONS
// =============================================

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Job = Database['public']['Tables']['jobs']['Row'];
export type JobApplication = Database['public']['Tables']['job_applications']['Row'];
export type Attendance = Database['public']['Tables']['attendance']['Row'];
export type FinancialRecord = Database['public']['Tables']['financial_records']['Row'];
export type Gamification = Database['public']['Tables']['gamification']['Row'];
export type StoreItem = Database['public']['Tables']['store_items']['Row'];
export type StorePurchase = Database['public']['Tables']['store_purchases']['Row'];

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type JobInsert = Database['public']['Tables']['jobs']['Insert'];
export type ApplicationInsert = Database['public']['Tables']['job_applications']['Insert'];

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
export async function getUserProfile(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
    try {
        const profile = await getUserProfile(userId);
        return profile.role === 'admin';
    } catch {
        return false;
    }
}

/**
 * Get active jobs
 */
export async function getActiveJobs() {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Get job by ID with details
 */
export async function getJobById(id: string) {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
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
 * Calculate net salary for a user
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
    return data?.[0];
}

/**
 * Get financial records for a user
 */
export async function getUserFinancialRecords(
    userId: string,
    month?: number,
    year?: number
) {
    let query = supabase
        .from('financial_records')
        .select('*')
        .eq('user_id', userId);

    if (month && year) {
        query = query
            .eq('period_month', month)
            .eq('period_year', year);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Get user's performance ranking
 */
export async function getUserRanking(userId: string, month: number, year: number) {
    const { data, error } = await supabase
        .from('gamification')
        .select('*')
        .eq('user_id', userId)
        .eq('month', month)
        .eq('year', year)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Get top performers for leaderboard
 */
export async function getTopPerformers(month: number, year: number, limit = 10) {
    const { data, error } = await supabase
        .from('gamification')
        .select(`
      *,
      profiles (
        full_name,
        profile_photo
      )
    `)
        .eq('month', month)
        .eq('year', year)
        .order('rank_score', { ascending: false })
        .limit(limit);

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
 * Purchase store item
 */
export async function purchaseItem(
    userId: string,
    itemId: string,
    quantity: number
) {
    // First get the item details
    const { data: item, error: itemError } = await supabase
        .from('store_items')
        .select('price, stock')
        .eq('id', itemId)
        .single();

    if (itemError) throw itemError;

    const totalPrice = item.price * quantity;

    // Create purchase record
    const { data, error } = await supabase
        .from('store_purchases')
        .insert({
            user_id: userId,
            item_id: itemId,
            quantity,
            unit_price: item.price,
            total_price: totalPrice,
        })
        .select()
        .single();

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

/**
 * Mark attendance
 */
export async function markAttendance(
    userId: string,
    date: string,
    status: 'present' | 'sick' | 'alpha' | 'permit' | 'leave',
    checkInTime?: string,
    notes?: string
) {
    const { data, error } = await supabase
        .from('attendance')
        .upsert({
            user_id: userId,
            date,
            status,
            check_in_time: checkInTime,
            notes,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export default supabase;
