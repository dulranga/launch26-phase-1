import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const SciFiSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  React.ComponentPropsWithoutRef<typeof SelectTrigger>
>(({ className, children, ...props }, ref) => (
  <div className="relative inline-block w-full group/scifiselect">
    {/* SVG Border Wrapper */}
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        d="M 0,0 L 95,0 L 100,20 L 100,100 L 5,100 L 0,80 Z"
        fill="none"
        stroke="var(--color-sci-fi-cyan)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        className="opacity-70 group-hover/scifiselect:opacity-100 group-hover/scifiselect:drop-shadow-[0_0_5px_var(--color-sci-fi-cyan)] transition-all duration-300 animate-sci-fi-draw"
      />
      <circle 
        cx="97" cy="10" r="1.5" 
        fill="var(--color-sci-fi-cyan)" 
        className="opacity-0 group-hover/scifiselect:opacity-100 transition-opacity duration-300 delay-150" 
      />
    </svg>
    <SelectTrigger
      ref={ref}
      className={cn(
        "relative z-10 w-full bg-transparent border-none shadow-none rounded-none focus-visible:ring-0 focus-visible:outline-none focus:ring-0",
        "text-[var(--color-sci-fi-cyan)] font-mono data-placeholder:text-[var(--color-sci-fi-cyan)]/60",
        className
      )}
      {...props}
    >
      {children}
    </SelectTrigger>
  </div>
))
SciFiSelectTrigger.displayName = "SciFiSelectTrigger"

const SciFiSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectContent>,
  React.ComponentPropsWithoutRef<typeof SelectContent>
>(({ className, ...props }, ref) => (
  <SelectContent
    ref={ref}
    className={cn(
      "border border-[var(--color-sci-fi-cyan)]/50 bg-black/95 backdrop-blur-md text-[var(--color-sci-fi-cyan)] rounded-none shadow-[0_0_15px_rgba(0,240,255,0.1)] font-mono",
      className
    )}
    {...props}
  />
))
SciFiSelectContent.displayName = "SciFiSelectContent"

const SciFiSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectItem>,
  React.ComponentPropsWithoutRef<typeof SelectItem>
>(({ className, ...props }, ref) => (
  <SelectItem
    ref={ref}
    className={cn(
      "focus:bg-[var(--color-sci-fi-cyan)]/20 focus:text-cyan-100 rounded-none transition-colors cursor-pointer",
      className
    )}
    {...props}
  />
))
SciFiSelectItem.displayName = "SciFiSelectItem"

export {
  Select as SciFiSelect,
  SelectGroup as SciFiSelectGroup,
  SelectValue as SciFiSelectValue,
  SciFiSelectTrigger,
  SciFiSelectContent,
  SelectLabel as SciFiSelectLabel,
  SciFiSelectItem,
  SelectSeparator as SciFiSelectSeparator,
  SelectScrollUpButton as SciFiSelectScrollUpButton,
  SelectScrollDownButton as SciFiSelectScrollDownButton,
}
