/* 카탈로그 공통 셸.
 *
 * 두 가지 규칙을 지킨다.
 *  1) 이 UI 자체를 레포의 컴포넌트로 만든다 — Collapsible · ScrollArea · Button · Badge.
 *     정리용 화면이라고 예외를 두면 시스템을 안 쓰는 자리가 생긴다.
 *  2) 목록은 lib/catalog-nav.ts 한 곳에서만 온다. 사이드바와 페이지가 갈라지지 않게.
 *
 * 블록 상세와 사이드바 예제는 그 자체가 앱 셸이라 이 셸을 두르지 않는다. */
"use client"

import {
  Blocks,
  Boxes,
  ChevronRight,
  Component,
  FileStack,
  Palette,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { ThemeSwitcher } from "@/components/theme-switcher"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PAGES } from "@/lib/catalog-nav"
import { cn } from "@/lib/utils"

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  palette: Palette,
  component: Component,
  "file-stack": FileStack,
  boxes: Boxes,
  blocks: Blocks,
}

export function CatalogShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  /* 지금 보고 있는 페이지는 펼친 채로 둔다. 나머지는 접는다. */
  const [open, setOpen] = useState<string | null>(null)
  useEffect(() => {
    const hit = PAGES.find((p) =>
      p.href === "/" ? pathname === "/" : pathname.startsWith(p.href)
    )
    setOpen(hit?.href ?? null)
  }, [pathname])

  /* 카탈로그 페이지는 차트·이미지가 늦게 자리를 잡아, 브라우저 기본 앵커 이동만으로는
   * 목표가 어긋난다. 해시가 바뀌면 잠깐 동안 다시 맞춘다. */
  useEffect(() => {
    const settle = () => {
      const id = decodeURIComponent(location.hash.slice(1))
      if (!id) return
      let tries = 0
      const tick = () => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ block: "start" })
        if (++tries < 8) setTimeout(tick, 120)
      }
      tick()
    }
    settle()
    window.addEventListener("hashchange", settle)
    return () => window.removeEventListener("hashchange", settle)
  }, [pathname])

  return (
    <div className="flex min-h-dvh">
      <aside className="bg-sidebar sticky top-0 hidden h-dvh w-64 shrink-0 flex-col lg:flex">
        <div className="flex h-14 shrink-0 items-center gap-2 px-5">
          <Boxes className="size-4" />
          <span className="text-sm font-semibold">slate × shadcn</span>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <nav className="flex flex-col gap-0.5 p-3">
            {PAGES.map((page) => {
              const Icon = ICONS[page.icon] ?? Boxes
              const active =
                page.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(page.href)
              const expanded = open === page.href && page.sections.length > 0

              return (
                <Collapsible
                  key={page.href}
                  open={expanded}
                  onOpenChange={(v) => setOpen(v ? page.href : null)}
                >
                  <div
                    className={cn(
                      "flex items-center rounded-md",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <Link
                      href={page.href}
                      className={cn(
                        "flex min-w-0 flex-1 items-center gap-2.5 px-2 py-1.5 text-sm",
                        active && "font-medium"
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="min-w-0 flex-1 truncate">{page.label}</span>
                    </Link>

                    {page.sections.length > 0 ? (
                      <CollapsibleTrigger
                        className="hover:text-foreground shrink-0 px-2 py-1.5"
                        aria-label={`${page.label} 하위 목록`}
                      >
                        <ChevronRight
                          className={cn(
                            "size-3.5 transition-transform",
                            expanded && "rotate-90"
                          )}
                        />
                      </CollapsibleTrigger>
                    ) : null}
                  </div>

                  <CollapsibleContent>
                    <div className="flex flex-col gap-0.5 py-1 pl-8">
                      {page.sections.map((s) => (
                        <Link
                          key={s.id}
                          href={`${page.href}#${s.id}`}
                          className="text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-md px-2 py-1 text-[13px]"
                        >
                          <span className="min-w-0 flex-1 truncate">{s.label}</span>
                          {s.count ? (
                            <span className="text-[11px] tabular-nums opacity-60">
                              {s.count}
                            </span>
                          ) : null}
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </nav>
        </ScrollArea>

        <div className="p-3">
          <ThemeSwitcher />
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

/* 페이지 머리말 — 카탈로그 페이지가 같은 모양을 갖게 한다. */
export function CatalogHeader({
  title,
  count,
  children,
}: {
  title: string
  count?: string
  children: React.ReactNode
}) {
  return (
    <header className="mb-8">
      <div className="mb-2 flex items-center gap-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {count ? <Badge variant="secondary">{count}</Badge> : null}
      </div>
      <p className="text-muted-foreground max-w-[64ch] text-sm">{children}</p>
    </header>
  )
}

/* 군 머리말 — 무엇이고 언제 쓰는지를 항상 같은 자리에 둔다. */
export function GroupHeader({
  title,
  note,
  count,
  icon: Icon,
}: {
  title: string
  note: string
  count?: number
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="text-muted-foreground size-4" /> : null}
        <h2 className="text-base font-semibold">{title}</h2>
        {count != null ? (
          <span className="text-muted-foreground text-xs tabular-nums">
            {count}
          </span>
        ) : null}
      </div>
      <p className="text-muted-foreground mt-1 max-w-[60ch] text-sm">{note}</p>
    </div>
  )
}
