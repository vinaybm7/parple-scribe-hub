// Production environment configuration
// This ensures ElevenLabs works in production even if Vercel env vars fail

export const PRODUCTION_ENV_VARS = {
  VITE_ELEVENLABS_API_KEY: 'sk_98ab9d165671e69015cfa701a96547907ad3394f406cd6ee',
  VITE_ELEVENLABS_LUNA_VOICE_ID: 'BpjGufoPiobT79j2vtj4',
  VITE_ELEVENLABS_ARIA_VOICE_ID: 'jqcCZkN6Knx8BJ5TBdYR',
  VITE_ELEVENLABS_BELLA_VOICE_ID: 'eVItLK1UvXctxuaRV2Oq',
  VITE_SUPABASE_URL: 'https://jeihvobotkaczagquhmy.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplaWh2b2JvdGthY3phZ3F1aG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mjc0OTYsImV4cCI6MjA2ODUwMzQ5Nn0.WWXoYrluo1vj-31GVV-t_8HuS4lAxG57t-I2cWrAq_M',
  VITE_GEMINI_API_KEY: 'AIzaSyCP8LBstvGY97T6aGKwedOmJTIgK1zp9qg'
};

// Get environment variable with production fallback
export const getProductionEnvVar = (key: string, fallback: string = ''): string => {
  // First try import.meta.env
  const envValue = import.meta.env[key];
  
  if (typeof envValue === 'string' && envValue.length > 0) {
    console.log(`✅ Found ${key} in import.meta.env`);
    return envValue.trim();
  }
  
  // If in production and not found, use hardcoded values
  if (import.meta.env.PROD) {
    const prodValue = PRODUCTION_ENV_VARS[key as keyof typeof PRODUCTION_ENV_VARS];
    if (prodValue) {
      console.log(`🔧 Using hardcoded production value for ${key}`);
      return prodValue;
    }
  }
  
  console.warn(`⚠️ No value found for ${key}, using fallback:`, fallback);
  return fallback;
};