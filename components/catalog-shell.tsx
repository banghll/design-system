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
  GitCompare,
  LayoutDashboard,
  Menu,
  Palette,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { type Copy, useLang } from "@/components/lang"
import { ShellControls } from "@/components/shell-controls"
import { Toc, type TocItem } from "@/components/toc"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { TokenEditor } from "@/components/token-editor"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { PAGES } from "@/lib/catalog-nav"
import { cn } from "@/lib/utils"

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  palette: Palette,
  component: Component,
  "file-stack": FileStack,
  boxes: Boxes,
  blocks: Blocks,
  layout: LayoutDashboard,
  gitcompare: GitCompare,
}

/* 페이지 목록. 사이드바와 모바일 서랍이 같은 것을 그린다 —
 * 두 벌로 두면 한쪽에만 페이지가 늘어나는 일이 반드시 생긴다. */
function NavList({
  pathname,
  onPick,
}: {
  pathname: string
  onPick?: () => void
}) {
  const { t } = useLang()
  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {PAGES.map((page) => {
        const Icon = ICONS[page.icon] ?? Boxes
        const active =
          page.href === "/" ? pathname === "/" : pathname.startsWith(page.href)

        return (
          <Link
            key={page.href}
            href={page.href}
            onClick={onPick}
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
  )
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
  const { t, lang } = useLang()
  const [open, setOpen] = useState(false)

  /* 어느 페이지에 있는지. 모바일에는 사이드바가 없으니 머리줄이 그 자리를 대신한다 */
  const here =
    PAGES.find((p) =>
      p.href === "/" ? pathname === "/" : pathname.startsWith(p.href)
    ) ?? PAGES[0]

  /* 카탈로그 페이지는 차트·이미지가 늦게 자리를 잡아, 브라우저 기본 앵커 이동만으로는
   * 목표가 어긋난다. 해시가 바뀌면 잠깐 동안 다시 맞춘다. */
  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])

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
          <NavList pathname={pathname} />
        </ScrollArea>

        <div className="flex flex-col gap-2 p-3">
          <ThemeSwitcher />
          <TokenEditor />
          <ShellControls />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* 모바일 머리줄. 큰 화면에는 사이드바가 늘 보이므로 여기서는 사라진다.
          * 예전에는 이게 없어서, 폰으로 들어오면 그 페이지에서 나갈 방법이 없었다. */}
        <header className="bg-background/90 sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b px-3 backdrop-blur lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={lang === "ko" ? "메뉴 열기" : "Open menu"}
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 gap-0 p-0">
              <SheetHeader className="border-b">
                <SheetTitle className="flex items-center gap-2 text-sm">
                  <Boxes className="size-4" />
                  shadcn 디자인 시스템
                </SheetTitle>
                <SheetDescription className="sr-only">
                  {lang === "ko" ? "페이지 목록과 도구" : "Pages and tools"}
                </SheetDescription>
              </SheetHeader>

              <ScrollArea className="min-h-0 flex-1">
                <NavList pathname={pathname} onPick={() => setOpen(false)} />

                {/* 이 페이지 안의 구획. 큰 화면에서는 오른쪽 목차가 맡지만
                  * 모바일에는 그 자리가 없어서 같은 서랍에 이어 붙인다. */}
                {toc?.length ? (
                  <div className="border-t p-3">
                    <div className="text-muted-foreground mb-1.5 px-2 text-[11px] font-medium">
                      {t(here.label)}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {toc.map((i) => (
                        <a
                          key={i.id}
                          href={"#" + i.id}
                          onClick={() => setOpen(false)}
                          className="text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground truncate rounded-md px-2 py-1.5 text-sm"
                        >
                          {t(i.label)}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </ScrollArea>

              <div className="flex flex-col gap-2 border-t p-3">
                <ThemeSwitcher />
                <ShellControls />
              </div>
            </SheetContent>
          </Sheet>

          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            {t(here.label)}
          </span>
        </header>

        {children}
      </div>

      {toc?.length ? <Toc items={toc} /> : null}
    </div>
  )
}

/* 모든 페이지의 본문 틀.
 *
 * 폭과 위아래 여백을 한 곳에서 정한다. 예전에는 페이지마다 1100 · 1200 · 900 ·
 * 1400 이 제각각이었고, 탭을 옮길 때마다 본문이 좌우로 흔들렸다. 흔들리는 폭은
 * «다른 사이트로 왔나» 로 읽힌다.
 *
 * wide 는 패턴·블록처럼 카드가 실제로 넓어야 하는 화면만 쓴다. */
export function CatalogMain({
  wide = false,
  children,
}: {
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <main
      className={cn(
        "mx-auto w-full px-6 py-14 lg:px-10",
        wide ? "max-w-[1200px]" : "max-w-[1100px]"
      )}
    >
      {children}
    </main>
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
