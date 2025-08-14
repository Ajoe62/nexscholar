'use client';

import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useChat } from '@/hooks/useChat';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';

interface ChatWindowProps {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const { messages, isLoading, error, sendMessage, clearChat, cancelRequest } = useChat();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">AI</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">NexScholar Assistant</h3>
            <p className="text-xs text-gray-600">Here to help with scholarships</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearChat}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear chat"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Close chat"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
      </div>

      {/* Quick Actions - Placeholder for future implementation */}
      {messages.length <= 1 && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => sendMessage("How do I apply for scholarships?")}
              className="px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              How to apply for scholarships?
            </button>
            <button 
              onClick={() => sendMessage("What scholarships are available?")}
              className="px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Show available scholarships
            </button>
            <button 
              onClick={() => sendMessage("Help me find scholarships matching my profile")}
              className="px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Find matching scholarships
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200">
        <MessageInput 
          onSendMessage={sendMessage} 
          isLoading={isLoading}
          onCancel={cancelRequest}
        />
      </div>
    </div>
  );
}
