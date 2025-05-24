import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface FullScreenPortalProps {
  children: ReactNode;
}

export default function FullScreenPortal({ children }: FullScreenPortalProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  if (!elRef.current) {
    elRef.current = document.createElement('div');
  }

  useEffect(() => {
    const el = elRef.current!;
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  if (elRef.current) {
    elRef.current.style.position = 'fixed';
    elRef.current.style.top = '0';
    elRef.current.style.left = '0';
    elRef.current.style.right = '0';
    elRef.current.style.bottom = '0';
    elRef.current.style.zIndex = '10000';
    elRef.current.style.background = 'var(--background, #18181b)';
  }

  return createPortal(children, elRef.current);
} 