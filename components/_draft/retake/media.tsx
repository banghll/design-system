/* 왜: 화면마다 영상이 열 몇 개씩이라 다 틀어 두면 디코딩만으로 프레임을 잡아먹는다.
 *     실측으로 대화·대기 화면에서 스물세 개가 동시에 돌고 있었다.
 * 어디서: /retake 의 히어로 · 템플릿 목록 · 추천 카드 · 홈. 2026-09-01 */
"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

/* 지금 보고 있는 화면. 여기 없는 화면의 영상은 멈춘다 */
export type VideoView = "hero" | "catalog" | "chat" | "home"

const ActiveViews = createContext<Set<VideoView>>(new Set<VideoView>(["hero", "catalog"]))

export function VideoScope({
  views,
  children,
}: {
  views: VideoView[]
  children: React.ReactNode
}) {
  /* 배열은 매 렌더 새 참조라 그대로 두면 컨텍스트가 계속 바뀐다.
     내용으로 키를 만들어 그 키가 바뀔 때만 새 Set 을 만든다. */
  const key = views.join("|")
  const set = useMemo(
    () => new Set(key.split("|").filter(Boolean) as VideoView[]),
    [key]
  )
  return <ActiveViews.Provider value={set}>{children}</ActiveViews.Provider>
}

/* 링크가 죽으면 그 카드만 그라디언트로 떨어진다 — 화면 전체가 비지 않게. */
export function Clip({
  src,
  view,
  tone,
  className,
}: {
  src?: string
  view: VideoView
  tone: number
  className?: string
}) {
  const active = useContext(ActiveViews)
  const ref = useRef<HTMLVideoElement>(null)
  const [broken, setBroken] = useState(!src)
  const on = active.has(view)

  useEffect(() => {
    const v = ref.current
    if (!v || broken) return
    if (!on) {
      v.pause()
      return
    }
    /* 화면 안에 들어온 것만 튼다. observe() 는 등록 즉시 첫 판정을 던지는데
     * 갓 붙은 요소는 «화면 밖» 으로 잡히는 일이 있어, 우리 확인을 그 뒤로 미룬다. */
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { rootMargin: "120px" }
    )
    io.observe(v)
    const t = setTimeout(() => {
      const r = v.getBoundingClientRect()
      const near =
        r.bottom > -120 && r.top < innerHeight + 120 && r.right > -120 && r.left < innerWidth + 120
      if (near && v.paused) v.play().catch(() => {})
    }, 80)
    return () => {
      clearTimeout(t)
      io.disconnect()
      v.pause()
    }
  }, [on, broken])

  /* 링크가 늦되 살아 있는 경우가 있어 시간으로도 한 번 본다 */
  const onLoaded = useCallback(() => setBroken(false), [])

  return (
    <div className={cn("absolute inset-0", TONES[tone % TONES.length])}>
      {src && !broken ? (
        <video
          ref={ref}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setBroken(true)}
          onLoadedData={onLoaded}
          className={cn("size-full object-cover", className)}
        />
      ) : null}
    </div>
  )
}

/* 영상이 없을 때 깔리는 면. 자리표시자가 회색 한 장이면 화면이 죽는다 */
const TONES = [
  "bg-linear-150 from-amber-200 via-orange-400 to-violet-500",
  "bg-linear-150 from-sky-200 via-blue-500 to-blue-900",
  "bg-linear-150 from-pink-200 via-rose-400 to-purple-900",
  "bg-linear-150 from-emerald-100 via-emerald-400 to-emerald-900",
  "bg-linear-150 from-violet-200 via-violet-400 to-indigo-900",
  "bg-linear-150 from-yellow-100 via-amber-400 to-amber-800",
]
