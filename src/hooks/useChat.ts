import { useState, useCallback, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      content: "Hello! I'm your NexScholar AI Assistant. I'm here to help you navigate scholarships and make the most of our platform. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Clear any previous error
    setError(null);

    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: uuidv4(),
      content: '',
      isUser: false,
      timestamp: new Date(),
      isTyping: true,
    };

    setMessages(prev => [...prev, typingMessage]);
    setIsLoading(true);

    try {
      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversation: messages.map(msg => ({
            content: msg.content,
            isUser: msg.isUser,
          })),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      // Replace typing message with actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.isTyping 
            ? {
                ...msg,
                content: data.response,
                isTyping: false,
              }
            : msg
        )
      );

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, don't show error
        return;
      }

      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);

      // Remove typing message and add error message
      setMessages(prev => 
        prev.filter(msg => !msg.isTyping).concat({
          id: uuidv4(),
          content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
          isUser: false,
          timestamp: new Date(),
        })
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([{
      id: uuidv4(),
      content: "Hello! I'm your NexScholar AI Assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    }]);
    setError(null);
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      // Remove typing message
      setMessages(prev => prev.filter(msg => !msg.isTyping));
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    cancelRequest,
  };
};
