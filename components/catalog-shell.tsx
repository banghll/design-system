/* 카탈로그 공통 셸.
 * 블록 상세(/blocks/<이름>)와 사이드바 예제는 화면 전체를 쓰는 앱 셸이라 이 셸을 두르지 않는다.
 * 목록·갤러리 페이지에만 붙인다. */
"use client"

import {
  Blocks,
  Boxes,
  Component,
  FileStack,
  Film,
  LayoutGrid,
  MessagesSquare,
  Palette,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { ThemeSwitcher } from "@/components/theme-switcher"
import { cn } from "@/lib/utils"

type Item = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  count?: string
}

const NAV: { title: string; items: Item[] }[] = [
  {
    title: "시스템",
    items: [{ href: "/", label: "파운데이션", icon: Palette }],
  },
  {
    title: "카탈로그",
    items: [
      { href: "/kit", label: "컴포넌트", icon: Component, count: "109" },
      { href: "/examples", label: "공식 예제", icon: FileStack, count: "64" },
      { href: "/patterns", label: "패턴", icon: Boxes, count: "74" },
      { href: "/blocks", label: "블록", icon: Blocks, count: "30" },
    ],
  },
  {
    title: "앱",
    items: [
      { href: "/chat", label: "AI 채팅", icon: MessagesSquare },
      { href: "/movies", label: "영화 평점", icon: Film },
      { href: "/ai", label: "AI Elements", icon: Sparkles },
      { href: "/components", label: "인벤토리", icon: LayoutGrid },
    ],
  },
]

export function CatalogShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-dvh">
      <aside className="bg-sidebar sticky top-0 hidden h-dvh w-60 shrink-0 flex-col overflow-y-auto border-r lg:flex">
        <div className="flex h-14 shrink-0 items-center gap-2 border-b px-5">
          <Boxes className="size-4" />
          <span className="text-sm font-semibold">slate × shadcn</span>
        </div>

        <nav className="flex flex-col gap-6 p-3">
          {NAV.map((group) => (
            <div key={group.title} className="flex flex-col gap-1">
              <span className="text-muted-foreground px-2 pb-1 text-[11px] tracking-[0.08em]">
                {group.title}
              </span>
              {group.items.map(({ href, label, icon: Icon, count }) => {
                const active =
                  href === "/" ? pathname === "/" : pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                    {count ? (
                      <span className="text-muted-foreground text-[11px] tabular-nums">
                        {count}
                      </span>
                    ) : null}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="mt-auto border-t p-3">
          <ThemeSwitcher />
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
