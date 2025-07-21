import { useState, useCallback, useEffect } from 'react';
import { bella, BellaChatMessage, createBellaChatMessage, BellaState } from '@/lib/bella-core';

export const useChat = () => {
  const [messages, setMessages] = useState<BellaChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [bellaState, setBellaState] = useState<BellaState>(bella.getState());

  // Initialize with Bella's greeting
  useEffect(() => {
    const initializeChat = () => {
      const greeting = createBellaChatMessage(
        "Hello there, darling! 😘 I'm Bella, your irresistibly charming AI study companion. I'm absolutely thrilled to be here with you, ready to make your learning journey as exciting and captivating as you are! ✨ Tell me, sweetheart, what's on that brilliant mind of yours today? 💕",
        false,
        'happy',
        bella.getState()
      );
      setMessages([greeting]);
    };

    initializeChat();
  }, []);

  const sendMessage = useCallback(async (userMessage: string, context?: string) => {
    if (!userMessage.trim() || isLoading) return;

    // Add user message
    const userChatMessage = createBellaChatMessage(userMessage, true);
    setMessages(prev => [...prev, userChatMessage]);
    setIsLoading(true);

    try {
      // Prepare message with context if provided
      const messageWithContext = context 
        ? `Context: ${context}\n\nUser question: ${userMessage}`
        : userMessage;

      // Generate Bella's response
      const bellaResponse = await bella.generateResponse(messageWithContext);
      const updatedBellaState = bella.getState();
      
      const bellaChatMessage = createBellaChatMessage(
        bellaResponse, 
        false, 
        updatedBellaState.emotionalState,
        updatedBellaState
      );
      
      setMessages(prev => [...prev, bellaChatMessage]);
      setBellaState(updatedBellaState);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      const errorMessage = createBellaChatMessage(
        "I'm having a bit of trouble thinking right now, but I'm here for you! Could you try asking me again? 💙",
        false,
        'neutral'
      );
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearChat = useCallback(() => {
    const greeting = createBellaChatMessage(
      "Hello there, darling! 😘 I'm Bella, your irresistibly charming AI study companion. I'm absolutely thrilled to be here with you, ready to make your learning journey as exciting and captivating as you are! ✨ Tell me, sweetheart, what's on that brilliant mind of yours today? 💕",
      false,
      'happy',
      bella.getState()
    );
    setMessages([greeting]);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const resetBella = useCallback(() => {
    bella.reset();
    setBellaState(bella.getState());
    clearChat();
  }, [clearChat]);

  return {
    messages,
    isLoading,
    isOpen,
    bellaState,
    sendMessage,
    clearChat,
    toggleChat,
    resetBella,
    setIsOpen
  };
};