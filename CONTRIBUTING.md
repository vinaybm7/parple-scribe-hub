# Contributing to Parple Scribe Hub

Thank you for your interest in contributing to Parple Scribe Hub! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/parple-scribe-hub.git`
3. Install dependencies: `npm install`
4. Copy environment variables: `cp .env.example .env`
5. Start development server: `npm run dev`

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Use functional components with hooks
- Implement proper error handling
- Add JSDoc comments for complex functions

### Component Structure
```typescript
// Example component structure
interface ComponentProps {
  title: string;
  onAction: () => void;
}

const Component = ({ title, onAction }: ComponentProps) => {
  // Hooks at the top
  const [state, setState] = useState(false);
  
  // Event handlers
  const handleClick = () => {
    onAction();
  };
  
  // Render
  return (
    <div className="component-class">
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  );
};

export default Component;
```

### Commit Messages
Use conventional commit format:
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `style: formatting changes`
- `refactor: code restructuring`
- `test: add or update tests`

### Pull Request Process
1. Create a feature branch from `main`
2. Make your changes with proper tests
3. Ensure all linting passes: `npm run lint`
4. Update documentation if needed
5. Submit pull request with clear description

## 🧪 Testing

### Running Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Writing Tests
- Write unit tests for new components
- Test user interactions and edge cases
- Mock external dependencies
- Aim for >80% code coverage

## 🐛 Bug Reports

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

## 💡 Feature Requests

For new features:
- Check existing issues first
- Provide clear use case
- Consider implementation complexity
- Discuss with maintainers before starting

## 📚 Documentation

- Update README.md for new features
- Add JSDoc comments for functions
- Update API documentation
- Include examples in documentation

## 🔒 Security

- Never commit API keys or secrets
- Use environment variables for configuration
- Follow security best practices
- Report security issues privately

## 📞 Getting Help

- Check existing documentation
- Search GitHub issues
- Ask questions in discussions
- Contact maintainers for complex issues

Thank you for contributing to Parple Scribe Hub! 🎉