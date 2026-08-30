"use client"

/* 블록 목록.
 *
 * 예전에는 이름과 링크만 나열했다. 그러면 sidebar-01 부터 16 까지 구분이 안 되고,
 * 하나씩 열어 봐야 무엇인지 알 수 있었다. 이제는 실제 라우트를 축소해 그 자리에서 보여 준다.
 * 목록 자체가 미리보기다 — 들어가지 않아도 고를 수 있다. */

import {
  CalendarDays,
  LayoutDashboard,
  LogIn,
  PanelLeft,
  Search,
  Sparkles,
  UserPlus,
} from "lucide-react"
import { useMemo, useState } from "react"

import { useLang } from "@/components/lang"
import { BlockPreview } from "@/components/block-preview"
import { CatalogHeader, CatalogShell, GroupHeader } from "@/components/catalog-shell"
import { Input } from "@/components/ui/input"
import { BLOCK_GROUPS, BLOCKS } from "@/lib/block-catalog"

const GROUP_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  sidebar: PanelLeft,
  dashboard: LayoutDashboard,
  preview: Sparkles,
  login: LogIn,
  signup: UserPlus,
  calendars: CalendarDays,
}

export default function BlocksPage() {
  const { t, lang } = useLang()
  const [q, setQ] = useState("")

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return BLOCK_GROUPS.map((g) => ({
      ...g,
      items: BLOCKS.filter(
        (b) =>
          b.group === g.key &&
          (!needle ||
            `${b.id} ${b.title.ko} ${b.title.en} ${b.what.ko} ${b.what.en} ${b.when.ko} ${b.when.en} ${b.tags.join(" ")}`
              .toLowerCase()
              .includes(needle))
      ),
    })).filter((g) => g.items.length > 0)
  }, [q])

  const total = groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <CatalogShell>
      <div className="mx-auto max-w-6xl px-8 py-14">
        <CatalogHeader
          title={{ ko: "블록", en: "Blocks" }}
          count={lang === "ko" ? `${BLOCKS.length}개` : `${BLOCKS.length}`}
        >
          {lang === "ko" ? (
            <>
              <b>블록은 화면 한 벌이다.</b> 컴포넌트가 더 쪼갤 수 없는 낱개,
              패턴이 한 가지 상황을 푼 조립이라면, 블록은 그 위에 앉는 완성된 뼈대다 —
              새 화면을 만들 때 가장 먼저, 그리고 가장 되돌리기 어렵게 정해지는 단위다.
              <br />
              <br />
              아래 미리보기는 실제 라우트를 축소한 것이다. 블록 코드를 고치면 이
              목록도 그대로 바뀐다. 고르는 순서는 <b>무엇인지</b> 보고,{" "}
              <b>언제</b> 줄의 조건이 지금 상황과 맞는지 확인하고, 그 폴더를 복사해
              내용을 갈아 끼우는 것이다.
            </>
          ) : (
            <>
              <b>A block is a whole screen.</b> If a component is the indivisible
              unit and a pattern is an assembly that solves one situation, a block
              is the finished frame they sit in — the first decision on a new
              screen, and the hardest one to walk back.
              <br />
              <br />
              Every preview below is the real route, scaled down. Edit a block and
              this list changes with it. The order of work: read <b>what</b> it is,
              check whether the <b>when</b> condition matches your situation, then
              copy that folder and swap the content.
            </>
          )}
        </CatalogHeader>

        <div className="relative mb-12 max-w-sm">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "ko" ? "블록 · 특징으로 찾기 (예: 접힘, 오른쪽, OAuth)" : "Search blocks and traits (fold, right, OAuth)"}
            className="pl-9"
          />
        </div>

        {q && total === 0 ? (
          <p className="text-muted-foreground text-sm">
            {lang === "ko" ? `«${q}» 에 맞는 블록이 없다.` : `Nothing matches “${q}”.`}
          </p>
        ) : null}

        <div className="flex flex-col gap-16">
          {groups.map((g) => (
            <section key={g.key} id={g.key} className="scroll-mt-8">
              <GroupHeader
                title={g.title}
                note={g.note}
                count={g.items.length}
                icon={GROUP_ICON[g.key]}
              />
              <div className="grid gap-6 md:grid-cols-2">
                {g.items.map((b) => (
                  <BlockPreview key={b.id} block={b} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </CatalogShell>
  )
}
