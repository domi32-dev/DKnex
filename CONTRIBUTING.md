# Contributing to DkNex

Thank you for your interest in contributing to DkNex! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs
- Use the GitHub issue tracker
- Include detailed steps to reproduce
- Provide environment information
- Include error messages and logs

### Suggesting Features
- Check existing issues first
- Provide clear use case descriptions
- Include mockups if applicable
- Consider implementation complexity

### Code Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Commit with conventional commit messages
7. Push to your branch
8. Create a Pull Request

## 📝 Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL
- Git

### Installation

#### Option 1: Quick Setup (Recommended)
```bash
# Clone your fork (replace YOUR_USERNAME with your GitHub username)
git clone https://github.com/YOUR_USERNAME/dknex.git
cd dknex

# One-command setup (includes Docker database)
npm run setup:dev

# Start development server
npm run dev
```

#### Option 2: Manual Setup
```bash
# Clone your fork (replace YOUR_USERNAME with your GitHub username)
git clone https://github.com/YOUR_USERNAME/dknex.git
cd dknex

# Install dependencies
npm install

# Set up environment
cp env.example .env.local
# Edit .env.local with your configuration

# Set up database (choose one)
# Option A: Using Docker
npm run db:docker:up

# Option B: Local PostgreSQL
# Install PostgreSQL and create database 'dknex'

# Run database setup
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
```

#### Demo Mode
For quick testing without setting up authentication:
```bash
# In .env.local
DEMO_MODE=true
NEXT_PUBLIC_DEMO_MODE=true
```

Then use: `demo@dknex.com` / `Demo123!@#`

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:ui
```

### Writing Tests
- Write tests for new features
- Maintain test coverage above 80%
- Use descriptive test names
- Follow the existing test patterns

## 📋 Code Style

### TypeScript
- Use strict TypeScript settings
- Define proper types for all functions
- Avoid `any` type
- Use interfaces for object shapes

### React Components
- Use functional components with hooks
- Follow naming conventions
- Keep components focused and small
- Use proper prop types

### Styling
- Use Tailwind CSS classes
- Follow the design system
- Ensure responsive design
- Maintain accessibility standards

## 🔄 Git Workflow

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements

### Commit Messages
Use conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance

### Pull Request Process
1. Update documentation if needed
2. Add tests for new functionality
3. Ensure CI/CD passes
4. Request review from maintainers
5. Address feedback
6. Merge when approved

## 🐛 Bug Reports

### Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Safari, Firefox]
- Version: [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

## 💡 Feature Requests

### Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 📞 Getting Help

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions and ideas
- **Email**: Contact the maintainer directly for urgent matters

## 🎯 Areas for Contribution

### High Priority
- Performance optimizations
- Security improvements
- Accessibility enhancements
- Test coverage improvements

### Medium Priority
- UI/UX improvements
- Documentation updates
- Code refactoring
- New form field types

### Low Priority
- Cosmetic changes
- Minor bug fixes
- Documentation typos

## 📄 License

By contributing to DkNex, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to DkNex! 🚀 