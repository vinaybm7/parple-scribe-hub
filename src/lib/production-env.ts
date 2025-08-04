// SECURITY: API keys should NEVER be hardcoded in source code
// This file has been secured - all sensitive data moved to environment variables

// ElevenLabs API Key Pool - Now uses environment variables only
export const ELEVENLABS_API_KEY_POOL: string[] = [];

// Production environment configuration - SECURED
// All sensitive data must be provided via environment variables
export const PRODUCTION_ENV_VARS = {
  // These are now placeholders - actual values must come from environment
  VITE_ELEVENLABS_API_KEY: '',
  VITE_ELEVENLABS_LUNA_VOICE_ID: '',
  VITE_ELEVENLABS_ARIA_VOICE_ID: '',
  VITE_ELEVENLABS_BELLA_VOICE_ID: '',
  VITE_SUPABASE_URL: '',
  VITE_SUPABASE_ANON_KEY: '',
  VITE_GEMINI_API_KEY: ''
};

// Track failed API keys to avoid retrying them
const failedApiKeys = new Set<string>();

// Clear failed keys on startup to ensure new key is used
failedApiKeys.clear();

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

// Get the next available API key from environment variables only
export const getAvailableElevenLabsApiKey = (): string => {
  // Only try environment variable - no hardcoded fallbacks
  const envKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (typeof envKey === 'string' && envKey.length > 0 && !failedApiKeys.has(envKey)) {
    return envKey.trim();
  }
  
  // No fallback to hardcoded keys - fail securely
  throw new Error('ElevenLabs API key not configured. Please set VITE_ELEVENLABS_API_KEY environment variable.');
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

// Check if all API keys are exhausted
export const areAllApiKeysExhausted = (): boolean => {
  return failedApiKeys.size >= ELEVENLABS_API_KEY_POOL.length;
};

// Get environment variable - SECURE VERSION (no hardcoded fallbacks)
export const getProductionEnvVar = (key: string, fallback: string = ''): string => {
  // Special handling for ElevenLabs API key
  if (key === 'VITE_ELEVENLABS_API_KEY') {
    try {
      return getAvailableElevenLabsApiKey();
    } catch (error) {
      if (fallback) return fallback;
      throw error;
    }
  }
  
  // Only try import.meta.env - no hardcoded fallbacks
  const envValue = import.meta.env[key];
  
  if (typeof envValue === 'string' && envValue.length > 0) {
    return envValue.trim();
  }
  
  // Use fallback if provided, otherwise throw error for required vars
  if (fallback) {
    return fallback;
  }
  
  throw new Error(`Required environment variable ${key} is not configured`);
};