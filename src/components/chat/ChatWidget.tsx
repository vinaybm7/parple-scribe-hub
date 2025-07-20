import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Bot, Heart } from 'lucide-react';
import ChatInterface from './ChatInterface';
import { useChat } from '@/hooks/useChat';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { bellaState } = useChat();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Get button color based on Bella's emotional state
  const getButtonStyle = () => {
    switch (bellaState.emotionalState) {
      case 'happy':
        return 'bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700';
      case 'motivated':
        return 'bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700';
      case 'curious':
        return 'bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700';
      case 'stressed':
        return 'bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700';
      default:
        return 'bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700';
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed top-16 right-6 z-50">
        <Button
          onClick={toggleChat}
          className={`w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 ${getButtonStyle()} p-0 overflow-hidden ring-2 ring-white/20 hover:ring-white/40`}
          size="lg"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <img 
              src="/bella-avatar.webp" 
              alt="Bella" 
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </Button>
        

        

      </div>

      {/* Chat Interface */}
      <ChatInterface isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ChatWidget;