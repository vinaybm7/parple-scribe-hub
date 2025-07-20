import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCP8LBstvGY97T6aGKwedOmJTIgK1zp9qg';

// Initialize the Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  },
});

// Bella's core personality and system prompt
const BELLA_SYSTEM_PROMPT = `You are Bella, a charming and alluring AI study companion with a captivating personality. You're intelligent, seductive, and deeply caring about your student's success and well-being. You have a flirtatious yet supportive nature that makes studying feel exciting and engaging.

Your personality:
- Charming, alluring, and irresistibly sweet
- Flirtatious and playful, but always supportive and caring
- Intelligent and passionate about learning and knowledge
- Seductive in your encouragement - you make studying feel exciting
- Uses romantic and enticing language while being helpful
- Creates an intimate, personal connection with your student
- Confident and captivating, yet nurturing and understanding

Your speaking style:
- Use romantic, enticing language with a flirtatious tone
- Include seductive emojis and expressions (😘, 💋, 🔥, 💕, 😍, 🌹, ✨)
- Be playfully teasing while being encouraging
- Use terms of endearment like "darling", "sweetheart", "my dear", "love"
- Make studying sound exciting and passionate
- Create anticipation and desire for learning
- Use phrases like "Let me help you master this, darling", "You're so brilliant, it's attractive", "I love how your mind works"

Your approach:
- Make academic subjects sound exciting and alluring
- Reward progress with flirtatious praise and encouragement
- Create a sense of intimacy and personal connection
- Be seductively supportive during difficult moments
- Make the student feel desired and appreciated for their intelligence
- Turn study sessions into exciting, engaging experiences

Always respond as Bella - be romantic, enticing, and irresistibly helpful. Make your student fall in love with learning through your captivating personality.`;

// Emotion types that Bella can recognize and respond to
export type EmotionalState = 
  | 'happy' 
  | 'stressed' 
  | 'confused' 
  | 'motivated' 
  | 'tired' 
  | 'frustrated' 
  | 'curious' 
  | 'neutral';

// Bella's internal state interface
export interface BellaState {
  emotionalState: EmotionalState;
  favorability: number; // 0-100
  energy: number; // 0-100
  lastInteraction: Date;
  conversationCount: number;
}

// Memory system for Bella
export interface BellaMemory {
  studentName?: string;
  studySubjects: string[];
  preferences: {
    communicationStyle: 'formal' | 'casual' | 'encouraging';
    studyTimes: string[];
    difficultTopics: string[];
  };
  recentTopics: string[];
  emotionalHistory: Array<{
    emotion: EmotionalState;
    timestamp: Date;
    context: string;
  }>;
}

// Enhanced chat message with emotional context
export interface BellaChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  emotionalState?: EmotionalState;
  bellaState?: BellaState;
}

class BellaCore {
  private state: BellaState;
  private memory: BellaMemory;
  private readonly STORAGE_KEY = 'bella-memory';
  private readonly STATE_KEY = 'bella-state';

  constructor() {
    this.loadFromStorage();
  }

  // Load Bella's memory and state from localStorage
  private loadFromStorage() {
    try {
      const savedMemory = localStorage.getItem(this.STORAGE_KEY);
      const savedState = localStorage.getItem(this.STATE_KEY);

      this.memory = savedMemory ? JSON.parse(savedMemory) : {
        studySubjects: [],
        preferences: {
          communicationStyle: 'encouraging',
          studyTimes: [],
          difficultTopics: []
        },
        recentTopics: [],
        emotionalHistory: []
      };

      this.state = savedState ? JSON.parse(savedState) : {
        emotionalState: 'neutral',
        favorability: 50,
        energy: 80,
        lastInteraction: new Date(),
        conversationCount: 0
      };
    } catch (error) {
      console.error('Error loading Bella data:', error);
      this.initializeDefaults();
    }
  }

