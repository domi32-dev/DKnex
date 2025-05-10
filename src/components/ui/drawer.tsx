'use client';

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const ANIMATION_DURATION = 700;

const Drawer = ({ open, onClose, children, childrenFooter }: { open: boolean; onClose: () => void; children: React.ReactNode; childrenFooter: React.ReactNode }) => {
  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), ANIMATION_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!shouldRender) return null;

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 bg-transparent z-[99999] pointer-events-auto"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 right-0 h-screen bg-white dark:bg-gray-800 transform transition-transform duration-700 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        } w-80 shadow-lg z-[100000]`}
      >
        <div className="relative h-full flex flex-col">
          {/* Header: Close button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body: Drawer content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          {/* Footer: Additional content */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            {childrenFooter}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default Drawer;
