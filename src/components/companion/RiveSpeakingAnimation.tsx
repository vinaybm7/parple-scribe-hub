import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { useEffect, useRef, useState } from 'react';
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';

interface RiveSpeakingAnimationProps {
  isActive: boolean;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  volumeLevel?: number; // 0-1 for dynamic volume visualization
  audioElement?: HTMLAudioElement | null; // For real-time audio analysis
  enableAudioAnalysis?: boolean; // Enable dynamic volume from audio
}

const RiveSpeakingAnimation = ({
  isActive,
  onSpeechStart,
  onSpeechEnd,
  size = 'md',
  className = '',
  volumeLevel = 0.8,
  audioElement = null,
  enableAudioAnalysis = false
}: RiveSpeakingAnimationProps) => {
  const previousActiveState = useRef(isActive);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Use audio analyzer for dynamic volume levels
  const { volumeLevel: analyzedVolume, isAnalyzing } = useAudioAnalyzer(
    enableAudioAnalysis ? audioElement : null,
    {
      fftSize: 256,
      smoothingTimeConstant: 0.8,
      updateInterval: 50
    }
  );

  // Use analyzed volume if available, otherwise use prop
  const currentVolumeLevel = enableAudioAnalysis && isAnalyzing ? analyzedVolume : volumeLevel;

  // Size configurations - optimized for voice assistant animation
  const sizeConfig = {
    sm: { width: 100, height: 80 },
    md: { width: 140, height: 110 },
    lg: { width: 180, height: 140 }
  };

  const config = sizeConfig[size];

  // Initialize Rive animation with multiple fallback state machine names
  const { rive, RiveComponent } = useRive({
    src: '/voice_assistant_animation.riv',
    stateMachines: ['State Machine 1', 'StateMachine', 'Main', 'Voice'], // Try multiple common names
    autoplay: true, // Let it autoplay the idle state
    onLoad: () => {
      console.log('🎨 Rive voice animation loaded successfully');
      setIsLoaded(true);
      setHasError(false);
    },
    onLoadError: (error) => {
      console.error('❌ Error loading Rive voice animation:', error);
      setHasError(true);
      setIsLoaded(false);
    },
    onPlay: () => {
      console.log('▶️ Rive voice animation started playing');
    },
    onPause: () => {
      console.log('⏸️ Rive voice animation paused');
    },
    onStop: () => {
      console.log('⏹️ Rive voice animation stopped');
    }
  });

  // Try to get state machine inputs with multiple possible names
  const speakingInput = useStateMachineInput(rive, 'State Machine 1', 'speaking') ||
                       useStateMachineInput(rive, 'State Machine 1', 'isSpeaking') ||
                       useStateMachineInput(rive, 'State Machine 1', 'talk') ||
                       useStateMachineInput(rive, 'State Machine 1', 'voice') ||
                       useStateMachineInput(rive, 'StateMachine', 'speaking') ||
                       useStateMachineInput(rive, 'Main', 'speaking');

  const volumeInput = useStateMachineInput(rive, 'State Machine 1', 'volume') ||
                     useStateMachineInput(rive, 'State Machine 1', 'level') ||
                     useStateMachineInput(rive, 'State Machine 1', 'amplitude') ||
                     useStateMachineInput(rive, 'StateMachine', 'volume') ||
                     useStateMachineInput(rive, 'Main', 'volume');

  // Control animation based on speaking state
  useEffect(() => {
    if (!rive || !isLoaded) return;

    console.log('🎤 Rive speaking state changed:', isActive);
    console.log('🎤 Available inputs:', { 
      speakingInput: !!speakingInput, 
      volumeInput: !!volumeInput 
    });

    if (isActive) {
      // Start speaking animation
      if (speakingInput) {
        speakingInput.value = true;
        console.log('✅ Set speaking input to true');
      } else {
        console.warn('⚠️ No speaking input found, trying to play animation directly');
        rive.play();
      }
      
      // Set volume level for dynamic visualization
      if (volumeInput) {
        volumeInput.value = currentVolumeLevel;
        console.log(`🔊 Set volume input to ${currentVolumeLevel.toFixed(2)} ${enableAudioAnalysis ? '(analyzed)' : '(static)'}`);
      }

      // Trigger callback if state changed from inactive to active
      if (!previousActiveState.current) {
        onSpeechStart?.();
      }
    } else {
      // Stop speaking animation
      if (speakingInput) {
        speakingInput.value = false;
        console.log('✅ Set speaking input to false');
      }
      
      if (volumeInput) {
        volumeInput.value = 0;
        console.log('🔇 Set volume input to 0');
      }

      // Trigger callback if state changed from active to inactive
      if (previousActiveState.current) {
        onSpeechEnd?.();
      }
    }

    previousActiveState.current = isActive;
  }, [isActive, rive, isLoaded, speakingInput, volumeInput, currentVolumeLevel, onSpeechStart, onSpeechEnd]);

  // Update volume level dynamically
  useEffect(() => {
    if (volumeInput && isActive) {
      volumeInput.value = currentVolumeLevel;
    }
  }, [currentVolumeLevel, volumeInput, isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rive) {
        rive.stop();
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
            <span className="text-xs text-purple-700 dark:text-purple-300 font-medium">Loading Voice Animation...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100/80 dark:bg-red-900/80 rounded-xl backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-2 text-center px-4">
            <div className="text-red-500 text-lg">⚠️</div>
            <span className="text-xs text-red-700 dark:text-red-300">Animation Error</span>
            <span className="text-xs text-red-600 dark:text-red-400">Check console for details</span>
          </div>
        </div>
      )}

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute -bottom-10 left-0 text-xs text-gray-500 bg-black/20 px-2 py-1 rounded max-w-full">
          <div>Rive: {isActive ? 'Speaking' : 'Silent'} | {isLoaded ? 'Loaded' : 'Loading'}</div>
          <div>Inputs: {speakingInput ? '✅' : '❌'} Speaking | {volumeInput ? '✅' : '❌'} Volume</div>
          <div>Volume: {(currentVolumeLevel * 100).toFixed(0)}% {enableAudioAnalysis ? '(Live)' : '(Static)'}</div>
        </div>
      )}
    </div>
  );
};

export default RiveSpeakingAnimation;