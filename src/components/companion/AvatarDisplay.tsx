import { useState, useEffect } from 'react';
import { Heart, Sparkles, Coffee, Book, Smile } from 'lucide-react';

interface AvatarDisplayProps {
  avatarId: string;
  mood: 'happy' | 'excited' | 'calm' | 'focused' | 'caring';
  isTyping?: boolean;
  isSpeaking?: boolean;
}

const AvatarDisplay = ({ avatarId, mood, isTyping = false, isSpeaking = false }: AvatarDisplayProps) => {
  const [currentExpression, setCurrentExpression] = useState('neutral');
  const [eyeBlink, setEyeBlink] = useState(false);

  // Avatar configurations
  const avatarConfig = {
    luna: {
      name: 'Luna',
      color: 'purple',
      gradient: 'from-purple-400 to-purple-600',
      bgGradient: 'from-purple-100 to-purple-200',
      darkBgGradient: 'dark:from-purple-900/30 dark:to-purple-800/30'
    },
    aria: {
      name: 'Aria',
      color: 'indigo',
      gradient: 'from-indigo-400 to-indigo-600',
      bgGradient: 'from-indigo-100 to-indigo-200',
      darkBgGradient: 'dark:from-indigo-900/30 dark:to-indigo-800/30'
    }
  };

  const config = avatarConfig[avatarId as keyof typeof avatarConfig] || avatarConfig.luna;

  // Mood-based expressions and animations
  const getMoodIcon = () => {
    switch (mood) {
      case 'happy':
        return <Smile className="w-6 h-6 text-yellow-500" />;
      case 'excited':
        return <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />;
      case 'calm':
        return <Heart className="w-6 h-6 text-blue-500" />;
      case 'focused':
        return <Book className="w-6 h-6 text-green-500" />;
      case 'caring':
        return <Heart className="w-6 h-6 text-pink-500 animate-pulse" />;
      default:
        return <Heart className="w-6 h-6 text-gray-500" />;
    }
  };

  // Eye blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Expression changes based on mood
  useEffect(() => {
    setCurrentExpression(mood);
  }, [mood]);

  return (
    <div className="flex flex-col items-center p-6">
      {/* Avatar Container */}
      <div className="relative mb-4">
        {/* Outer glow effect */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.gradient} opacity-20 blur-xl scale-110 ${isSpeaking ? 'animate-pulse' : ''}`} />
        
        {/* Main avatar circle */}
        <div className={`relative w-48 h-48 rounded-full bg-gradient-to-br ${config.bgGradient} ${config.darkBgGradient} border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden`}>
          {/* Avatar face */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-100/90 dark:to-gray-200/80 flex items-center justify-center">
            {/* Simple anime-style face */}
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              {/* Eyes */}
              <div className="flex space-x-6 mb-4">
                <div className={`w-4 h-4 bg-gray-800 rounded-full transition-all duration-150 ${eyeBlink ? 'scale-y-10' : 'scale-y-100'}`} />
                <div className={`w-4 h-4 bg-gray-800 rounded-full transition-all duration-150 ${eyeBlink ? 'scale-y-10' : 'scale-y-100'}`} />
              </div>
              
              {/* Mouth based on mood */}
              <div className="relative">
                {mood === 'happy' && (
                  <div className="w-6 h-3 border-b-2 border-gray-800 rounded-b-full" />
                )}
                {mood === 'excited' && (
                  <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce" />
                )}
                {mood === 'calm' && (
                  <div className="w-4 h-1 bg-gray-600 rounded-full" />
                )}
                {mood === 'focused' && (
                  <div className="w-3 h-3 border border-gray-800 rounded-full" />
                )}
                {mood === 'caring' && (
                  <div className="w-5 h-2 bg-pink-400 rounded-full" />
                )}
              </div>
            </div>
          </div>

          {/* Typing indicator */}
          {isTyping && (
            <div className="absolute bottom-2 right-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Mood indicator */}
        <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
          {getMoodIcon()}
        </div>

        {/* Speaking animation */}
        {isSpeaking && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <div className={`w-2 h-8 bg-gradient-to-t ${config.gradient} rounded-full animate-pulse`} style={{ animationDelay: '0ms' }} />
              <div className={`w-2 h-6 bg-gradient-to-t ${config.gradient} rounded-full animate-pulse`} style={{ animationDelay: '100ms' }} />
              <div className={`w-2 h-10 bg-gradient-to-t ${config.gradient} rounded-full animate-pulse`} style={{ animationDelay: '200ms' }} />
              <div className={`w-2 h-4 bg-gradient-to-t ${config.gradient} rounded-full animate-pulse`} style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Avatar name and status */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">{config.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {isTyping ? 'Typing...' : isSpeaking ? 'Speaking...' : `Feeling ${mood}`}
        </p>
      </div>

      {/* Floating hearts animation for caring mood */}
      {mood === 'caring' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              className="absolute w-4 h-4 text-pink-400 animate-bounce opacity-60"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 10}%`,
                animationDelay: `${i * 500}ms`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvatarDisplay;