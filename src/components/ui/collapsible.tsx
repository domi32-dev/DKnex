"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CollapsibleContextValue {
  isOpen: boolean
  toggle: () => void
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | undefined>(undefined)

const useCollapsible = () => {
  const context = React.useContext(CollapsibleContext)
  if (!context) {
    throw new Error("useCollapsible must be used within a Collapsible")
  }
  return context
}

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ className, open = false, onOpenChange, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(open)

    React.useEffect(() => {
      setIsOpen(open)
    }, [open])

    const toggle = () => {
      const newOpen = !isOpen
      setIsOpen(newOpen)
      onOpenChange?.(newOpen)
    }

    return (
      <CollapsibleContext.Provider value={{ isOpen, toggle }}>
        <div
          ref={ref}
          className={cn("", className)}
          data-state={isOpen ? "open" : "closed"}
          {...props}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    )
  }
)
Collapsible.displayName = "Collapsible"

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, onClick, ...props }, ref) => {
    const { toggle } = useCollapsible()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      toggle()
      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        className={cn("", className)}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isOpen } = useCollapsible()

    if (!isOpen) return null

    return (
      <div
        ref={ref}
        className={cn("overflow-hidden transition-all duration-200", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent } 