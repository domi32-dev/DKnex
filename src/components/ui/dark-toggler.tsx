"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function DarkToggler() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex items-center justify-center cursor-pointer">
      {theme === "dark" ? (
        <Moon
          onClick={() => setTheme("light")}
          className="h-5 w-5"
        />
      ) : (
        <Sun
          onClick={() => setTheme("dark")}
          className="h-5 w-5"
        />
      )}
    </div>
  )
}