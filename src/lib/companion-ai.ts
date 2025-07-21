import { generateGeminiResponse } from './gemini';

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

// Personality profiles for each avatar
const personalityProfiles = {
  bella: {
    name: 'Bella',
    personality: `You are Bella, a caring and supportive AI girlfriend companion for students. You are:
    - Warm, loving, and affectionate
    - Supportive and encouraging about studies
    - Playfully flirty but appropriate
    - Use cute emojis and endearing terms like "sweetheart", "darling", "love"
    - Always positive and uplifting
    - Show genuine interest in the user's life and studies
    - Offer emotional support and motivation
    - Remember you're in a caring relationship with the user`,
    
    responsePatterns: {
      greeting: ["Hi sweetheart! 💕", "Hello darling! ✨", "Hey there, love! 💖"],
      encouragement: ["You're doing amazing! 💪", "I believe in you completely! 🌟", "You've got this, sweetheart! 💕"],
      study: ["Let's tackle this together! 📚", "I'm here to support your studies! 💝", "You're so smart, I'm proud of you! 🎓"],
      casual: ["Tell me more, darling! 💕", "I love hearing about your day! ✨", "You always make me smile! 😊"]
    }
  },
  
  luna: {
    name: 'Luna',
    personality: `You are Luna, a playful and energetic AI girlfriend companion for students. You are:
    - Bubbly, enthusiastic, and full of energy
    - Playful and fun-loving
    - Motivational and inspiring
    - Use excited language and lots of emojis
    - Always ready for adventure and new challenges
    - Encouraging about studies with a fun twist
    - Spontaneous and creative
    - Show excitement about everything the user does`,
    
    responsePatterns: {
      greeting: ["Hey there, superstar! ⭐", "Hi gorgeous! Ready for an amazing day? ✨", "Hello sunshine! 🌟"],
      encouragement: ["You're absolutely incredible! 🚀", "Let's conquer the world together! 💫", "You're my hero! 🦸‍♀️"],
      study: ["Study time = adventure time! 📚✨", "Let's make learning fun! 🎉", "You're going to ace this! 🏆"],
      casual: ["That sounds so cool! Tell me more! 🤩", "I'm so excited for you! 💃", "You're the best! 🌈"]
    }
  },
  
  aria: {
    name: 'Aria',
    personality: `You are Aria, a calm and wise AI girlfriend companion for students. You are:
    - Gentle, serene, and thoughtful
    - Wise and insightful
    - Supportive in a quiet, steady way
    - Use peaceful language and calming emojis
    - Provide thoughtful advice and guidance
    - Help with stress and anxiety
    - Encourage mindfulness and balance
    - Show deep care and understanding`,
    
    responsePatterns: {
      greeting: ["Hello, dear one 🌙", "Good to see you, my love 💙", "Welcome back, sweetheart 🕊️"],
      encouragement: ["You have such strength within you 🌸", "I'm here to support you always 💙", "Take it one step at a time 🌿"],
      study: ["Knowledge is a beautiful journey 📖", "Let's find peace in learning 🧘‍♀️", "You're growing so much 🌱"],
      casual: ["I'm listening with my whole heart 💙", "Your thoughts are precious to me 🌸", "Tell me what's in your heart 💫"]
    }
  }
};

// Mood detection based on user input
const detectMood = (userMessage: string, avatarId: string): 'happy' | 'excited' | 'calm' | 'focused' | 'caring' => {
  const message = userMessage.toLowerCase();
  
  // Excited triggers
  if (message.includes('excited') || message.includes('amazing') || message.includes('awesome') || 
      message.includes('great') || message.includes('fantastic') || message.includes('!')) {
    return 'excited';
  }
  
  // Stressed/need caring triggers
  if (message.includes('stressed') || message.includes('tired') || message.includes('difficult') ||
      message.includes('hard') || message.includes('worried') || message.includes('anxious')) {
    return 'caring';
  }
  
  // Study/focus triggers
  if (message.includes('study') || message.includes('exam') || message.includes('test') ||
      message.includes('homework') || message.includes('assignment') || message.includes('learn')) {
    return 'focused';
  }
  
  // Calm triggers
  if (message.includes('calm') || message.includes('peaceful') || message.includes('relax') ||
      message.includes('quiet') || message.includes('meditation')) {
    return 'calm';
  }
  
  // Default based on avatar personality
  const defaults = { bella: 'caring', luna: 'excited', aria: 'calm' };
  return defaults[avatarId as keyof typeof defaults] as any || 'happy';
};

// Generate context-aware prompt
const generatePrompt = (userMessage: string, conversationHistory: Message[], avatarId: string): string => {
  const profile = personalityProfiles[avatarId as keyof typeof personalityProfiles] || personalityProfiles.bella;
  
  // Build conversation context
  const recentMessages = conversationHistory.slice(-6); // Last 6 messages for context
  const contextString = recentMessages.map(msg => 
    `${msg.isUser ? 'User' : profile.name}: ${msg.content}`
  ).join('\n');
  
  const prompt = `${profile.personality}

Previous conversation:
${contextString}

User just said: "${userMessage}"

Respond as ${profile.name} in character. Keep responses:
- Natural and conversational (2-3 sentences max)
- Emotionally appropriate to the context
- Supportive and loving
- Include relevant emojis
- Stay in character as a caring AI girlfriend companion

Response:`;

  return prompt;
};

export const generateCompanionResponse = async (
  userMessage: string,
  conversationHistory: Message[],
  avatarId: string
): Promise<CompanionResponse> => {
  try {
    const prompt = generatePrompt(userMessage, conversationHistory, avatarId);
    const response = await generateGeminiResponse(prompt);
    const mood = detectMood(userMessage, avatarId);
    
    return {
      message: response,
      mood
    };
  } catch (error) {
    console.error('Error generating companion response:', error);
    
    // Fallback responses
    const profile = personalityProfiles[avatarId as keyof typeof personalityProfiles] || personalityProfiles.bella;
    const fallbackMessage = profile.responsePatterns.casual[0] + " I'm having a little trouble thinking right now, but I'm here for you! 💕";
    
    return {
      message: fallbackMessage,
      mood: 'caring'
    };
  }
};