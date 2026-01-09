import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // Get session
    const { data: { session } } = await supabase.auth.getSession()

    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isMemberRoute = request.nextUrl.pathname.startsWith('/member')
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')

    // If user is not logged in and trying to access protected routes
    if (!session && (isAdminRoute || isMemberRoute)) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
    }

    // If user is logged in
    if (session) {
        // Get user profile to check role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, status')
            .eq('id', session.user.id)
            .single()

        // If accessing admin routes, check if user is admin
        if (isAdminRoute && profile?.role !== 'admin') {
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/unauthorized'
            redirectUrl.searchParams.set('reason', 'admin_only')
            return NextResponse.redirect(redirectUrl)
        }

        // Optional: Redirect inactive users
        if ((isAdminRoute || isMemberRoute) && profile?.status === 'inactive') {
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/account-inactive'
            return NextResponse.redirect(redirectUrl)
        }

        // If user is already logged in and trying to access auth routes, redirect to appropriate dashboard
        if (isAuthRoute) {
            const redirectUrl = request.nextUrl.clone()
            if (profile?.role === 'admin') {
                redirectUrl.pathname = '/admin'
            } else {
                redirectUrl.pathname = '/member'
            }
            return NextResponse.redirect(redirectUrl)
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
