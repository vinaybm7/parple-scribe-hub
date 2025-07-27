# Performance Monitoring Guide

This document outlines the comprehensive performance monitoring system for Parple Scribe Hub, including metrics, tools, and implementation strategies.

## 📊 Performance Monitoring Overview

Performance monitoring is crucial for maintaining a high-quality user experience. Our monitoring system tracks various metrics across different layers of the application.

## 🎯 Core Web Vitals

### What are Core Web Vitals?
Core Web Vitals are a set of real-world, user-centered metrics that quantify key aspects of user experience.

### Implementation
```typescript
// src/lib/performance.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface WebVital {
  name: string;
  value: number;
  id: string;
  delta: number;
}

const sendToAnalytics = (metric: WebVital) => {
  // Send to your analytics service
  console.log('Performance metric:', metric);
  
  // Example: Send to Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  getCLS(sendToAnalytics);  // Cumulative Layout Shift
  getFID(sendToAnalytics);  // First Input Delay
  getFCP(sendToAnalytics);  // First Contentful Paint
  getLCP(sendToAnalytics);  // Largest Contentful Paint
  getTTFB(sendToAnalytics); // Time to First Byte
};
```

### Metrics Explained

#### 1. **Largest Contentful Paint (LCP)**
- **What**: Time until the largest content element is rendered
- **Good**: ≤ 2.5 seconds
- **Needs Improvement**: 2.5 - 4.0 seconds
- **Poor**: > 4.0 seconds

#### 2. **First Input Delay (FID)**
- **What**: Time from first user interaction to browser response
- **Good**: ≤ 100 milliseconds
- **Needs Improvement**: 100 - 300 milliseconds
- **Poor**: > 300 milliseconds

#### 3. **Cumulative Layout Shift (CLS)**
- **What**: Visual stability of page elements
- **Good**: ≤ 0.1
- **Needs Improvement**: 0.1 - 0.25
- **Poor**: > 0.25

## 🚀 Application Performance Metrics

### Custom Performance Tracking
```typescript
// src/lib/analytics.ts
interface PerformanceMetrics {
  // Page Performance
  pageLoadTime: number;
  routeTransitionTime: number;
  componentRenderTime: number;
  
  // API Performance
  apiResponseTime: number;
  apiErrorRate: number;
  apiThroughput: number;
  
  // User Experience
  chatResponseTime: number;
  fileUploadTime: number;
  searchQueryTime: number;
  
  // Resource Usage
  memoryUsage: number;
  bundleSize: number;
  cacheHitRate: number;
}

class PerformanceTracker {
  private metrics: Partial<PerformanceMetrics> = {};
  
  // Track page load time
  trackPageLoad() {
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart;
    
    this.metrics.pageLoadTime = loadTime;
    this.sendMetric('page_load_time', loadTime);
  }
  
  // Track API response time
  trackApiCall(endpoint: string, startTime: number) {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    this.metrics.apiResponseTime = responseTime;
    this.sendMetric('api_response_time', responseTime, { endpoint });
  }
  
  // Track component render time
  trackComponentRender(componentName: string, renderTime: number) {
    this.sendMetric('component_render_time', renderTime, { component: componentName });
  }
  
  // Track memory usage
  trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize / memory.totalJSHeapSize;
      
      this.metrics.memoryUsage = memoryUsage;
      this.sendMetric('memory_usage', memoryUsage);
    }
  }
  
  private sendMetric(name: string, value: number, labels?: Record<string, string>) {
    // Send to monitoring service
    console.log(`Metric: ${name}`, { value, labels });
  }
}

export const performanceTracker = new PerformanceTracker();
```

### React Performance Monitoring
```typescript
// src/hooks/usePerformanceMonitor.ts
import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>();
  
  useEffect(() => {
    renderStartTime.current = performance.now();
  });
  
  useEffect(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      performanceTracker.trackComponentRender(componentName, renderTime);
    }
  });
};

// Usage in components
const ChatInterface = () => {
  usePerformanceMonitor('ChatInterface');
  // Component logic...
};
```

## 📈 Monitoring Tools & Services

### 1. **Sentry** - Error & Performance Monitoring
```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  integrations: [
    new BrowserTracing({
      // Set sampling rate for performance monitoring
      tracePropagationTargets: ['localhost', /^https:\/\/yourapi\.domain\.com\/api/],
    }),
  ],
  tracesSampleRate: 0.1, // Capture 10% of transactions
  environment: process.env.NODE_ENV,
});

// Custom performance tracking
export const trackPerformance = (operation: string, duration: number) => {
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `${operation} took ${duration}ms`,
    level: 'info',
  });
};
```

### 2. **Google Analytics 4** - User Behavior
```typescript
// src/lib/gtag.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track custom events
export const trackChatInteraction = (companionType: string, responseTime: number) => {
  trackEvent('chat_interaction', 'AI Companion', companionType, responseTime);
};

export const trackFileUpload = (fileSize: number, uploadTime: number) => {
  trackEvent('file_upload', 'File Management', 'upload_success', uploadTime);
};
```

### 3. **Vercel Analytics** - Real User Monitoring
```typescript
// src/lib/vercel-analytics.ts
import { Analytics } from '@vercel/analytics/react';

// Add to your App component
export const App = () => {
  return (
    <>
      {/* Your app components */}
      <Analytics />
    </>
  );
};
```

