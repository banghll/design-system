import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-(--skeleton-radius) bg-(--skeleton-surface)", className)}
      {...props}
    />
  )
}

export { Skeleton }
