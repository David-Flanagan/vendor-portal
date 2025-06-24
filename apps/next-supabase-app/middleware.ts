import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client configured for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          req.cookies.set({
            name,
            value,
            ...options,
          });

          // Update the response cookies
          const newCookie = req.cookies.get(name);
          if (newCookie) {
            res.cookies.set({
              name,
              value: newCookie.value,
              ...options,
            });
          }
        },
        remove(name: string, options) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });

          // Update the response cookies
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession();

  // Handle auth redirection
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/invoices'];

  // Auth routes that should redirect to dashboard if already logged in
  const authRoutes = ['/signin', '/signup'];

  // Check if the path starts with any protected route
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.some(route => path === route);

  if (isProtectedRoute && !session) {
    // Redirect to signin if trying to access protected route without a session
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  } else if (isAuthRoute && session) {
    // Redirect to dashboard if trying to access auth routes with a session
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return res;
}

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};