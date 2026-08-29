/* 캘린더 · 차트 블록 갤러리 — 이들은 라우트가 아니라 컴포넌트로 배포된다. */
import C0 from "@/components/calendar-01"
import C1 from "@/components/calendar-02"
import C2 from "@/components/calendar-03"
import C3 from "@/components/calendar-04"
import C4 from "@/components/calendar-05"
import C5 from "@/components/calendar-06"
import C6 from "@/components/calendar-07"
import C7 from "@/components/calendar-08"
import C8 from "@/components/calendar-09"
import C9 from "@/components/calendar-10"
import C10 from "@/components/calendar-11"
import C11 from "@/components/calendar-12"
import C12 from "@/components/calendar-13"
import C13 from "@/components/calendar-14"
import C14 from "@/components/calendar-15"
import C15 from "@/components/calendar-16"
import C16 from "@/components/calendar-17"
import C17 from "@/components/calendar-18"
import C18 from "@/components/calendar-19"
import C19 from "@/components/calendar-20"
import C20 from "@/components/calendar-21"
import C21 from "@/components/calendar-22"
import C22 from "@/components/calendar-23"
import C23 from "@/components/calendar-24"
import C24 from "@/components/calendar-25"
import C25 from "@/components/calendar-26"
import C26 from "@/components/calendar-27"
import C27 from "@/components/calendar-28"
import C28 from "@/components/calendar-29"
import C29 from "@/components/calendar-30"
import C30 from "@/components/calendar-31"
import C31 from "@/components/calendar-32"
import C32 from "@/components/chart-area-default"
import C33 from "@/components/chart-bar-default"
import C34 from "@/components/chart-line-default"
import C35 from "@/components/chart-pie-simple"
import C36 from "@/components/chart-radar-default"
import C37 from "@/components/chart-tooltip-default"

const ITEMS = [
  { id: "calendar-01", Comp: C0 },
  { id: "calendar-02", Comp: C1 },
  { id: "calendar-03", Comp: C2 },
  { id: "calendar-04", Comp: C3 },
  { id: "calendar-05", Comp: C4 },
  { id: "calendar-06", Comp: C5 },
  { id: "calendar-07", Comp: C6 },
  { id: "calendar-08", Comp: C7 },
  { id: "calendar-09", Comp: C8 },
  { id: "calendar-10", Comp: C9 },
  { id: "calendar-11", Comp: C10 },
  { id: "calendar-12", Comp: C11 },
  { id: "calendar-13", Comp: C12 },
  { id: "calendar-14", Comp: C13 },
  { id: "calendar-15", Comp: C14 },
  { id: "calendar-16", Comp: C15 },
  { id: "calendar-17", Comp: C16 },
  { id: "calendar-18", Comp: C17 },
  { id: "calendar-19", Comp: C18 },
  { id: "calendar-20", Comp: C19 },
  { id: "calendar-21", Comp: C20 },
  { id: "calendar-22", Comp: C21 },
  { id: "calendar-23", Comp: C22 },
  { id: "calendar-24", Comp: C23 },
  { id: "calendar-25", Comp: C24 },
  { id: "calendar-26", Comp: C25 },
  { id: "calendar-27", Comp: C26 },
  { id: "calendar-28", Comp: C27 },
  { id: "calendar-29", Comp: C28 },
  { id: "calendar-30", Comp: C29 },
  { id: "calendar-31", Comp: C30 },
  { id: "calendar-32", Comp: C31 },
  { id: "chart-area-default", Comp: C32 },
  { id: "chart-bar-default", Comp: C33 },
  { id: "chart-line-default", Comp: C34 },
  { id: "chart-pie-simple", Comp: C35 },
  { id: "chart-radar-default", Comp: C36 },
  { id: "chart-tooltip-default", Comp: C37 },
]

export default function CalendarsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold">캘린더 · 차트</h1>
        <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
          공식 shadcn 블록 38개. 화면이 아니라 컴포넌트라 한 페이지에 모아 놓는다.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {ITEMS.map(({ id, Comp }) => (
          <section key={id} className="flex flex-col gap-3">
            <code className="text-xs text-muted-foreground">{id}</code>
            <div className="flex min-h-40 items-center justify-center rounded-lg border p-4">
              <Comp />
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
