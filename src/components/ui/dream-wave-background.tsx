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
            opacity: 0.7,
            filter: 'hue-rotate(280deg) saturate(1.3) brightness(0.9) contrast(1.1)',
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
              rgba(147, 51, 234, 0.08) 0%, 
              rgba(79, 70, 229, 0.08) 25%, 
              rgba(236, 72, 153, 0.08) 50%, 
              rgba(59, 130, 246, 0.08) 75%, 
              rgba(16, 185, 129, 0.08) 100%
            ),
            radial-gradient(ellipse at center, 
              rgba(255, 255, 255, 0.03) 0%, 
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