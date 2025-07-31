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
    let timeoutId: NodeJS.Timeout;
    
    const initializeUnicornStudio = () => {
      // Initialize UnicornStudio if not already loaded
      if (!window.UnicornStudio) {
        window.UnicornStudio = { isInitialized: false };
      }
      
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="unicornStudio"]');
      
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
        script.onload = function() {
          console.log('🌊 UnicornStudio script loaded');
          timeoutId = setTimeout(() => {
            if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
              try {
                (window as any).UnicornStudio.init();
                window.UnicornStudio.isInitialized = true;
                console.log('🌊 UnicornStudio initialized successfully');
              } catch (error) {
                console.error('🌊 UnicornStudio initialization error:', error);
              }
            }
          }, 100);
        };
        script.onerror = function() {
          console.error('🌊 Failed to load UnicornStudio script');
        };
        (document.head || document.body).appendChild(script);
      } else {
        // Script exists, try to initialize
        timeoutId = setTimeout(() => {
          if (window.UnicornStudio && typeof (window as any).UnicornStudio.init === 'function') {
            try {
              if (!window.UnicornStudio.isInitialized) {
                (window as any).UnicornStudio.init();
                window.UnicornStudio.isInitialized = true;
                console.log('🌊 UnicornStudio re-initialized');
              }
            } catch (error) {
              console.error('🌊 UnicornStudio re-initialization error:', error);
            }
          }
        }, 100);
      }
    };

    initializeUnicornStudio();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
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
            opacity: 0.6,
            zIndex: 0
          }}
        />
      </div>
      

      
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