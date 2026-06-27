import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface SciFiButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  theme?: "default" | "destructive" | "success"
}

const SciFiButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  SciFiButtonProps
>(
  ({ className, theme = "default", children, ...props }, ref) => {
    const themeClass = 
      theme === "destructive" ? "text-red-500 focus-visible:ring-red-500" :
      theme === "success" ? "text-green-400 focus-visible:ring-green-400" :
      "text-[var(--color-sci-fi-cyan)] focus-visible:ring-[var(--color-sci-fi-cyan)]"

    const glowClass = 
      theme === "destructive" ? "group-hover:drop-shadow-[0_0_5px_rgba(239,68,68,0.8)] group-hover:text-red-200" :
      theme === "success" ? "group-hover:drop-shadow-[0_0_5px_rgba(74,222,128,0.8)] group-hover:text-green-200" :
      "group-hover:drop-shadow-[0_0_5px_var(--color-sci-fi-cyan)] group-hover:text-cyan-100"

    return (
      <div className={cn("relative inline-block group", themeClass, className)}>
        {/* SVG Border Wrapper */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Subtle background glow */}
          <path
            d="M 0,0 L 100,0 L 100,60 L 95,100 L 0,100 Z"
            fill="currentColor"
            className="opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          />
          {/* Main border with chamfered bottom-right corner */}
          <path
            d="M 0,0 L 100,0 L 100,60 L 95,100 L 0,100 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            className={cn("opacity-70 group-hover:opacity-100 transition-all duration-300 animate-sci-fi-draw", glowClass)}
          />
          {/* Small decorative dot at the chamfer */}
          <circle 
            cx="97" cy="80" r="1.5" 
            fill="currentColor" 
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" 
          />
        </svg>
        <Button
          ref={ref}
          className={cn(
            "relative z-10 w-full h-full rounded-none bg-transparent hover:bg-transparent border-none text-inherit",
            "px-6 py-2 uppercase tracking-wider font-mono shadow-none",
            "transition-colors duration-300"
          )}
          {...props}
        >
          {children}
        </Button>
      </div>
    )
  }
)
SciFiButton.displayName = "SciFiButton"

export { SciFiButton }
