import { useEffect, useState } from 'react';
import { Mic } from 'lucide-react';

interface VoiceAnimationProps {
  isListening: boolean;
  audioLevel?: number;
}

const VoiceAnimation = ({ isListening, audioLevel = 0 }: VoiceAnimationProps) => {
  const [pulseIntensity, setPulseIntensity] = useState(0);

  useEffect(() => {
    if (isListening) {
      // Create a pulsing animation based on audio level
      const interval = setInterval(() => {
        setPulseIntensity(Math.random() * 0.8 + 0.2); // Random pulse between 0.2 and 1
      }, 150);

      return () => clearInterval(interval);
    } else {
      setPulseIntensity(0);
    }
  }, [isListening, audioLevel]);

  if (!isListening) return null;

  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
      <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border-2 border-pink-200 dark:border-pink-700">
        {/* Outer pulse ring */}
        <div 
          className="absolute inset-0 rounded-full bg-pink-400/30 animate-ping"
          style={{
            animationDuration: '1s',
            transform: `scale(${1 + pulseIntensity * 0.5})`
          }}
        />
        
        {/* Middle pulse ring */}
        <div 
          className="absolute inset-1 rounded-full bg-pink-500/40"
          style={{
            transform: `scale(${1 + pulseIntensity * 0.3})`,
            transition: 'transform 0.15s ease-out'
          }}
        />
        
        {/* Inner mic icon */}
        <div className="relative z-10 flex items-center justify-center">
          <Mic 
            className="w-5 h-5 text-pink-600 dark:text-pink-400"
            style={{
              transform: `scale(${1 + pulseIntensity * 0.2})`,
              transition: 'transform 0.15s ease-out'
            }}
          />
        </div>
        
        {/* Sound waves */}
        <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
          <div 
            className="w-1 bg-pink-500 rounded-full"
            style={{
              height: `${8 + pulseIntensity * 12}px`,
              opacity: pulseIntensity,
              transition: 'all 0.15s ease-out'
            }}
          />
        </div>
        <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
          <div 
            className="w-1 bg-pink-400 rounded-full"
            style={{
              height: `${6 + pulseIntensity * 16}px`,
              opacity: pulseIntensity * 0.8,
              transition: 'all 0.15s ease-out'
            }}
          />
        </div>
        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
          <div 
            className="w-1 bg-pink-500 rounded-full"
            style={{
              height: `${8 + pulseIntensity * 12}px`,
              opacity: pulseIntensity,
              transition: 'all 0.15s ease-out'
            }}
          />
        </div>
        <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
          <div 
            className="w-1 bg-pink-400 rounded-full"
            style={{
              height: `${6 + pulseIntensity * 16}px`,
              opacity: pulseIntensity * 0.8,
              transition: 'all 0.15s ease-out'
            }}
          />
        </div>
      </div>
      
      {/* Listening text */}
      <div className="text-center mt-2">
        <span className="text-xs text-pink-600 dark:text-pink-400 font-medium bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-full">
          Listening...
        </span>
      </div>
    </div>
  );
};

export default VoiceAnimation;