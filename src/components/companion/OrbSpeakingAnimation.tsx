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

  // Size configurations - Reduced sizes for better positioning
  const sizeConfig = {
    sm: { width: 60, height: 60, blur: 'blur-sm' },
    md: { width: 90, height: 90, blur: 'blur-md' },
    lg: { width: 120, height: 120, blur: 'blur-lg' }
  };

  const config = sizeConfig[size];

  // Enhanced color configurations with vibrant, visible colors
  const colorConfig = {
    purple: {
      primary: 'from-fuchsia-400 via-purple-500 via-indigo-500 to-cyan-400',
      secondary: 'from-pink-400/90 via-purple-400/80 via-blue-400/80 to-teal-400/90',
      accent: 'from-fuchsia-300/70 via-violet-400/60 via-sky-400/60 to-emerald-300/70',
      tertiary: 'from-pink-300/50 via-purple-300/40 via-blue-300/40 to-cyan-300/50',
      glow: 'shadow-purple-500/60',
      border: 'border-purple-400/70',
      innerGlow: 'from-white/60 via-purple-200/50 to-transparent',
      pastelOverlay: 'from-rose-300/40 via-violet-300/30 via-sky-300/30 to-teal-300/40'
    },
    indigo: {
      primary: 'from-purple-400 via-indigo-500 via-blue-500 to-cyan-400',
      secondary: 'from-purple-400/90 via-indigo-400/80 via-blue-400/80 to-cyan-400/90',
      accent: 'from-violet-300/70 via-indigo-400/60 via-sky-400/60 to-teal-300/70',
      tertiary: 'from-purple-300/50 via-indigo-300/40 via-blue-300/40 to-cyan-300/50',
      glow: 'shadow-indigo-500/60',
      border: 'border-indigo-400/70',
      innerGlow: 'from-white/60 via-indigo-200/50 to-transparent',
      pastelOverlay: 'from-violet-300/40 via-indigo-300/30 via-sky-300/30 to-cyan-300/40'
    },
    pink: {
      primary: 'from-pink-400 via-rose-500 via-purple-500 to-indigo-400',
      secondary: 'from-pink-400/90 via-rose-400/80 via-purple-400/80 to-violet-400/90',
      accent: 'from-rose-300/70 via-pink-400/60 via-purple-400/60 to-indigo-300/70',
      tertiary: 'from-pink-300/50 via-rose-300/40 via-purple-300/40 to-violet-300/50',
      glow: 'shadow-pink-500/60',
      border: 'border-pink-400/70',
      innerGlow: 'from-white/60 via-pink-200/50 to-transparent',
      pastelOverlay: 'from-rose-300/40 via-pink-300/30 via-purple-300/30 to-violet-300/40'
    }
  };

  const colors = colorConfig[avatarColor];

  // Animate wave phases and intensity - Enhanced for smoother movement
  useEffect(() => {
    const interval = setInterval(() => {
      setWavePhase(prev => (prev + 2) % 360); // Faster phase progression
      
      if (isActive) {
        // More dynamic intensity variation when speaking
        setIntensity(0.5 + Math.sin(Date.now() * 0.01) * 0.3 + Math.random() * 0.2);
      } else {
        // Gentle breathing intensity when silent
        setIntensity(0.2 + Math.sin(Date.now() * 0.003) * 0.1);
      }
    }, 50); // Smoother 20fps updates

    if (isActive) {
      onSpeechStart?.();
    } else {
      onSpeechEnd?.();
    }

    return () => clearInterval(interval);
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
      className={`relative flex items-center justify-center transition-all duration-500 mx-auto ${className}`}
      style={{
        width: config.width,
        height: config.height,
        opacity: isActive ? 1 : 0.8,
        transform: isActive ? 'scale(1.03)' : 'scale(1)',
      }}
    >
      {/* Enhanced outer glow with vibrant colors */}
      <div 
        className={`absolute inset-0 rounded-full bg-gradient-to-r ${colors.primary} ${config.blur} ${isActive ? 'animate-pulse' : ''}`}
        style={{
          transform: `scale(${1.3 + (isActive ? intensity * 0.4 : 0.1)})`,
          opacity: isActive ? intensity * 0.8 : 0.4,
          filter: 'blur(8px)'
        }}
      />
      
      {/* Rotating color layer for dynamic effects */}
      <div 
        className={`absolute inset-0 rounded-full bg-gradient-conic ${colors.secondary} ${config.blur}`}
        style={{
          transform: `scale(${1.15 + (isActive ? intensity * 0.2 : 0.05)}) rotate(${wavePhase}deg)`,
          opacity: isActive ? intensity * 0.6 : 0.3,
          filter: 'blur(4px)'
        }}
      />
      
      {/* Additional ambient glow */}
      <div 
        className={`absolute inset-0 rounded-full bg-gradient-radial ${colors.accent}`}
        style={{
          transform: `scale(${1.4 + (isActive ? intensity * 0.3 : 0.1)})`,
          opacity: isActive ? intensity * 0.4 : 0.2,
          filter: 'blur(12px)'
        }}
      />

      {/* Main orb container */}
      <div 
        className={`relative rounded-full ${isActive ? 'glass-orb-active orb-speaking color-shift' : 'glass-orb orb-breathing'} bg-gradient-to-br ${colors.primary} border ${colors.border} overflow-hidden`}
        style={{
          width: config.width,
          height: config.height,
          transform: `scale(${1 + (isActive ? intensity * 0.1 : 0)})`,
          filter: isActive ? `hue-rotate(${wavePhase}deg) saturate(1.2) brightness(1.1)` : 'saturate(1.1)'
        }}
      >
        {/* Enhanced gradient layers for vibrant colors */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.secondary}`} 
             style={{ opacity: isActive ? 0.9 : 0.7 }} />
        <div className={`absolute inset-0 rounded-full bg-gradient-to-tl ${colors.accent}`} 
             style={{ opacity: isActive ? 0.7 : 0.5 }} />
        <div className={`absolute inset-0 rounded-full bg-gradient-radial ${colors.tertiary}`} 
             style={{ opacity: isActive ? 0.8 : 0.6 }} />
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${colors.pastelOverlay}`} 
             style={{ 
               transform: `rotate(${wavePhase * 0.5}deg)`,
               opacity: isActive ? 0.6 : 0.4
             }} />
        
        {/* Dynamic color shifting layer */}
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-conic ${colors.primary}`}
          style={{
            transform: `rotate(${wavePhase}deg)`,
            opacity: isActive ? 0.3 : 0.2,
            mixBlendMode: 'overlay'
          }}
        />
        
        {/* Inner glow with better visibility */}
        <div className={`absolute inset-3 rounded-full bg-gradient-radial ${colors.innerGlow}`} 
             style={{ opacity: isActive ? 0.9 : 0.7 }} />
        
        {/* Enhanced shimmer effect */}
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{
            transform: `rotate(${wavePhase * 0.3}deg)`,
            opacity: isActive ? 0.8 : 0.4,
            filter: 'blur(1px)'
          }}
        />


      </div>

      {/* Pastel ripple waves around the orb when speaking */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Multi-colored ripple waves */}
          {[...Array(4)].map((_, i) => (
            <div
              key={`ripple-${i}`}
              className={`absolute border-2 rounded-full animate-ping`}
              style={{
                width: `${110 + i * 25}%`,
                height: `${110 + i * 25}%`,
                borderColor: i === 0 ? 'rgba(244, 114, 182, 0.4)' : // pink-400
                           i === 1 ? 'rgba(168, 85, 247, 0.3)' :   // purple-500  
                           i === 2 ? 'rgba(99, 102, 241, 0.25)' :  // indigo-500
                           'rgba(34, 197, 94, 0.2)',              // emerald-500
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2.5 + intensity * 0.5}s`,
                opacity: intensity * (0.7 - i * 0.12),
                filter: 'blur(0.5px)'
              }}
            />
          ))}
          
          {/* Additional soft glow rings */}
          {[...Array(2)].map((_, i) => (
            <div
              key={`glow-${i}`}
              className={`absolute rounded-full`}
              style={{
                width: `${140 + i * 40}%`,
                height: `${140 + i * 40}%`,
                background: i === 0 ? 
                  'radial-gradient(circle, rgba(244, 114, 182, 0.1) 0%, transparent 70%)' :
                  'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
                opacity: intensity * (0.5 - i * 0.2),
                transform: `scale(${1 + Math.sin((wavePhase + i * 180) * Math.PI / 180) * 0.1})`,
                filter: 'blur(2px)'
              }}
            />
          ))}
        </div>
      )}




    </div>
  );
};

export default OrbSpeakingAnimation;