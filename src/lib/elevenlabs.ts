// ElevenLabs Text-to-Speech API Integration
// Documentation: https://docs.elevenlabs.io/api-reference/text-to-speech

interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
}

interface VoiceSettings {
  stability: number;        // 0.0 to 1.0 - Higher values make voice more stable/consistent
  similarity_boost: number; // 0.0 to 1.0 - Higher values make voice more similar to original
  style?: number;          // 0.0 to 1.0 - Style exaggeration (only for v2 models)
  use_speaker_boost?: boolean; // Boost speaker clarity
}

interface TextToSpeechRequest {
  text: string;
  model_id?: string;       // Default: "eleven_monolingual_v1"
  voice_settings?: VoiceSettings;
}

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  samples: any[];
  category: string;
  fine_tuning: {
    is_allowed_to_fine_tune: boolean;
    state: string;
  };
  labels: Record<string, string>;
  description: string;
  preview_url: string;
  available_for_tiers: string[];
  settings: VoiceSettings;
}

class ElevenLabsService {
  private config: ElevenLabsConfig;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(config: ElevenLabsConfig) {
    this.config = config;
  }

  /**
   * Convert text to speech using ElevenLabs API
   * @param text - Text to convert to speech
   * @param voiceSettings - Optional voice settings override
   * @returns Promise<ArrayBuffer> - Audio data as ArrayBuffer
   */
  async textToSpeech(
    text: string, 
    voiceSettings?: Partial<VoiceSettings>
  ): Promise<ArrayBuffer> {
    if (!this.config.apiKey) {
      throw new Error('ElevenLabs API key is required');
    }

    if (!this.config.voiceId) {
      throw new Error('Voice ID is required');
    }

    if (!text.trim()) {
      throw new Error('Text is required for speech synthesis');
    }

    // Default voice settings optimized for conversational AI
    const defaultSettings: VoiceSettings = {
      stability: 0.75,        // Balanced stability
      similarity_boost: 0.8,  // High similarity to original voice
      style: 0.5,            // Moderate style exaggeration
      use_speaker_boost: true // Enhanced clarity
    };

    const requestBody: TextToSpeechRequest = {
      text: text.trim(),
      model_id: "eleven_multilingual_v2", // Latest model with better quality
      voice_settings: {
        ...defaultSettings,
        ...voiceSettings
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${this.config.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.config.apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('ElevenLabs TTS Error:', error);
      throw error;
    }
  }

  /**
   * Get available voices from ElevenLabs
   * @returns Promise<ElevenLabsVoice[]> - Array of available voices
   */
  async getVoices(): Promise<ElevenLabsVoice[]> {
    if (!this.config.apiKey) {
      throw new Error('ElevenLabs API key is required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'xi-api-key': this.config.apiKey
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('ElevenLabs Get Voices Error:', error);
      throw error;
    }
  }

  /**
   * Get voice settings for a specific voice
   * @param voiceId - Voice ID to get settings for
   * @returns Promise<VoiceSettings> - Voice settings
   */
  async getVoiceSettings(voiceId?: string): Promise<VoiceSettings> {
    const targetVoiceId = voiceId || this.config.voiceId;
    
    if (!this.config.apiKey) {
      throw new Error('ElevenLabs API key is required');
    }

    if (!targetVoiceId) {
      throw new Error('Voice ID is required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices/${targetVoiceId}/settings`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'xi-api-key': this.config.apiKey
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('ElevenLabs Get Voice Settings Error:', error);
      throw error;
    }
  }

  /**
   * Play audio from ArrayBuffer
   * @param audioBuffer - Audio data as ArrayBuffer
   * @param onStart - Callback when audio starts playing
   * @param onEnd - Callback when audio ends
   * @returns Promise<void>
   */
  async playAudio(
    audioBuffer: ArrayBuffer,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Decode audio data
      const audioBufferDecoded = await audioContext.decodeAudioData(audioBuffer);
      
      // Create audio source
      const source = audioContext.createBufferSource();
      source.buffer = audioBufferDecoded;
      source.connect(audioContext.destination);
      
      // Set up event listeners
      source.onended = () => {
        onEnd?.();
      };
      
      // Start playing
      onStart?.();
      source.start(0);
      
    } catch (error) {
      console.error('Audio playback error:', error);
      throw error;
    }
  }

  /**
   * Update API configuration
   * @param newConfig - New configuration
   */
  updateConfig(newConfig: Partial<ElevenLabsConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance (will be configured with API key and voice ID)
let elevenLabsService: ElevenLabsService | null = null;

export const initializeElevenLabs = (apiKey: string, voiceId: string): ElevenLabsService => {
  elevenLabsService = new ElevenLabsService({ apiKey, voiceId });
  return elevenLabsService;
};

export const getElevenLabsService = (): ElevenLabsService => {
  if (!elevenLabsService) {
    throw new Error('ElevenLabs service not initialized. Call initializeElevenLabs first.');
  }
  return elevenLabsService;
};

export { ElevenLabsService };
export type { ElevenLabsConfig, VoiceSettings, ElevenLabsVoice };