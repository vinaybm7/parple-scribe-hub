import { useState, useCallback } from 'react';
import { generateCompanionResponse } from '@/lib/companion-ai';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  mood?: string;
}

interface CompanionResponse {
  message: string;
  mood: 'happy' | 'excited' | 'calm' | 'focused' | 'caring';
}

export const useCompanion = (avatarId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);

  const generateResponse = useCallback(async (
    userMessage: string, 
    messages: Message[]
  ): Promise<CompanionResponse> => {
    setIsLoading(true);
    
    try {
      const response = await generateCompanionResponse(userMessage, messages, avatarId);
      
      // Update conversation history
      setConversationHistory(prev => [...prev, {
        id: Date.now().toString(),
        content: userMessage,
        isUser: true,
        timestamp: new Date()
      }, {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isUser: false,
        timestamp: new Date(),
        mood: response.mood
      }]);

      return response;
    } catch (error) {
      console.error('Error generating companion response:', error);
      
      // Fallback response
      const fallbackResponses = {
        luna: {
          message: "Oops! My brain had a little hiccup there! ✨ Let's try that again, shall we?",
          mood: 'excited' as const
        },
        aria: {
          message: "I apologize, but I'm experiencing some difficulty processing that. Please give me a moment and try again.",
          mood: 'calm' as const
        }
      };

      return fallbackResponses[avatarId as keyof typeof fallbackResponses] || fallbackResponses.luna;
    } finally {
      setIsLoading(false);
    }
  }, [avatarId]);

  const sendMessage = useCallback(async (message: string) => {
    return generateResponse(message, conversationHistory);
  }, [generateResponse, conversationHistory]);

  const clearHistory = useCallback(() => {
    setConversationHistory([]);
  }, []);

  return {
    isLoading,
    conversationHistory,
    generateResponse,
    sendMessage,
    clearHistory
  };
};