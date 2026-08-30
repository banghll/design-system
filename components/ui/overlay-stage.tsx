"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* 열린 상태를 그 자리에서 보여 주는 무대.
 *
 * 다이얼로그·시트·드로어·팝오버는 눌러야 나온다. 카탈로그에서는 그게 불편하다 —
 * 어떤 모양인지 보려고 매번 열었다 닫아야 하고, 열면 화면 전체를 덮어서
 * 옆 예시와 나란히 비교할 수가 없다.
 *
 * 그래서 «포털이 향하는 곳» 만 바꾼다. 오버레이 컴포넌트를 복제해서 흉내 내면
 * 진짜와 어긋나기 시작하므로, 진짜를 그대로 쓰되 body 대신 이 상자로 보낸다.
 *
 * transform 이 걸린 요소는 position:fixed 의 기준이 된다. 그 성질 하나로
 * «화면 한가운데» 가 «이 상자 한가운데» 가 된다 — 오버레이 쪽 클래스는
 * 한 글자도 고치지 않는다. */
const StageContext = React.createContext<HTMLElement | null>(null)

export function useOverlayContainer() {
  return React.useContext(StageContext) ?? undefined
}

export function OverlayStage({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const [el, setEl] = React.useState<HTMLDivElement | null>(null)

  return (
    <div
      ref={setEl}
      data-slot="overlay-stage"
      className={cn(
        "relative isolate min-h-64 overflow-hidden rounded-lg border border-dashed border-border bg-background [transform:translateZ(0)]",
        className
      )}
      {...props}
    >
      {/* 상자가 실제로 생긴 다음에 자식을 그린다 — 없는 곳으로는 포털을 못 보낸다 */}
      <StageContext.Provider value={el}>{el ? children : null}</StageContext.Provider>
    </div>
  )
}
