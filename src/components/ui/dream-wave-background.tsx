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

    // Debug logging for production
    console.log('🌊 Initializing UnicornStudio...', {
      environment: import.meta.env.MODE,
      hasWindow: typeof window !== 'undefined',
      hasUnicornStudio: !!window.UnicornStudio,
      isInitialized: window.UnicornStudio?.isInitialized
    });

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
            console.log('🌊 UnicornStudio reinitialized');
          }
        }, 50);
      }
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="unicornStudio"]');
    
    if (!existingScript) {
      console.log('🌊 Loading UnicornStudio script...');
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
      script.crossOrigin = "anonymous"; // Add CORS support
      script.onload = function() {
        if (!isMounted.current) return;
        console.log('🌊 UnicornStudio script loaded successfully');
        
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
        }, 200); // Increased timeout for production
      };
      script.onerror = function(error) {
        console.error('🌊 Failed to load UnicornStudio script:', error);
        console.error('🌊 This might be due to CSP restrictions or network issues');
      };
      (document.head || document.body).appendChild(script);
    } else if (window.UnicornStudio && typeof (window as any).UnicornStudio.init === 'function') {
      // Script exists but might need reinitialization
      console.log('🌊 UnicornStudio script exists, reinitializing...');
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
      }, 200);
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
      {/* Fallback Gradient Background */}
      <div className="w-full h-full fixed top-0 left-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-purple-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
      </div>
      
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
            zIndex: 1
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