import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export function createClient(cookieStore?: any) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return (cookieStore || cookies()).get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            (cookieStore || cookies()).set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            (cookieStore || cookies()).set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// Service role client for admin operations
export function createServiceClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get() { return undefined; },
        set() {},
        remove() {},
      },
    }
  );
}

// Function specifically for API routes with additional debugging
export const createAPISupabaseClient = async () => {
  const cookieStore = await cookies();

  // For debugging - check if auth cookies exist
  const sbAccessToken = cookieStore.get('sb-access-token');
  const sbRefreshToken = cookieStore.get('sb-refresh-token');
  console.log('Auth cookies present:', {
    accessToken: !!sbAccessToken,
    refreshToken: !!sbRefreshToken
  });

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const cookie = cookieStore.get(name);
          if (cookie) console.log(`Cookie found: ${name}`);
          return cookie?.value;
        },
        set(name, value, options) {
          try {
            console.log(`Setting cookie: ${name}`);
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            console.error(`Error setting cookie ${name}:`, error);
          }
        },
        remove(name, options) {
          try {
            console.log(`Removing cookie: ${name}`);
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            console.error(`Error removing cookie ${name}:`, error);
          }
        },
      },
    }
  );
};