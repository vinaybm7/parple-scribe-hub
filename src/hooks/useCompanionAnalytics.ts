import { useState, useCallback, useEffect } from 'react';

interface CompanionMetrics {
  sessionStartTime: Date;
  totalMessages: number;
  userMessages: number;
  companionMessages: number;
  averageResponseTime: number;
  moodDistribution: Record<string, number>;
  errorCount: number;
  voiceUsage: number;
  sessionDuration: number;
}

interface PerformanceMetrics {
  responseTime: number;
  mood: string;
  messageLength: number;
  timestamp: Date;
  error?: string;
}

export const useCompanionAnalytics = (avatarId: string) => {
  const [metrics, setMetrics] = useState<CompanionMetrics>({
    sessionStartTime: new Date(),
    totalMessages: 0,
    userMessages: 0,
    companionMessages: 0,
    averageResponseTime: 0,
    moodDistribution: {},
    errorCount: 0,
    voiceUsage: 0,
    sessionDuration: 0
  });

  const [performanceHistory, setPerformanceHistory] = useState<PerformanceMetrics[]>([]);

  // Update session duration every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        sessionDuration: Date.now() - prev.sessionStartTime.getTime()
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const trackMessage = useCallback((isUser: boolean, responseTime?: number, mood?: string, messageLength?: number) => {
    setMetrics(prev => {
      const newMetrics = {
        ...prev,
        totalMessages: prev.totalMessages + 1,
        userMessages: isUser ? prev.userMessages + 1 : prev.userMessages,
        companionMessages: !isUser ? prev.companionMessages + 1 : prev.companionMessages
      };

      // Update average response time for companion messages
      if (!isUser && responseTime) {
        const totalResponseTime = prev.averageResponseTime * prev.companionMessages + responseTime;
        newMetrics.averageResponseTime = totalResponseTime / newMetrics.companionMessages;
      }

      // Update mood distribution
      if (mood) {
        newMetrics.moodDistribution = {
          ...prev.moodDistribution,
          [mood]: (prev.moodDistribution[mood] || 0) + 1
        };
      }

      return newMetrics;
    });

    // Track performance metrics
    if (!isUser && responseTime && mood) {
      const performanceMetric: PerformanceMetrics = {
        responseTime,
        mood,
        messageLength: messageLength || 0,
        timestamp: new Date()
      };

      setPerformanceHistory(prev => [...prev.slice(-50), performanceMetric]); // Keep last 50 entries
    }
  }, []);

  const trackError = useCallback((error: string, responseTime?: number) => {
    setMetrics(prev => ({
      ...prev,
      errorCount: prev.errorCount + 1
    }));

    // Track error in performance history
    const errorMetric: PerformanceMetrics = {
      responseTime: responseTime || 0,
      mood: 'error',
      messageLength: 0,
      timestamp: new Date(),
      error
    };

    setPerformanceHistory(prev => [...prev.slice(-50), errorMetric]);
  }, []);

  const trackVoiceUsage = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      voiceUsage: prev.voiceUsage + 1
    }));
  }, []);

  const getSessionSummary = useCallback(() => {
    const duration = Date.now() - metrics.sessionStartTime.getTime();
    const durationMinutes = Math.round(duration / 60000);
    
    const topMood = Object.entries(metrics.moodDistribution)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'unknown';

    const averageMessageLength = performanceHistory.length > 0
      ? performanceHistory.reduce((sum, metric) => sum + metric.messageLength, 0) / performanceHistory.length
      : 0;

    return {
      avatar: avatarId,
      duration: durationMinutes,
      totalMessages: metrics.totalMessages,
      averageResponseTime: Math.round(metrics.averageResponseTime),
      topMood,
      errorRate: metrics.totalMessages > 0 ? (metrics.errorCount / metrics.totalMessages * 100).toFixed(1) : '0',
      voiceUsageRate: metrics.totalMessages > 0 ? (metrics.voiceUsage / metrics.totalMessages * 100).toFixed(1) : '0',
      averageMessageLength: Math.round(averageMessageLength)
    };
  }, [metrics, performanceHistory, avatarId]);

  const resetMetrics = useCallback(() => {
    setMetrics({
      sessionStartTime: new Date(),
      totalMessages: 0,
      userMessages: 0,
      companionMessages: 0,
      averageResponseTime: 0,
      moodDistribution: {},
      errorCount: 0,
      voiceUsage: 0,
      sessionDuration: 0
    });
    setPerformanceHistory([]);
  }, []);

  const getPerformanceInsights = useCallback(() => {
    if (performanceHistory.length < 5) return null;

    const recentMetrics = performanceHistory.slice(-10);
    const averageResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length;
    
    const insights = [];

    if (averageResponseTime > 3000) {
      insights.push('Response times are slower than usual. Consider optimizing AI requests.');
    }

    if (metrics.errorCount > metrics.totalMessages * 0.1) {
      insights.push('High error rate detected. Check API connectivity and error handling.');
    }

    const moodVariety = Object.keys(metrics.moodDistribution).length;
    if (moodVariety < 3 && metrics.totalMessages > 10) {
      insights.push('Limited mood variety. Consider enhancing mood detection algorithms.');
    }

    return insights.length > 0 ? insights : ['System performance is optimal!'];
  }, [performanceHistory, metrics]);

  return {
    metrics,
    performanceHistory,
    trackMessage,
    trackError,
    trackVoiceUsage,
    getSessionSummary,
    resetMetrics,
    getPerformanceInsights
  };
};