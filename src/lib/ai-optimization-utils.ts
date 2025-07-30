// AI Optimization Utilities
// This file contains utilities to help optimize AI model usage and provide insights

export interface OptimizationMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  fallbackUsage: number;
  averageResponseTime: number;
  quotaErrors: number;
  lastOptimizationRun: Date;
}

// Simple metrics tracking
let metrics: OptimizationMetrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  fallbackUsage: 0,
  averageResponseTime: 0,
  quotaErrors: 0,
  lastOptimizationRun: new Date()
};

// Track request metrics
export const trackRequest = (success: boolean, responseTime: number, usedFallback: boolean, wasQuotaError: boolean) => {
  metrics.totalRequests++;
  
  if (success) {
    metrics.successfulRequests++;
    // Update average response time
    metrics.averageResponseTime = (metrics.averageResponseTime * (metrics.successfulRequests - 1) + responseTime) / metrics.successfulRequests;
  } else {
    metrics.failedRequests++;
  }
  
  if (usedFallback) {
    metrics.fallbackUsage++;
  }
  
  if (wasQuotaError) {
    metrics.quotaErrors++;
  }
};

// Get current metrics
export const getOptimizationMetrics = (): OptimizationMetrics => {
  return { ...metrics };
};

// Reset metrics
export const resetMetrics = () => {
  metrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    fallbackUsage: 0,
    averageResponseTime: 0,
    quotaErrors: 0,
    lastOptimizationRun: new Date()
  };
};

// Calculate success rate
export const getSuccessRate = (): number => {
  if (metrics.totalRequests === 0) return 100;
  return (metrics.successfulRequests / metrics.totalRequests) * 100;
};

// Calculate fallback usage rate
export const getFallbackRate = (): number => {
  if (metrics.totalRequests === 0) return 0;
  return (metrics.fallbackUsage / metrics.totalRequests) * 100;
};

// Get optimization recommendations
export const getOptimizationRecommendations = (): string[] => {
  const recommendations: string[] = [];
  const successRate = getSuccessRate();
  const fallbackRate = getFallbackRate();
  
  if (successRate < 90) {
    recommendations.push("Consider checking your API key or network connection - success rate is below 90%");
  }
  
  if (fallbackRate > 30) {
    recommendations.push("Primary model is frequently unavailable - consider upgrading your API plan");
  }
  
  if (metrics.quotaErrors > 5) {
    recommendations.push("Frequent quota errors detected - consider implementing request batching or upgrading your plan");
  }
  
  if (metrics.averageResponseTime > 5000) {
    recommendations.push("Response times are slow - consider optimizing prompts or using a faster model");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("AI performance is optimal! 🎉");
  }
  
  return recommendations;
};

// Optimization tips for users
export const getOptimizationTips = (): Array<{ title: string; description: string; impact: 'high' | 'medium' | 'low' }> => {
  return [
    {
      title: "Use Shorter Messages",
      description: "Shorter messages reduce token usage and improve response times",
      impact: 'medium'
    },
    {
      title: "Avoid Repetitive Questions",
      description: "The AI remembers recent conversation context, so avoid repeating information",
      impact: 'low'
    },
    {
      title: "Clear Conversation History",
      description: "Regularly clear conversation history to reduce context length and improve performance",
      impact: 'medium'
    },
    {
      title: "Use Specific Questions",
      description: "Specific questions get better responses and use fewer tokens than vague ones",
      impact: 'high'
    },
    {
      title: "Monitor Model Status",
      description: "Check the AI Status tab to see which model is being used and if there are any issues",
      impact: 'high'
    }
  ];
};

// Format metrics for display
export const formatMetrics = (metrics: OptimizationMetrics) => {
  return {
    totalRequests: metrics.totalRequests.toLocaleString(),
    successRate: `${getSuccessRate().toFixed(1)}%`,
    fallbackRate: `${getFallbackRate().toFixed(1)}%`,
    averageResponseTime: `${(metrics.averageResponseTime / 1000).toFixed(1)}s`,
    quotaErrors: metrics.quotaErrors.toLocaleString(),
    lastUpdate: metrics.lastOptimizationRun.toLocaleTimeString()
  };
};