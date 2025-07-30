import { GoogleGenerativeAI } from '@google/generative-ai';
import { trackRequest } from './ai-optimization-utils';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCP8LBstvGY97T6aGKwedOmJTIgK1zp9qg';

// Initialize the Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);

// Model configuration with fallback strategy
const MODEL_CONFIG = {
  primary: 'gemini-1.5-flash',
  fallback: 'gemini-2.0-flash-exp', // Gemini 2.0 Flash as fallback
  generationConfig: {
    temperature: 0.8,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024, // Limit response length for efficiency
  }
};

// Rate limiting and error tracking
interface ModelStatus {
  isAvailable: boolean;
  lastError?: string;
  errorCount: number;
  lastUsed: number;
  cooldownUntil?: number;
}

const modelStatus: Record<string, ModelStatus> = {
  [MODEL_CONFIG.primary]: {
    isAvailable: true,
    errorCount: 0,
    lastUsed: 0
  },
  [MODEL_CONFIG.fallback]: {
    isAvailable: true,
    errorCount: 0,
    lastUsed: 0
  }
};

// Request queue and rate limiting
const requestQueue: Array<() => Promise<any>> = [];
let isProcessingQueue = false;
const RATE_LIMIT_DELAY = 1000; // 1 second between requests
const MAX_RETRIES = 2;
const COOLDOWN_DURATION = 5 * 60 * 1000; // 5 minutes cooldown after repeated failures

// Get the best available model
const getAvailableModel = () => {
  const now = Date.now();
  
  // Check if primary model is available
  const primaryStatus = modelStatus[MODEL_CONFIG.primary];
  if (primaryStatus.isAvailable && (!primaryStatus.cooldownUntil || now > primaryStatus.cooldownUntil)) {
    return genAI.getGenerativeModel({ 
      model: MODEL_CONFIG.primary,
      generationConfig: MODEL_CONFIG.generationConfig
    });
  }
  
  // Check if fallback model is available
  const fallbackStatus = modelStatus[MODEL_CONFIG.fallback];
  if (fallbackStatus.isAvailable && (!fallbackStatus.cooldownUntil || now > fallbackStatus.cooldownUntil)) {
    console.log('🔄 Using fallback model:', MODEL_CONFIG.fallback);
    return genAI.getGenerativeModel({ 
      model: MODEL_CONFIG.fallback,
      generationConfig: MODEL_CONFIG.generationConfig
    });
  }
  
  // If both models are in cooldown, use primary anyway (last resort)
  console.warn('⚠️ Both models in cooldown, using primary as last resort');
  return genAI.getGenerativeModel({ 
    model: MODEL_CONFIG.primary,
    generationConfig: MODEL_CONFIG.generationConfig
  });
};

// Mark model as failed and potentially put it in cooldown
const markModelFailed = (modelName: string, error: string) => {
  const status = modelStatus[modelName];
  if (!status) return;
  
  status.errorCount++;
  status.lastError = error;
  
  // Put model in cooldown after 3 consecutive failures
  if (status.errorCount >= 3) {
    status.cooldownUntil = Date.now() + COOLDOWN_DURATION;
    status.errorCount = 0; // Reset counter
    console.warn(`🚫 Model ${modelName} put in cooldown until ${new Date(status.cooldownUntil).toLocaleTimeString()}`);
  }
};

// Mark model as successful
const markModelSuccess = (modelName: string) => {
  const status = modelStatus[modelName];
  if (!status) return;
  
  status.errorCount = 0;
  status.lastUsed = Date.now();
  status.cooldownUntil = undefined;
};

// Process request queue with rate limiting
const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) {
      try {
        await request();
      } catch (error) {
        console.error('Queue request failed:', error);
      }
      
      // Rate limiting delay
      if (requestQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      }
    }
  }
  
  isProcessingQueue = false;
};

