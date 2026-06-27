import * as React from "react"
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface SciFiCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  theme?: "default" | "destructive" | "success"
}

const SciFiCard = React.forwardRef<
  React.ElementRef<typeof Card>,
  SciFiCardProps
>(({ className, theme = "default", children, ...props }, ref) => {
  const themeClass = 
    theme === "destructive" ? "text-red-500" :
    theme === "success" ? "text-green-500" :
    "text-[var(--color-sci-fi-cyan)]"

  const dropShadowClass = 
    theme === "destructive" ? "group-hover/scificard:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" :
    theme === "success" ? "group-hover/scificard:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" :
    "group-hover/scificard:drop-shadow-[0_0_8px_var(--color-sci-fi-cyan)]"

  return (
    <div className={cn("relative group/scificard", themeClass, className)}>
      {/* SVG Border Wrapper */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Subtle background */}
        <path
          d="M 0,5 L 5,0 L 95,0 L 100,5 L 100,95 L 95,100 L 5,100 L 0,95 Z"
          fill="currentColor"
          className="opacity-[0.02] group-hover/scificard:opacity-[0.05] transition-opacity duration-500"
        />
        {/* Main geometric border with 4 chamfered corners */}
        <path
          d="M 0,5 L 5,0 L 95,0 L 100,5 L 100,95 L 95,100 L 5,100 L 0,95 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          className="opacity-50 group-hover/scificard:opacity-100 transition-all duration-500 animate-sci-fi-draw"
        />
        {/* Top-left decorative accent */}
        <path
          d="M 0,20 L 0,5 L 5,0 L 20,0"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          className={cn("opacity-80 transition-all duration-300", dropShadowClass)}
        />
        {/* Bottom-right decorative accent */}
        <path
          d="M 100,80 L 100,95 L 95,100 L 80,100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          className={cn("opacity-80 transition-all duration-300", dropShadowClass)}
        />
      </svg>
      
      {/* Small tech crosshatch pattern overlay (optional detail) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      <Card
        ref={ref}
        className={cn(
          "relative z-10 w-full h-full rounded-none bg-transparent border-none shadow-none ring-0",
          "text-inherit",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    </div>
  )
})
SciFiCard.displayName = "SciFiCard"

// Wrapping the rest to ensure they don't break the transparent/neon styling
const SciFiCardHeader = React.forwardRef<
  React.ElementRef<typeof CardHeader>,
  React.ComponentPropsWithoutRef<typeof CardHeader>
>(({ className, ...props }, ref) => (
  <CardHeader ref={ref} className={cn("pb-2", className)} {...props} />
))
SciFiCardHeader.displayName = "SciFiCardHeader"

const SciFiCardTitle = React.forwardRef<
  React.ElementRef<typeof CardTitle>,
  React.ComponentPropsWithoutRef<typeof CardTitle>
>(({ className, ...props }, ref) => (
  <CardTitle ref={ref} className={cn("font-sans tracking-wide text-cyan-50", className)} {...props} />
))
SciFiCardTitle.displayName = "SciFiCardTitle"

const SciFiCardDescription = React.forwardRef<
  React.ElementRef<typeof CardDescription>,
  React.ComponentPropsWithoutRef<typeof CardDescription>
>(({ className, ...props }, ref) => (
  <CardDescription ref={ref} className={cn("font-mono text-cyan-200/60", className)} {...props} />
))
SciFiCardDescription.displayName = "SciFiCardDescription"

const SciFiCardContent = React.forwardRef<
  React.ElementRef<typeof CardContent>,
  React.ComponentPropsWithoutRef<typeof CardContent>
>(({ className, ...props }, ref) => (
  <CardContent ref={ref} className={className} {...props} />
))
SciFiCardContent.displayName = "SciFiCardContent"

const SciFiCardFooter = React.forwardRef<
  React.ElementRef<typeof CardFooter>,
  React.ComponentPropsWithoutRef<typeof CardFooter>
>(({ className, ...props }, ref) => (
  <CardFooter ref={ref} className={cn("border-t-0 bg-transparent pt-4", className)} {...props} />
))
SciFiCardFooter.displayName = "SciFiCardFooter"

export {
  SciFiCard,
  SciFiCardHeader,
  SciFiCardFooter,
  SciFiCardTitle,
  SciFiCardDescription,
  SciFiCardContent,
  CardAction as SciFiCardAction,
}
