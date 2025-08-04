import React, { useEffect, useRef, useCallback } from 'react';

interface DreamWaveBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init?: () => void;
      destroy?: () => void;
    };
  }
}

export const DreamWaveBackground: React.FC<DreamWaveBackgroundProps> = ({ 
  children, 
  className = "" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout>();
  const isMounted = useRef(true);

  const initializeUnicornStudio = useCallback(() => {
    if (!isMounted.current) return;

    // Clear any existing timeouts
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }

    // Initialize UnicornStudio if not already loaded
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
    } else if (window.UnicornStudio.isInitialized) {
      // If already initialized, ensure the container is visible
      const container = containerRef.current?.querySelector('.dream-wave-animation');
      if (container) {
        container.innerHTML = ''; // Clear previous instance
        const newContainer = document.createElement('div');
        newContainer.setAttribute('data-us-project', 'v3r3CutuBESeiAosS9Ii');
        newContainer.style.cssText = `
          width: 100%;
          height: 100%;
          min-width: 1440px;
          min-height: 900px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1.1);
          opacity: 0.6;
          z-index: 0;
        `;
        container.appendChild(newContainer);
        
        // Reinitialize with a small delay to ensure DOM is ready
        initTimeoutRef.current = setTimeout(() => {
          if (window.UnicornStudio?.init) {
            (window as any).UnicornStudio.init();
          }
        }, 50);
      }
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="unicornStudio"]');
    
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
      script.onload = function() {
        if (!isMounted.current) return;
        console.log('🌊 UnicornStudio script loaded');
        
        initTimeoutRef.current = setTimeout(() => {
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
    } else if (window.UnicornStudio && typeof (window as any).UnicornStudio.init === 'function') {
      // Script exists but might need reinitialization
      initTimeoutRef.current = setTimeout(() => {
        if (!window.UnicornStudio?.isInitialized) {
          try {
            (window as any).UnicornStudio.init();
            window.UnicornStudio.isInitialized = true;
            console.log('🌊 UnicornStudio initialized from existing script');
          } catch (error) {
            console.error('🌊 Error initializing from existing script:', error);
          }
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    initializeUnicornStudio();

    // Cleanup function
    return () => {
      isMounted.current = false;
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [initializeUnicornStudio]);

  // Reinitialize on visibility change (for when user returns to the tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Small delay to ensure the component is fully visible before reinitializing
        const timer = setTimeout(() => {
          if (isMounted.current) {
            initializeUnicornStudio();
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [initializeUnicornStudio]);

  return (
    <div className={`dream-wave-container ${className}`} ref={containerRef}>
      {/* Dream Wave Animation Background */}
      <div className="dream-wave-animation w-full h-full fixed top-0 left-0 overflow-hidden">
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
          key="unicorn-bg" // Force re-creation on re-render
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