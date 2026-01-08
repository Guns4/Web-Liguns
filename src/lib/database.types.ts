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
                    role?: 'admin' | 'talent' | 'user'
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
