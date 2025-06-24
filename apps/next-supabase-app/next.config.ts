import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // If using environment variables, they should be properly loaded
  // and not hardcoded here. For now, we'll use these example values
  // for development. In production, use proper environment variables.
  env: {
    // Replace these with your actual Supabase credentials
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-actual-project.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-actual-anon-key',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock_webhook_secret',
  },
};

export default nextConfig;
