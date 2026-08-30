// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import React from "react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  image: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
  version?: string;
  width?: number;
  height?: number;
  showName?: boolean;
  badge?: string;
}

export default function Logo({
  className,
  image: SvgImage,
  name,
  version,
  width = 24,
  height = 24,
  showName = true,
  badge,
  ...props
}: LogoProps) {
  return (
    <div
      data-slot="logo"
      className={cn("flex items-center gap-2 text-sm font-medium", className)}
      {...props}
    >
      <SvgImage
        width={width}
        height={height}
        aria-hidden="true"
        className="max-h-full max-w-full opacity-70"
      />
      <span className={cn(!showName && "sr-only")}>{name}</span>
      {version && <span className="text-muted-foreground">{version}</span>}
      {badge && (
        <Badge variant="brand" size="sm">
          {badge}
        </Badge>
      )}
    </div>
  );
}
