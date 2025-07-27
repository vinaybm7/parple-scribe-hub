import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Bot, Heart } from 'lucide-react';
import ChatInterface from './ChatInterface';
import { useChat } from '@/hooks/useChat';
import { useLocation } from 'react-router-dom';

// Load Live2D widget script dynamically
const loadLive2DWidget = () => {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="L2Dwidget"]');
    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.js';
    script.onload = () => {
      try {
        // @ts-ignore
        if (window.L2Dwidget) {
          // @ts-ignore - L2Dwidget is loaded dynamically
          window.L2Dwidget.init({
            model: {
              jsonPath: 'https://cdn.jsdelivr.net/gh/evrstr/live2d-widget-models/live2d_evrstr/rfb_1601/model.json',
              scale: 1.1
            },
            display: {
              position: 'right',
              width: 120,
              height: 250,
              hOffset: 20,
              vOffset: -20,
              superSample: 2
            },
            mobile: {
              show: true,
              scale: 0.5,
              motion: true
            },
            react: {
              opacityDefault: 1,
              opacityOnHover: 0.8
            },
            dialog: {
              enable: false
            }
          });
        }
        resolve(true);
      } catch (error) {
        console.warn('Live2D widget initialization failed:', error);
        resolve(true); // Still resolve to prevent blocking
      }
    };
    script.onerror = () => {
      console.warn('Failed to load Live2D widget script');
      resolve(true); // Still resolve to prevent blocking
    };
    document.body.appendChild(script);
  });
};

const ChatWidget = () => {
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL LOGIC
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { bellaState } = useChat();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const widgetInitialized = useRef(false);
  
  // Calculate conditions after all hooks
  const shouldHideWidget = location.pathname === '/admin-dashboard-secure-vny-access' || 
                          location.pathname.startsWith('/companion');

  // Initialize Live2D widget
  useEffect(() => {
    if (!widgetInitialized.current && !shouldHideWidget) {
      loadLive2DWidget();
      widgetInitialized.current = true;
    }
  }, [shouldHideWidget]);

  // Monitor for modal state changes
  useEffect(() => {
    if (shouldHideWidget) {
      return;
    }

    const checkModalState = () => {
      const modalOpen = document.querySelector('[data-state="open"]') !== null;
      setIsModalOpen(modalOpen);
    };

    checkModalState();
    const observer = new MutationObserver(checkModalState);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-state']
    });

    return () => observer.disconnect();
  }, [shouldHideWidget]);

  // Add click handler for the Live2D widget
  useEffect(() => {
    if (shouldHideWidget) {
      return;
    }
    
    const handleWidgetClick = (e: MouseEvent) => {
      const widgetContainer = document.querySelector('#live2d-widget');
      const ariaContainer = document.querySelector('#aria-live2d-widget');
      const canvas = document.querySelector('canvas');
      
      if (ariaContainer && ariaContainer.contains(e.target as Node)) {
        return;
      }
      
      const clickedOnWidget = widgetContainer && widgetContainer.contains(e.target as Node);
      const clickedOnCanvas = canvas && (canvas === e.target || canvas.contains(e.target as Node)) && !ariaContainer?.contains(canvas);
      
      if (clickedOnWidget || clickedOnCanvas) {
        e.stopPropagation();
        e.preventDefault();
        setIsOpen(prev => !prev);
        return false;
      }
    };

    const addListeners = () => {
      const widget = document.querySelector('#live2d-widget') as HTMLElement;
      if (widget) {
        widget.style.pointerEvents = 'auto';
        widget.style.cursor = 'pointer';
        widget.addEventListener('click', handleWidgetClick, true);
      }
      
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      const ariaContainer = document.querySelector('#aria-live2d-widget');
      if (canvas && !ariaContainer?.contains(canvas)) {
        canvas.style.pointerEvents = 'auto';
        canvas.style.cursor = 'pointer';
        canvas.addEventListener('click', handleWidgetClick, true);
      }
    };

    addListeners();
    const timer = setTimeout(addListeners, 2000);

    return () => {
      clearTimeout(timer);
      const widget = document.querySelector('#live2d-widget');
      const canvas = document.querySelector('canvas');
      const ariaContainer = document.querySelector('#aria-live2d-widget');
      
      if (widget) widget.removeEventListener('click', handleWidgetClick, true);
      if (canvas && !ariaContainer?.contains(canvas)) {
        canvas.removeEventListener('click', handleWidgetClick, true);
      }
    };
  }, [shouldHideWidget]);

  // CONDITIONAL RETURNS ONLY AFTER ALL HOOKS
  console.log('ChatWidget - Current pathname:', location.pathname);
  if (shouldHideWidget) {
    console.log('ChatWidget - Hiding widget for companion page');
    return null;
  }

  if (isModalOpen) {
    return null;
  }

  return (
    <>
      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <ChatInterface isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
      )}
      
      {/* Close Button when chat is open */}
      {isOpen && (
        <Button
          onClick={() => setIsOpen(false)}
          className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0 flex items-center justify-center shadow-lg bg-red-500 hover:bg-red-600 text-white"
          aria-label="Close chat"
        >
          <X className="h-6 w-6" />
        </Button>
      )}
    </>
  );
};

export default ChatWidget;