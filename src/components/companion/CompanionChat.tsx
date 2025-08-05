import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Mic, MicOff, Volume2, VolumeX, Heart, Sparkles } from 'lucide-react';
import { useCompanion } from '@/hooks/useCompanion';
import { useVoice } from '@/hooks/useVoice';
import { initializeElevenLabsForAvatar } from '@/lib/elevenlabs-config';

interface CompanionChatProps {
  avatarId: string;
  onMoodChange: (mood: 'happy' | 'excited' | 'calm' | 'focused' | 'caring') => void;
  onTypingChange: (isTyping: boolean) => void;
  onSpeakingChange: (isSpeaking: boolean) => void;
  onVoiceLevelChange?: (level: number) => void;
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  mood?: string;
}

const CompanionChat = ({ avatarId, onMoodChange, onTypingChange, onSpeakingChange, onVoiceLevelChange }: CompanionChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const { sendMessage, isLoading, generateResponse } = useCompanion(avatarId);
  const { speak, isSpeaking, isVoiceActive, voiceLevel, isElevenLabsSupported, voiceSettings, updateVoiceSettings } = useVoice();
  
  // Initialize ElevenLabs service for the avatar
  useEffect(() => {
    console.log('🔊 Initializing ElevenLabs service for avatar:', avatarId);
    
    try {
      // Force update voice settings to ensure ElevenLabs is enabled
      updateVoiceSettings({
        ...voiceSettings,
        useElevenLabs: true,
        enabled: true
      });
      
      // Initialize the service
      const elevenLabsService = initializeElevenLabsForAvatar(avatarId);
      
      if (elevenLabsService) {
        console.log('✅ ElevenLabs service initialized successfully');
        console.log('🔊 Current voice settings:', voiceSettings);
      } else {
        console.warn('⚠️ Failed to initialize ElevenLabs service, falling back to browser TTS');
      }
    } catch (error) {
      console.error('❌ Error initializing ElevenLabs:', error);
    }
  }, [avatarId]);
  
  // Enhanced voice activity synchronization with parent component
  useEffect(() => {
    // Prioritize real-time voice activity over general speaking state for better sync
    // isVoiceActive is updated in real-time based on actual audio analysis
    // isSpeaking is the general state that audio is playing
    const isActuallySpeaking = isVoiceActive || isSpeaking;
    
    console.log('🎙️ Voice sync update:', {
      isVoiceActive,
      isSpeaking,
      finalState: isActuallySpeaking,
      voiceLevel
    });
    
    onSpeakingChange(isActuallySpeaking);
  }, [isVoiceActive, isSpeaking, onSpeakingChange, voiceLevel]);

  // Sync voice level with parent component
  useEffect(() => {
    onVoiceLevelChange?.(voiceLevel);
  }, [voiceLevel, onVoiceLevelChange]);

  // Initialize speech recognition with auto-stop functionality
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Configure for automatic stopping when user stops speaking
      recognition.continuous = false; // Don't continue listening indefinitely
      recognition.interimResults = true; // Show real-time results
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('🎤 Speech recognition started in companion');
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Update message with final transcript or show interim results
        if (finalTranscript) {
          setInputMessage(finalTranscript.trim());
          // Don't set isListening to false here - let onend handle it
        } else if (interimTranscript) {
          setInputMessage(interimTranscript.trim());
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error in companion:', event.error);
        setIsListening(false);
        
        // Handle specific errors
        if (event.error === 'no-speech') {
          console.log('No speech detected - auto-stopping');
          // Don't show error for no-speech, it's expected behavior
        } else if (event.error === 'audio-capture') {
          console.error('No microphone access');
        } else if (event.error === 'not-allowed') {
          console.error('Microphone access denied');
        }
      };

      recognition.onend = () => {
        console.log('🎤 Speech recognition ended automatically');
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setSpeechSupported(true);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);



  // Enhanced speakMessage function with perfect audio synchronization
  const speakMessage = async (text: string) => {
    console.log('💬 speakMessage called with:', text.substring(0, 50) + '...');
    console.log('💬 isSoundEnabled:', isSoundEnabled);
    
    if (!isSoundEnabled) {
      console.log('💬 Sound disabled, skipping speech');
      return;
    }
    
    try {
      console.log('💬 Calling speak function with enhanced sync...');
      
      // Pre-signal that speech is about to start
      const speechStartTime = Date.now();
      
      await speak(text, 
        () => {
          // On actual audio playback start - this is when the orb should start animating
          const actualStartTime = Date.now();
          const delay = actualStartTime - speechStartTime;
          console.log(`💬 🎙️ Audio playback started (delay: ${delay}ms)`);
          console.log('💬 🎙️ Orb animation should now be active');
          
          // The orb animation will automatically sync via the useEffect that monitors
          // isVoiceActive and isSpeaking states from the useVoice hook
        },
        () => {
          // On actual audio playback end - this is when the orb should stop animating
          console.log('💬 🎙️ Audio playback completely finished');
          console.log('💬 🎙️ Orb animation should now stop');
          
          // Ensure the orb animation stops by clearing voice activity
          // This is handled automatically by the ElevenLabs service's onEnd callback
          // which sets isVoiceActive to false and voiceLevel to 0
        }
      );
    } catch (error) {
      console.error('💬 Error speaking message:', error);
      // On error, ensure orb animation stops
      console.log('💬 🎙️ Speech error - ensuring orb animation stops');
    }
  };

  // Initial greeting - only once per session
  useEffect(() => {
    const sessionKey = `welcomeShown_${avatarId}`;
    const welcomeShown = sessionStorage.getItem(sessionKey);
    
    // If welcome was already shown in this session, don't show it again
    if (welcomeShown) {
      console.log('Welcome message already shown in this session');
      return;
    }

    const avatarNames = { luna: 'Luna', zyan: 'Zyan', aria: 'Aria' };
    const avatarName = avatarNames[avatarId as keyof typeof avatarNames] || 'Luna';
    
    const greetings = {
      luna: `Hey there! ✨ I'm ${avatarName}, your energetic study buddy! I'm super excited to help you tackle whatever challenges come your way. Ready to make today amazing together?`,
      zyan: `Hey gorgeous! 🔥 I'm ${avatarName}, and I'm absolutely PUMPED to meet you! Ready to set this world on FIRE together? Let's make studying the most exciting adventure ever! 💙⚡✨`,
      aria: `Hello, dear student. 🌙 I'm ${avatarName}, and I'm here to provide you with calm guidance and wisdom. Whether you need help with studies or just want to chat, I'm here for you.`
    };

    const initialMessage: Message = {
      id: '1',
      content: greetings[avatarId as keyof typeof greetings] || greetings.luna,
      isUser: false,
      timestamp: new Date(),
      mood: 'caring'
    };

    setMessages([initialMessage]);
    onMoodChange('caring');
    
    // Mark welcome as shown for this session
    sessionStorage.setItem(sessionKey, 'true');

    // Speak the initial greeting with ElevenLabs voice
    if (isSoundEnabled) {
      console.log('Playing welcome message with ElevenLabs');
      setTimeout(() => {
        speakMessage(initialMessage.content);
      }, 1000); // Delay to ensure ElevenLabs is initialized
    } else {
      console.log('Sound is disabled, not playing welcome message');
    }
  }, [avatarId, onMoodChange]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    onTypingChange(true);

    try {
      const response = await generateResponse(inputMessage, messages);
      
      setTimeout(() => {
        const companionMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.message,
          isUser: false,
          timestamp: new Date(),
          mood: response.mood
        };

        setMessages(prev => [...prev, companionMessage]);
        onMoodChange(response.mood as any);
        onTypingChange(false);

        // Text-to-speech if enabled
        console.log('💬 Response received, checking if should speak...');
        console.log('💬 isSoundEnabled:', isSoundEnabled);
        console.log('💬 Response message:', response.message.substring(0, 50) + '...');
        
        if (isSoundEnabled) {
          console.log('💬 Calling speakMessage for response...');
          speakMessage(response.message);
        } else {
          console.log('💬 Sound disabled, not speaking response');
        }
      }, 1000 + Math.random() * 1000); // Simulate typing delay
    } catch (error) {
      console.error('Error generating response:', error);
      onTypingChange(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current || !speechSupported) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        // Clear any existing message before starting
        setInputMessage('');
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition in companion:', error);
        setIsListening(false);
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };



  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-pink-500" />
          <span className="font-semibold">Companion Chat</span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Debug button to test ElevenLabs */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('Testing ElevenLabs...');
              console.log('isElevenLabsSupported:', isElevenLabsSupported);
              console.log('voiceSettings:', voiceSettings);
              speakMessage('Hello, this is a test of ElevenLabs voice synthesis.');
            }}
            className="p-2 text-xs"
            title="Test ElevenLabs Voice"
          >
            🎙️
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="p-2"
          >
            {isSoundEnabled ? (
              <Volume2 className="w-4 h-4 text-green-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-1'}`}>
              <Card className={`${
                message.isUser 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                  : 'bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20'
              }`}>
                <CardContent className="p-3">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </span>
                    {!message.isUser && message.mood && (
                      <div className="flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span className="text-xs text-purple-600 capitalize">{message.mood}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
              <CardContent className="p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-background">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "Listening..." : "Type your message..."}
            disabled={isLoading || isListening}
            className="flex-1"
          />
          
          {/* Voice Input Button */}
          {speechSupported && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleVoiceInput}
              disabled={isLoading}
              className={`p-2 ${isListening ? 'bg-red-100 text-red-600' : ''}`}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          )}
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanionChat;