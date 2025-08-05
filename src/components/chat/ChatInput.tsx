import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Mic } from 'lucide-react';
import VoiceAnimation from './VoiceAnimation';

interface ChatInputProps {
  onSendMessage: (message: string, context?: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  context?: string;
}

const ChatInput = ({ onSendMessage, isLoading, disabled = false, context }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true; // Enable continuous listening
      recognition.interimResults = true; // Get interim results to detect speech
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        // Start silence detection timer
        silenceTimerRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 3000); // Stop after 3 seconds of silence
      };

      recognition.onresult = (event) => {
        // Clear the silence timer when we get results
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

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
          setMessage(prev => prev + finalTranscript);
          // Don't auto-stop, let user decide when to send
          // Reset silence timer for potential additional speech
          silenceTimerRef.current = setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
          }, 3000); // 3 seconds of silence after final speech
        } else if (interimTranscript) {
          setMessage(prev => {
            // Replace interim results, don't append
            const finalPart = prev.replace(/\s*[^\s]*$/, ''); // Remove last word if it was interim
            return finalPart + interimTranscript;
          });
          // Reset silence timer when we detect speech
          silenceTimerRef.current = setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
          }, 2000); // 2 seconds of silence after speech
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
      };

      recognitionRef.current = recognition;
      setSpeechSupported(true);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  const handleSend = () => {
    if (message.trim() && !isLoading && !disabled) {
      // Stop any ongoing speech recognition
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      
      onSendMessage(message.trim(), context);
      setMessage('');
      setIsListening(false);
      
      // Clear any pending timers
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Stop listening if currently active
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
      }
      handleSend();
    }
  };

  const startVoiceInput = () => {
    if (!recognitionRef.current || isListening) return;
    
    // Clear any existing message before starting
    setMessage('');
    recognitionRef.current.start();
  };

  return (
    <div className="relative">
      {/* Voice Animation */}
      <VoiceAnimation isListening={isListening} />
      
      <div className="flex gap-2 p-4 border-t bg-background">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isListening ? "Listening..." : "Ask me anything about your studies..."}
          disabled={isLoading || disabled}
          className="flex-1"
        />
        
        {/* Voice Input Button */}
        {speechSupported && (
          <Button
            onClick={startVoiceInput}
            disabled={isLoading || disabled || isListening}
            size="sm"
            variant={isListening ? "default" : "outline"}
            className={`px-3 transition-all duration-200 ${
              isListening 
                ? "bg-pink-500 hover:bg-pink-600 text-white shadow-lg" 
                : "hover:bg-pink-50 hover:border-pink-300"
            }`}
            title={isListening ? "Recording..." : "Start voice input"}
          >
            <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />
          </Button>
        )}
        
        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isLoading || disabled}
          size="sm"
          className="px-3"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;