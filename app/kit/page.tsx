/* 컴포넌트 갤러리 — 레포에 있는 모든 컴포넌트를 한 화면에 렌더한다.
 * 이 페이지는 두 가지를 겸한다: 사람이 보는 갤러리, Paper 로 뽑는 추출 지그.
 * data-kit 블록이 추출 단위다.
 */
"use client"

import { SectionAi } from "./section-ai"
import { SectionAi2 } from "./section-ai2"
import { SectionDisplay } from "./section-display"
import { SectionForm } from "./section-form"
import { SectionNavData } from "./section-nav-data"
import { SectionOverlay } from "./section-overlay"

const TOC = [
  { id: "g-action", label: "액션 · 입력" },
  { id: "g-display", label: "표시" },
  { id: "g-nav", label: "탐색 · 데이터" },
  { id: "g-overlay", label: "오버레이 · 팝업" },
  { id: "g-ai", label: "AI Elements" },
  { id: "g-ai2", label: "AI Elements · 산출물" },
]

export default function KitPage() {
  return (
    <div className="flex min-h-dvh">
      <nav
        className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col overflow-y-auto border-r p-6 lg:flex"
        style={{
          borderColor: "var(--color-border-subtle)",
          background: "var(--color-background-alt)",
        }}
      >
        <span className="text-caption-2xs text-subtle mb-4 tracking-[0.1em]">
          컴포넌트
        </span>
        <div className="flex flex-col gap-1">
          {TOC.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className="text-body-sm text-subtle hover:text-foreground rounded-md px-2 py-1.5"
            >
              {t.label}
            </a>
          ))}
        </div>
      </nav>

      <main className="min-w-0 flex-1 px-6 py-10 lg:px-10">
        <header className="mb-10">
          <h1 className="text-title-xl">컴포넌트 갤러리</h1>
          <p className="text-body-sm text-subtle mt-2 max-w-[60ch]">
            레포에 저장된 컴포넌트를 전부 렌더한다. 색과 타이포는 slate
            파운데이션에서, 나머지는 shadcn 기본 스케일에서 온다.
          </p>
        </header>

        <div className="flex flex-col gap-12">
          <SectionForm />
          <SectionDisplay />
          <SectionNavData />
          <SectionOverlay />
          <SectionAi />
          <SectionAi2 />
        </div>
      </main>
    </div>
  )
}