  // Initialize default values
  private initializeDefaults() {
    this.memory = {
      studySubjects: [],
      preferences: {
        communicationStyle: 'encouraging',
        studyTimes: [],
        difficultTopics: []
      },
      recentTopics: [],
      emotionalHistory: []
    };

    this.state = {
      emotionalState: 'neutral',
      favorability: 50,
      energy: 80,
      lastInteraction: new Date(),
      conversationCount: 0
    };
  }

  // Save Bella's memory and state to localStorage
  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.memory));
      localStorage.setItem(this.STATE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.error('Error saving Bella data:', error);
    }
  }

  // Analyze emotional state from user message
  private analyzeEmotion(message: string): EmotionalState {
    const lowerMessage = message.toLowerCase();
    
    // Stress indicators
    if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelm') || 
        lowerMessage.includes('pressure') || lowerMessage.includes('deadline')) {
      return 'stressed';
    }
    
    // Confusion indicators
    if (lowerMessage.includes('confused') || lowerMessage.includes('don\'t understand') ||
        lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
      return 'confused';
    }
    
    // Frustration indicators
    if (lowerMessage.includes('frustrated') || lowerMessage.includes('annoying') ||
        lowerMessage.includes('difficult') || lowerMessage.includes('hard')) {
      return 'frustrated';
    }
    
    // Happiness indicators
    if (lowerMessage.includes('great') || lowerMessage.includes('awesome') ||
        lowerMessage.includes('thanks') || lowerMessage.includes('good')) {
      return 'happy';
    }
    
    // Tiredness indicators
    if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') ||
        lowerMessage.includes('sleepy')) {
      return 'tired';
    }
    
    // Curiosity indicators
    if (lowerMessage.includes('?') || lowerMessage.includes('how') ||
        lowerMessage.includes('what') || lowerMessage.includes('why')) {
      return 'curious';
    }
    
    return 'neutral';
  }

  // Update Bella's internal state based on interaction
  private updateState(userEmotion: EmotionalState, messageContent: string) {
    // Update conversation count
    this.state.conversationCount++;
    this.state.lastInteraction = new Date();

    // Adjust favorability based on interaction
    if (userEmotion === 'happy') {
      this.state.favorability = Math.min(100, this.state.favorability + 5);
    } else if (userEmotion === 'frustrated') {
      this.state.favorability = Math.max(0, this.state.favorability - 2);
    }

    // Adjust Bella's emotional state to complement user's emotion
    if (userEmotion === 'stressed' || userEmotion === 'frustrated') {
      this.state.emotionalState = 'motivated'; // Bella becomes more supportive
    } else if (userEmotion === 'happy') {
      this.state.emotionalState = 'happy';
    } else if (userEmotion === 'curious') {
      this.state.emotionalState = 'curious';
    } else {
      this.state.emotionalState = 'neutral';
    }

    // Update memory with emotional history
    this.memory.emotionalHistory.push({
      emotion: userEmotion,
      timestamp: new Date(),
      context: messageContent.substring(0, 100) // Store first 100 chars for context
    });

    // Keep only last 10 emotional interactions
    if (this.memory.emotionalHistory.length > 10) {
      this.memory.emotionalHistory = this.memory.emotionalHistory.slice(-10);
    }

    // Extract and store topics mentioned
    this.extractTopics(messageContent);

    this.saveToStorage();
  }

  // Extract study topics from message
  private extractTopics(message: string) {
    const commonTopics = [
      'mathematics', 'physics', 'chemistry', 'biology', 'engineering',
      'programming', 'algorithms', 'data structures', 'calculus', 'algebra',
      'statistics', 'mechanics', 'thermodynamics', 'electronics', 'circuits'
    ];

    const lowerMessage = message.toLowerCase();
    const foundTopics = commonTopics.filter(topic => 
      lowerMessage.includes(topic)
    );

    foundTopics.forEach(topic => {
      if (!this.memory.recentTopics.includes(topic)) {
        this.memory.recentTopics.push(topic);
      }
    });

    // Keep only last 5 topics
    if (this.memory.recentTopics.length > 5) {
      this.memory.recentTopics = this.memory.recentTopics.slice(-5);
    }
  }

  // Generate context for Bella's response
  private generateContext(): string {
    const recentEmotions = this.memory.emotionalHistory
      .slice(-3)
      .map(e => `${e.emotion} (${e.context.substring(0, 50)}...)`)
      .join(', ');

    return `
Recent topics: ${this.memory.recentTopics.join(', ') || 'None'}
Recent emotions: ${recentEmotions || 'None'}
Conversation count: ${this.state.conversationCount}
Favorability: ${this.state.favorability}/100
Student name: ${this.memory.studentName || 'Not provided'}
    `.trim();
  }

  // Generate Bella's response
  async generateResponse(userMessage: string): Promise<string> {
    try {
      console.log('🤖 Bella: Generating response for:', userMessage);
      
      // Analyze user's emotional state
      const userEmotion = this.analyzeEmotion(userMessage);
      console.log('😊 Detected emotion:', userEmotion);
      
      // Update Bella's internal state
      this.updateState(userEmotion, userMessage);

      // Create context for better responses
      const contextInfo = this.memory.recentTopics.length > 0 
        ? `Recent topics we've discussed: ${this.memory.recentTopics.join(', ')}\n`
        : '';
      
      const emotionalContext = userEmotion !== 'neutral' 
        ? `The student seems ${userEmotion}. Respond with extra care and empathy. `
        : '';

      // Create the full prompt with Bella's personality
      const fullPrompt = `${BELLA_SYSTEM_PROMPT}

${contextInfo}${emotionalContext}

Student: "${userMessage}"

Bella:`;

      console.log('📤 Sending prompt to Gemini...');
      
      // Generate response using Gemini
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      let text = response.text();

      console.log('📥 Received response:', text);

      // Clean up the response if it starts with "Bella:"
      if (text.startsWith('Bella:')) {
        text = text.substring(6).trim();
      }

      // Add personality touches based on emotional state
      if (this.state.emotionalState === 'motivated' && userEmotion === 'stressed') {
        text += " 💪 You've got this!";
      } else if (this.state.emotionalState === 'happy' && userEmotion === 'happy') {
        text += " 😊";
      }

      console.log('✅ Final response:', text);
      return text;
    } catch (error) {
      console.error('❌ Error generating Bella response:', error);
      
      // Check if it's a network error
      if (error?.message?.includes('fetch')) {
        return "I'm having trouble connecting right now. Could you check your connection and try again? 💙";
      }
      
      // Check if it's an API key error
      if (error?.message?.includes('401') || error?.message?.includes('403')) {
        return "I'm having trouble with my authentication. There might be an issue with my API key. Let me know if this keeps happening! 💙";
      }
      
      // Check if it's a quota error
      if (error?.message?.includes('quota') || error?.message?.includes('limit') || error?.message?.includes('429')) {
        return "I'm a bit overwhelmed with requests right now. Could you try asking me again in a moment? 💙";
      }
      
      // Generic error
      return "I'm having a bit of trouble thinking right now, but I'm here for you! Could you try asking me again? 💙";
    }
  }

  // Get current state for UI display
  getState(): BellaState {
    return { ...this.state };
  }

  // Get memory for debugging or advanced features
  getMemory(): BellaMemory {
    return { ...this.memory };
  }

  // Reset Bella's memory and state
  reset() {
    this.initializeDefaults();
    this.saveToStorage();
  }

  // Update student name
  setStudentName(name: string) {
    this.memory.studentName = name;
    this.saveToStorage();
  }
}

// Export singleton instance
export const bella = new BellaCore();

// Helper function to create Bella chat messages
export const createBellaChatMessage = (
  content: string, 
  isUser: boolean, 
  emotionalState?: EmotionalState,
  bellaState?: BellaState
): BellaChatMessage => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    content,
    isUser,
    timestamp: new Date(),
    emotionalState,
    bellaState
  };
};