import { useEffect, useRef, useState, useCallback } from 'react';

interface VideoSpeakingAnimationProps {
  isActive: boolean;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  syncDelay?: number; // Delay in ms to sync with audio
}

const VideoSpeakingAnimation = ({ 
  isActive, 
  onSpeechStart, 
  onSpeechEnd, 
  size = 'md',
  className = '',
  syncDelay = 0
}: VideoSpeakingAnimationProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout>();

  // Size configurations - optimized for better visibility
  const sizeConfig = {
    sm: { width: 70, height: 47 },
    md: { width: 90, height: 60 },
    lg: { width: 120, height: 80 }
  };

  const config = sizeConfig[size];

  // Handle video loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      console.log('Speaking animation video loaded');
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onSpeechStart?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onSpeechEnd?.();
    };

    const handleError = (e: Event) => {
      console.error('Speaking animation video error:', e);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    // Preload the video
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [onSpeechStart, onSpeechEnd]);

  // Enhanced video control with sync delay
  const startVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isVideoLoaded) return;

    video.currentTime = 0;
    video.play().catch(error => {
      console.error('Error playing speaking animation:', error);
    });
  }, [isVideoLoaded]);

  const stopVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
    setShouldPlay(false);
    onSpeechEnd?.();
  }, [onSpeechEnd]);

  // Control video playback with sync delay
  useEffect(() => {
    // Clear any existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    if (isActive) {
      setShouldPlay(true);
      // Apply sync delay to match audio timing
      syncTimeoutRef.current = setTimeout(() => {
        startVideo();
      }, syncDelay);
    } else {
      setShouldPlay(false);
      stopVideo();
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isActive, syncDelay, startVideo, stopVideo]);

  // Handle video loop for continuous speaking with better sync
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // If we're near the end and still supposed to be playing, loop seamlessly
      if (shouldPlay && isActive && video.currentTime >= video.duration - 0.05) {
        video.currentTime = 0.1; // Small offset to avoid flicker
        if (video.paused) {
          video.play().catch(console.error);
        }
      }
    };

    const handleCanPlay = () => {
      // Ensure video is ready for smooth playback
      if (shouldPlay && isActive && video.paused) {
        video.play().catch(console.error);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [isActive, shouldPlay]);

  return (
    <div 
      className={`relative flex items-center justify-center transition-all duration-300 ${className}`}
      style={{
        width: config.width,
        height: config.height,
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'scale(1)' : 'scale(0.8)',
        pointerEvents: 'none'
      }}
    >
      {/* Enhanced video container with better styling */}
      <div 
        className="relative overflow-hidden rounded-xl shadow-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/20"
        style={{
          width: config.width,
          height: config.height
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-xl"
          muted
          playsInline
          preload="auto"
          loop={false} // We handle looping manually for better control
          style={{
            filter: 'brightness(1.05) contrast(1.05) saturate(1.1)',
            transform: 'scale(1.02)' // Slight scale to hide any edge artifacts
          }}
        >
          <source src="/speaking-animation.webm" type="video/webm" />
          {/* Fallback for browsers that don't support WebM */}
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 text-xs font-medium">
            🎤 Speaking...
          </div>
        </video>

        {/* Enhanced glow effect with better animation */}
        {isActive && isPlaying && (
          <>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/30 to-indigo-400/30 animate-pulse" />
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-400/20 to-indigo-400/20 blur-sm animate-pulse" />
          </>
        )}

        {/* Speaking indicator overlay */}
        {isActive && (
          <div className="absolute top-1 right-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg" />
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
          {isActive ? 'Active' : 'Inactive'} | {isPlaying ? 'Playing' : 'Paused'}
        </div>
      )}
    </div>
  );
};

export default VideoSpeakingAnimation;