/* 오른쪽 목차.
 *
 * 왼쪽 내비가 "어느 페이지인가" 를 맡고, 여기가 "그 페이지 안 어디인가" 를 맡는다.
 * 둘을 왼쪽에 겹쳐 두면 페이지 이동과 페이지 내 이동이 같은 모양이 되어 섞인다 —
 * 층이 다른 두 가지는 자리도 달라야 한다.
 *
 * 지금 읽고 있는 구획을 표시한다. 목차가 위치를 안 알려 주면 그냥 링크 목록이다. */
"use client"

import { useEffect, useState } from "react"

import { type Copy, useLang } from "@/components/lang"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export type TocItem = {
  /** 페이지 안 앵커 id */
  id: string
  label: Copy | string
  /** 0 = 구획, 1 = 그 아래 */
  depth?: 0 | 1
}

export function Toc({ items }: { items: TocItem[] }) {
  const { t, lang } = useLang()
  const [active, setActive] = useState<string | null>(null)

  /* 부르는 쪽이 map 으로 새 배열을 만들어 넘기므로 items 자체는 매 렌더 달라진다.
   * 그대로 의존성에 걸면 관찰자가 매번 다시 만들어져 한 번도 발화하지 못한다.
   * 실제로 달라진 것은 id 목록뿐이니 그것을 기준으로 삼는다. */
  const key = items.map((i) => i.id).join("|")

  /* 화면에 들어온 것 중 가장 위에 있는 구획을 지금 위치로 본다.
   * 여러 개가 동시에 보일 때 아래쪽을 고르면, 스크롤을 조금만 내려도
   * 표시가 앞서 나가 실제로 읽는 곳과 어긋난다. */
  useEffect(() => {
    if (!items.length) return
    const seen = new Map<string, boolean>()

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting)
        const first = items.find((i) => seen.get(i.id))
        if (first) setActive(first.id)
      },
      /* 위쪽 1/3 지점을 기준선으로 삼는다 — 제목이 화면 상단에 닿을 때 바뀐다. */
      { rootMargin: "-80px 0px -66% 0px", threshold: 0 }
    )

    for (const i of items) {
      const el = document.getElementById(i.id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  if (items.length < 2) return null

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 xl:block">
      <div className="flex h-full flex-col gap-3 py-8 pr-6 pl-2">
        <p className="text-muted-foreground px-3 text-xs font-medium">
          {lang === "ko" ? "목차" : "On this page"}
        </p>

        <ScrollArea className="min-h-0 flex-1">
          {/* 왼쪽 세로선이 목차 전체를 하나로 묶고, 지금 위치만 진해진다. */}
          <nav className="border-border/60 flex flex-col border-l">
            {items.map((i) => {
              const on = active === i.id
              return (
                <a
                  key={i.id}
                  href={`#${i.id}`}
                  className={cn(
                    "-ml-px border-l py-1.5 text-[13px] leading-snug transition-colors",
                    i.depth === 1 ? "pl-6" : "pl-3",
                    on
                      ? "border-foreground text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground border-transparent"
                  )}
                >
                  {t(i.label)}
                </a>
              )
            })}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  )
}
