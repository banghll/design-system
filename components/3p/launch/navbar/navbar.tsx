// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import * as React from "react";

import { cn } from "@/lib/utils";

function Navbar({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="navbar"
      className={cn("flex items-center justify-between py-4", className)}
      {...props}
    />
  );
}

function NavbarLeft({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navbar-left"
      className={cn("flex items-center justify-start gap-4", className)}
      {...props}
    />
  );
}

function NavbarRight({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navbar-right"
      className={cn("flex items-center justify-end gap-4", className)}
      {...props}
    />
  );
}

function NavbarCenter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navbar-center"
      className={cn("flex items-center justify-center gap-4", className)}
      {...props}
    />
  );
}

export { Navbar, NavbarCenter, NavbarLeft, NavbarRight };
