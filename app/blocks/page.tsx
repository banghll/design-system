"use client"

/* 블록 목록 — 공식 shadcn 블록을 종류별로 모아 링크한다.
 * 블록은 하나가 한 화면이라 갤러리에 나란히 넣을 수 없다. 목록 + 실제 라우트로 연다. */
import {
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  LogIn,
  PanelLeft,
  Search,
  Sparkles,
  UserPlus,
} from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { CatalogHeader, CatalogShell, GroupHeader } from "@/components/catalog-shell"
import { Input } from "@/components/ui/input"

const GROUPS = [
  {
    key: "sidebar",
    title: "앱 셸",
    icon: PanelLeft,
    note: "사이드바 + 본문. 제품 화면의 뼈대",
  },
  {
    key: "dashboard",
    title: "대시보드",
    icon: LayoutDashboard,
    note: "지표 · 차트 · 데이터 테이블 한 벌",
  },
  {
    key: "preview",
    title: "쇼케이스",
    icon: Sparkles,
    note: "create 페이지의 미리보기. 레지스트리엔 껍데기만 있어 레포에서 직접 받아왔다",
  },
  { key: "login", title: "로그인", icon: LogIn, note: "인증 진입 화면" },
  { key: "signup", title: "가입", icon: UserPlus, note: "계정 생성 화면" },
  {
    key: "calendars",
    title: "캘린더 · 차트",
    icon: CalendarDays,
    note: "라우트가 아니라 컴포넌트 — 38개를 한 페이지에 모아 놓았다",
  },
  { key: "chart", title: "차트", icon: BarChart3, note: "recharts 기반 기본형" },
]

const BLOCKS = [
  "calendars",
  "dashboard-01",
  "login-01",
  "login-02",
  "login-03",
  "login-04",
  "login-05",
  "preview",
  "preview-02",
  "preview-03",
  "sidebar-01",
  "sidebar-02",
  "sidebar-03",
  "sidebar-04",
  "sidebar-05",
  "sidebar-06",
  "sidebar-07",
  "sidebar-08",
  "sidebar-09",
  "sidebar-10",
  "sidebar-11",
  "sidebar-12",
  "sidebar-13",
  "sidebar-14",
  "sidebar-15",
  "sidebar-16",
  "signup-01",
  "signup-02",
  "signup-03",
  "signup-04",
  "signup-05",
]

export default function BlocksIndex() {
  const [q, setQ] = useState("")

  const grouped = useMemo(() => {
    const hit = (b: string) => !q || b.toLowerCase().includes(q.toLowerCase())
    return GROUPS.map((g) => ({
      ...g,
      items: BLOCKS.filter((b) => b.startsWith(g.key)).filter(hit),
    })).filter((g) => g.items.length > 0)
  }, [q])

  const total = grouped.reduce((n, g) => n + g.items.length, 0)

  return (
    <CatalogShell>
      <main className="mx-auto w-full max-w-[1200px] px-6 py-12 lg:px-10">
        <CatalogHeader title="블록" count={`${BLOCKS.length}개`}>
            낱개 컴포넌트를 조립해 놓은 완성 화면이다. 하나가 한 화면이라 갤러리에
            나란히 놓을 수 없어, 각각을 실제 라우트로 연다. 전부 우리 components/ui
            를 참조하므로 컴포넌트를 고치면 블록도 따라 바뀐다.
          </CatalogHeader>

        <div className="relative mb-8 max-w-sm">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="블록 이름으로 거르기"
            className="pl-9"
          />
        </div>

        {q && total === 0 ? (
          <p className="text-muted-foreground text-sm">
            거르는 조건에 맞는 블록이 없습니다.
          </p>
        ) : null}

        <div className="flex flex-col gap-10">
          {grouped.map(({ key, title, note, icon: Icon, items }) => (
            <section key={key} id={key} className="scroll-mt-6">
              <GroupHeader
                title={title}
                note={note}
                count={items.length}
                icon={Icon}
              />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((b) => (
                  <Link
                    key={b}
                    href={`/blocks/${b}`}
                    className="bg-card hover:border-foreground/30 flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors"
                  >
                    <Icon className="text-muted-foreground size-3.5 shrink-0" />
                    <span className="min-w-0 truncate">{b}</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </CatalogShell>
  )
}
