"use client";

import React, { Suspense, lazy, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface LazyComponentProps<T> {
  component: () => Promise<{ default: ComponentType<T> }>;
  props?: T;
  fallback?: React.ReactNode;
}

// Default loading fallback
const DefaultFallback = () => (
  <div className="flex items-center justify-center p-4">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
  </div>
);

// Lazy load wrapper for any component
export function LazyLoad({ children, fallback }: LazyLoadProps) {
  return (
    <Suspense fallback={fallback || <DefaultFallback />}>
      {children}
    </Suspense>
  );
}

// Lazy load a specific component
export function LazyComponent<T extends Record<string, unknown>>({
  component,
  props,
  fallback,
}: LazyComponentProps<T>) {
  const LazyComponent = lazy(component);

  return (
    <Suspense fallback={fallback || <DefaultFallback />}>
      <LazyComponent {...(props as T)} />
    </Suspense>
  );
}

// Intersection Observer based lazy loading
export function LazyLoadOnView({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasIntersected) {
          setIsVisible(true);
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, hasIntersected]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback || <DefaultFallback />}
    </div>
  );
}

// Preload component for better UX
export function preloadComponent<T extends Record<string, unknown>>(
  component: () => Promise<{ default: ComponentType<T> }>
) {
  return () => {
    const promise = component();
    return promise;
  };
}

// Lazy load with error boundary
export function LazyLoadWithErrorBoundary<T extends Record<string, unknown>>({
  component,
  props,
  fallback,
}: LazyComponentProps<T>) {
  const LazyComponent = lazy(component);

  return (
    <Suspense fallback={fallback || <DefaultFallback />}>
      <LazyComponent {...(props as T)} />
    </Suspense>
  );
} 