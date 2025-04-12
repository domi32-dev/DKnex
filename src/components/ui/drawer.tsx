'use client';

import { useEffect } from "react";

const Drawer = ({ open, onClose, children, childrenFooter }: { open: boolean; onClose: () => void; children: React.ReactNode; childrenFooter: React.ReactNode }) => {
  // Disable scrolling when the drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'; // Disable scroll
    } else {
      document.body.style.overflow = ''; // Re-enable scroll
    }
    return () => {
      document.body.style.overflow = ''; // Ensure scroll is re-enabled when component is unmounted
    };
  }, [open]);

  return (
    <>
      {/* Invisible overlay that functions but is not visible */}
      {open && <div className="fixed inset-0 bg-transparent z-40" onClick={onClose}></div>}

      <div
        className={`fixed top-0 right-0 h-full bg-white dark:bg-gray-800 transform transition-all duration-700 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        } w-72 shadow-lg z-50`}
      >
        <div className="relative h-full flex flex-col justify-between">
          {/* Header: Close button */}
          <div className="absolute top-4 left-4 w-full flex justify-between px-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
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
          <div className="flex-1 p-2 pt-12">
            {children}
          </div>

          {/* Footer: Additional content */}
          <div className="border-t p-4 bg-white dark:bg-gray-800">
            <div className="text-center text-sm">
              {childrenFooter}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