// Queue a request with rate limiting
const queueRequest = <T>(requestFn: () => Promise<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    const wrappedRequest = async () => {
      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    
    requestQueue.push(wrappedRequest);
    processQueue();
  });
};

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
  return queueRequest(async () => {
    const startTime = Date.now();
    let lastError: Error | null = null;
    let usedFallback = false;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        console.log(`Generating AI response (attempt ${attempt + 1}):`, userMessage.substring(0, 50) + '...');
        
        const model = getAvailableModel();
        const modelName = model.model;
        usedFallback = modelName !== MODEL_CONFIG.primary;
        
        const prompt = STUDY_ASSISTANT_PROMPT + userMessage;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Mark model as successful
        markModelSuccess(modelName);
        
        // Track successful request
        const responseTime = Date.now() - startTime;
        trackRequest(true, responseTime, usedFallback, false);
        
        console.log('AI response generated successfully');
        return text;
      } catch (error: any) {
        lastError = error;
        console.error(`AI response attempt ${attempt + 1} failed:`, error);
        
        // Check if it's a quota/rate limit error
        const errorMessage = error.message?.toLowerCase() || '';
        const isQuotaError = errorMessage.includes('quota') || 
                           errorMessage.includes('rate limit') || 
                           errorMessage.includes('resource exhausted') ||
                           errorMessage.includes('429');
        
        if (isQuotaError) {
          const model = getAvailableModel();
          markModelFailed(model.model, error.message);
          console.log('🔄 Quota exceeded, trying different model...');
        }
        
        // Wait before retry
        if (attempt < MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
        }
      }
    }
    
    // Track failed request
    const responseTime = Date.now() - startTime;
    const isQuotaError = lastError?.message?.toLowerCase().includes('quota') || false;
    trackRequest(false, responseTime, usedFallback, isQuotaError);
    
    console.error('All AI response attempts failed:', lastError);
    return "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";
  });
};

export const generateGeminiResponse = async (prompt: string): Promise<string> => {
  return queueRequest(async () => {
    const startTime = Date.now();
    let lastError: Error | null = null;
    let usedFallback = false;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        console.log(`Generating companion response (attempt ${attempt + 1})...`);
        
        const model = getAvailableModel();
        const modelName = model.model;
        usedFallback = modelName !== MODEL_CONFIG.primary;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Mark model as successful
        markModelSuccess(modelName);
        
        // Track successful request
        const responseTime = Date.now() - startTime;
        trackRequest(true, responseTime, usedFallback, false);
        
        console.log('Companion response generated successfully');
        return text;
      } catch (error: any) {
        lastError = error;
        console.error(`Companion response attempt ${attempt + 1} failed:`, error);
        
        // Check if it's a quota/rate limit error
        const errorMessage = error.message?.toLowerCase() || '';
        const isQuotaError = errorMessage.includes('quota') || 
                           errorMessage.includes('rate limit') || 
                           errorMessage.includes('resource exhausted') ||
                           errorMessage.includes('429');
        
        if (isQuotaError) {
          const model = getAvailableModel();
          markModelFailed(model.model, error.message);
          console.log('🔄 Quota exceeded, switching to fallback model...');
        }
        
        // Wait before retry with exponential backoff
        if (attempt < MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1)));
        }
      }
    }
    
    // Track failed request
    const responseTime = Date.now() - startTime;
    const isQuotaError = lastError?.message?.toLowerCase().includes('quota') || false;
    trackRequest(false, responseTime, usedFallback, isQuotaError);
    
    console.error('All companion response attempts failed:', lastError);
    return "I'm having a little trouble thinking right now, but I'm here for you! 💕";
  });
};

export const createChatMessage = (content: string, isUser: boolean): ChatMessage => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    content,
    isUser,
    timestamp: new Date()
  };
};

// Utility functions for monitoring and management
export const getModelStatus = () => {
  return {
    models: { ...modelStatus },
    queueLength: requestQueue.length,
    isProcessing: isProcessingQueue,
    config: MODEL_CONFIG
  };
};

export const resetModelStatus = (modelName?: string) => {
  if (modelName && modelStatus[modelName]) {
    modelStatus[modelName] = {
      isAvailable: true,
      errorCount: 0,
      lastUsed: 0
    };
    console.log(`✅ Reset status for model: ${modelName}`);
  } else {
    // Reset all models
    Object.keys(modelStatus).forEach(model => {
      modelStatus[model] = {
        isAvailable: true,
        errorCount: 0,
        lastUsed: 0
      };
    });
    console.log('✅ Reset status for all models');
  }
};

export const getCurrentModel = () => {
  const model = getAvailableModel();
  return model.model;
};

// Enhanced error detection for better fallback decisions
export const isTemporaryError = (error: any): boolean => {
  const errorMessage = error.message?.toLowerCase() || '';
  const temporaryErrors = [
    'quota',
    'rate limit',
    'resource exhausted',
    '429',
    '503',
    'service unavailable',
    'timeout',
    'network',
    'connection'
  ];
  
  return temporaryErrors.some(keyword => errorMessage.includes(keyword));
};

// Optimize prompt for better performance
export const optimizePrompt = (prompt: string): string => {
  // Remove excessive whitespace and newlines
  let optimized = prompt.replace(/\s+/g, ' ').trim();
  
  // Limit prompt length to prevent token overflow
  const MAX_PROMPT_LENGTH = 3000;
  if (optimized.length > MAX_PROMPT_LENGTH) {
    optimized = optimized.substring(0, MAX_PROMPT_LENGTH) + '...';
    console.log('📝 Prompt truncated for optimization');
  }
  
  return optimized;
};