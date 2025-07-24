import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Bot, Heart } from 'lucide-react';
import ChatInterface from './ChatInterface';
import { useChat } from '@/hooks/useChat';

// Load Live2D widget script dynamically
const loadLive2DWidget = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.js';
    script.onload = () => {
      // @ts-ignore
      if (window.L2Dwidget) {
        // @ts-ignore
        window.L2Dwidget.init({
          model: {
            jsonPath: 'https://cdn.jsdelivr.net/gh/evrstr/live2d-widget-models/live2d_evrstr/rfb_1601/model.json',
            scale: 1.2 // Slightly larger than original
          },
          display: {
            position: 'right',
            width: 120,
            height: 240,
            hOffset: 20,
            vOffset: -20,
            superSample: 2,
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
    };
    document.body.appendChild(script);
  });
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { bellaState } = useChat();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const widgetInitialized = useRef(false);

  // Initialize Live2D widget
  useEffect(() => {
    if (!widgetInitialized.current) {
      loadLive2DWidget();
      widgetInitialized.current = true;
    }
  }, []);

  // Monitor for modal state changes
  useEffect(() => {
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
  }, []);

  // Don't render the chat widget if a modal is open
  if (isModalOpen) {
    return null;
  }

  // Add click handler for the Live2D widget
  useEffect(() => {
    const handleWidgetClick = (e: MouseEvent) => {
      // Get the widget container and canvas
      const widgetContainer = document.querySelector('#live2d-widget');
      const canvas = document.querySelector('canvas');
      
      // Check if the click is on the widget or canvas
      const clickedOnWidget = widgetContainer && widgetContainer.contains(e.target as Node);
      const clickedOnCanvas = canvas && (canvas === e.target || canvas.contains(e.target as Node));
      
      if (clickedOnWidget || clickedOnCanvas) {
        e.stopPropagation();
        e.preventDefault();
        setIsOpen(prev => !prev); // Toggle chat on each click
        return false;
      }
    };

    // Add event listeners
    const addListeners = () => {
      const widget = document.querySelector('#live2d-widget') as HTMLElement;
      if (widget) {
        widget.style.pointerEvents = 'auto';
        widget.style.cursor = 'pointer';
        widget.addEventListener('click', handleWidgetClick, true);
      }
      
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        canvas.style.pointerEvents = 'auto';
        canvas.style.cursor = 'pointer';
        canvas.addEventListener('click', handleWidgetClick, true);
      }
    };

    // Try to add listeners immediately
    addListeners();
    
    // And also after a delay in case widget isn't ready yet
    const timer = setTimeout(addListeners, 2000);

    return () => {
      clearTimeout(timer);
      const widget = document.querySelector('#live2d-widget');
      const canvas = document.querySelector('canvas');
      
      if (widget) widget.removeEventListener('click', handleWidgetClick, true);
      if (canvas) canvas.removeEventListener('click', handleWidgetClick, true);
    };
  }, []);

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