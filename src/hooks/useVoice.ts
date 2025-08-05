import { useState, useCallback, useRef, useEffect } from 'react';
import { getElevenLabsService } from '@/lib/elevenlabs';
import type { VoiceSettings as ElevenLabsVoiceSettings } from '@/lib/elevenlabs';

interface VoiceSettings {
  enabled: boolean;
  speed: number;
  pitch: number;
  volume: number;
  useElevenLabs: boolean; // Toggle between browser TTS and ElevenLabs
}

interface SpeechRecognitionSettings {
  enabled: boolean;
  language: string;
  continuous: boolean;
}

interface ElevenLabsSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

export const useVoice = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isElevenLabsSupported, setIsElevenLabsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false); // Real-time voice activity
  const [voiceLevel, setVoiceLevel] = useState(0); // Voice activity level (0-1)
  const [isListening, setIsListening] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: true,
    speed: 1.0,
    pitch: 1.1,
    volume: 0.8,
    useElevenLabs: true // Re-enabled with new API key
  });

  const [elevenLabsSettings, setElevenLabsSettings] = useState<ElevenLabsSettings>({
    stability: 0.75,
    similarity_boost: 0.8,
    style: 0.5,
    use_speaker_boost: true
  });
  
  const [speechSettings, setSpeechSettings] = useState<SpeechRecognitionSettings>({
    enabled: true,
    language: 'en-US',
    continuous: false
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check ElevenLabs support dynamically
  const checkElevenLabsSupport = useCallback(() => {
    console.log('🔍 Checking ElevenLabs support...');
    try {
      const elevenLabsService = getElevenLabsService();
      console.log('🔍 ElevenLabs service found:', !!elevenLabsService);
      if (elevenLabsService) {
        console.log('🔍 ElevenLabs service is available and ready');
        setIsElevenLabsSupported(true);
        return true;
      } else {
        console.log('🔍 ElevenLabs service is null');
        setIsElevenLabsSupported(false);
        return false;
      }
    } catch (error) {
      console.log('🔍 ElevenLabs not initialized, falling back to browser TTS:', error);
      setIsElevenLabsSupported(false);
      return false;
    }
  }, []);

  // Check for browser support
  useEffect(() => {
    const speechSupported = 'speechSynthesis' in window;
    const recognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(speechSupported && recognitionSupported);

    // Initial ElevenLabs check
    checkElevenLabsSupport();

    // Initialize speech recognition
    if (recognitionSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = speechSettings.continuous;
      recognition.interimResults = false;
      recognition.lang = speechSettings.language;
      
      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [speechSettings.continuous, speechSettings.language]);

  // Enhanced text-to-speech function with ElevenLabs support
  const speak = useCallback(async (text: string, onStart?: () => void, onEnd?: () => void) => {
    console.log('🎤 speak() called with text:', text.substring(0, 50) + '...');
    console.log('🎤 Voice settings:', { enabled: voiceSettings.enabled, useElevenLabs: voiceSettings.useElevenLabs });
    
    if (!voiceSettings.enabled || !text.trim()) {
      console.log('🎤 Voice disabled or empty text, skipping');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();
    // Don't set speaking state here - wait for actual audio to start

    // Dynamically check ElevenLabs support each time
    const elevenLabsAvailable = checkElevenLabsSupport();
    console.log('🎤 ElevenLabs check result:', elevenLabsAvailable);
    console.log('🎤 Voice settings useElevenLabs:', voiceSettings.useElevenLabs);

    try {
      // Use ElevenLabs if enabled and supported
      if (voiceSettings.useElevenLabs && elevenLabsAvailable) {
        console.log('🎤 Attempting to use ElevenLabs TTS...');
        
        console.log('🎤 Attempting to use ElevenLabs TTS...');
        const elevenLabsService = getElevenLabsService();
        
        console.log('🎤 Converting text to speech with ElevenLabs...');
        // Convert text to speech using ElevenLabs
        const audioBuffer = await elevenLabsService.textToSpeech(text, {
          stability: elevenLabsSettings.stability,
          similarity_boost: elevenLabsSettings.similarity_boost,
          style: elevenLabsSettings.style,
          use_speaker_boost: elevenLabsSettings.use_speaker_boost
        });

        console.log('🎤 Audio buffer received, size:', audioBuffer.byteLength, 'bytes');

        // Play the audio with enhanced voice activity detection for perfect orb sync
        await elevenLabsService.playAudio(
          audioBuffer,
          () => {
            console.log('🎤 🎙️ ElevenLabs audio playback started - orb should animate');
            setIsSpeaking(true);
            // Don't set isVoiceActive here - let the real-time analysis handle it
            onStart?.();
          },
          () => {
            console.log('🎤 🎙️ ElevenLabs audio playback completely finished - orb should stop');
            setIsSpeaking(false);
            setIsVoiceActive(false);
            setVoiceLevel(0);
            onEnd?.();
          },
          (isActive: boolean, level: number) => {
            // Real-time voice activity detection - this drives the orb animation
            setIsVoiceActive(isActive);
            setVoiceLevel(level);
            
            // Enhanced logging for debugging sync issues
            if (isActive && level > 0.1) {
              console.log('🎤 🎙️ Voice activity detected:', { isActive, level: level.toFixed(3) });
            }
          }
        );
      } else {
        console.log('🎤 Using browser TTS fallback');
        // Fallback to browser TTS
        if (!isSupported) {
          console.warn('🎤 Browser TTS not supported');
          setIsSpeaking(false);
          onEnd?.();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = voiceSettings.speed;
        utterance.pitch = voiceSettings.pitch;
        utterance.volume = voiceSettings.volume;

        utterance.onstart = () => {
          console.log('🎤 🎙️ Browser TTS started - orb should animate');
          setIsSpeaking(true);
          // For browser TTS, simulate voice activity since we can't analyze it
          setIsVoiceActive(true);
          setVoiceLevel(0.5); // Moderate level for browser TTS
          onStart?.();
        };

        utterance.onend = () => {
          console.log('🎤 🎙️ Browser TTS ended - orb should stop');
          // Add a delay before stopping the animation to ensure it matches speech duration
          setTimeout(() => {
            setIsSpeaking(false);
            setIsVoiceActive(false);
            setVoiceLevel(0);
            onEnd?.();
          }, 500); // 500ms delay to ensure animation continues slightly after speech ends
        };

        utterance.onerror = (event) => {
          console.error('🎤 Speech synthesis error:', event.error);
          setIsSpeaking(false);
          setIsVoiceActive(false);
          setVoiceLevel(0);
          onEnd?.();
        };

        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('🎤 Text-to-speech error:', error);
      setIsSpeaking(false);
      onEnd?.();
      
      // Check if it's a quota exceeded error
      if ((error as any)?.isQuotaExceeded) {
        console.warn('🎤 ElevenLabs quota exceeded, automatically falling back to browser TTS');
        // Show a user-friendly message
        if (typeof window !== 'undefined' && window.alert) {
          setTimeout(() => {
            alert('ElevenLabs voice credits have been exceeded. Falling back to browser voice for now. Please add more credits to continue using premium voices.');
          }, 100);
        }
      }
      
      // Fallback to browser TTS on ElevenLabs error
      if (voiceSettings.useElevenLabs && isSupported) {
        console.log('🎤 Falling back to browser TTS due to ElevenLabs error');
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = voiceSettings.speed;
          utterance.pitch = voiceSettings.pitch;
          utterance.volume = voiceSettings.volume;

          utterance.onstart = () => {
            console.log('🎤 🎙️ Fallback browser TTS started - orb should animate');
            setIsSpeaking(true);
            // For browser TTS, simulate voice activity since we can't analyze it
            setIsVoiceActive(true);
            setVoiceLevel(0.5); // Moderate level for fallback TTS
            onStart?.();
          };

          utterance.onend = () => {
            console.log('🎤 🎙️ Fallback browser TTS ended - orb should stop');
            // Add a delay before stopping the animation to ensure it matches speech duration
            setTimeout(() => {
              setIsSpeaking(false);
              setIsVoiceActive(false);
              setVoiceLevel(0);
              onEnd?.();
            }, 500); // 500ms delay to ensure animation continues slightly after speech ends
          };

          utterance.onerror = (event) => {
            console.error('🎤 Fallback speech synthesis error:', event.error);
            setIsSpeaking(false);
            setIsVoiceActive(false);
            setVoiceLevel(0);
            onEnd?.();
          };

          utteranceRef.current = utterance;
          speechSynthesis.speak(utterance);
        } catch (fallbackError) {
          console.error('🎤 Fallback TTS also failed:', fallbackError);
          setIsSpeaking(false);
          setIsVoiceActive(false);
          setVoiceLevel(0);
          onEnd?.();
        }
      }
    }
  }, [isSupported, isElevenLabsSupported, voiceSettings, elevenLabsSettings]);

  // Speech recognition function
  const startListening = useCallback((
    onResult: (transcript: string) => void,
    onError?: (error: string) => void
  ) => {
    if (!isSupported || !speechSettings.enabled || !recognitionRef.current) return;

    const recognition = recognitionRef.current;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      onError?.(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      onError?.('Failed to start speech recognition');
      setIsListening(false);
    }
  }, [isSupported, speechSettings.enabled]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsVoiceActive(false);
    setVoiceLevel(0);
  }, []);

  const updateVoiceSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setVoiceSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const updateSpeechSettings = useCallback((newSettings: Partial<SpeechRecognitionSettings>) => {
    setSpeechSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const updateElevenLabsSettings = useCallback((newSettings: Partial<ElevenLabsSettings>) => {
    setElevenLabsSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    isSupported,
    isElevenLabsSupported,
    isSpeaking,
    isVoiceActive, // Real-time voice activity
    voiceLevel, // Voice activity level
    isListening,
    voiceSettings,
    speechSettings,
    elevenLabsSettings,
    speak,
    startListening,
    stopListening,
    stopSpeaking,
    updateVoiceSettings,
    updateSpeechSettings,
    updateElevenLabsSettings
  };
};