import * as React from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const SciFiTextarea = React.forwardRef<
  React.ElementRef<typeof Textarea>,
  React.ComponentPropsWithoutRef<typeof Textarea>
>(({ className, ...props }, ref) => {
  return (
    <div className="relative group/scifitextarea w-full">
      {/* SVG Border Wrapper */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 0,10 L 10,0 L 100,0 L 100,90 L 90,100 L 0,100 Z"
          fill="var(--color-sci-fi-cyan)"
          className="opacity-0 group-focus-within/scifitextarea:opacity-10 transition-opacity duration-300"
        />
        <path
          d="M 0,10 L 10,0 L 100,0 L 100,90 L 90,100 L 0,100 Z"
          fill="none"
          stroke="var(--color-sci-fi-cyan)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          className="opacity-50 group-focus-within/scifitextarea:opacity-100 group-hover/scifitextarea:opacity-80 transition-all duration-300 animate-sci-fi-draw"
        />
      </svg>
      <Textarea
        ref={ref}
        className={cn(
          "relative z-10 w-full min-h-[80px] bg-transparent border-none shadow-none rounded-none focus-visible:ring-0 focus-visible:outline-none focus:ring-0",
          "text-[var(--color-sci-fi-cyan)] font-mono placeholder:text-[var(--color-sci-fi-cyan)]/50",
          className
        )}
        {...props}
      />
    </div>
  )
})
SciFiTextarea.displayName = "SciFiTextarea"

export { SciFiTextarea }
