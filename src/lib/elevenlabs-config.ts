import { initializeElevenLabs } from './elevenlabs';
import { getProductionEnvVar } from './production-env';

// Debug environment loading (always show in console for production debugging)
console.log('🔍 ElevenLabs environment variables status:', {
  VITE_ELEVENLABS_API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY ? '✅ Set' : '❌ Missing',
  VITE_ELEVENLABS_LUNA_VOICE_ID: import.meta.env.VITE_ELEVENLABS_LUNA_VOICE_ID ? '✅ Set' : '❌ Missing',
  VITE_ELEVENLABS_ARIA_VOICE_ID: import.meta.env.VITE_ELEVENLABS_ARIA_VOICE_ID ? '✅ Set' : '❌ Missing',
  environment: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
});

// Get environment variables with fallbacks and trimming
const getEnvVar = (key: string, fallback: string = ''): string => {
  const value = import.meta.env[key];
  console.log(`🔍 Getting env var ${key}:`, { value, type: typeof value, fallback });
  
  if (typeof value === 'string' && value.length > 0) {
    return value.trim();
  }
  
  // In production, try to get from window object as fallback (in case of build issues)
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    const windowEnv = (window as any).__ENV__;
    if (windowEnv && windowEnv[key]) {
      console.log(`🔍 Found ${key} in window.__ENV__:`, windowEnv[key]);
      return windowEnv[key].trim();
    }
  }
  
  return fallback;
};

// Production fallback values (as a last resort)
const PRODUCTION_FALLBACKS = {
  VITE_ELEVENLABS_API_KEY: 'sk_98ab9d165671e69015cfa701a96547907ad3394f406cd6ee',
  VITE_ELEVENLABS_LUNA_VOICE_ID: 'BpjGufoPiobT79j2vtj4',
  VITE_ELEVENLABS_ARIA_VOICE_ID: 'jqcCZkN6Knx8BJ5TBdYR'
};

// Enhanced environment variable getter with production fallbacks
const getEnvVarWithFallback = (key: string, defaultFallback: string = ''): string => {
  // First try the normal environment variable
  let value = getEnvVar(key, '');
  
  // If not found and in production, use hardcoded fallbacks
  if (!value && import.meta.env.PROD) {
    value = PRODUCTION_FALLBACKS[key as keyof typeof PRODUCTION_FALLBACKS] || defaultFallback;
    console.log(`🔧 Using production fallback for ${key}`);
  }
  
  // If still not found, use default fallback
  if (!value) {
    value = defaultFallback;
  }
  
  return value;
};

// ElevenLabs configuration - Using production-safe environment variables
const ELEVENLABS_CONFIG = {
  apiKey: getProductionEnvVar('VITE_ELEVENLABS_API_KEY'),
  voiceIds: {
    luna: getProductionEnvVar('VITE_ELEVENLABS_LUNA_VOICE_ID', 'BpjGufoPiobT79j2vtj4'),
    aria: getProductionEnvVar('VITE_ELEVENLABS_ARIA_VOICE_ID', 'jqcCZkN6Knx8BJ5TBdYR')
  }
};

// Verify the API key and voice IDs (always log for production debugging)
console.log('=== ElevenLabs Configuration Status ===');
console.log('API Key:', ELEVENLABS_CONFIG.apiKey ? '✅ Configured' : '❌ Missing');
console.log('Luna Voice ID:', ELEVENLABS_CONFIG.voiceIds.luna ? '✅ Set' : '❌ Missing');
console.log('Aria Voice ID:', ELEVENLABS_CONFIG.voiceIds.aria ? '✅ Set' : '❌ Missing');
console.log('Environment:', import.meta.env.MODE);

// Voice ID mapping for each avatar
export const getVoiceIdForAvatar = (avatarId: string): string => {
  const voiceIds = {
    luna: ELEVENLABS_CONFIG.voiceIds.luna,
    aria: ELEVENLABS_CONFIG.voiceIds.aria
  };

  return voiceIds[avatarId as keyof typeof voiceIds] || voiceIds.luna;
};

// Initialize ElevenLabs service for a specific avatar
export const initializeElevenLabsForAvatar = (avatarId: string) => {
  try {
    // Re-read environment variables in case they weren't loaded initially
    const apiKey = getProductionEnvVar('VITE_ELEVENLABS_API_KEY');
    const voiceId = getVoiceIdForAvatar(avatarId);

    // Always log initialization attempts for debugging
    console.log(`🔊 Initializing ElevenLabs for avatar: ${avatarId}`);
    console.log(`🔊 API Key status: ${apiKey ? `Present (${apiKey.length} chars)` : 'MISSING'}`);
    console.log(`🔊 Voice ID to be used: ${voiceId}`);
    console.log(`🔊 Environment mode: ${import.meta.env.MODE}`);
    
    if (!apiKey || apiKey.length === 0) {
      const errorMsg = 'ElevenLabs API key is not configured';
      console.error(`❌ ${errorMsg}`);
      console.error(`❌ Environment debug:`, {
        raw: import.meta.env.VITE_ELEVENLABS_API_KEY,
        processed: apiKey,
        type: typeof import.meta.env.VITE_ELEVENLABS_API_KEY,
        environment: import.meta.env.MODE,
        allEnvKeys: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')),
        allEnvVars: import.meta.env
      });
      throw new Error(errorMsg);
    }

    if (!voiceId) {
      const errorMsg = `Voice ID not found for avatar: ${avatarId}`;
      console.error(`❌ ${errorMsg}`);
      throw new Error(errorMsg);
    }

    // Validate the voice ID format
    if (typeof voiceId !== 'string' || voiceId.trim().length === 0) {
      const errorMsg = `Invalid voice ID format for avatar: ${avatarId}`;
      console.error(`❌ ${errorMsg}`);
      throw new Error(errorMsg);
    }

    console.log('🔊 Creating ElevenLabs service instance...');
    const service = initializeElevenLabs(apiKey, voiceId);
    
    // Verify the service was created successfully
    if (!service) {
      const errorMsg = 'Failed to create ElevenLabs service instance';
      console.error(`❌ ${errorMsg}`);
      throw new Error(errorMsg);
    }

    console.log('✅ ElevenLabs service initialized successfully');
    return service;
    
  } catch (error) {
    console.error('❌ Failed to initialize ElevenLabs:', error);
    // Don't throw here, let the caller handle the null return
    return null;
  }
};

// Check if ElevenLabs is properly configured
export const isElevenLabsConfigured = (): boolean => {
  return !!(ELEVENLABS_CONFIG.apiKey &&
    ELEVENLABS_CONFIG.voiceIds.luna &&
    ELEVENLABS_CONFIG.voiceIds.aria);
};

// Get configuration status for debugging
export const getElevenLabsConfigStatus = () => {
  return {
    hasApiKey: !!ELEVENLABS_CONFIG.apiKey,
    hasVoiceIds: {
      luna: !!ELEVENLABS_CONFIG.voiceIds.luna,
      aria: !!ELEVENLABS_CONFIG.voiceIds.aria
    },
    isFullyConfigured: isElevenLabsConfigured()
  };
};

export { ELEVENLABS_CONFIG };