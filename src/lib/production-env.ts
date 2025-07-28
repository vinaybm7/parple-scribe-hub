// ElevenLabs API Key Pool - Add new keys here when credits run out
// The system will automatically try keys in order until one works
export const ELEVENLABS_API_KEY_POOL = [
  'sk_98ab9d165671e69015cfa701a96547907ad3394f406cd6ee', // Current key
  'sk_dabc8260f66a6c21d7b604737a77140154f76faeb432f53b', // Backup key 1
  'sk_7453981580c758ea5f89e7474a69a5fb2d0f84e80bfb4bfd', // Backup key 2
  'sk_5aa00e6ade7d0de9f7cb8be380e41f1ce1c1f78e9846446b', // Backup key 3
  // Add more API keys here when you get them:
  // 'sk_new_key_here_when_credits_run_out',
  // 'sk_another_backup_key_here',
];

// Production environment configuration
// This ensures ElevenLabs works in production even if Vercel env vars fail
export const PRODUCTION_ENV_VARS = {
  VITE_ELEVENLABS_API_KEY: ELEVENLABS_API_KEY_POOL[0], // Uses first available key
  VITE_ELEVENLABS_LUNA_VOICE_ID: 'BpjGufoPiobT79j2vtj4',
  VITE_ELEVENLABS_ARIA_VOICE_ID: 'jqcCZkN6Knx8BJ5TBdYR',
  VITE_ELEVENLABS_BELLA_VOICE_ID: 'eVItLK1UvXctxuaRV2Oq',
  VITE_SUPABASE_URL: 'https://jeihvobotkaczagquhmy.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplaWh2b2JvdGthY3phZ3F1aG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mjc0OTYsImV4cCI6MjA2ODUwMzQ5Nn0.WWXoYrluo1vj-31GVV-t_8HuS4lAxG57t-I2cWrAq_M',
  VITE_GEMINI_API_KEY: 'AIzaSyCP8LBstvGY97T6aGKwedOmJTIgK1zp9qg'
};

// Track failed API keys to avoid retrying them
const failedApiKeys = new Set<string>();

// Get the list of failed API keys (for admin interface)
export const getFailedApiKeys = (): string[] => {
  return Array.from(failedApiKeys);
};

// Get API key pool status (for admin interface)
export const getApiKeyPoolStatus = () => {
  return {
    totalKeys: ELEVENLABS_API_KEY_POOL.length,
    failedKeys: Array.from(failedApiKeys),
    currentKey: getAvailableElevenLabsApiKey(),
    allKeys: ELEVENLABS_API_KEY_POOL.map((key, index) => ({
      index: index + 1,
      key: key,
      preview: `${key.substring(0, 10)}...${key.substring(key.length - 4)}`,
      isFailed: failedApiKeys.has(key),
      isCurrent: key === getAvailableElevenLabsApiKey()
    }))
  };
};

// Get the next available API key from the pool
export const getAvailableElevenLabsApiKey = (): string => {
  // First try environment variable
  const envKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (typeof envKey === 'string' && envKey.length > 0 && !failedApiKeys.has(envKey)) {
    console.log('✅ Using ElevenLabs API key from environment');
    return envKey.trim();
  }
  
  // Try keys from the pool
  for (const apiKey of ELEVENLABS_API_KEY_POOL) {
    if (!failedApiKeys.has(apiKey)) {
      console.log(`🔧 Using ElevenLabs API key from pool (${apiKey.substring(0, 10)}...)`);
      return apiKey;
    }
  }
  
  console.error('❌ All ElevenLabs API keys have failed or run out of credits');
  return ELEVENLABS_API_KEY_POOL[0]; // Return first key as last resort
};

// Mark an API key as failed (out of credits or invalid)
export const markApiKeyAsFailed = (apiKey: string, reason: string = 'Unknown error') => {
  failedApiKeys.add(apiKey);
  console.warn(`⚠️ Marked ElevenLabs API key as failed: ${apiKey.substring(0, 10)}... (${reason})`);
  
  // If all keys are failed, reset the failed set (maybe credits were refilled)
  if (failedApiKeys.size >= ELEVENLABS_API_KEY_POOL.length) {
    console.log('🔄 All API keys failed, resetting failed keys list (maybe credits were refilled)');
    failedApiKeys.clear();
  }
};

// Get environment variable with production fallback
export const getProductionEnvVar = (key: string, fallback: string = ''): string => {
  // Special handling for ElevenLabs API key
  if (key === 'VITE_ELEVENLABS_API_KEY') {
    return getAvailableElevenLabsApiKey();
  }
  
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