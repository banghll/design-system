// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { cn } from '@/lib/utils'

function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
    return (
        <kbd
            data-slot="kbd"
            className={cn("bg-foreground/5 inset-ring inset-ring-foreground/5 text-muted-foreground in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium [&_svg:not([class*='size-'])]:size-3", className)}
            {...props}
        />
    )
}

function KbdGroup({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <kbd
            data-slot="kbd-group"
            className={cn('inline-flex items-center gap-1', className)}
            {...props}
        />
    )
}

export { Kbd, KbdGroup }
