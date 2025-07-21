import { initializeElevenLabs } from './elevenlabs';

// ElevenLabs configuration
const ELEVENLABS_CONFIG = {
  apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
  voiceIds: {
    bella: import.meta.env.VITE_ELEVENLABS_BELLA_VOICE_ID || '',
    luna: import.meta.env.VITE_ELEVENLABS_LUNA_VOICE_ID || '',
    aria: import.meta.env.VITE_ELEVENLABS_ARIA_VOICE_ID || ''
  }
};

// Voice ID mapping for each avatar
export const getVoiceIdForAvatar = (avatarId: string): string => {
  const voiceIds = {
    bella: ELEVENLABS_CONFIG.voiceIds.bella,
    luna: ELEVENLABS_CONFIG.voiceIds.luna,
    aria: ELEVENLABS_CONFIG.voiceIds.aria
  };

  return voiceIds[avatarId as keyof typeof voiceIds] || voiceIds.bella;
};

// Initialize ElevenLabs service for a specific avatar
export const initializeElevenLabsForAvatar = (avatarId: string) => {
  const apiKey = ELEVENLABS_CONFIG.apiKey;
  const voiceId = getVoiceIdForAvatar(avatarId);

  if (!apiKey) {
    console.warn('ElevenLabs API key not found in environment variables');
    return null;
  }

  if (!voiceId) {
    console.warn(`Voice ID not found for avatar: ${avatarId}`);
    return null;
  }

  try {
    return initializeElevenLabs(apiKey, voiceId);
  } catch (error) {
    console.error('Failed to initialize ElevenLabs:', error);
    return null;
  }
};

// Check if ElevenLabs is properly configured
export const isElevenLabsConfigured = (): boolean => {
  return !!(ELEVENLABS_CONFIG.apiKey && 
           ELEVENLABS_CONFIG.voiceIds.bella && 
           ELEVENLABS_CONFIG.voiceIds.luna && 
           ELEVENLABS_CONFIG.voiceIds.aria);
};

// Get configuration status for debugging
export const getElevenLabsConfigStatus = () => {
  return {
    hasApiKey: !!ELEVENLABS_CONFIG.apiKey,
    hasVoiceIds: {
      bella: !!ELEVENLABS_CONFIG.voiceIds.bella,
      luna: !!ELEVENLABS_CONFIG.voiceIds.luna,
      aria: !!ELEVENLABS_CONFIG.voiceIds.aria
    },
    isFullyConfigured: isElevenLabsConfigured()
  };
};

export { ELEVENLABS_CONFIG };