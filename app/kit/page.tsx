/* 컴포넌트 갤러리 — 레포에 있는 모든 컴포넌트를 한 화면에 렌더한다.
 * 이 페이지는 두 가지를 겸한다: 사람이 보는 갤러리, Paper·Figma 로 뽑는 추출 지그.
 * data-kit 블록이 추출 단위다.
 */
"use client"

import { Boxes, Layers, MousePointerClick, Sparkles, Table2 } from "lucide-react"

import { CatalogShell } from "@/components/catalog-shell"

import { SectionAi } from "./section-ai"
import { SectionAi2 } from "./section-ai2"
import { SectionDisplay } from "./section-display"
import { SectionForm } from "./section-form"
import { SectionNavData } from "./section-nav-data"
import { SectionOverlay } from "./section-overlay"

const TOC = [
  { id: "g-action", label: "액션 · 입력", icon: MousePointerClick },
  { id: "g-display", label: "표시", icon: Layers },
  { id: "g-nav", label: "탐색 · 데이터", icon: Table2 },
  { id: "g-overlay", label: "오버레이 · 팝업", icon: Boxes },
  { id: "g-ai", label: "AI Elements", icon: Sparkles },
  { id: "g-ai2", label: "AI · 산출물", icon: Sparkles },
]

export default function KitPage() {
  return (
    <CatalogShell>
      <main className="min-w-0 px-6 py-10 lg:px-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold">컴포넌트 갤러리</h1>
          <p className="text-muted-foreground mt-2 max-w-[62ch] text-sm">
            레포에 저장된 컴포넌트를 전부 렌더한다. 색과 타이포는 slate
            파운데이션에서, 나머지는 shadcn 기본 스케일에서 온다. 같은 컴포넌트를
            원작자가 어떻게 쓰는지는{" "}
            <a href="/examples" className="underline underline-offset-4">
              공식 예제
            </a>
            에 있다.
          </p>
        </header>

        <nav className="mb-10 flex flex-wrap gap-2">
          {TOC.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className="hover:bg-accent flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors"
            >
              <Icon className="size-3.5" />
              {label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-12">
          <SectionForm />
          <SectionDisplay />
          <SectionNavData />
          <SectionOverlay />
          <SectionAi />
          <SectionAi2 />
        </div>
      </main>
    </CatalogShell>
  )
}
