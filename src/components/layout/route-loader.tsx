"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Trigger bar reset and re-animation
    setKey(prev => prev + 1);
    setLoading(true);

    const finish = setTimeout(() => {
      setLoading(false);
    }, 800); // match duration of animation

    return () => clearTimeout(finish);
  }, [pathname]);

  return (
    <div
      key={key} // reset animation on route change
      className={`fixed top-0 left-0 h-[3px] bg-indigo-500 transition-all duration-700 ease-linear z-50 ${
        loading ? "w-full opacity-100" : "w-0 opacity-0"
      }`}
    />
  );
}
