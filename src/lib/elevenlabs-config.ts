import { initializeElevenLabs } from './elevenlabs';

// ElevenLabs configuration - Hardcoded values for reliability
const ELEVENLABS_CONFIG = {
  apiKey: 'sk_971ee974018db43973b8cf86d1f335df06eacc1d27b426bc',
  voiceIds: {
    luna: 'BpjGufoPiobT79j2vtj4',
    aria: 'jqcCZkN6Knx8BJ5TBdYR'
  }
};

// Verify the API key and voice IDs
console.log('=== ElevenLabs Configuration ===');
console.log('Using API Key:', ELEVENLABS_CONFIG.apiKey ? '*** (set)' : 'NOT SET');
console.log('Luna Voice ID:', ELEVENLABS_CONFIG.voiceIds.luna);
console.log('Aria Voice ID:', ELEVENLABS_CONFIG.voiceIds.aria);

// Debug logging with more details
console.log('=== ElevenLabs Config Debug ===');
console.log('Environment Variables:', {
  VITE_ELEVENLABS_API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY ? '*** (set)' : 'NOT SET',
  VITE_ELEVENLABS_LUNA_VOICE_ID: import.meta.env.VITE_ELEVENLABS_LUNA_VOICE_ID ? '*** (set)' : 'NOT SET',
  VITE_ELEVENLABS_ARIA_VOICE_ID: import.meta.env.VITE_ELEVENLABS_ARIA_VOICE_ID ? '*** (set)' : 'NOT SET'
});

console.log('ElevenLabs Config:', {
  hasApiKey: !!ELEVENLABS_CONFIG.apiKey,
  apiKeyStartsWith: ELEVENLABS_CONFIG.apiKey ? ELEVENLABS_CONFIG.apiKey.substring(0, 10) + '...' : 'N/A',
  apiKeyLength: ELEVENLABS_CONFIG.apiKey ? ELEVENLABS_CONFIG.apiKey.length : 0,
  voiceIds: {
    luna: !!ELEVENLABS_CONFIG.voiceIds.luna,
    aria: !!ELEVENLABS_CONFIG.voiceIds.aria
  }
});

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
    const apiKey = ELEVENLABS_CONFIG.apiKey;
    const voiceId = getVoiceIdForAvatar(avatarId);

    console.log(`🔊 Initializing ElevenLabs for avatar: ${avatarId}`);
    console.log(`🔊 Voice ID to be used: ${voiceId}`);
    
    if (!apiKey) {
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