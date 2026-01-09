// =============================================
// LIGUNS ENTERTAINMENT - DATABASE TYPE DEFINITIONS
// Auto-generated from supabase/schema.sql
// =============================================

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    role: 'admin' | 'talent' | 'user'
                    full_name: string
                    email: string
                    phone: string | null
                    address: string | null
                    height: number | null
                    weight: number | null
                    photos: string[]
                    profile_photo: string | null
                    join_date: string
                    status: 'active' | 'contract' | 'interview' | 'inactive'
                    date_of_birth: string | null
                    gender: 'male' | 'female' | null
                    education: string | null
                    experience: string | null
                    bio: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    role: 'admin' | 'talent' | 'user'
                    full_name: string
                    email: string
                    phone?: string | null
                    address?: string | null
                    height?: number | null
                    weight?: number | null
                    photos?: string[]
                    profile_photo?: string | null
                    join_date?: string
                    status?: 'active' | 'contract' | 'interview' | 'inactive'
                    date_of_birth?: string | null
                    gender?: 'male' | 'female' | null
                    education?: string | null
                    experience?: string | null
                    bio?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    role?: 'admin' | 'talent' | 'user'
                    full_name?: string
                    email?: string
                    phone?: string | null
                    address?: string | null
                    height?: number | null
                    weight?: number | null
                    photos?: string[]
                    profile_photo?: string | null
                    join_date?: string
                    status?: 'active' | 'contract' | 'interview' | 'inactive'
                    date_of_birth?: string | null
                    gender?: 'male' | 'female' | null
                    education?: string | null
                    experience?: string | null
                    bio?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            jobs: {
                Row: {
                    id: string
                    title: string
                    category: 'LC' | 'Spa' | 'Model' | 'Entertainer' | 'Other'
                    salary_min: number | null
                    salary_max: number | null
                    salary_display: string | null
                    description: string
                    requirements: string | null
                    responsibilities: string | null
                    facilities: Json
                    location: string
                    city: string | null
                    province: string | null
                    map_url: string | null
                    image_url: string | null
                    gallery: string[]
                    is_active: boolean
                    slots_available: number
                    slots_filled: number
                    created_by: string | null
                    created_at: string
                    updated_at: string
                    deadline: string | null
                }
                Insert: {
                    id?: string
                    title: string
                    category: 'LC' | 'Spa' | 'Model' | 'Entertainer' | 'Other'
                    salary_min?: number | null
                    salary_max?: number | null
                    salary_display?: string | null
                    description: string
                    requirements?: string | null
                    responsibilities?: string | null
                    facilities?: Json
                    location: string
                    city?: string | null
                    province?: string | null
                    map_url?: string | null
                    image_url?: string | null
                    gallery?: string[]
                    is_active?: boolean
                    slots_available?: number
                    slots_filled?: number
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                    deadline?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    category?: 'LC' | 'Spa' | 'Model' | 'Entertainer' | 'Other'
                    salary_min?: number | null
                    salary_max?: number | null
                    salary_display?: string | null
                    description?: string
                    requirements?: string | null
                    responsibilities?: string | null
                    facilities?: Json
                    location?: string
                    city?: string | null
                    province?: string | null
                    map_url?: string | null
                    image_url?: string | null
                    gallery?: string[]
                    is_active?: boolean
                    slots_available?: number
                    slots_filled?: number
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                    deadline?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "jobs_created_by_fkey"
                        columns: ["created_by"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            job_applications: {
                Row: {
                    id: string
                    job_id: string
                    user_id: string
                    cover_letter: string | null
                    resume_url: string | null
                    additional_info: Json
                    status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected'
                    admin_notes: string | null
                    applied_at: string
                    reviewed_at: string | null
                    updated_at: string
                }
                Insert: {
                    id?: string
                    job_id: string
                    user_id: string
                    cover_letter?: string | null
                    resume_url?: string | null
                    additional_info?: Json
                    status?: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected'
                    admin_notes?: string | null
                    applied_at?: string
                    reviewed_at?: string | null
                    updated_at?: string
                }
                Update: {
                    id?: string
                    job_id?: string
                    user_id?: string
                    cover_letter?: string | null
                    resume_url?: string | null
                    additional_info?: Json
                    status?: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected'
                    admin_notes?: string | null
                    applied_at?: string
                    reviewed_at?: string | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "job_applications_job_id_fkey"
                        columns: ["job_id"]
                        referencedRelation: "jobs"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "job_applications_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            attendance: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    status: 'present' | 'sick' | 'alpha' | 'permit' | 'leave'
                    check_in_time: string | null
                    check_out_time: string | null
                    notes: string | null
                    approved_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date?: string
                    status: 'present' | 'sick' | 'alpha' | 'permit' | 'leave'
                    check_in_time?: string | null
                    check_out_time?: string | null
                    notes?: string | null
                    approved_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    status?: 'present' | 'sick' | 'alpha' | 'permit' | 'leave'
                    check_in_time?: string | null
                    check_out_time?: string | null
                    notes?: string | null
                    approved_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "attendance_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "attendance_approved_by_fkey"
                        columns: ["approved_by"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            financial_records: {
                Row: {
                    id: string
                    user_id: string
                    type: 'voucher_income' | 'bonus' | 'deduction_loan' | 'deduction_saving' | 'deduction_health' | 'deduction_store' | 'adjustment'
                    amount: number
                    description: string | null
                    reference_id: string | null
                    date: string
                    period_month: number | null
                    period_year: number | null
                    is_paid: boolean
                    paid_at: string | null
                    payment_method: string | null
                    created_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: 'voucher_income' | 'bonus' | 'deduction_loan' | 'deduction_saving' | 'deduction_health' | 'deduction_store' | 'adjustment'
                    amount: number
                    description?: string | null
                    reference_id?: string | null
                    date?: string
                    period_month?: number | null
                    period_year?: number | null
                    is_paid?: boolean
                    paid_at?: string | null
                    payment_method?: string | null
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: 'voucher_income' | 'bonus' | 'deduction_loan' | 'deduction_saving' | 'deduction_health' | 'deduction_store' | 'adjustment'
                    amount?: number
                    description?: string | null
                    reference_id?: string | null
                    date?: string
                    period_month?: number | null
                    period_year?: number | null
                    is_paid?: boolean
                    paid_at?: string | null
                    payment_method?: string | null
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "financial_records_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "financial_records_created_by_fkey"
                        columns: ["created_by"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            gamification: {
                Row: {
                    id: string
                    user_id: string
                    month: number
                    year: number
                    rank_score: number
                    attendance_score: number
                    performance_score: number
                    customer_rating: number
                    total_vouchers: number
                    total_hours: number
                    feedback_notes: string | null
                    achievements: Json
                    rank_position: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    month: number
                    year: number
                    rank_score?: number
                    attendance_score?: number
                    performance_score?: number
                    customer_rating?: number
                    total_vouchers?: number
                    total_hours?: number
                    feedback_notes?: string | null
                    achievements?: Json
                    rank_position?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    month?: number
                    year?: number
                    rank_score?: number
                    attendance_score?: number
                    performance_score?: number
                    customer_rating?: number
                    total_vouchers?: number
                    total_hours?: number
                    feedback_notes?: string | null
                    achievements?: Json
                    rank_position?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "gamification_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            store_items: {
                Row: {
                    id: string
                    name: string
                    category: 'pulsa' | 'fashion' | 'makeup' | 'accessories' | 'other' | null
                    description: string | null
                    price: number
                    image_url: string | null
                    stock: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    category?: 'pulsa' | 'fashion' | 'makeup' | 'accessories' | 'other' | null
                    description?: string | null
                    price: number
                    image_url?: string | null
                    stock?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    category?: 'pulsa' | 'fashion' | 'makeup' | 'accessories' | 'other' | null
                    description?: string | null
                    price?: number
                    image_url?: string | null
                    stock?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            store_purchases: {
                Row: {
                    id: string
                    user_id: string
                    item_id: string
                    quantity: number
                    unit_price: number
                    total_price: number
                    status: 'pending' | 'approved' | 'delivered' | 'cancelled'
                    deducted: boolean
                    financial_record_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    item_id: string
                    quantity?: number
                    unit_price: number
                    total_price: number
                    status?: 'pending' | 'approved' | 'delivered' | 'cancelled'
                    deducted?: boolean
                    financial_record_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    item_id?: string
                    quantity?: number
                    unit_price?: number
                    total_price?: number
                    status?: 'pending' | 'approved' | 'delivered' | 'cancelled'
                    deducted?: boolean
                    financial_record_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "store_purchases_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "store_purchases_item_id_fkey"
                        columns: ["item_id"]
                        referencedRelation: "store_items"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "store_purchases_financial_record_id_fkey"
                        columns: ["financial_record_id"]
                        referencedRelation: "financial_records"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            calculate_net_salary: {
                Args: {
                    p_user_id: string
                    p_month: number
                    p_year: number
                }
                Returns: {
                    total_income: number
                    total_deductions: number
                    net_salary: number
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// =============================================
// UTILITY TYPES FOR EASIER ACCESS
// =============================================

// Table row types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Job = Database['public']['Tables']['jobs']['Row']
export type JobApplication = Database['public']['Tables']['job_applications']['Row']
export type Attendance = Database['public']['Tables']['attendance']['Row']
export type FinancialRecord = Database['public']['Tables']['financial_records']['Row']
export type Gamification = Database['public']['Tables']['gamification']['Row']
export type StoreItem = Database['public']['Tables']['store_items']['Row']
export type StorePurchase = Database['public']['Tables']['store_purchases']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type JobInsert = Database['public']['Tables']['jobs']['Insert']
export type JobApplicationInsert = Database['public']['Tables']['job_applications']['Insert']
export type AttendanceInsert = Database['public']['Tables']['attendance']['Insert']
export type FinancialRecordInsert = Database['public']['Tables']['financial_records']['Insert']
export type GamificationInsert = Database['public']['Tables']['gamification']['Insert']
export type StoreItemInsert = Database['public']['Tables']['store_items']['Insert']
export type StorePurchaseInsert = Database['public']['Tables']['store_purchases']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type JobUpdate = Database['public']['Tables']['jobs']['Update']
export type JobApplicationUpdate = Database['public']['Tables']['job_applications']['Update']
export type AttendanceUpdate = Database['public']['Tables']['attendance']['Update']
export type FinancialRecordUpdate = Database['public']['Tables']['financial_records']['Update']
export type GamificationUpdate = Database['public']['Tables']['gamification']['Update']
export type StoreItemUpdate = Database['public']['Tables']['store_items']['Update']
export type StorePurchaseUpdate = Database['public']['Tables']['store_purchases']['Update']

// Enum types for stricter typing
export type UserRole = Profile['role']
export type UserStatus = Profile['status']
export type Gender = Profile['gender']
export type JobCategory = Job['category']
export type ApplicationStatus = JobApplication['status']
export type AttendanceStatus = Attendance['status']
export type FinancialRecordType = FinancialRecord['type']
export type StoreItemCategory = StoreItem['category']
export type PurchaseStatus = StorePurchase['status']
