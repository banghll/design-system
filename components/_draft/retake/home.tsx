/* 왜: 가입 직후 도착하는 화면. 첫 영상은 아직 만들어지는 중이라
 *     «생성 중» 이 목록보다 위에 있어야 한다 — 방금 시킨 일이 어디 갔는지 찾게 하면 안 된다.
 * 어디서: /retake 의 마지막 단계. 2026-09-01 */
"use client"

import { Compass, LayoutGrid, Library } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"

import type { Template } from "./data"
import type { Progressing } from "./generating"
import { TemplateCatalog } from "./sections"

const NAV = [
  { label: "Explore", icon: Compass },
  { label: "템플릿", icon: LayoutGrid },
  { label: "라이브러리", icon: Library },
]

export function Home({
  name,
  progress,
  onPick,
}: {
  name: string
  progress: Progressing
  onPick: (t: Template) => void
}) {
  const done = progress.pct >= 100

  return (
    <div className="grid h-svh grid-cols-[15.5rem_1fr] max-md:grid-cols-1">
      <nav className="flex flex-col gap-2 border-r px-5 py-7 max-md:hidden">
        <span className="mb-6 font-anton text-xl tracking-[0.06em] uppercase">Retake</span>
        {NAV.map((n, i) => (
          <Button
            key={n.label}
            type="button"
            variant={i === 0 ? "secondary" : "ghost"}
            className="h-11 justify-start gap-2 text-base"
            aria-current={i === 0 ? "page" : undefined}
          >
            <n.icon />
            {n.label}
          </Button>
        ))}
        <span className="flex-1" />
        <Button type="button" className="h-11 font-anton tracking-[0.1em] uppercase">
          Upgrade
        </Button>
        <Button type="button" variant="outline" className="h-11">
          설정
        </Button>
        <span className="mt-4 flex items-center gap-3">
          <i className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold not-italic text-primary-foreground">
            {name.slice(0, 1)}
          </i>
          <span className="truncate text-sm font-semibold">{name}</span>
        </span>
      </nav>

      <div className="overflow-y-auto px-10 pt-8 pb-20">
        <div className="mx-auto mb-10 flex w-[min(47.5rem,100%)] items-center gap-2 rounded-xl border bg-card p-2 shadow-sm">
          <Input
            size="lg"
            placeholder="다음 영상을 설명해 주세요"
            aria-label="다음 영상"
            className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <Button type="button" size="lg" className="font-bold">
            Shoot
          </Button>
        </div>

        <p className="mb-4 text-sm font-medium text-muted-foreground">
          {done ? "방금 완성" : "생성 중"}
        </p>
        <div className="mb-12 flex gap-5">
          <div className="flex w-48 flex-col gap-3">
            <div className="grid aspect-9/12 place-items-center gap-2 rounded-xl bg-linear-160 from-neutral-200 to-neutral-300">
              {done ? null : <Spinner className="size-9 text-neutral-700" />}
              <small className="px-4 text-xs text-neutral-700 tabular-nums">
                {done ? "완료 · 100%" : `${progress.label} · ${progress.pct}%`}
              </small>
              {done ? null : <Progress value={progress.pct} className="h-1 w-3/4 bg-white/60" />}
            </div>
            <b className="text-sm font-bold">방금 만든 영상</b>
          </div>
        </div>

        <p className="mb-4 text-sm font-medium text-muted-foreground">영상 템플릿</p>
        <TemplateCatalog view="home" onPick={onPick} />
      </div>
    </div>
  )
}
