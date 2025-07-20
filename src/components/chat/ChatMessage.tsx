import { BellaChatMessage } from '@/lib/bella-core';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Heart, Brain, Zap, Coffee, Frown, Smile, HelpCircle } from 'lucide-react';

interface ChatMessageProps {
  message: BellaChatMessage;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get emotion icon for Bella's messages
  const getEmotionIcon = (emotion?: string) => {
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

  // Get avatar styling based on Bella's emotional state
  const getBellaAvatarStyle = (emotion?: string) => {
    switch (emotion) {
      case 'happy':
        return 'bg-green-100 border-2 border-green-300';
      case 'motivated':
        return 'bg-blue-100 border-2 border-blue-300';
      case 'curious':
        return 'bg-purple-100 border-2 border-purple-300';
      case 'stressed':
        return 'bg-red-100 border-2 border-red-300';
      default:
        return 'bg-pink-100 border-2 border-pink-300';
    }
  };

  return (
    <div className={`flex gap-3 mb-4 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback 
          className={
            message.isUser 
              ? 'bg-primary text-primary-foreground' 
              : getBellaAvatarStyle(message.emotionalState)
          }
        >
          {message.isUser ? <User className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col max-w-[80%] ${message.isUser ? 'items-end' : 'items-start'}`}>
        {/* Bella's emotional state indicator */}
        {!message.isUser && message.emotionalState && (
          <div className="flex items-center gap-1 mb-1 px-2">
            {getEmotionIcon(message.emotionalState)}
            <span className="text-xs text-muted-foreground capitalize">
              {message.emotionalState}
            </span>
          </div>
        )}
        
        <div
          className={`rounded-2xl px-4 py-2 text-sm ${
            message.isUser
              ? 'bg-primary text-primary-foreground ml-2'
              : 'bg-muted text-foreground mr-2'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        
        <div className="flex items-center gap-2 mt-1 px-2">
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
          
          {/* Favorability indicator for Bella's messages */}
          {!message.isUser && message.bellaState && (
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-pink-400" />
              <span className="text-xs text-muted-foreground">
                {message.bellaState.favorability}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;