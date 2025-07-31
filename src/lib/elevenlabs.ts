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
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private currentAnimationFrame: number | null = null;

  constructor(config: ElevenLabsConfig) {
    this.config = config;
  }

  /**
   * Get or create AudioContext singleton
   */
  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Resume context if it's suspended (required by some browsers)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    return this.audioContext;
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

    // Ensure text is properly formatted and not too long
    const processedText = text.trim().substring(0, 5000); // Limit text length
    
    const requestBody = {
      text: processedText,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        ...defaultSettings,
        ...voiceSettings
      }
    };

    try {
      console.log('🔊 ElevenLabs: Making TTS API request...');
      console.log('🔊 Voice ID:', this.config.voiceId);
      console.log('🔊 Text length:', processedText.length);
      
      // Log request details without sensitive data
      const loggableBody = {
        ...requestBody,
        text: processedText.length > 50 
          ? `${processedText.substring(0, 50)}... (${processedText.length} chars)` 
          : processedText
      };
      console.log('🔊 Request details:', JSON.stringify(loggableBody, null, 2));

      const endpoint = `${this.baseUrl}/text-to-speech/${encodeURIComponent(this.config.voiceId)}`;
      console.log('🔊 API Endpoint:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.config.apiKey,
          'User-Agent': 'ParpleScribeHub/1.0'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('🔊 ElevenLabs API response status:', response.status);
      
      if (!response.ok) {
        let errorDetails = '';
        let errorData: any = null;
        
        try {
          errorData = await response.json();
          errorDetails = JSON.stringify(errorData, null, 2);
        } catch (e) {
          errorDetails = await response.text();
        }
        
        console.error('🔊 ElevenLabs API error:', {
          status: response.status,
          statusText: response.statusText,
          details: errorDetails,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        // Handle quota exceeded specifically
        if (response.status === 401 && errorData?.detail?.status === 'quota_exceeded') {
          const quotaError = new Error(`ElevenLabs quota exceeded. ${errorData.detail.message || 'Please add more credits or try again later.'}`);
          (quotaError as any).isQuotaExceeded = true;
          throw quotaError;
        }
        
        throw new Error(`ElevenLabs API error (${response.status}): ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('Received empty audio response from ElevenLabs');
      }
      
      console.log('🔊 ElevenLabs: Received audio buffer, size:', arrayBuffer.byteLength, 'bytes');
      return arrayBuffer;
    } catch (error) {
      console.error('🔊 ElevenLabs TTS Error:', error);
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
   * Stop any currently playing audio
   */
  stopAudio(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch (error) {
        // Source might already be stopped
        console.log('Audio source already stopped');
      }
      this.currentSource = null;
    }
    
    if (this.currentAnimationFrame) {
      cancelAnimationFrame(this.currentAnimationFrame);
      this.currentAnimationFrame = null;
    }
  }

  /**
   * Play audio from ArrayBuffer with real-time audio analysis
   * @param audioBuffer - Audio data as ArrayBuffer
   * @param onStart - Callback when audio starts playing
   * @param onEnd - Callback when audio ends
   * @param onVoiceActivity - Callback with voice activity level (0-1)
   * @returns Promise<void>
   */
  async playAudio(
    audioBuffer: ArrayBuffer,
    onStart?: () => void,
    onEnd?: () => void,
    onVoiceActivity?: (isActive: boolean, level: number) => void
  ): Promise<void> {
    try {
      console.log('🔊 ElevenLabs: Starting audio playback...');
      
      // Stop any currently playing audio
      this.stopAudio();
      
      // Get audio context
      const audioContext = this.getAudioContext();
      console.log('🔊 AudioContext state:', audioContext.state);
      
      // Decode audio data
      console.log('🔊 Decoding audio data...');
      const audioBufferDecoded = await audioContext.decodeAudioData(audioBuffer.slice(0));
      console.log('🔊 Audio decoded successfully, duration:', audioBufferDecoded.duration, 'seconds');
      
      // Create audio source
      const source = audioContext.createBufferSource();
      source.buffer = audioBufferDecoded;
      
      // Create analyzer node for real-time audio analysis
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      
      // Connect audio graph: source -> analyser -> destination
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      // Store reference to current source
      this.currentSource = source;
      
      // Enhanced audio analysis for precise voice activity detection with longer duration
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let lastActiveTime = 0;
      let audioStartTime = Date.now();
      const SILENCE_THRESHOLD = 800; // Increased to 800ms of silence before considering inactive
      const MIN_ANIMATION_DURATION = 1500; // Minimum 1.5s animation duration
      
      const analyzeAudio = () => {
        if (!this.currentSource) return;
        
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate RMS (Root Mean Square) for more accurate voice detection
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);
        
        // Normalize to 0-1 range with better scaling
        const level = Math.min(rms / 128, 1.0); // Scale RMS to 0-1
        
        // Enhanced voice activity detection with longer hysteresis
        const threshold = 0.012; // Slightly lower threshold for better detection
        const currentTime = Date.now();
        const timeSinceStart = currentTime - audioStartTime;
        
        if (level > threshold) {
          lastActiveTime = currentTime;
        }
        
        // Extended logic: stay active longer and ensure minimum animation duration
        const timeSinceLastActive = currentTime - lastActiveTime;
        const isActive = timeSinceLastActive < SILENCE_THRESHOLD || timeSinceStart < MIN_ANIMATION_DURATION;
        
        // Provide more consistent level for better animation
        const adjustedLevel = isActive ? Math.max(level, 0.3) : level;
        
        // Call voice activity callback with enhanced data
        onVoiceActivity?.(isActive, adjustedLevel);
        
        // Continue analysis at 60fps for smooth animation
        this.currentAnimationFrame = requestAnimationFrame(analyzeAudio);
      };
      
      // Set up event listeners
      source.onended = () => {
        console.log('🔊 Audio playback completed');
        if (this.currentAnimationFrame) {
          cancelAnimationFrame(this.currentAnimationFrame);
          this.currentAnimationFrame = null;
        }
        this.currentSource = null;
        onVoiceActivity?.(false, 0); // Ensure animation stops
        onEnd?.();
      };
      
      // Handle any errors during playback
      const handleError = () => {
        console.error('🔊 Audio playback error occurred');
        if (this.currentAnimationFrame) {
          cancelAnimationFrame(this.currentAnimationFrame);
          this.currentAnimationFrame = null;
        }
        this.currentSource = null;
        onVoiceActivity?.(false, 0);
        onEnd?.();
      };
      
      // Set a timeout to detect if playback fails to start
      const errorTimeout = setTimeout(() => {
        if (this.currentSource) {
          console.error('🔊 Playback start timed out');
          handleError();
        }
      }, 5000); // 5 second timeout
      
      // Start playback
      console.log('🔊 Starting audio playback...');
      source.start(0);
      
      // Start audio analysis
      analyzeAudio();
      
      // Call onStart immediately when audio actually starts playing
      // The audio analysis will handle the precise timing for orb animation
      onStart?.();
      
    } catch (error) {
      console.error('🔊 Error during audio playback:', error);
      this.currentSource = null;
      onVoiceActivity?.(false, 0);
      onEnd?.();
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

// Export singleton instance
let elevenLabsService: ElevenLabsService | null = null;

export function initializeElevenLabs(apiKey: string, voiceId: string): ElevenLabsService {
  console.log('🔄 Initializing ElevenLabs service...');
  console.log('🔑 API Key:', apiKey ? '*** (set)' : 'NOT SET');
  console.log('🗣️ Voice ID:', voiceId || 'NOT SET');
  
  if (!apiKey) {
    throw new Error('ElevenLabs API key is required');
  }
  
  if (!voiceId) {
    throw new Error('Voice ID is required');
  }
  
  elevenLabsService = new ElevenLabsService({ apiKey, voiceId });
  console.log('✅ ElevenLabs service initialized successfully');
  return elevenLabsService;
}

export function getElevenLabsService(): ElevenLabsService {
  if (!elevenLabsService) {
    throw new Error('ElevenLabs service not initialized. Call initializeElevenLabs first.');
  }
  return elevenLabsService;
}

// Helper function to check if ElevenLabs is properly configured
export function isElevenLabsReady(): boolean {
  try {
    const service = getElevenLabsService();
    return service !== null;
  } catch (error) {
    console.error('❌ ElevenLabs not ready:', error);
    return false;
  }
};

export { ElevenLabsService };
export type { ElevenLabsConfig, VoiceSettings, ElevenLabsVoice };