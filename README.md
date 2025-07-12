# 🚀 DkNex - Advanced Form Builder Platform

> A professional form builder dashboard built with cutting-edge technology stack

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.6-green?logo=prisma)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)](https://www.postgresql.org)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/do-ki-project)

## 🎯 Project Overview

A comprehensive **Form Builder Platform** with dashboard that enables users to create, manage, and analyze interactive forms. This project demonstrates advanced full-stack development with modern web technologies and enterprise-grade features.

## ✨ Key Features

### 🏗️ **Advanced Form Builder**
- **Drag & Drop Interface** with intuitive form creation
- **Real-time Preview** with instant updates
- **Template System** with pre-built layouts
- **Responsive Design** optimized for all devices
- **Custom Field Types** and validation rules

### 🔐 **Enterprise Authentication**
- **NextAuth.js** integration with multiple providers
- **2FA (Two-Factor Authentication)** with QR code setup
- **JWT-based** session management
- **Secure password encryption** with bcrypt
- **Email verification** system

### 📊 **Analytics Dashboard**
- **Real-time Statistics** and performance metrics
- **Interactive Charts** powered by Recharts
- **Submission Tracking** and conversion rates
- **Custom Reports** and data visualization
- **Export functionality** (CSV, PDF)

### 🗓️ **Calendar Integration**
- **Modern Calendar Views** (Day, Week, Month)
- **Event Management** with appointment scheduling
- **Calendar Synchronization** with external providers
- **Recurring Events** support

### 🗺️ **Maps & Navigation**
- **3D Maps** powered by Cesium.js
- **Route Generator** for geographical data
- **MapLibre GL** for interactive mapping
- **Geolocation Services** integration

### 🌐 **Internationalization**
- **Multi-language Support** (English, German)
- **Dynamic Translations** with i18next
- **RTL Support** for right-to-left languages
- **Locale-specific Formatting**

### 🔔 **Real-time Notifications**
- **Push Notifications** system
- **Email Integration** with Nodemailer
- **In-app Notifications** with real-time updates
- **Notification Preferences** management

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 15.2** - App Router with Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Framer Motion** - Smooth animations
- **React Query** - Server state management
- **React Hook Form** - Form handling

### **Backend**
- **Next.js API Routes** - Serverless functions
- **tRPC** - Type-safe API development
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Production database
- **NextAuth.js** - Authentication system

### **DevOps & Tools**
- **ESLint** - Code linting and formatting
- **Vitest** - Fast unit testing
- **Turbopack** - Lightning-fast bundling
- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Deployment platform

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/do-ki-project.git
cd do-ki-project

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up the database
npx prisma migrate dev
npx prisma db seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/test"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Configuration
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@test.com"
```

## 📱 Screenshots

### Dashboard Overview
![Dashboard](public/screenshots/dashboard.png)

### Form Builder Interface
![Form Builder](public/screenshots/form-builder.png)

### Mobile Responsive Design
![Mobile View](public/screenshots/mobile.png)

### Analytics Dashboard
![Analytics](public/screenshots/analytics.png)

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:ui
```

## 📈 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, SEO, Accessibility, Best Practices)
- **Bundle Size**: Optimized with tree-shaking and code splitting
- **Loading Time**: < 1s First Contentful Paint
- **SEO Score**: 100/100 with structured data
- **Accessibility**: WCAG 2.1 AA compliant

## 🔄 CI/CD Pipeline

- **GitHub Actions** for automated testing and deployment
- **Vercel** for seamless production deployments
- **Prisma Migrate** for database schema management
- **ESLint** for code quality enforcement
- **Automated testing** on every pull request

## 📄 API Documentation

### Authentication Endpoints
```typescript
POST /api/auth/register     # User registration
POST /api/auth/signin       # User login
POST /api/auth/2fa/setup    # Two-factor authentication setup
POST /api/auth/2fa/verify   # Two-factor authentication verification
```

### Form Management
```typescript
GET    /api/forms           # List all forms
POST   /api/forms           # Create new form
GET    /api/forms/[id]      # Get form details
PUT    /api/forms/[id]      # Update form
DELETE /api/forms/[id]      # Delete form
```

### Analytics
```typescript
GET /api/analytics/forms    # Form analytics
GET /api/analytics/users    # User analytics
GET /api/analytics/export   # Export data
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── forms/             # Form-related pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── form-builder/     # Form builder components
│   └── layout/           # Layout components
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
└── __tests__/            # Test files
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development Guidelines

- Follow TypeScript best practices
- Write unit tests for new features
- Use conventional commit messages
- Ensure all tests pass before submitting PR
- Follow the existing code style

## 🐛 Known Issues

- [ ] Form builder drag-and-drop on mobile devices
- [ ] Email delivery rate optimization
- [ ] Advanced analytics caching

## 🔮 Roadmap

- [ ] **Advanced Form Logic** - Conditional fields and branching
- [ ] **Integrations** - Zapier, Webhook support
- [ ] **Team Collaboration** - Multi-user editing
- [ ] **Advanced Analytics** - Custom dashboards
- [ ] **Mobile App** - React Native companion app

## 📊 Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

**Your Name**
- Email: domi.kinzel@gmail.com
- LinkedIn: [https://www.linkedin.com/in/dominik-kinzel](https://www.linkedin.com/in/dominik-kinzel)
- Portfolio: [dk-dev.com](https://dk-dev.com)
- GitHub: [@domi32-dev](https://github.com/domi32-dev)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Open source community for the tools and libraries

---

⭐ **If you find this project helpful, please give it a star on GitHub!**
