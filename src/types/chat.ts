export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatConversation {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuickAction {
  id: string;
  label: string;
  message: string;
  icon?: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'find-scholarships',
    label: 'Find Scholarships',
    message: 'How can I find scholarships that match my profile?',
    icon: '🎓'
  },
  {
    id: 'application-tips',
    label: 'Application Tips',
    message: 'What are some tips for a strong scholarship application?',
    icon: '📝'
  },
  {
    id: 'essay-help',
    label: 'Essay Writing',
    message: 'How do I write a compelling scholarship essay?',
    icon: '✍️'
  },
  {
    id: 'deadlines',
    label: 'Manage Deadlines',
    message: 'How can I keep track of scholarship deadlines?',
    icon: '⏰'
  },
  {
    id: 'profile-help',
    label: 'Profile Setup',
    message: 'How do I optimize my profile for better scholarship matches?',
    icon: '👤'
  },
  {
    id: 'events',
    label: 'Events & Workshops',
    message: 'What educational events are available on the platform?',
    icon: '🎪'
  }
];
