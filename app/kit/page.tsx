/* 컴포넌트 갤러리 — 레포에 저장된 컴포넌트를 전부 렌더한다.
 * 두 가지를 겸한다: 사람이 보는 갤러리, Paper·Figma 로 뽑는 추출 지그.
 * data-kit 블록이 추출 단위다. 목록은 lib/catalog-nav.ts 와 같은 것을 본다.
 */
"use client"

import { CatalogHeader, CatalogShell } from "@/components/catalog-shell"

import { SectionAi } from "./section-ai"
import { SectionAi2 } from "./section-ai2"
import { SectionDisplay } from "./section-display"
import { SectionForm } from "./section-form"
import { SectionNavData } from "./section-nav-data"
import { SectionOverlay } from "./section-overlay"

export default function KitPage() {
  return (
    <CatalogShell>
      <main className="mx-auto w-full max-w-[1200px] px-6 py-12 lg:px-10">
        <CatalogHeader title="컴포넌트" count="109개">
          레포에 저장된 컴포넌트를 전부 렌더한다. shadcn/ui 61개와 AI Elements
          48개다. 색과 타이포는 slate 파운데이션에서, 간격·모서리는 shadcn 기본
          스케일에서 온다. 같은 컴포넌트를 원작자가 어떻게 쓰는지는{" "}
          <a href="/examples" className="underline underline-offset-4">
            공식 예제
          </a>
          에, 이것들을 조립한 결과는{" "}
          <a href="/patterns" className="underline underline-offset-4">
            패턴
          </a>
          에 있다.
        </CatalogHeader>

        <div className="flex flex-col gap-14">
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
