'use client'

import { useAuth, useIsAdmin, useIsTalent } from '@/context/AuthContext'

/**
 * Example component showing how to use AuthContext
 * This component displays different content based on auth state and user role
 */
export default function AuthExample() {
    const { user, profile, isLoading, signOut } = useAuth()
    const isAdmin = useIsAdmin()
    const isTalent = useIsTalent()

    // Loading state
    if (isLoading) {
        return (
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
            </div>
        )
    }

    // Not authenticated
    if (!user || !profile) {
        return (
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Not Authenticated
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Please login to see your profile information.
                </p>
                <div className="space-x-4">
                    <a
                        href="/login"
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-block"
                    >
                        Login
                    </a>
                    <a
                        href="/register"
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors inline-block"
                    >
                        Register
                    </a>
                </div>
            </div>
        )
    }

    // Authenticated - show profile
    return (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                        Welcome Back!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        You are successfully authenticated
                    </p>
                </div>
                <button
                    onClick={signOut}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Logout
                </button>
            </div>

            {/* Profile Information */}
            <div className="space-y-4 mb-6">
                <ProfileField label="Full Name" value={profile.full_name} />
                <ProfileField label="Email" value={profile.email} />
                <ProfileField label="Phone" value={profile.phone || 'Not set'} />

                {/* Role Badge */}
                <div className="flex items-center gap-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Role:</span>
                    <RoleBadge role={profile.role} />
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Status:</span>
                    <StatusBadge status={profile.status} />
                </div>

                {profile.date_of_birth && (
                    <ProfileField label="Date of Birth" value={profile.date_of_birth} />
                )}

                {profile.bio && (
                    <div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium block mb-1">Bio:</span>
                        <p className="text-gray-600 dark:text-gray-400">{profile.bio}</p>
                    </div>
                )}
            </div>

            {/* Role-specific sections */}
            {isAdmin && (
                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                        🔑 Admin Access
                    </h3>
                    <p className="text-purple-700 dark:text-purple-300 mb-4">
                        You have administrator privileges.
                    </p>
                    <a
                        href="/admin"
                        className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Go to Admin Panel
                    </a>
                </div>
            )}

            {isTalent && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        ⭐ Talent Dashboard
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300 mb-4">
                        Access your talent dashboard and manage your profile.
                    </p>
                    <a
                        href="/member"
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Dashboard
                    </a>
                </div>
            )}

            {/* Debug Information (only in development) */}
            {process.env.NODE_ENV === 'development' && (
                <details className="mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                    <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white mb-2">
                        Debug Information
                    </summary>
                    <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
                        {JSON.stringify({ user, profile }, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    )
}

// Helper Components

function ProfileField({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">{label}:</span>
            <span className="ml-2 text-gray-900 dark:text-white">{value}</span>
        </div>
    )
}

function RoleBadge({ role }: { role: string }) {
    const colors = {
        admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        talent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        user: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    }

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[role as keyof typeof colors]}`}>
            {role.toUpperCase()}
        </span>
    )
}

function StatusBadge({ status }: { status: string }) {
    const colors = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        contract: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        interview: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    }

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status as keyof typeof colors]}`}>
            {status.toUpperCase()}
        </span>
    )
}
