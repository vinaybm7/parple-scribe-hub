import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Trash2, Bot, Heart, Zap, RotateCcw, Smile, Frown, HelpCircle, Coffee, Brain, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChat } from '@/hooks/useChat';
import './chat-animations.css';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
  isEmbedded?: boolean;
}

const ChatInterface = ({ isOpen, onClose, context, isEmbedded = false }: ChatInterfaceProps) => {
  const { messages, isLoading, sendMessage, clearChat, bellaState, resetBella } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  // Initialize Live2D widget (only for non-embedded mode)
  useEffect(() => {
    if (typeof window === 'undefined' || !isOpen || widgetLoaded || isEmbedded) return;

    const loadLive2DWidget = () => {
      try {
        // @ts-expect-error - L2Dwidget is loaded dynamically
        if (window.L2Dwidget) {
          // @ts-expect-error - L2Dwidget is loaded dynamically
          // Add CSS to hide gradient elements
          const style = document.createElement('style');
          style.textContent = `
            #live2d-widget [style*="gradient"]:not(canvas),
            #live2d-widget [style*="linear-gradient"]:not(canvas) {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }
            #live2d-widget {
              overflow: visible !important;
            }
          `;
          document.head.appendChild(style);

          window.L2Dwidget.init({
            model: {
              jsonPath: 'https://cdn.jsdelivr.net/gh/evrstr/live2d-widget-models/live2d_evrstr/tia/model.json',
              scale: 1.1
            },
            display: {
              position: 'right',
              width: 200,
              height: 200,
              hOffset: 0,
              vOffset: 0
            },
            mobile: {
              show: true,
              scale: 0.8
            },
            react: {
              opacityDefault: 1,
              opacityOnHover: 0.8
            },
            dialog: {
              enable: false
            }
          });
          setWidgetLoaded(true);
        } else {
          // If L2Dwidget is not available, load the script
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.js';
          script.onload = () => {
            loadLive2DWidget();
          };
          script.onerror = () => {
            console.warn('Failed to load Live2D widget');
            setWidgetLoaded(true); // Prevent infinite retries
          };
          document.body.appendChild(script);
        }
      } catch (error) {
        console.warn('Live2D widget initialization failed:', error);
        setWidgetLoaded(true); // Prevent infinite retries
      }
    };

    loadLive2DWidget();

    return () => {
      // Cleanup if needed
    };
  }, [isOpen, widgetLoaded, isEmbedded]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get emotion icon for Bella's current state
  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return <Smile className="w-3 h-3 text-green-500" />;
      case 'stressed':
        return <Frown className="w-3 h-3 text-red-500" />;
      case 'confused':
        return <HelpCircle className="w-3 h-3 text-yellow-500" />;
      case 'motivated':
        return <Zap className="w-3 h-3 text-blue-500" />;
      case 'tired':
        return <Coffee className="w-3 h-3 text-orange-500" />;
      case 'curious':
        return <Brain className="w-3 h-3 text-purple-500" />;
      case 'frustrated':
        return <Frown className="w-3 h-3 text-red-400" />;
      default:
        return <Heart className="w-3 h-3 text-pink-500" />;
    }
  };

  if (!isOpen) return null;

  // Different styling for embedded vs floating mode
  const containerClass = isEmbedded
    ? "h-full flex flex-col"
    : "fixed top-24 right-4 w-96 sm:w-[420px] h-[700px] z-[70] animate-in slide-in-from-top-2 duration-300";

  const cardClass = isEmbedded
    ? "h-full flex flex-col border-0 shadow-none bg-transparent"
    : "h-full flex flex-col shadow-2xl border-2 bg-gradient-to-b from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20";

  return (
    <div className={containerClass}>
      <Card className={cardClass}>
        {/* Header with Controls */}
        <div className="flex items-center justify-between p-3 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="w-5 h-5 text-pink-600" />
            Bella
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetBella}
              className="h-8 w-8 p-0"
              title="Reset Bella"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="h-8 w-8 p-0"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Live2D Widget Section - Only show in non-embedded mode */}
        {!isEmbedded && (
          <div className="flex flex-col items-center p-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30">
            <div id="live2d-widget" className="relative w-full flex justify-center items-center" style={{ height: '200px' }}>
              {/* Live2D widget will be injected here */}
            </div>

            {/* Bella's Status */}
            <div className="mt-3 w-full space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span className="text-muted-foreground">Favorability</span>
                </div>
                <span className="font-medium">{bellaState.favorability}%</span>
              </div>
              <Progress value={bellaState.favorability} className="h-2" />

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>Energy: {bellaState.energy}%</span>
                </div>
                <div className="capitalize">
                  Mood: {bellaState.emotionalState}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Embedded mode header */}
        {isEmbedded && (
          <div className="p-3 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <span className="font-medium">Chat with Bella</span>
            </div>
          </div>
        )}

        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-900">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-pink-100 border-2 border-pink-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-pink-600" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-2 mr-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="border-t bg-background">
          <ChatInput onSendMessage={sendMessage} isLoading={isLoading} context={context} />
        </div>
      </Card>


    </div>
  );
};

export default ChatInterface;