import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCP8LBstvGY97T6aGKwedOmJTIgK1zp9qg';

// Initialize the Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);

// Get the generative model
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Study assistant system prompt
const STUDY_ASSISTANT_PROMPT = `You are a helpful AI study assistant for engineering students using Parple Notes - a platform for organizing and sharing study materials. 

Your role is to:
- Help students with their studies and academic questions
- Provide explanations for engineering concepts
- Give study tips and learning strategies
- Help with note organization and study planning
- Answer questions about various engineering subjects
- Be encouraging and supportive

Keep responses concise but helpful. If asked about topics outside of academics/studying, politely redirect to study-related topics.

Student Question: `;

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const generateAIResponse = async (userMessage: string): Promise<string> => {
  try {
    console.log('Generating AI response for:', userMessage);
    
    const prompt = STUDY_ASSISTANT_PROMPT + userMessage;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('AI response generated successfully');
    return text;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";
  }
};

export const createChatMessage = (content: string, isUser: boolean): ChatMessage => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    content,
    isUser,
    timestamp: new Date()
  };
};