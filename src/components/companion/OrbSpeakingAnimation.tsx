import { useEffect, useState } from 'react';
import './orb-animations.css';

interface OrbSpeakingAnimationProps {
  isActive: boolean;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  avatarColor?: 'purple' | 'indigo' | 'pink';
}

const OrbSpeakingAnimation = ({
  isActive,
  onSpeechStart,
  onSpeechEnd,
  size = 'md',
  className = '',
  avatarColor = 'purple'
}: OrbSpeakingAnimationProps) => {
  const [wavePhase, setWavePhase] = useState(0);
  const [intensity, setIntensity] = useState(0.5);

  // Size configurations
  const sizeConfig = {
    sm: { width: 80, height: 80, blur: 'blur-sm' },
    md: { width: 120, height: 120, blur: 'blur-md' },
    lg: { width:160, height: 160, blur: 'blur-lg' }
  };

  const config = sizeConfig[size];

  // Color configurations for different avatars
  const colorConfig = {
    purple: {
      primary: 'from-purple-400/80 via-indigo-500/70 to-pink-400/80',
      secondary: 'from-purple-300/60 via-blue-400/50 to-pink-300/60',
      accent: 'from-purple-500/40 via-indigo-400/30 to-pink-500/40',
      glow: 'shadow-purple-500/50',
      border: 'border-purple-300/30'
    },
    indigo: {
      primary: 'from-indigo-400/80 via-blue-500/70 to-cyan-400/80',
      secondary: 'from-indigo-300/60 via-blue-400/50 to-cyan-300/60',
      accent: 'from-indigo-500/40 via-blue-400/30 to-cyan-500/40',
      glow: 'shadow-indigo-500/50',
      border: 'border-indigo-300/30'
    },
    pink: {
      primary: 'from-pink-400/80 via-rose-500/70 to-purple-400/80',
      secondary: 'from-pink-300/60 via-rose-400/50 to-purple-300/60',
      accent: 'from-pink-500/40 via-rose-400/30 to-purple-500/40',
      glow: 'shadow-pink-500/50',
      border: 'border-pink-300/30'
    }
  };

  const colors = colorConfig[avatarColor];

  // Animate wave phases and intensity when speaking
  useEffect(() => {
    if (!isActive) {
      setIntensity(0.2);
      return;
    }

    onSpeechStart?.();

    const interval = setInterval(() => {
      setWavePhase(prev => (prev + 1) % 360);
      setIntensity(0.4 + Math.random() * 0.6); // Random intensity between 0.4-1.0
    }, 100);

    return () => {
      clearInterval(interval);
      onSpeechEnd?.();
    };
  }, [isActive, onSpeechStart, onSpeechEnd]);

  // Generate random wave positions
  const generateWaves = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.sin((wavePhase + i * 60) * Math.PI / 180) * 20,
      y: Math.cos((wavePhase + i * 45) * Math.PI / 180) * 15,
      scale: 0.8 + Math.sin((wavePhase + i * 30) * Math.PI / 180) * 0.4,
      opacity: 0.3 + Math.sin((wavePhase + i * 90) * Math.PI / 180) * 0.3,
      rotation: (wavePhase + i * 20) % 360
    }));
  };

  const waves = generateWaves(8);

  return (
    <div 
      className={`relative flex items-center justify-center transition-all duration-500 ${className}`}
      style={{
        width: config.width,
        height: config.height,
        opacity: isActive ? 1 : 0.7,
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* Outer glow effect */}
      {isActive && (
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${colors.primary} ${config.blur} animate-pulse`}
          style={{
            transform: `scale(${1.2 + intensity * 0.3})`,
            opacity: intensity * 0.6
          }}
        />
      )}

      {/* Main orb container */}
      <div 
        className={`relative rounded-full ${isActive ? 'glass-orb-active orb-speaking' : 'glass-orb orb-breathing'} bg-gradient-to-br ${colors.primary} border ${colors.border} overflow-hidden`}
        style={{
          width: config.width,
          height: config.height,
          transform: `scale(${1 + (isActive ? intensity * 0.1 : 0)})`,
        }}
      >
        {/* Inner gradient layers */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.secondary} opacity-60`} />
        <div className={`absolute inset-0 rounded-full bg-gradient-to-tl ${colors.accent} opacity-40`} />
        
        {/* Animated waves inside the orb */}
        {isActive && waves.map((wave) => (
          <div
            key={wave.id}
            className={`absolute rounded-full bg-gradient-to-r ${colors.secondary} ${config.blur} wave-animation`}
            style={{
              width: `${30 + wave.scale * 20}%`,
              height: `${30 + wave.scale * 20}%`,
              left: `${50 + wave.x}%`,
              top: `${50 + wave.y}%`,
              transform: `translate(-50%, -50%) rotate(${wave.rotation}deg) scale(${wave.scale})`,
              opacity: wave.opacity * intensity,
              animationDelay: `${wave.id * 0.2}s`,
              animationDuration: `${1.5 + Math.random() * 1}s`
            }}
          />
        ))}

        {/* Ripple effects */}
        {isActive && (
          <>
            <div 
              className={`absolute inset-0 rounded-full border-2 ${colors.border} ripple-animation`}
              style={{
                animationDuration: `${1.5 + intensity}s`,
                opacity: intensity * 0.5
              }}
            />
            <div 
              className={`absolute inset-2 rounded-full border ${colors.border} ripple-animation`}
              style={{
                animationDuration: `${2 + intensity}s`,
                animationDelay: '0.5s',
                opacity: intensity * 0.3
              }}
            />
          </>
        )}

        {/* Glass reflection effect with shimmer */}
        <div 
          className="absolute top-2 left-2 w-1/3 h-1/3 rounded-full bg-gradient-to-br from-white/40 to-transparent glass-shimmer"
          style={{
            transform: 'rotate(-45deg)',
            filter: 'blur(1px)'
          }}
        />
        
        {/* Additional shimmer effect when speaking */}
        {isActive && (
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent glass-shimmer"
            style={{
              animationDelay: '1s',
              animationDuration: '2s'
            }}
          />
        )}

        {/* Bottom highlight */}
        <div 
          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2/3 h-1/4 rounded-full bg-gradient-to-t from-white/20 to-transparent"
          style={{ filter: 'blur(2px)' }}
        />
      </div>

      {/* Outer ripple rings when speaking */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute border-2 ${colors.border} rounded-full animate-ping`}
              style={{
                width: `${120 + i * 40}%`,
                height: `${120 + i * 40}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + intensity}s`,
                opacity: (0.4 - i * 0.1) * intensity
              }}
            />
          ))}
        </div>
      )}

      {/* Speaking indicator particles */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${colors.primary} particle-animation`}
              style={{
                left: `${50 + Math.sin((wavePhase + i * 60) * Math.PI / 180) * 60}%`,
                top: `${50 + Math.cos((wavePhase + i * 60) * Math.PI / 180) * 60}%`,
                opacity: intensity * 0.8,
                transform: `scale(${0.5 + intensity * 0.5})`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${1.5 + Math.random() * 1}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute -bottom-8 left-0 text-xs text-gray-500 bg-black/80 px-2 py-1 rounded text-white">
          Orb: {isActive ? 'Speaking' : 'Silent'} | Intensity: {(intensity * 100).toFixed(0)}% | Phase: {wavePhase}°
        </div>
      )}
    </div>
  );
};

export default OrbSpeakingAnimation;