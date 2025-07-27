import { initializeElevenLabs } from './elevenlabs';
import { getProductionEnvVar, markApiKeyAsFailed, getAvailableElevenLabsApiKey } from './production-env';

// Debug environment loading (always show in console for production debugging)
console.log('🔍 ElevenLabs environment variables status:', {
  VITE_ELEVENLABS_API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY ? '✅ Set' : '❌ Missing',
  VITE_ELEVENLABS_LUNA_VOICE_ID: import.meta.env.VITE_ELEVENLABS_LUNA_VOICE_ID ? '✅ Set' : '❌ Missing',
  VITE_ELEVENLABS_ARIA_VOICE_ID: import.meta.env.VITE_ELEVENLABS_ARIA_VOICE_ID ? '✅ Set' : '❌ Missing',
  environment: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
});

// Simplified approach - use the production environment helper directly

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

// Initialize ElevenLabs service for a specific avatar with automatic API key rotation
export const initializeElevenLabsForAvatar = (avatarId: string, retryCount: number = 0) => {
  try {
    // Get the next available API key
    const apiKey = getAvailableElevenLabsApiKey();
    const voiceId = getVoiceIdForAvatar(avatarId);

    // Always log initialization attempts for debugging
    console.log(`🔊 Initializing ElevenLabs for avatar: ${avatarId} (attempt ${retryCount + 1})`);
    console.log(`🔊 API Key status: ${apiKey ? `Present (${apiKey.substring(0, 10)}...)` : 'MISSING'}`);
    console.log(`🔊 Voice ID to be used: ${voiceId}`);
    console.log(`🔊 Environment mode: ${import.meta.env.MODE}`);
    
    if (!apiKey || apiKey.length === 0) {
      const errorMsg = 'ElevenLabs API key is not configured';
      console.error(`❌ ${errorMsg}`);
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
    
    // If this was an API key related error and we haven't retried too many times
    if (retryCount < 3 && error instanceof Error) {
      const apiKey = getAvailableElevenLabsApiKey();
      
      // Mark the current API key as failed if it looks like a quota/auth error
      if (error.message.includes('quota') || error.message.includes('credits') || 
          error.message.includes('unauthorized') || error.message.includes('401')) {
        markApiKeyAsFailed(apiKey, error.message);
        console.log(`🔄 Retrying with next available API key...`);
        return initializeElevenLabsForAvatar(avatarId, retryCount + 1);
      }
    }
    
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