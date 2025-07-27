# Testing Guide for Parple Scribe Hub

This document provides comprehensive information about testing strategies, setup, and best practices for the Parple Scribe Hub project.

## 🧪 Testing Philosophy

Our testing approach follows the testing pyramid:
- **Unit Tests (70%)** - Test individual components and functions
- **Integration Tests (20%)** - Test component interactions
- **End-to-End Tests (10%)** - Test complete user workflows

## 🛠️ Testing Setup

### Installation
```bash
# Install testing dependencies
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  vitest \
  jsdom \
  @vitest/ui
```

### Configuration
Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## 📝 Unit Testing

### Component Testing
```typescript
// Example: Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-destructive');
  });
});
```

### Hook Testing
```typescript
// Example: useChat.test.ts
import { renderHook, act } from '@testing-library/react';
import { useChat } from '@/hooks/useChat';

describe('useChat Hook', () => {
  it('initializes with empty messages', () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.messages).toEqual([]);
  });

  it('sends message correctly', async () => {
    const { result } = renderHook(() => useChat());
    
    await act(async () => {
      await result.current.sendMessage('Hello');
    });
    
    expect(result.current.messages).toHaveLength(2); // User + AI response
  });
});
```

### Utility Function Testing
```typescript
// Example: utils.test.ts
import { formatFileSize, validateEmail } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1.00 KB');
      expect(formatFileSize(1048576)).toBe('1.00 MB');
      expect(formatFileSize(0)).toBe('0 Bytes');
    });
  });

  describe('validateEmail', () => {
    it('validates email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
    });
  });
});
```

## 🔗 Integration Testing

### API Integration
```typescript
// Example: api.test.ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { uploadFile, getFileUrl } from '@/lib/supabase';

const server = setupServer(
  rest.post('/storage/v1/object/notes/*', (req, res, ctx) => {
    return res(ctx.json({ path: 'test-file.pdf' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('File Operations', () => {
  it('uploads file successfully', async () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const result = await uploadFile(file, 'test-path');
    
    expect(result.data).toBeDefined();
    expect(result.error).toBeNull();
  });
});
```

### Component Integration
```typescript
// Example: ChatInterface.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChatInterface from '@/components/chat/ChatInterface';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('ChatInterface Integration', () => {
  it('sends and receives messages', async () => {
    render(<ChatInterface isOpen={true} onClose={() => {}} />, {
      wrapper: createWrapper(),
    });
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'Hello Bella' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText('Hello Bella')).toBeInTheDocument();
    });
  });
});
```

## 🎭 Mocking

### API Mocking
```typescript
// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    storage: {
      from: () => ({
        upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'mock-url' } }),
      }),
    },
  },
}));

// Mock Gemini AI
vi.mock('@/lib/gemini', () => ({
  generateAIResponse: vi.fn().mockResolvedValue('Mocked AI response'),
}));
```

### Component Mocking
```typescript
// Mock complex components
vi.mock('@/components/chat/ChatInterface', () => ({
  default: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="chat-interface">{isOpen ? 'Open' : 'Closed'}</div>
  ),
}));
```

## 🎯 End-to-End Testing

### Playwright Setup
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:8080',
    headless: true,
  },
  webServer: {
    command: 'npm run dev',
    port: 8080,
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Example
```typescript
// e2e/chat.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Chat Functionality', () => {
  test('user can chat with Bella', async ({ page }) => {
    await page.goto('/');
    
    // Open chat widget
    await page.click('[data-testid="chat-widget"]');
    
    // Send message
    await page.fill('[placeholder="Type your message..."]', 'Hello Bella');
    await page.click('button[type="submit"]');
    
    // Verify response
    await expect(page.locator('.chat-message')).toContainText('Hello Bella');
    await expect(page.locator('.chat-message')).toContainText('Hi!');
  });
});
```

## 📊 Test Coverage

### Coverage Configuration
```json
// package.json
{
  "scripts": {
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

### Coverage Targets
- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >80%
- **Lines**: >80%

## 🚀 Continuous Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:coverage
      - run: npm run build
```

## 🛡️ Testing Best Practices

### Do's
- ✅ Test user behavior, not implementation details
- ✅ Use descriptive test names
- ✅ Keep tests simple and focused
- ✅ Mock external dependencies
- ✅ Test error conditions
- ✅ Use data-testid for stable selectors

### Don'ts
- ❌ Test internal component state directly
- ❌ Write overly complex test setups
- ❌ Test third-party library functionality
- ❌ Ignore test failures
- ❌ Skip edge cases

## 🔧 Testing Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run E2E tests
npm run test:e2e

# Run specific test file
npm run test -- Button.test.tsx

# Run tests matching pattern
npm run test -- --grep "chat"
```

## 📚 Resources

- [Testing Library Documentation](https://testing-library.com/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)

Happy Testing! 🎉