import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* 입력은 버튼과 같은 사다리를 탄다.
 *
 * 한 줄에 «금액 입력 + 통화 선택» 처럼 나란히 놓이는 일이 대부분이라,
 * 둘의 크기 이름이 다르면 한쪽만 커져서 줄이 어긋난다. size="sm" 버튼 옆의
 * size="sm" 입력은 언제나 같은 높이다. */
const inputVariants = cva(
  "w-full min-w-0 rounded-(--input-radius) border border-input bg-transparent py-1 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        default:
          "h-(--input-md-height) px-(--input-md-padding-x) text-(length:--input-md-font-size)",
        xs: "h-(--input-xs-height) px-(--input-xs-padding-x) text-(length:--input-xs-font-size)",
        sm: "h-(--input-sm-height) px-(--input-sm-padding-x) text-(length:--input-sm-font-size)",
        lg: "h-(--input-lg-height) px-(--input-lg-padding-x) text-(length:--input-lg-font-size)",
      },
    },
    defaultVariants: { size: "default" },
  }
)

function Input({
  className,
  type,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(inputVariants({ size, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
