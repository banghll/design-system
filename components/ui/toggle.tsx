"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Toggle as TogglePrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-(--toggle-gap) rounded-(--toggle-radius) text-(length:--toggle-md-font-size) font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-(--toggle-active-surface) data-[state=on]:bg-(--toggle-active-surface) dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-muted",
      },
      size: {
        default: "h-(--toggle-md-height) min-w-(--toggle-md-height) px-(--toggle-md-padding-x)",
        sm: "h-(--toggle-sm-height) min-w-(--toggle-sm-height) rounded-[min(var(--radius-md),12px)] px-(--toggle-sm-padding-x) text-(length:--toggle-sm-font-size) [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-(--toggle-lg-height) min-w-(--toggle-lg-height) px-(--toggle-lg-padding-x)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