### 4. **LogRocket** - Session Replay
```typescript
// src/lib/logrocket.ts
import LogRocket from 'logrocket';

if (process.env.NODE_ENV === 'production') {
  LogRocket.init(process.env.VITE_LOGROCKET_APP_ID!);
  
  // Identify users
  LogRocket.identify('user-id', {
    name: 'User Name',
    email: 'user@example.com',
  });
}

export const trackUserAction = (action: string, properties?: Record<string, any>) => {
  LogRocket.track(action, properties);
};
```

## 🎛️ Performance Dashboard

### Custom Metrics Dashboard
```typescript
// src/components/admin/PerformanceDashboard.tsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardMetrics {
  averageLoadTime: number;
  errorRate: number;
  activeUsers: number;
  apiLatency: number;
  memoryUsage: number;
}

const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  
  useEffect(() => {
    // Fetch metrics from your monitoring service
    fetchMetrics().then(setMetrics);
  }, []);
  
  if (!metrics) return <div>Loading...</div>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Average Load Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.averageLoadTime.toFixed(2)}s
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Error Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(metrics.errorRate * 100).toFixed(2)}%
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>API Latency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.apiLatency.toFixed(0)}ms
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

## 🔍 Performance Optimization Strategies

### 1. **Code Splitting**
```typescript
// Lazy load components
import { lazy, Suspense } from 'react';

const CompanionPage = lazy(() => import('@/pages/CompanionPage'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));

// Use in routes
<Route 
  path="/companion" 
  element={
    <Suspense fallback={<div>Loading...</div>}>
      <CompanionPage />
    </Suspense>
  } 
/>
```

### 2. **Bundle Analysis**
```bash
# Install bundle analyzer
npm install --save-dev @bundle-analyzer/webpack-plugin

# Analyze bundle
npm run build -- --analyze
```

### 3. **Image Optimization**
```typescript
// Lazy loading images
const LazyImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      style={{ opacity: isLoaded ? 1 : 0 }}
      {...props}
    />
  );
};
```

## 📊 Alerting & Notifications

### Performance Alerts
```typescript
// src/lib/alerts.ts
interface AlertThresholds {
  pageLoadTime: number;
  errorRate: number;
  apiLatency: number;
  memoryUsage: number;
}

const ALERT_THRESHOLDS: AlertThresholds = {
  pageLoadTime: 3000, // 3 seconds
  errorRate: 0.05,    // 5%
  apiLatency: 1000,   // 1 second
  memoryUsage: 0.8,   // 80%
};

export const checkPerformanceThresholds = (metrics: PerformanceMetrics) => {
  const alerts: string[] = [];
  
  if (metrics.pageLoadTime > ALERT_THRESHOLDS.pageLoadTime) {
    alerts.push(`High page load time: ${metrics.pageLoadTime}ms`);
  }
  
  if (metrics.apiErrorRate > ALERT_THRESHOLDS.errorRate) {
    alerts.push(`High error rate: ${(metrics.apiErrorRate * 100).toFixed(2)}%`);
  }
  
  if (alerts.length > 0) {
    sendAlert(alerts);
  }
};

const sendAlert = (alerts: string[]) => {
  // Send to Slack, email, or other notification service
  console.warn('Performance alerts:', alerts);
};
```

## 🎯 Performance Testing

### Load Testing with Artillery
```yaml
# artillery.yml
config:
  target: 'http://localhost:8080'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Browse and chat"
    flow:
      - get:
          url: "/"
      - think: 2
      - get:
          url: "/notes"
      - think: 3
      - post:
          url: "/api/chat"
          json:
            message: "Hello Bella"
```

### Lighthouse CI
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci && npm run build
      - run: npm install -g @lhci/cli@0.12.x
      - run: lhci autorun
```

## 📈 Reporting & Analytics

### Weekly Performance Reports
```typescript
// Generate automated reports
const generatePerformanceReport = async () => {
  const metrics = await fetchWeeklyMetrics();
  
  const report = {
    period: 'Last 7 days',
    averageLoadTime: metrics.avgLoadTime,
    errorRate: metrics.errorRate,
    userSatisfaction: metrics.userSatisfaction,
    topIssues: metrics.topIssues,
    improvements: calculateImprovements(metrics),
  };
  
  await sendReportEmail(report);
};
```

## 🛠️ Tools & Resources

### Recommended Tools
- **Sentry** - Error tracking and performance monitoring
- **Google Analytics** - User behavior analytics
- **Vercel Analytics** - Real user monitoring
- **LogRocket** - Session replay and debugging
- **Lighthouse** - Performance auditing
- **WebPageTest** - Detailed performance analysis

### Browser DevTools
- **Performance Tab** - Analyze runtime performance
- **Network Tab** - Monitor network requests
- **Memory Tab** - Track memory usage
- **Coverage Tab** - Find unused code

### Performance Budgets
Set performance budgets to maintain standards:
- **Bundle Size**: < 500KB gzipped
- **Load Time**: < 3 seconds
- **Time to Interactive**: < 5 seconds
- **Memory Usage**: < 50MB

## 🎯 Best Practices

### Do's
- ✅ Monitor real user metrics
- ✅ Set up automated alerts
- ✅ Regular performance audits
- ✅ Optimize critical rendering path
- ✅ Use performance budgets

### Don'ts
- ❌ Ignore performance metrics
- ❌ Only test on fast networks
- ❌ Skip mobile performance testing
- ❌ Overlook third-party scripts
- ❌ Forget about accessibility performance

## 📞 Support

For performance-related issues:
- Check the performance dashboard
- Review Sentry error reports
- Analyze Lighthouse scores
- Contact the development team

---

**Performance is a feature, not an afterthought!** 🚀