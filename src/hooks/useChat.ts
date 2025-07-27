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
        "Hi! ✨ I'm Bella, your friendly AI study companion. I'm here to help make your learning journey more enjoyable and successful. What can I help you with today? 💕",
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
        "I'm having trouble thinking right now, but I'm here for you! Try asking again? 💙",
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
      "Hi! ✨ I'm Bella, your friendly AI study companion. I'm here to help make your learning journey more enjoyable and successful. What can I help you with today? 💕",
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