import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Define proper types for mocked components
interface MockImageProps {
  src: string;
  alt: string;
  [key: string]: unknown;
}

interface MockIconProps {
  className?: string;
  [key: string]: unknown;
}

interface MockCardProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: MockImageProps) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  AlertTriangle: ({ className }: MockIconProps) => <div data-testid="alert-triangle" className={className} />,
  RefreshCw: ({ className }: MockIconProps) => <div data-testid="refresh-cw" className={className} />,
  Home: ({ className }: MockIconProps) => <div data-testid="home" className={className} />,
  Bug: ({ className }: MockIconProps) => <div data-testid="bug" className={className} />,
  Copy: ({ className }: MockIconProps) => <div data-testid="copy" className={className} />,
}));

// Mock UI components
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: MockCardProps) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: MockCardProps) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }: MockCardProps) => <div className={className}>{children}</div>,
  CardTitle: ({ children, className }: MockCardProps) => <h3 className={className}>{children}</h3>,
}));

// Mock NextAuth
vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// Mock Prisma for tests that don't need real database
vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    verificationToken: {
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    $disconnect: vi.fn(),
  })),
}));

// Mock bcrypt
vi.mock("bcryptjs", () => ({
  hash: vi.fn().mockResolvedValue("hashedPassword"),
  compare: vi.fn().mockResolvedValue(true),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
