// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { type VariantProps } from "class-variance-authority";
import { type ComponentProps, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";

export interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
  size?: ComponentProps<typeof Button>["size"];
}

export function LinkButton({
  href,
  children,
  variant = "default",
  icon,
  iconRight,
  size = "lg",
}: LinkButtonProps) {
  return (
    <Button variant={variant} size={size} asChild>
      <a href={href}>
        {icon}
        {children}
        {iconRight}
      </a>
    </Button>
  );
}
