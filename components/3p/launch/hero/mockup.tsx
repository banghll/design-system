// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "@/lib/utils";

const mockupVariants = cva(
  "flex relative z-10 overflow-hidden shadow-2xl border border-border/70 dark:border-border/5 dark:border-t-border/15",
  {
    variants: {
      type: {
        mobile: "rounded-[48px] max-w-[350px]",
        responsive: "rounded-md",
      },
    },
    defaultVariants: {
      type: "responsive",
    },
  },
);

export interface MockupProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mockupVariants> {}

function Mockup({ className, type, ...props }: MockupProps) {
  return (
    <div
      data-slot="mockup"
      className={cn(mockupVariants({ type, className }))}
      {...props}
    />
  );
}

const frameVariants = cva(
  "bg-border/50 flex relative z-10 overflow-hidden rounded-2xl dark:bg-border/10",
  {
    variants: {
      size: {
        small: "p-2",
        large: "p-4",
      },
    },
    defaultVariants: {
      size: "small",
    },
  },
);

export interface MockupFrameProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof frameVariants> {}

function MockupFrame({ className, size, ...props }: MockupFrameProps) {
  return (
    <div
      data-slot="mockup-frame"
      className={cn(frameVariants({ size, className }))}
      {...props}
    />
  );
}

export { Mockup, MockupFrame };
