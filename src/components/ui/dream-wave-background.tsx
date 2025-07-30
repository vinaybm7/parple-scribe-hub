import React, { useEffect, useRef } from 'react';

interface DreamWaveBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const DreamWaveBackground: React.FC<DreamWaveBackgroundProps> = ({ 
  children, 
  className = "" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize UnicornStudio if not already loaded
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
      
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
      script.onload = function() {
        if (!window.UnicornStudio.isInitialized) {
          UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      };
      (document.head || document.body).appendChild(script);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className={`dream-wave-container ${className}`} ref={containerRef}>
      {/* Dream Wave Animation Background */}
      <div className="dream-wave-animation">
        <div 
          data-us-project="v3r3CutuBESeiAosS9Ii" 
          style={{
            width: '100%',
            height: '100%',
            minWidth: '1440px',
            minHeight: '900px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.1)',
            opacity: 0.8,
            filter: 'hue-rotate(260deg) saturate(1.5) brightness(1.1) contrast(1.2)',
            zIndex: 0
          }}
        />
      </div>
      
      {/* Gradient Overlay to blend with site theme */}
      <div 
        className="dream-wave-overlay absolute inset-0 z-10"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(147, 51, 234, 0.12) 0%, 
              rgba(168, 85, 247, 0.10) 25%, 
              rgba(196, 125, 255, 0.08) 50%, 
              rgba(221, 170, 255, 0.06) 75%, 
              rgba(237, 201, 255, 0.04) 100%
            ),
            radial-gradient(ellipse at center, 
              rgba(147, 51, 234, 0.05) 0%, 
              transparent 70%
            )
          `
        }}
      />
      
      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    UnicornStudio: {
      isInitialized: boolean;
      init?: () => void;
    };
  }
}