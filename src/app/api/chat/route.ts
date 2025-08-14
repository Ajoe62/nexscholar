import { NextRequest, NextResponse } from 'next/server';
import { groq, GROQ_MODEL } from '@/lib/groq';
import { getContextualPrompt } from '@/lib/chat-context';

export async function POST(request: NextRequest) {
  try {
    const { message, conversation = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Build conversation context
    const messages: any[] = [
      {
        role: 'system',
        content: getContextualPrompt(message)
      }
    ];

    // Add conversation history (last 10 messages to avoid token limits)
    const recentConversation = conversation.slice(-10);
    for (const msg of recentConversation) {
      messages.push({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      });
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    // Check if API key is properly configured
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_actual_groq_api_key_here') {
      // Return a fallback response for testing
      return NextResponse.json({
        response: "👋 Hi! I'm the NexScholar AI Assistant. I'm currently in demo mode since the API key isn't configured yet.\n\nOnce you add your Groq API key to the `.env.local` file, I'll be able to help you with:\n\n• Finding scholarships that match your profile\n• Application tips and guidance\n• Deadline reminders\n• General questions about the platform\n\nTo get started, please add your Groq API key to the environment variables!",
        timestamp: new Date().toISOString()
      });
    }

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages,
      max_tokens: 500,
      temperature: 0.7,
      stream: false,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Handle rate limiting
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Sorry, I encountered an error. Please try again.' },
      { status: 500 }
    );
  }
}
