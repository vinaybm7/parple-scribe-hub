import { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Coffee, Book, Smile } from 'lucide-react';

interface AvatarDisplayProps {
  avatarId: string;
  mood: 'happy' | 'excited' | 'calm' | 'focused' | 'caring';
  isTyping?: boolean;
  isSpeaking?: boolean;
}

const AvatarDisplay = ({ avatarId, mood, isTyping = false, isSpeaking = false }: AvatarDisplayProps) => {
  const [currentExpression, setCurrentExpression] = useState('neutral');
  const [eyeBlink, setEyeBlink] = useState(false);
  const [live2dLoaded, setLive2dLoaded] = useState(false);
  const widgetInitialized = useRef(false);

  // Avatar configurations
  const avatarConfig = {
    luna: {
      name: 'Luna',
      color: 'purple',
      gradient: 'from-purple-400 to-purple-600',
      bgGradient: 'from-purple-100 to-purple-200',
      darkBgGradient: 'dark:from-purple-900/30 dark:to-purple-800/30'
    },
    aria: {
      name: 'Aria',
      color: 'indigo',
      gradient: 'from-indigo-400 to-indigo-600',
      bgGradient: 'from-indigo-100 to-indigo-200',
      darkBgGradient: 'dark:from-indigo-900/30 dark:to-indigo-800/30'
    }
  };

  const config = avatarConfig[avatarId as keyof typeof avatarConfig] || avatarConfig.luna;

  // Initialize Live2D widget for Luna with Xisitina model
  const initializeLive2DForLuna = () => {
    if (avatarId !== 'luna' || widgetInitialized.current) return;

    const container = document.querySelector('#luna-live2d-widget');
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Create iframe to isolate Live2D instance
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = 'transparent';
    
    container.appendChild(iframe);

    // Write HTML content to iframe with Xisitina model
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            html, body { 
              margin: 0; 
              padding: 0; 
              background: transparent; 
              overflow: visible;
              height: 700px;
              width: 100%;
            }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;
            }
            #live2d-widget {
              position: relative !important;
              width: 380px !important;
              height: 650px !important;
              overflow: visible !important;
            }
            canvas {
              position: relative !important;
              left: 0 !important;
              top: 0 !important;
              transform: scale(0.9) translateY(-30px) !important;
              transform-origin: center center !important;
              overflow: visible !important;
            }
          </style>
        </head>
        <body>
          <script src="https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.js"></script>
          <script>
            console.log('🔍 LUNA LIVE2D DIAGNOSTICS - Starting initialization');
            
            L2Dwidget.init({
              "model": {
                "jsonPath": "https://cdn.jsdelivr.net/gh/evrstr/live2d-widget-models/live2d_evrstr/xisitina/model.json"
              },
              "display": {
                "position": "relative",
                "width": 380,
                "height": 650,
                "hOffset": 0,
                "vOffset": 0
              },
              "mobile": {
                "show": true,
                "scale": 0.7,
                "motion": true
              },
              "react": {
                "opacityDefault": 1,
                "opacityOnHover": 0.9
              },
              "dialog": {
                "enable": false
              }
            });
          </script>
        </body>
        </html>
      `);
      iframeDoc.close();

      // Mark as loaded after a delay
      setTimeout(() => {
        setLive2dLoaded(true);
        widgetInitialized.current = true;
      }, 2000);
    }
  };

  // Initialize Live2D widget for Aria with Sagiri model
  const initializeLive2DForAria = () => {
    if (avatarId !== 'aria' || widgetInitialized.current) return;

    const container = document.querySelector('#aria-live2d-widget');
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Create iframe to isolate Live2D instance
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = 'transparent';
    
    container.appendChild(iframe);

    // Write HTML content to iframe with Sagiri model
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            html, body { 
              margin: 0; 
              padding: 0; 
              background: transparent; 
              overflow: visible;
              height: 700px;
              width: 100%;
            }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;
            }
            #live2d-widget {
              position: relative !important;
              width: 380px !important;
              height: 650px !important;
              overflow: visible !important;
            }
            canvas {
              position: relative !important;
              left: 0 !important;
              top: 0 !important;
              transform: scale(0.85) translateY(-40px) !important;
              transform-origin: center center !important;
              overflow: visible !important;
            }
          </style>
        </head>
        <body>
          <script src="https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.js"></script>
          <script>
            // Add comprehensive logging for diagnostics
            console.log('🔍 ARIA LIVE2D DIAGNOSTICS - Starting initialization');
            console.log('🔍 Window dimensions:', window.innerWidth, 'x', window.innerHeight);
            console.log('🔍 Body dimensions:', document.body.offsetWidth, 'x', document.body.offsetHeight);
            
            L2Dwidget.init({
              "model": {
                "jsonPath": "https://cdn.jsdelivr.net/gh/evrstr/live2d-widget-models/live2d_evrstr/sagiri/model.json"
              },
              "display": {
                "position": "relative",
                "width": 380,
                "height": 650,
                "hOffset": 0,
                "vOffset": 0
              },
              "mobile": {
                "show": true,
                "scale": 0.7,
                "motion": true
              },
              "react": {
                "opacityDefault": 1,
                "opacityOnHover": 0.9
              },
              "dialog": {
                "enable": false
              }
            });
            
            // Monitor for widget creation and log positioning
            setTimeout(() => {
              const widget = document.querySelector('#live2d-widget');
              const canvas = document.querySelector('canvas');
              
              console.log('🔍 ARIA LIVE2D DIAGNOSTICS - After initialization');
              console.log('🔍 Widget element:', widget);
              console.log('🔍 Canvas element:', canvas);
              
              if (widget) {
                const widgetRect = widget.getBoundingClientRect();
                const widgetStyles = window.getComputedStyle(widget);
                console.log('🔍 Widget position:', widgetRect);
                console.log('🔍 Widget computed styles:', {
                  position: widgetStyles.position,
                  top: widgetStyles.top,
                  left: widgetStyles.left,
                  width: widgetStyles.width,
                  height: widgetStyles.height,
                  transform: widgetStyles.transform
                });
              }
              
              if (canvas) {
                const canvasRect = canvas.getBoundingClientRect();
                const canvasStyles = window.getComputedStyle(canvas);
                console.log('🔍 Canvas position:', canvasRect);
                console.log('🔍 Canvas computed styles:', {
                  position: canvasStyles.position,
                  top: canvasStyles.top,
                  left: canvasStyles.left,
                  width: canvasStyles.width,
                  height: canvasStyles.height,
                  transform: canvasStyles.transform
                });
                console.log('🔍 Canvas actual dimensions:', canvas.width, 'x', canvas.height);
                
                // Check if canvas is being clipped
                const parentRect = canvas.parentElement?.getBoundingClientRect();
                console.log('🔍 Canvas parent position:', parentRect);
                
                if (parentRect && canvasRect) {
                  const isClippedTop = canvasRect.top < parentRect.top;
                  const isClippedBottom = canvasRect.bottom > parentRect.bottom;
                  console.log('🔍 Canvas clipping analysis:', {
                    clippedTop: isClippedTop,
                    clippedBottom: isClippedBottom,
                    topDiff: canvasRect.top - parentRect.top,
                    bottomDiff: parentRect.bottom - canvasRect.bottom
                  });
                }
              }
            }, 2000);
            
            // Monitor for model loading completion
            setTimeout(() => {
              console.log('🔍 ARIA LIVE2D DIAGNOSTICS - Model should be loaded');
              const canvas = document.querySelector('canvas');
              if (canvas) {
                console.log('🔍 Final canvas position after model load:', canvas.getBoundingClientRect());
                console.log('🔍 Final canvas transform:', window.getComputedStyle(canvas).transform);
              }
            }, 4000);
          </script>
        </body>
        </html>
      `);
      iframeDoc.close();

      // Mark as loaded after a delay
      setTimeout(() => {
        console.log('🔍 ARIA CONTAINER DIAGNOSTICS - Main component');
        const container = document.querySelector('#aria-live2d-widget');
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const containerStyles = window.getComputedStyle(container);
          console.log('🔍 Main container position:', containerRect);
          console.log('🔍 Main container styles:', {
            height: containerStyles.height,
            paddingTop: containerStyles.paddingTop,
            overflow: containerStyles.overflow,
            display: containerStyles.display,
            alignItems: containerStyles.alignItems,
            justifyContent: containerStyles.justifyContent
          });
        }
        
        const iframe = container?.querySelector('iframe');
        if (iframe) {
          const iframeRect = iframe.getBoundingClientRect();
          console.log('🔍 Iframe position:', iframeRect);
          console.log('🔍 Iframe dimensions:', {
            width: iframe.style.width,
            height: iframe.style.height,
            actualWidth: iframe.offsetWidth,
            actualHeight: iframe.offsetHeight
          });
        }
        
        setLive2dLoaded(true);
        widgetInitialized.current = true;
      }, 2000);
    }
  };

  // Mood-based expressions and animations
  const getMoodIcon = () => {
    switch (mood) {
      case 'happy':
        return <Smile className="w-6 h-6 text-yellow-500" />;
      case 'excited':
        return <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />;
      case 'calm':
        return <Heart className="w-6 h-6 text-blue-500" />;
      case 'focused':
        return <Book className="w-6 h-6 text-green-500" />;
      case 'caring':
        return <Heart className="w-6 h-6 text-pink-500 animate-pulse" />;
      default:
        return <Heart className="w-6 h-6 text-gray-500" />;
    }
  };

  // Eye blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Expression changes based on mood
  useEffect(() => {
    setCurrentExpression(mood);
  }, [mood]);

  // Initialize Live2D for Aria and Luna
  useEffect(() => {
    if (avatarId === 'aria') {
      initializeLive2DForAria();
    } else if (avatarId === 'luna') {
      initializeLive2DForLuna();
    }

    // Cleanup function
    return () => {
      if (avatarId === 'aria') {
        const ariaWidget = document.querySelector('#aria-live2d-widget');
        if (ariaWidget) {
          ariaWidget.innerHTML = '';
        }
        widgetInitialized.current = false;
        setLive2dLoaded(false);
      } else if (avatarId === 'luna') {
        const lunaWidget = document.querySelector('#luna-live2d-widget');
        if (lunaWidget) {
          lunaWidget.innerHTML = '';
        }
        widgetInitialized.current = false;
        setLive2dLoaded(false);
      }
    };
  }, [avatarId]);

  // Render Live2D for Aria and Luna, 2D avatar for others
  if (avatarId === 'aria' || avatarId === 'luna') {
    return (
      <div className="flex flex-col items-center w-full">
        {/* Live2D Container for Aria and Luna - Full model display */}
        <div className="relative w-full flex items-center justify-center">
          {/* Live2D Widget Container - Full model visibility */}
          <div 
            id={`${avatarId}-live2d-widget`}
            className="flex items-center justify-center"
            style={{ width: '380px', height: '650px', overflow: 'visible', margin: '0 auto' }}
          />



          {/* Typing indicator for Live2D */}
          {isTyping && (
            <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-full px-3 py-2 shadow-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}


        </div>

        {/* Avatar name */}
        <div className="text-center mt-4 w-full flex justify-center">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{config.name}</h3>
        </div>
      </div>
    );
  }

  // Default 2D avatar for Luna and others
  return (
    <div className="flex flex-col items-center p-6">
      {/* Avatar Container */}
      <div className="relative mb-4">
        {/* Outer glow effect */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.gradient} opacity-20 blur-xl scale-110 ${isSpeaking ? 'animate-pulse' : ''}`} />
        
        {/* Main avatar circle */}
        <div className={`relative w-48 h-48 rounded-full bg-gradient-to-br ${config.bgGradient} ${config.darkBgGradient} border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden`}>
          {/* Avatar face */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-100/90 dark:to-gray-200/80 flex items-center justify-center">
            {/* Simple anime-style face */}
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              {/* Eyes */}
              <div className="flex space-x-6 mb-4">
                <div className={`w-4 h-4 bg-gray-800 rounded-full transition-all duration-150 ${eyeBlink ? 'scale-y-10' : 'scale-y-100'}`} />
                <div className={`w-4 h-4 bg-gray-800 rounded-full transition-all duration-150 ${eyeBlink ? 'scale-y-10' : 'scale-y-100'}`} />
              </div>
              
              {/* Mouth based on mood */}
              <div className="relative">
                {mood === 'happy' && (
                  <div className="w-6 h-3 border-b-2 border-gray-800 rounded-b-full" />
                )}
                {mood === 'excited' && (
                  <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce" />
                )}
                {mood === 'calm' && (
                  <div className="w-4 h-1 bg-gray-600 rounded-full" />
                )}
                {mood === 'focused' && (
                  <div className="w-3 h-3 border border-gray-800 rounded-full" />
                )}
                {mood === 'caring' && (
                  <div className="w-5 h-2 bg-pink-400 rounded-full" />
                )}
              </div>
            </div>
          </div>

          {/* Typing indicator */}
          {isTyping && (
            <div className="absolute bottom-2 right-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Mood indicator */}
        <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
          {getMoodIcon()}
        </div>


      </div>

      {/* Avatar name and status */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">{config.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {isTyping ? 'Typing...' : isSpeaking ? 'Speaking...' : `Feeling ${mood}`}
        </p>
      </div>

      {/* Floating hearts animation for caring mood */}
      {mood === 'caring' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              className="absolute w-4 h-4 text-pink-400 animate-bounce opacity-60"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 10}%`,
                animationDelay: `${i * 500}ms`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvatarDisplay;