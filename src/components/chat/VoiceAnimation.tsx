import { useEffect, useState } from 'react';

interface VoiceAnimationProps {
  isListening: boolean;
  audioLevel?: number;
}

const VoiceAnimation = ({ isListening, audioLevel = 0 }: VoiceAnimationProps) => {
  const [bars, setBars] = useState<number[]>([0, 0, 0, 0, 0]);

  useEffect(() => {
    if (isListening) {
      // Create animated bars with different heights
      const interval = setInterval(() => {
        setBars([
          Math.random() * 0.8 + 0.2,
          Math.random() * 1.0 + 0.3,
          Math.random() * 0.6 + 0.4,
          Math.random() * 0.9 + 0.1,
          Math.random() * 0.7 + 0.3
        ]);
      }, 120);

      return () => clearInterval(interval);
    } else {
      setBars([0, 0, 0, 0, 0]);
    }
  }, [isListening, audioLevel]);

  if (!isListening) return null;

  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-10 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-xl border border-pink-200 dark:border-pink-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* Central circle with pulse */}
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center relative overflow-hidden">
              {/* Pulse effect */}
              <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
              <div className="relative z-10 w-3 h-3 bg-white rounded-full" />
            </div>
            {/* Outer pulse ring */}
            <div className="absolute inset-0 rounded-full border-2 border-pink-400/40 animate-pulse" style={{ transform: 'scale(1.3)' }} />
          </div>
          
          {/* Animated bars */}
          <div className="flex items-center gap-1">
            {bars.map((height, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-pink-500 to-purple-400 rounded-full transition-all duration-150 ease-out"
                style={{
                  width: '3px',
                  height: `${8 + height * 16}px`,
                  opacity: 0.7 + height * 0.3
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Listening text */}
        <div className="text-center mt-2">
          <span className="text-xs text-pink-600 dark:text-pink-400 font-medium">
            Listening...
          </span>
        </div>
      </div>
    </div>
  );
};

export default VoiceAnimation;