'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/database.types'

// =============================================
// TYPE DEFINITIONS
// =============================================

interface AuthContextType {
    user: User | null
    profile: Profile | null
    isLoading: boolean
    signOut: () => Promise<void>
    refreshProfile: () => Promise<void>
}

// =============================================
// CREATE CONTEXT
// =============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// =============================================
// AUTH PROVIDER COMPONENT
// =============================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                setUser(session?.user ?? null)

                if (session?.user) {
                    await fetchProfile(session.user.id)
                }
            } catch (error) {
                console.error('Error initializing auth:', error)
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth()

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event)

                setUser(session?.user ?? null)

                if (session?.user) {
                    // User logged in - fetch their profile
                    await fetchProfile(session.user.id)
                } else {
                    // User logged out - clear profile
                    setProfile(null)
                }

                setIsLoading(false)
            }
        )

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe()
        }
    }, [])

    /**
     * Fetch user profile from public.profiles table
     */
    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Error fetching profile:', error)
                setProfile(null)
                return
            }

            setProfile(data)
            console.log('Profile loaded:', {
                name: data.full_name,
                role: data.role,
                email: data.email
            })
        } catch (error) {
            console.error('Failed to fetch profile:', error)
            setProfile(null)
        }
    }

    /**
     * Sign out the current user
     */
    const signOut = async () => {
        try {
            setIsLoading(true)
            const { error } = await supabase.auth.signOut()

            if (error) {
                console.error('Error signing out:', error)
                throw error
            }

            // Clear state
            setUser(null)
            setProfile(null)
        } catch (error) {
            console.error('Failed to sign out:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Manually refresh the user's profile
     */
    const refreshProfile = async () => {
        if (user?.id) {
            await fetchProfile(user.id)
        }
    }

    const value: AuthContextType = {
        user,
        profile,
        isLoading,
        signOut,
        refreshProfile,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// =============================================
// CUSTOM HOOK
// =============================================

/**
 * Hook to access auth context
 * @throws Error if used outside of AuthProvider
 */
export function useAuth() {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}

// =============================================
// UTILITY HOOKS
// =============================================

/**
 * Hook to check if user is admin
 */
export function useIsAdmin() {
    const { profile } = useAuth()
    return profile?.role === 'admin'
}

/**
 * Hook to check if user is talent
 */
export function useIsTalent() {
    const { profile } = useAuth()
    return profile?.role === 'talent'
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth(redirectTo = '/login') {
    const { user, isLoading } = useAuth()

    useEffect(() => {
        if (!isLoading && !user) {
            // Redirect to login page
            if (typeof window !== 'undefined') {
                window.location.href = redirectTo
            }
        }
    }, [user, isLoading, redirectTo])

    return { user, isLoading }
}

/**
 * Hook to require admin role
 * Redirects to home if not admin
 */
export function useRequireAdmin(redirectTo = '/') {
    const { profile, isLoading } = useAuth()

    useEffect(() => {
        if (!isLoading && profile?.role !== 'admin') {
            // Redirect to home page
            if (typeof window !== 'undefined') {
                window.location.href = redirectTo
            }
        }
    }, [profile, isLoading, redirectTo])

    return { profile, isLoading }
}
