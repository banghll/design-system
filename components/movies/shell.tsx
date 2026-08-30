/* 씨네덱 앱 셸.
 *
 * 카탈로그의 sidebar-16(고정 헤더 + inset 사이드바) 구조를 그대로 가져왔다.
 * 전역 검색이 사이드바보다 위에 있어야 해서 그 블록을 고른 것이다 —
 * 블록 탭의 '언제' 줄이 실제로 판단 근거가 된 자리다. */
"use client"

import {
  Bookmark,
  Clapperboard,
  Compass,
  LayoutGrid,
  Search,
  Star,
  User,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { useLang } from "@/components/lang"
import { RateDialog } from "@/components/movies/rate-dialog"
import { ShellControls } from "@/components/shell-controls"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { average, MOVIES } from "@/lib/movies/data"
import { useLibrary } from "@/lib/movies/store"

const NAV = [
  { href: "/movies", icon: Compass, ko: "발견", en: "Discover" },
  { href: "/movies/browse", icon: LayoutGrid, ko: "탐색", en: "Browse" },
  { href: "/movies/me", icon: User, ko: "내 기록", en: "My log" },
]

function GlobalSearch() {
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="text-muted-foreground w-full justify-start gap-2 sm:w-72"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">
          {lang === "ko" ? "작품 · 감독 · 태그 검색" : "Search titles, directors, tags"}
        </span>
        <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={
            lang === "ko" ? "제목 · 감독 · 태그로 찾기" : "Title, director or tag"
          }
        />
        <CommandList>
          <CommandEmpty>
            {lang === "ko"
              ? "맞는 작품이 없습니다. 태그로도 찾을 수 있어요 — 예: 반전, 따뜻하다"
              : "No match. Tags work too — try “반전” or “따뜻하다”."}
          </CommandEmpty>
          <CommandGroup heading={lang === "ko" ? "작품" : "Titles"}>
            {MOVIES.map((m) => (
              <CommandItem
                key={m.id}
                value={`${m.title} ${m.titleEn} ${m.director} ${m.genres.join(" ")} ${m.tags.join(" ")}`}
                onSelect={() => {
                  setOpen(false)
                  router.push(`/movies/title/${m.id}`)
                }}
              >
                <Clapperboard className="size-4" />
                <span className="flex-1">{lang === "ko" ? m.title : m.titleEn}</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {m.year} · ★{average(m).toFixed(1)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

export function MoviesShell({ children }: { children: React.ReactNode }) {
  const { lang } = useLang()
  const pathname = usePathname()
  const records = useLibrary((s) => s.records)
  const wish = useLibrary((s) => s.wish)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const rated = Object.keys(records).length
  /* 다음에 볼 것 — 위시리스트 맨 앞. 없으면 평점 1위. */
  const next = MOVIES.find((m) => wish.includes(m.id)) ?? null

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg">
                <Link href="/movies">
                  <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Clapperboard className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate font-semibold">씨네덱</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {lang === "ko" ? "평균 말고 분포" : "Distribution, not average"}
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV.map((n) => (
                  <SidebarMenuItem key={n.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        n.href === "/movies"
                          ? pathname === "/movies"
                          : pathname.startsWith(n.href)
                      }
                      tooltip={lang === "ko" ? n.ko : n.en}
                    >
                      <Link href={n.href}>
                        <n.icon />
                        <span>{lang === "ko" ? n.ko : n.en}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>
              {lang === "ko" ? "내 상태" : "Your state"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={lang === "ko" ? "평가한 작품" : "Rated"}
                  >
                    <Link href="/movies/me">
                      <Star />
                      <span className="flex-1">
                        {lang === "ko" ? "평가함" : "Rated"}
                      </span>
                      {mounted && rated ? (
                        <Badge variant="secondary" className="tabular-nums">
                          {rated}
                        </Badge>
                      ) : null}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={lang === "ko" ? "볼 목록" : "Watchlist"}
                  >
                    <Link href="/movies/me#wish">
                      <Bookmark />
                      <span className="flex-1">
                        {lang === "ko" ? "볼 목록" : "Watchlist"}
                      </span>
                      {mounted && wish.length ? (
                        <Badge variant="secondary" className="tabular-nums">
                          {wish.length}
                        </Badge>
                      ) : null}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="group-data-[collapsible=icon]:hidden">
            <ShellControls />
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* 전역 검색과 평가는 사이드바보다 위에 있어야 한다 —
          * 어느 화면에 있든 손이 닿아야 하는 두 가지다. */}
        <header className="bg-background/80 sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b px-4 backdrop-blur lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <GlobalSearch />
          <div className="ml-auto flex items-center gap-2">
            {next ? (
              <RateDialog movie={next}>
                <Button size="sm" variant="outline" className="hidden sm:inline-flex">
                  <Star className="size-4" />
                  {lang === "ko" ? "방금 본 것 기록" : "Log what you watched"}
                </Button>
              </RateDialog>
            ) : null}
            <Button asChild size="sm" variant="ghost">
              <Link href="/">{lang === "ko" ? "디자인 시스템" : "Design system"}</Link>
            </Button>
          </div>
        </header>

        <div className="min-w-0 flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
