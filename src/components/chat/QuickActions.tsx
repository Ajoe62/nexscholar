'use client';

import { QUICK_ACTIONS } from '@/types/chat';

interface QuickActionsProps {
  onActionSelect: (message: string) => void;
}

export default function QuickActions({ onActionSelect }: QuickActionsProps) {
  return (
    <div className="p-3">
      <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
      <div className="grid grid-cols-2 gap-2">
        {QUICK_ACTIONS.slice(0, 6).map((action) => (
          <button
            key={action.id}
            onClick={() => onActionSelect(action.message)}
            className="flex items-center space-x-2 p-2 text-left text-xs text-gray-600 hover:bg-gray-50 rounded transition-colors"
          >
            <span>{action.icon}</span>
            <span className="truncate">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
