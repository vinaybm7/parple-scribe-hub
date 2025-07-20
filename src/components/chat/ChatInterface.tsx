import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Trash2, Bot, Heart, Zap, RotateCcw, Smile, Frown, HelpCircle, Coffee, Brain, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChat } from '@/hooks/useChat';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatInterface = ({ isOpen, onClose }: ChatInterfaceProps) => {
  const { messages, isLoading, sendMessage, clearChat, bellaState, resetBella } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get emotion icon for Bella's current state
  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return <Smile className="w-3 h-3 text-green-500" />;
      case 'stressed':
        return <Frown className="w-3 h-3 text-red-500" />;
      case 'confused':
        return <HelpCircle className="w-3 h-3 text-yellow-500" />;
      case 'motivated':
        return <Zap className="w-3 h-3 text-blue-500" />;
      case 'tired':
        return <Coffee className="w-3 h-3 text-orange-500" />;
      case 'curious':
        return <Brain className="w-3 h-3 text-purple-500" />;
      case 'frustrated':
        return <Frown className="w-3 h-3 text-red-400" />;
      default:
        return <Heart className="w-3 h-3 text-pink-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-24 right-4 w-96 sm:w-[420px] h-[700px] z-50 animate-in slide-in-from-top-2 duration-300">
      <Card className="h-full flex flex-col shadow-2xl border-2 bg-gradient-to-b from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
        {/* Header with Controls */}
        <div className="flex items-center justify-between p-3 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="w-5 h-5 text-pink-600" />
            Bella
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetBella}
              className="h-8 w-8 p-0"
              title="Reset Bella"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="h-8 w-8 p-0"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bella's Avatar Section */}
        <div className="flex flex-col items-center p-4 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30">
          <div className="relative w-40 h-40 rounded-full border-4 border-pink-300 shadow-lg overflow-hidden bg-pink-50">
            <video 
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{
                objectPosition: 'center top',
                transform: 'scale(1.05)' // Reduced scale to show more of the video
              }}
              onError={(e) => {
                console.log('Video failed to load, falling back to image');
                // Create an img element as fallback
                const img = document.createElement('img');
                img.src = '/bella-avatar.webp';
                img.alt = 'Bella Avatar';
                img.className = 'w-full h-full object-cover';
                img.style.objectPosition = 'center center';
                e.currentTarget.parentNode?.replaceChild(img, e.currentTarget);
              }}
            >
              <source src="/Anime_Shy_Girl_Video_Generated (online-video-cutter.com).mp4" type="video/mp4" />
              {/* Fallback image if video doesn't load */}
              <img 
                src="/bella-avatar.webp" 
                alt="Bella Avatar" 
                className="w-full h-full object-cover"
                style={{
                  objectPosition: 'center center'
                }}
              />
            </video>
          </div>
          
          {/* Bella's Status */}
          <div className="mt-3 w-full space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                <span className="text-muted-foreground">Favorability</span>
              </div>
              <span className="font-medium">{bellaState.favorability}%</span>
            </div>
            <Progress value={bellaState.favorability} className="h-2" />
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>Energy: {bellaState.energy}%</span>
              </div>
              <div className="capitalize">
                Mood: {bellaState.emotionalState}
              </div>
            </div>
          </div>
        </div>
        
        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-900">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-pink-100 border-2 border-pink-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-pink-600" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-2 mr-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area - Fixed at bottom */}
        <div className="border-t bg-background">
          <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        </div>
      </Card>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gentle-bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;