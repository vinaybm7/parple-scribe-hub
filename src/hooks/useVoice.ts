import { useState, useCallback, useRef, useEffect } from 'react';

interface VoiceSettings {
  enabled: boolean;
  speed: number;
  pitch: number;
  volume: number;
}

interface SpeechRecognitionSettings {
  enabled: boolean;
  language: string;
  continuous: boolean;
}

export const useVoice = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: true,
    speed: 1.0,
    pitch: 1.1,
    volume: 0.8
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

  // Text-to-speech function
  const speak = useCallback((text: string, onStart?: () => void, onEnd?: () => void) => {
    if (!isSupported || !voiceSettings.enabled || !text.trim()) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceSettings.speed;
    utterance.pitch = voiceSettings.pitch;
    utterance.volume = voiceSettings.volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      onStart?.();
    };

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
  }, [isSupported, voiceSettings]);

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

  return {
    isSupported,
    isSpeaking,
    isListening,
    voiceSettings,
    speechSettings,
    speak,
    startListening,
    stopListening,
    stopSpeaking,
    updateVoiceSettings,
    updateSpeechSettings
  };
};