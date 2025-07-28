import { useRive } from '@rive-app/react-canvas';
import { useEffect, useRef, useState } from 'react';

interface SimpleRiveAnimationProps {
  isActive: boolean;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SimpleRiveAnimation = ({
  isActive,
  onSpeechStart,
  onSpeechEnd,
  size = 'md',
  className = ''
}: SimpleRiveAnimationProps) => {
  const previousActiveState = useRef(isActive);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Size configurations
  const sizeConfig = {
    sm: { width: 100, height: 80 },
    md: { width: 140, height: 110 },
    lg: { width: 180, height: 140 }
  };

  const config = sizeConfig[size];

  // Simple Rive animation without state machines
  const { rive, RiveComponent } = useRive({
    src: '/voice_assistant_animation.riv',
    autoplay: false, // We'll control playback manually
    onLoad: () => {
      console.log('🎨 Simple Rive animation loaded successfully');
      
      if (rive) {
        console.log('🎬 Available animations:', rive.animationNames);
        console.log('📋 Available state machines:', rive.stateMachineNames);
      }
      
      setIsLoaded(true);
      setHasError(false);
    },
    onLoadError: (error) => {
      console.error('❌ Error loading simple Rive animation:', error);
      setHasError(true);
      setIsLoaded(false);
    }
  });

  // Control animation based on speaking state
  useEffect(() => {
    if (!rive || !isLoaded) return;

    console.log('🎤 Simple Rive speaking state changed:', isActive);

    if (isActive) {
      // Start animation
      try {
        rive.play();
        console.log('▶️ Started Rive animation');
        
        // Trigger callback if state changed from inactive to active
        if (!previousActiveState.current) {
          onSpeechStart?.();
        }
      } catch (error) {
        console.error('❌ Error starting animation:', error);
      }
    } else {
      // Pause animation
      try {
        rive.pause();
        console.log('⏸️ Paused Rive animation');
        
        // Trigger callback if state changed from active to inactive
        if (previousActiveState.current) {
          onSpeechEnd?.();
        }
      } catch (error) {
        console.error('❌ Error pausing animation:', error);
      }
    }

    previousActiveState.current = isActive;
  }, [isActive, rive, isLoaded, onSpeechStart, onSpeechEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rive) {
        try {
          rive.stop();
        } catch (error) {
          console.warn('⚠️ Error stopping animation on cleanup:', error);
        }
      }
    };
  }, [rive]);

  return (
    <div 
      className={`relative flex items-center justify-center transition-all duration-300 ${className}`}
      style={{
        width: config.width,
        height: config.height,
        opacity: isActive ? 1 : 0.7,
        transform: isActive ? 'scale(1)' : 'scale(0.95)',
      }}
    >
      {/* Rive Animation Container */}
      <div 
        className="relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20"
        style={{
          width: config.width,
          height: config.height
        }}
      >
        <RiveComponent 
          style={{
            width: '100%',
            height: '100%'
          }}
        />

        {/* Glow effect when active */}
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-indigo-400/20 animate-pulse" />
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-400/10 to-indigo-400/10 blur-sm animate-pulse" />
          </>
        )}

        {/* Speaking indicator */}
        {isActive && (
          <div className="absolute top-2 right-2">
            <div className="flex space-x-1">
              <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse" />
              <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
              <div className="w-1 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        )}
      </div>

      {/* Loading state */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100/80 to-indigo-100/80 dark:bg-gradient-to-br dark:from-purple-900/80 dark:to-indigo-900/80 rounded-xl backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-purple-700 dark:text-purple-300 font-medium">Loading Animation...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100/80 dark:bg-red-900/80 rounded-xl backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-2 text-center px-4">
            <div className="text-red-500 text-lg">⚠️</div>
            <span className="text-xs text-red-700 dark:text-red-300">Animation Error</span>
            <span className="text-xs text-red-600 dark:text-red-400">Using simple playback</span>
          </div>
        </div>
      )}

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute -bottom-12 left-0 text-xs text-gray-500 bg-black/80 px-2 py-1 rounded max-w-full text-white">
          <div>Simple Rive: {isActive ? 'Playing' : 'Paused'} | {isLoaded ? 'Loaded' : 'Loading'}</div>
          <div>Animations: {rive?.animationNames?.join(', ') || 'None'}</div>
          <div>State Machines: {rive?.stateMachineNames?.join(', ') || 'None'}</div>
        </div>
      )}
    </div>
  );
};

export default SimpleRiveAnimation;