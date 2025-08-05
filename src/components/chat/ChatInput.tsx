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
          setMessage(finalTranscript.trim());
          // Stop listening after getting final result
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        } else if (interimTranscript) {
          setMessage(interimTranscript.trim());
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
      onSendMessage(message.trim(), context);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
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
            variant="outline"
            className="px-3"
            title="Start voice input"
          >
            <Mic className="w-4 h-4" />
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