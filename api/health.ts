// Health check endpoint for Vercel deployment and backend verification

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: Request): Promise<Response> {
  const geminiConfigured = Boolean(
    process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY
  );

  const supabaseConfigured = Boolean(
    (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL) &&
    (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY)
  );

  return new Response(
    JSON.stringify({
      status: 'healthy',
      app: 'Msingi AZ-900 Prep',
      timestamp: new Date().toISOString(),
      integrations: {
        gemini: geminiConfigured ? 'configured' : 'missing_api_key (using offline grounded engine)',
        supabase: supabaseConfigured ? 'configured' : 'mock_mode_active',
      },
      environment: process.env.VERCEL_ENV || 'development',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

