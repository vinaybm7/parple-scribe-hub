# 📚 Parple Scribe Hub

> **A comprehensive study companion platform with AI-powered assistants and intelligent note management**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/vinaybm7/parple-scribe-hub)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🌟 Features

### 📖 **Smart Note Management**
- **File Upload & Organization** - Upload and categorize study materials by year, semester, and subject
- **Advanced File Viewer** - Preview PDFs, images, and documents with integrated chat support
- **Search & Filter** - Quickly find materials with intelligent search functionality
- **Download Management** - Secure file storage and retrieval system

### 🤖 **AI Companions**
- **Bella** - Friendly study companion for general academic support
- **Luna** - Energetic motivational assistant for study sessions
- **Aria** - Calm, wise companion for stress relief and mindfulness

### 🎯 **Key Capabilities**
- **Real-time Chat** - Interactive conversations with AI companions
- **Voice Integration** - ElevenLabs TTS for natural voice responses
- **Emotional Intelligence** - AI companions adapt to your mood and needs
- **Study Analytics** - Track your learning progress and patterns
- **Responsive Design** - Works seamlessly on desktop and mobile

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm (install with [nvm](https://github.com/nvm-sh/nvm))
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/vinaybm7/parple-scribe-hub.git

# Navigate to project directory
cd parple-scribe-hub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys (see Configuration section)

# Start development server
npm run dev
```

Visit `http://localhost:8080` to see the application running.

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# AI Configuration
VITE_GEMINI_API_KEY=your-gemini-api-key

# ElevenLabs Voice Configuration
VITE_ELEVENLABS_API_KEY=your-elevenlabs-api-key
VITE_ELEVENLABS_BELLA_VOICE_ID=your-bella-voice-id
VITE_ELEVENLABS_LUNA_VOICE_ID=your-luna-voice-id
VITE_ELEVENLABS_ARIA_VOICE_ID=your-aria-voice-id
```

### API Keys Setup
- **Supabase**: Create project at [supabase.com](https://supabase.com)
- **Google Gemini**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **ElevenLabs**: Sign up at [elevenlabs.io](https://elevenlabs.io) for voice synthesis

## 🏗️ Tech Stack

### **Frontend**
- **React 18.3.1** - Modern UI library with hooks
- **TypeScript 5.8.3** - Type-safe JavaScript
- **Vite 5.4.19** - Fast build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible component library

### **Backend & Services**
- **Supabase** - Database, authentication, and file storage
- **Google Gemini AI** - Advanced language model for conversations
- **ElevenLabs** - High-quality text-to-speech synthesis
- **React Query** - Server state management and caching

### **Key Libraries**
- **React Router** - Client-side routing
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation

## 📁 Project Structure

```
parple-scribe-hub/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── chat/           # Chat system components
│   │   ├── companion/      # AI companion interfaces
│   │   ├── ui/             # Base UI components
│   │   └── admin/          # Admin dashboard components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Core utilities and services
│   │   ├── bella-core.ts   # Bella AI companion logic
│   │   ├── companion-ai.ts # Luna/Aria AI logic
│   │   ├── supabase.ts     # Database operations
│   │   └── elevenlabs.ts   # Voice synthesis
│   ├── pages/              # Route components
│   └── types/              # TypeScript definitions
├── public/                 # Static assets
└── docs/                   # Documentation files
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler

# Utilities
npm run update-elevenlabs-key  # Update ElevenLabs API key
```

## 🧪 Testing & Quality

### Unit Testing
Unit tests verify individual components and functions work correctly:

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Example test structure
src/
├── components/
│   ├── Button.test.tsx     # Component tests
│   └── Button.tsx
├── lib/
│   ├── utils.test.ts       # Utility function tests
│   └── utils.ts
└── hooks/
    ├── useChat.test.ts     # Custom hook tests
    └── useChat.ts
```

**What Unit Tests Include:**
- **Component Rendering** - Verify components render without crashing
- **User Interactions** - Test button clicks, form submissions, input changes
- **Props Handling** - Ensure components handle different prop combinations
- **State Management** - Test state updates and side effects
- **API Integration** - Mock API calls and test responses
- **Error Handling** - Verify graceful error handling

### Code Quality Tools
- **ESLint** - Code linting and style enforcement
- **TypeScript** - Static type checking
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks

## 📊 Performance Monitoring

A comprehensive performance monitoring system includes:

### **1. Core Web Vitals**
```javascript
// Example monitoring setup
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Track Core Web Vitals
getCLS(console.log);  // Cumulative Layout Shift
getFID(console.log);  // First Input Delay
getFCP(console.log);  // First Contentful Paint
getLCP(console.log);  // Largest Contentful Paint
getTTFB(console.log); // Time to First Byte
```

### **2. Application Performance Metrics**
- **Bundle Size Analysis** - Track JavaScript bundle sizes
- **Load Time Monitoring** - Page load and route transition times
- **Memory Usage** - Monitor memory leaks and usage patterns
- **API Response Times** - Track backend service performance
- **Error Rates** - Monitor JavaScript errors and crashes

### **3. User Experience Metrics**
- **User Journey Tracking** - Monitor user flows and drop-off points
- **Feature Usage Analytics** - Track which features are used most
- **Session Duration** - Average time users spend in the app
- **Conversion Rates** - Track goal completions and success metrics

### **4. Real-time Monitoring Tools**
- **Sentry** - Error tracking and performance monitoring
- **Google Analytics** - User behavior and traffic analysis
- **Vercel Analytics** - Deployment and performance insights
- **LogRocket** - Session replay and debugging

### **5. Custom Metrics Dashboard**
```typescript
// Example custom metrics
interface PerformanceMetrics {
  chatResponseTime: number;
  fileUploadSuccess: number;
  aiCompanionEngagement: number;
  searchQueryLatency: number;
  userRetentionRate: number;
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Platforms
- **Vercel** (Recommended) - Automatic deployments from Git
- **Netlify** - Static site hosting with serverless functions
- **AWS S3 + CloudFront** - Custom cloud deployment

### Environment Setup
1. Set up production environment variables
2. Configure domain and SSL certificates
3. Set up monitoring and analytics
4. Configure error tracking

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all linting passes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Lovable Platform** - Initial project scaffolding
- **Supabase Team** - Backend infrastructure
- **Google AI** - Gemini language model
- **ElevenLabs** - Voice synthesis technology
- **Open Source Community** - Various libraries and tools

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/vinaybm7/parple-scribe-hub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/vinaybm7/parple-scribe-hub/discussions)
- **Email**: support@parplescribehub.com

---

**Made with ❤️ by the Parple Scribe Hub Team**
