/* 왜: luma.com 랜딩의 첫 진입 연출을 이 시스템 위에 옮겨야 했는데, 색인에 히어로 연출이 없다.
 *     세 조각이 필요했다 — ① 잘린 창 안에서 올라오는 제목 ② 첫 프레임 뒤 걷히는 커튼
 *     ③ 포인터를 따라다니며 안쪽만 다른 글자를 보여주는 리빌 원.
 *     원본은 three.js 가 원의 위치를 CSS 변수로 밀어 주지만, 이 레포에 three 가 없다.
 *     카드 필드를 DOM + motion(이미 의존성)으로 세워 의존성을 늘리지 않았다.
 * 어디서: /landing 화면. 2026-08-31 */
"use client"

import { motion, useReducedMotion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"

/* 하위 경로 배포에서도 그림이 뜨게 한다 — block-thumb.tsx 와 같은 이유. */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

/* 떠 있는 카드. 이 레포가 이미 찍어 둔 블록 썸네일을 쓴다 —
 * 자리표시자 대신 실제 내용물이 떠 있어야 «무엇을 조립하는지» 가 그림으로 읽힌다.
 * x·y 는 %, depth 는 포인터 시차의 세기다. */
const CARDS = [
  { id: "tailark-dusk-hero-section-one", x: 4, y: 12, w: "w-44", rot: -7, depth: 0.5 },
  { id: "sidebar-ours", x: 15, y: 46, w: "w-52", rot: 5, depth: 0.9 },
  { id: "login-03", x: 2, y: 74, w: "w-40", rot: -3, depth: 1.3 },
  { id: "tailark-mist-features-two", x: 26, y: 4, w: "w-40", rot: 8, depth: 0.7 },
  { id: "space-gallery-01", x: 22, y: 82, w: "w-44", rot: -6, depth: 1.1 },
  { id: "dashboard-01", x: 40, y: 90, w: "w-52", rot: 3, depth: 1.4 },
  { id: "tailark-dusk-pricing-one", x: 60, y: 86, w: "w-44", rot: -4, depth: 1.2 },
  { id: "calendars", x: 74, y: 70, w: "w-48", rot: 7, depth: 0.9 },
  { id: "tailark-veil-stats-four", x: 86, y: 40, w: "w-44", rot: -5, depth: 0.6 },
  { id: "signup-02", x: 78, y: 10, w: "w-40", rot: 4, depth: 0.5 },
  { id: "space-testimonial-01", x: 58, y: 2, w: "w-44", rot: -8, depth: 0.4 },
  { id: "tailark-mist-integrations-three", x: 92, y: 78, w: "w-40", rot: 6, depth: 1.5 },
]

/* 리빌 원 안쪽에서만 바뀌는 낱말. 원본(luma)이 형용사를 바꾸는 자리다.
 * 글자 수를 기준 낱말과 맞춘다 — 길이가 다르면 가운데 정렬이 밀려서
 * «다른 낱말» 이 아니라 «깨진 글자» 로 보인다. 네 글자로 고정. */
const BASE_VERB = "조립한다"
const VERBS = ["골라낸다", "가져온다", "다시쓴다"]

/* 원이 열린 상태의 반지름. rem 으로 잡아 글자 크기와 함께 움직인다. */
const REVEAL_OPEN = "9rem"

export function LandingHero() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)

  /* 원의 목표값과 현재값. 프레임마다 React 를 다시 그리지 않으려고
   * ref 에 두고 CSS 변수로만 내보낸다 — 원본도 같은 방식이다. */
  const target = useRef({ x: 0, y: 0, on: 0 })
  const current = useRef({ x: 0, y: 0, on: 0 })
  const [verb, setVerb] = useState(0)

  /* 원 안쪽 낱말은 천천히 돌아간다. 원이 닫혀 있어도 돌아가야
   * 열었을 때 «방금 바뀐 것» 이 아니라 «원래 다른 것» 으로 읽힌다. */
  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setVerb((v) => (v + 1) % VERBS.length), 3200)
    return () => clearInterval(t)
  }, [reduced])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = sectionRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    target.current = { x: e.clientX - r.left, y: e.clientY - r.top, on: 1 }
  }, [])

  const onPointerLeave = useCallback(() => {
    target.current.on = 0
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el || reduced) return
    let raf = 0
    const tick = () => {
      const c = current.current
      const t = target.current
      /* 지수 감쇠. 포인터를 그대로 따라가면 원이 손가락처럼 붙어 딱딱하다. */
      c.x += (t.x - c.x) * 0.12
      c.y += (t.y - c.y) * 0.12
      c.on += (t.on - c.on) * 0.09
      el.style.setProperty("--reveal-x", `${c.x}px`)
      el.style.setProperty("--reveal-y", `${c.y}px`)
      el.style.setProperty("--reveal-size", `calc(${REVEAL_OPEN} * ${c.on.toFixed(3)})`)
      const f = fieldRef.current
      if (f) {
        /* 카드 필드는 원과 반대로 아주 조금 민다 — 깊이가 생긴다. */
        const nx = (c.x / el.clientWidth - 0.5) * 2
        const ny = (c.y / el.clientHeight - 0.5) * 2
        f.style.setProperty("--parallax-x", `${(-nx * 1.2).toFixed(3)}rem`)
        f.style.setProperty("--parallax-y", `${(-ny * 1.2).toFixed(3)}rem`)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const rise = (delay: number) =>
    reduced
      ? { initial: { y: 0 }, animate: { y: 0 } }
      : {
          initial: { y: "115%" },
          animate: { y: "0%" },
          /* 1.2s expo-out · 0.15s 간격. 원본과 같은 곡선이다. */
          transition: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] as const },
        }

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      /* dark 를 여기서 켠다 — 색을 새로 적지 않고 토큰의 다크 값을 그대로 쓴다. */
      className="dark relative isolate min-h-svh overflow-hidden bg-background text-foreground"
      style={
        {
          "--reveal-x": "50%",
          "--reveal-y": "50%",
          "--reveal-size": "0rem",
        } as React.CSSProperties
      }
    >
      {/* ① 카드 필드 — 원본의 WebGL 자리. 450px 아래에서는 원본도 끈다. */}
      <div
        ref={fieldRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden sm:block"
        style={{ "--parallax-x": "0rem", "--parallax-y": "0rem" } as React.CSSProperties}
      >
        {CARDS.map((c, i) => (
          <motion.div
            key={c.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              marginLeft: `calc(var(--parallax-x) * ${c.depth})`,
              marginTop: `calc(var(--parallax-y) * ${c.depth})`,
            }}
            initial={reduced ? false : { opacity: 0, scale: 0.9 }}
            animate={
              reduced
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: ["0%", "-4%", "0%"] }
            }
            transition={
              reduced
                ? undefined
                : {
                    opacity: { duration: 0.8, delay: 0.9 + i * 0.05, ease: [0.33, 1, 0.68, 1] },
                    scale: { duration: 1.1, delay: 0.9 + i * 0.05, ease: [0.16, 1, 0.3, 1] },
                    /* 표류는 카드마다 주기를 달리해야 «같이 숨쉬는» 느낌이 안 난다. */
                    y: { duration: 9 + i, repeat: Infinity, ease: "easeInOut" },
                  }
            }
          >
            <div className={`${c.w} overflow-hidden rounded-xl shadow-2xl ring-1 ring-border/60`} style={{ rotate: `${c.rot}deg` }}>
              <Image
                src={`${BASE}/thumbs/${c.id}.webp`}
                alt=""
                width={480}
                height={300}
                className="h-auto w-full opacity-90"
                sizes="13rem"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ② 커튼 — WebGL 첫 프레임을 기다리던 자리. 여기서는 카드가 자리 잡을 때까지다. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 bg-background"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
      />

      {/* ③ 본문 — 같은 글을 두 벌 겹치고 마스크로 원 안팎을 가른다.
          바깥 벌은 원 자리에 구멍이 뚫리고, 안쪽 벌은 원 안에서만 보인다.
          두 벌은 같은 흐름에서 시작해야 글자가 원 경계에서 어긋나지 않는다 —
          그래서 겹치는 쪽도 inset-0 이 아니라 top-0 이다(높이를 늘리면 세로 정렬이 밀린다). */}
      <div className="absolute inset-x-0 top-[48%] z-10 -translate-y-1/2">
        <div className="relative">
          <Block
            verb={BASE_VERB}
            rise={rise}
            muted
            maskStyle={{
              maskImage:
                "radial-gradient(circle at var(--reveal-x) var(--reveal-y), transparent var(--reveal-size), black var(--reveal-size))",
              WebkitMaskImage:
                "radial-gradient(circle at var(--reveal-x) var(--reveal-y), transparent var(--reveal-size), black var(--reveal-size))",
            }}
          />
          <Block
            verb={VERBS[verb]}
            rise={rise}
            overlay
            maskStyle={{
              maskImage:
                "radial-gradient(circle at var(--reveal-x) var(--reveal-y), black var(--reveal-size), transparent var(--reveal-size))",
              WebkitMaskImage:
                "radial-gradient(circle at var(--reveal-x) var(--reveal-y), black var(--reveal-size), transparent var(--reveal-size))",
            }}
          />
        </div>
      </div>
    </section>
  )
}

/* 두 벌이 완전히 같은 판이어야 원 경계에서 글자가 어긋나지 않는다.
 * muted 인 쪽만 두 번째 줄에 그라데이션을 입힌다 — 안쪽 벌은 단색이다. */
function Block({
  verb,
  rise,
  muted = false,
  overlay = false,
  maskStyle,
}: {
  verb: string
  rise: (delay: number) => Record<string, unknown>
  muted?: boolean
  overlay?: boolean
  maskStyle: React.CSSProperties
}) {
  return (
    <div
      aria-hidden={overlay}
      className={
        "pointer-events-none flex flex-col items-center gap-5 px-5 text-center will-change-transform" +
        (overlay ? " absolute inset-x-0 top-0" : "")
      }
      style={maskStyle}
    >
      <p className="text-xs tracking-widest text-muted-foreground uppercase">Design System</p>

      <h1 className="flex flex-col items-center text-5xl leading-none font-medium tracking-tight sm:text-7xl">
        <span className="overflow-hidden pb-1">
          <motion.span className="block" {...rise(0.25)}>
            화면은 만들지 않는다
          </motion.span>
        </span>
        <span className="overflow-hidden pb-2">
          <motion.span
            className="block"
            {...rise(0.4)}
            /* 시스템의 색은 전부 무채색이다 — 그라데이션도 회색 계조로만 짠다.
             * 컬러 액센트를 쓰려면 data/foundation.json 에 색을 더하는 결정이 먼저다.
             * chart-* 는 라이트·다크가 같은 값이라 다크에서 꼬리가 배경에 묻는다.
             * 모드를 따라 뒤집히는 세 이름으로만 짠다. */
            style={
              muted
                ? {
                    backgroundImage:
                      "radial-gradient(circle farthest-corner at 0% 0%, var(--foreground), var(--primary) 45%, var(--muted-foreground))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }
                : undefined
            }
          >
            이미 있는 것으로 {verb}
          </motion.span>
        </span>
      </h1>

      <p className="max-w-lg text-sm text-balance text-muted-foreground sm:text-base">
        컴포넌트 62 · 패턴 74 · 블록 88 · 토큰 58. 새 화면을 짜기 전에 여기부터 연다.
      </p>

      {/* 겹친 벌의 단추는 누를 수 없어야 한다 — 원본도 안쪽 벌의 링크를 끈다. */}
      <div className={overlay ? "mt-2 flex flex-col items-center gap-3" : "pointer-events-auto mt-2 flex flex-col items-center gap-3"}>
        <Button size="lg" asChild>
          <Link href="/blocks">블록부터 보기</Link>
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <Link href="/components">컴포넌트 색인 →</Link>
        </Button>
      </div>
    </div>
  )
}
