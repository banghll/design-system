/* 카탈로그 공통 셸.
 *
 * 두 가지 규칙을 지킨다.
 *  1) 이 UI 자체를 레포의 컴포넌트로 만든다 — ScrollArea · Button · Badge · Separator.
 *     정리용 화면이라고 예외를 두면 시스템을 안 쓰는 자리가 생긴다.
 *  2) 목록은 lib/catalog-nav.ts 한 곳에서만 온다. 사이드바와 페이지가 갈라지지 않게.
 *
 * 블록 상세와 사이드바 예제는 그 자체가 앱 셸이라 이 셸을 두르지 않는다. */
"use client"

import {
  Blocks,
  Boxes,
  Component,
  FileStack,
  Palette,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

import { type Copy, useLang } from "@/components/lang"
import { ShellControls } from "@/components/shell-controls"
import { Toc, type TocItem } from "@/components/toc"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { TokenEditor } from "@/components/token-editor"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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

export function CatalogShell({
  children,
  toc,
}: {
  children: React.ReactNode
  /** 오른쪽 목차에 올릴 항목. 없으면 목차를 그리지 않는다. */
  toc?: TocItem[]
}) {
  const pathname = usePathname()
  const { t } = useLang()

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
      <aside className="bg-sidebar sticky top-0 hidden h-dvh w-60 shrink-0 flex-col lg:flex">
        <div className="flex h-14 shrink-0 items-center gap-2 px-5">
          <Boxes className="size-4" />
          <span className="text-sm font-semibold">shadcn 디자인 시스템</span>
        </div>

        {/* 페이지 목록만 둔다. 페이지 안의 구획은 오른쪽 목차가 맡는다 —
          * 층이 다른 두 이동을 한자리에 겹쳐 두면 어느 쪽이 어느 쪽인지 섞인다. */}
        <ScrollArea className="min-h-0 flex-1">
          <nav className="flex flex-col gap-0.5 p-3">
            {PAGES.map((page) => {
              const Icon = ICONS[page.icon] ?? Boxes
              const active =
                page.href === "/" ? pathname === "/" : pathname.startsWith(page.href)

              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className={cn(
                    "flex min-w-0 items-center gap-2.5 rounded-md px-2 py-1.5 text-sm",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{t(page.label)}</span>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        <div className="flex flex-col gap-2 p-3">
          <ThemeSwitcher />
          <TokenEditor />
          <ShellControls />
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>

      {toc?.length ? <Toc items={toc} /> : null}
    </div>
  )
}

/* 페이지 머리말.
 *
 * 세 단을 고정한다 — 이름 · 정의 한 문단 · 구분선.
 * 구분선까지가 "여기가 어디인가"이고, 그 아래부터가 내용이다.
 * 탭마다 이 순서가 같아야 어느 탭에 들어가든 읽는 법이 같아진다. */
export function CatalogHeader({
  title,
  count,
  children,
}: {
  title: Copy | string
  count?: string
  children: React.ReactNode
}) {
  const { t } = useLang()
  return (
    <header className="mb-14">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-5xl leading-tight font-semibold tracking-tight text-balance">
          {t(title)}
        </h1>
        {count ? (
          <Badge variant="secondary" className="translate-y-1">
            {count}
          </Badge>
        ) : null}
      </div>
      <div className="text-muted-foreground max-w-[72ch] text-base leading-relaxed [&_b]:text-foreground [&_b]:font-medium">
        {children}
      </div>
      <Separator className="mt-10" />
    </header>
  )
}

/* 군 머리말.
 *
 * 페이지 안에서 한 단 아래 — 제목만으로는 "빈 상태"가 무엇의 빈 상태인지 알 수 없으므로,
 * 정의 한 줄을 항상 붙인다. 옆자리 디자이너에게 건네는 설명이라고 생각하고 쓴다. */
export function GroupHeader({
  title,
  note,
  count,
  icon: Icon,
}: {
  title: Copy | string
  note: Copy | string
  count?: number
  icon?: React.ComponentType<{ className?: string }>
}) {
  const { t } = useLang()
  return (
    <div className="mb-7">
      <div className="flex items-center gap-2.5">
        {Icon ? <Icon className="text-muted-foreground size-5" /> : null}
        <h2 className="text-2xl font-semibold tracking-tight">{t(title)}</h2>
        {count != null ? (
          <Badge variant="outline" className="translate-y-px tabular-nums">
            {count}
          </Badge>
        ) : null}
      </div>
      <p className="text-muted-foreground mt-2 max-w-[68ch] text-sm leading-relaxed">
        {t(note)}
      </p>
    </div>
  )
}
