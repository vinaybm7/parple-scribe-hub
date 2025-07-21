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
  const [isListening, setIsListening] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: true,
    speed: 1.0,
    pitch: 1.1,
    volume: 0.8,
    useElevenLabs: true // Default to ElevenLabs for better quality
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

  // Check for browser support
  useEffect(() => {
    const speechSupported = 'speechSynthesis' in window;
    const recognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(speechSupported && recognitionSupported);

    // Check ElevenLabs support (requires API key and voice ID to be configured)
    try {
      const elevenLabsService = getElevenLabsService();
      setIsElevenLabsSupported(true);
    } catch (error) {
      setIsElevenLabsSupported(false);
      console.log('ElevenLabs not initialized, falling back to browser TTS');
    }

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
    if (!voiceSettings.enabled || !text.trim()) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();
    setIsSpeaking(true);
    onStart?.();

    try {
      // Use ElevenLabs if enabled and supported
      if (voiceSettings.useElevenLabs && isElevenLabsSupported) {
        const elevenLabsService = getElevenLabsService();
        
        // Convert text to speech using ElevenLabs
        const audioBuffer = await elevenLabsService.textToSpeech(text, {
          stability: elevenLabsSettings.stability,
          similarity_boost: elevenLabsSettings.similarity_boost,
          style: elevenLabsSettings.style,
          use_speaker_boost: elevenLabsSettings.use_speaker_boost
        });

        // Play the audio
        await elevenLabsService.playAudio(
          audioBuffer,
          () => {
            // Audio started playing (already called onStart above)
          },
          () => {
            setIsSpeaking(false);
            onEnd?.();
          }
        );
      } else {
        // Fallback to browser TTS
        if (!isSupported) {
          console.warn('Browser TTS not supported');
          setIsSpeaking(false);
          onEnd?.();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = voiceSettings.speed;
        utterance.pitch = voiceSettings.pitch;
        utterance.volume = voiceSettings.volume;

        utterance.onend = () => {
          setIsSpeaking(false);
          onEnd?.();
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event.error);
          setIsSpeaking(false);
          onEnd?.();
        };

        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsSpeaking(false);
      onEnd?.();
      
      // Fallback to browser TTS on ElevenLabs error
      if (voiceSettings.useElevenLabs && isSupported) {
        console.log('Falling back to browser TTS due to ElevenLabs error');
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = voiceSettings.speed;
        utterance.pitch = voiceSettings.pitch;
        utterance.volume = voiceSettings.volume;

        utterance.onend = () => {
          setIsSpeaking(false);
          onEnd?.();
        };

        utterance.onerror = (event) => {
          console.error('Fallback speech synthesis error:', event.error);
          setIsSpeaking(false);
          onEnd?.();
        };

        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
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