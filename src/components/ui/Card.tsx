import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg bg-white text-gray-950 shadow-sm transition-all duration-200 dark:bg-gray-950 dark:text-gray-50",
  {
    variants: {
      variant: {
        default: "border border-gray-200 dark:border-gray-800",
        destructive: "border-red-600 dark:border-red-600",
        ghost: "border-transparent shadow-none",
      },
      shadow: {
        default: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        none: "",
      },
      hover: {
        default: "",
        lift: "hover:shadow-md hover:-translate-y-1",
        border: "hover:border-gray-300 dark:hover:border-gray-700",
        background: "hover:bg-gray-50 dark:hover:bg-gray-900",
      },
    },
    defaultVariants: {
      variant: "default",
      shadow: "default",
      hover: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, shadow, hover, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "div" : "div"
    return (
      <Comp
        ref={ref}
        className={cn(cardVariants({ variant, shadow, hover, className }))}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } 