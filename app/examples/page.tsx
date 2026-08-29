/* 공식 예제 카탈로그 — scripts/gen-examples.mjs 가 생성한다. 직접 고치지 말 것.
 * shadcn/ui 레포(MIT)의 컴포넌트별 예제 60개.
 * /kit 은 우리가 쓴 예시, 여기는 원작자가 의도한 표준 예시다.
 */
"use client"

import { CatalogShell } from "@/components/catalog-shell"

import E0 from "@/components/examples/accordion-example"
import E1 from "@/components/examples/alert-dialog-example"
import E2 from "@/components/examples/alert-example"
import E3 from "@/components/examples/aspect-ratio-example"
import E4 from "@/components/examples/attachment-example"
import E5 from "@/components/examples/avatar-example"
import E6 from "@/components/examples/badge-example"
import E7 from "@/components/examples/breadcrumb-example"
import E8 from "@/components/examples/bubble-example"
import E9 from "@/components/examples/button-example"
import E10 from "@/components/examples/button-group-example"
import E11 from "@/components/examples/calendar-example"
import E12 from "@/components/examples/card-example"
import E13 from "@/components/examples/carousel-example"
import E14 from "@/components/examples/chart-example"
import E15 from "@/components/examples/checkbox-example"
import E16 from "@/components/examples/collapsible-example"
import E17 from "@/components/examples/combobox-example"
import E18 from "@/components/examples/command-example"
import { ComponentExample as E19 } from "@/components/examples/component-example"
import E20 from "@/components/examples/context-menu-example"
import E21 from "@/components/examples/dialog-example"
import E22 from "@/components/examples/drawer-example"
import E23 from "@/components/examples/dropdown-menu-example"
import E24 from "@/components/examples/empty-example"
import E25 from "@/components/examples/field-example"
import E26 from "@/components/examples/hover-card-example"
import E27 from "@/components/examples/input-example"
import E28 from "@/components/examples/input-group-example"
import E29 from "@/components/examples/input-otp-example"
import E30 from "@/components/examples/item-example"
import E31 from "@/components/examples/kbd-example"
import E32 from "@/components/examples/label-example"
import E33 from "@/components/examples/marker-example"
import E34 from "@/components/examples/menubar-example"
import E35 from "@/components/examples/message-example"
import E36 from "@/components/examples/message-scroller-example"
import E37 from "@/components/examples/native-select-example"
import E38 from "@/components/examples/navigation-menu-example"
import E39 from "@/components/examples/pagination-example"
import E40 from "@/components/examples/popover-example"
import E41 from "@/components/examples/progress-example"
import E42 from "@/components/examples/questionnaire-example"
import E43 from "@/components/examples/radio-group-example"
import E44 from "@/components/examples/resizable-example"
import E45 from "@/components/examples/scroll-area-example"
import E46 from "@/components/examples/select-example"
import E47 from "@/components/examples/separator-example"
import E48 from "@/components/examples/sheet-example"
import E49 from "@/components/examples/skeleton-example"
import E50 from "@/components/examples/slider-example"
import E51 from "@/components/examples/sonner-example"
import E52 from "@/components/examples/spinner-example"
import E53 from "@/components/examples/switch-example"
import E54 from "@/components/examples/table-example"
import E55 from "@/components/examples/tabs-example"
import E56 from "@/components/examples/textarea-example"
import E57 from "@/components/examples/toggle-example"
import E58 from "@/components/examples/toggle-group-example"
import E59 from "@/components/examples/tooltip-example"

const ITEMS = [
  { id: "accordion", file: "accordion-example", Comp: E0 },
  { id: "alert-dialog", file: "alert-dialog-example", Comp: E1 },
  { id: "alert", file: "alert-example", Comp: E2 },
  { id: "aspect-ratio", file: "aspect-ratio-example", Comp: E3 },
  { id: "attachment", file: "attachment-example", Comp: E4 },
  { id: "avatar", file: "avatar-example", Comp: E5 },
  { id: "badge", file: "badge-example", Comp: E6 },
  { id: "breadcrumb", file: "breadcrumb-example", Comp: E7 },
  { id: "bubble", file: "bubble-example", Comp: E8 },
  { id: "button", file: "button-example", Comp: E9 },
  { id: "button-group", file: "button-group-example", Comp: E10 },
  { id: "calendar", file: "calendar-example", Comp: E11 },
  { id: "card", file: "card-example", Comp: E12 },
  { id: "carousel", file: "carousel-example", Comp: E13 },
  { id: "chart", file: "chart-example", Comp: E14 },
  { id: "checkbox", file: "checkbox-example", Comp: E15 },
  { id: "collapsible", file: "collapsible-example", Comp: E16 },
  { id: "combobox", file: "combobox-example", Comp: E17 },
  { id: "command", file: "command-example", Comp: E18 },
  { id: "component", file: "component-example", Comp: E19 },
  { id: "context-menu", file: "context-menu-example", Comp: E20 },
  { id: "dialog", file: "dialog-example", Comp: E21 },
  { id: "drawer", file: "drawer-example", Comp: E22 },
  { id: "dropdown-menu", file: "dropdown-menu-example", Comp: E23 },
  { id: "empty", file: "empty-example", Comp: E24 },
  { id: "field", file: "field-example", Comp: E25 },
  { id: "hover-card", file: "hover-card-example", Comp: E26 },
  { id: "input", file: "input-example", Comp: E27 },
  { id: "input-group", file: "input-group-example", Comp: E28 },
  { id: "input-otp", file: "input-otp-example", Comp: E29 },
  { id: "item", file: "item-example", Comp: E30 },
  { id: "kbd", file: "kbd-example", Comp: E31 },
  { id: "label", file: "label-example", Comp: E32 },
  { id: "marker", file: "marker-example", Comp: E33 },
  { id: "menubar", file: "menubar-example", Comp: E34 },
  { id: "message", file: "message-example", Comp: E35 },
  { id: "message-scroller", file: "message-scroller-example", Comp: E36 },
  { id: "native-select", file: "native-select-example", Comp: E37 },
  { id: "navigation-menu", file: "navigation-menu-example", Comp: E38 },
  { id: "pagination", file: "pagination-example", Comp: E39 },
  { id: "popover", file: "popover-example", Comp: E40 },
  { id: "progress", file: "progress-example", Comp: E41 },
  { id: "questionnaire", file: "questionnaire-example", Comp: E42 },
  { id: "radio-group", file: "radio-group-example", Comp: E43 },
  { id: "resizable", file: "resizable-example", Comp: E44 },
  { id: "scroll-area", file: "scroll-area-example", Comp: E45 },
  { id: "select", file: "select-example", Comp: E46 },
  { id: "separator", file: "separator-example", Comp: E47 },
  { id: "sheet", file: "sheet-example", Comp: E48 },
  { id: "skeleton", file: "skeleton-example", Comp: E49 },
  { id: "slider", file: "slider-example", Comp: E50 },
  { id: "sonner", file: "sonner-example", Comp: E51 },
  { id: "spinner", file: "spinner-example", Comp: E52 },
  { id: "switch", file: "switch-example", Comp: E53 },
  { id: "table", file: "table-example", Comp: E54 },
  { id: "tabs", file: "tabs-example", Comp: E55 },
  { id: "textarea", file: "textarea-example", Comp: E56 },
  { id: "toggle", file: "toggle-example", Comp: E57 },
  { id: "toggle-group", file: "toggle-group-example", Comp: E58 },
  { id: "tooltip", file: "tooltip-example", Comp: E59 },
]

export default function ExamplesPage() {
  return (
    <CatalogShell>
    <main className="mx-auto w-full max-w-[1400px] px-6 py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">공식 예제 64개</h1>
        <p className="text-muted-foreground mt-2 max-w-[62ch] text-sm">
          shadcn/ui 레포에 들어 있는 컴포넌트별 표준 예제다. 레지스트리로는 배포되지
          않아 레포에서 직접 받아왔다. <strong>/kit</strong> 이 우리가 쓴 예시라면,
          여기는 원작자가 의도한 쓰임이다.
        </p>
      </header>

      <nav className="mb-10 flex flex-wrap gap-1.5">
        {ITEMS.map((i) => (
          <a key={i.id} href={`#${i.id}`} className="rounded-md border px-2 py-1 text-[11px]">
            {i.id}
          </a>
        ))}
      </nav>

      <section className="mb-10 rounded-lg border p-5">
        <h2 className="mb-1 text-sm font-medium">앱 셸 예제</h2>
        <p className="text-muted-foreground mb-3 text-xs">화면 전체를 쓰는 예제라 각자 라우트로 열린다</p>
        <div className="flex flex-wrap gap-2">
          <a key="sidebar-example" href="/examples/sidebar-example" className="rounded-md border px-3 py-2 text-xs">sidebar-example</a>
          <a key="sidebar-floating-example" href="/examples/sidebar-floating-example" className="rounded-md border px-3 py-2 text-xs">sidebar-floating-example</a>
          <a key="sidebar-icon-example" href="/examples/sidebar-icon-example" className="rounded-md border px-3 py-2 text-xs">sidebar-icon-example</a>
          <a key="sidebar-inset-example" href="/examples/sidebar-inset-example" className="rounded-md border px-3 py-2 text-xs">sidebar-inset-example</a>
        </div>
      </section>

      <div className="flex flex-col gap-10">
        {ITEMS.map(({ id, file, Comp }) => (
          <section key={id} id={id} className="scroll-mt-6">
            <div className="mb-3 flex items-baseline gap-3 border-t pt-5">
              <h2 className="text-base font-medium">{id}</h2>
              <code className="text-muted-foreground text-[11px]">
                components/examples/{file}.tsx
              </code>
            </div>
            <div className="rounded-lg border p-6">
              <Comp />
            </div>
          </section>
        ))}
      </div>
    </main>
    </CatalogShell>
  )
}
