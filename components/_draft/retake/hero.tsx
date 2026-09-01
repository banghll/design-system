/* 왜: 랜딩 히어로 — 포인터가 Shoot 을 연타해 카드가 사방으로 날아가 앉는 연출.
 *     색인에 이런 연출 컴포넌트가 없다.
 * 어디서: /retake. 2026-09-01 */
"use client"

import { useReducedMotion } from "motion/react"
import { Paperclip, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { SPOTS, TEMPLATES, VIDEOS, type Template } from "./data"
import { Clip } from "./media"

export type StartInput = { text: string; template: Template | null; image: boolean }

export function Hero({ onStart }: { onStart: (input: StartInput) => void }) {
  const reduced = useReducedMotion()
  const shootRef = useRef<HTMLButtonElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [placed, setPlaced] = useState<number[]>([])
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null)
  const [tapping, setTapping] = useState(false)
  const [attached, setAttached] = useState(false)
  const [dropping, setDropping] = useState(false)

  /* 한 번 놓인 카드는 지우지 않는다 — 다 채우고 손을 뗀다 */
  const place = useCallback(() => {
    setPlaced((p) => (p.length >= SPOTS.length ? p : [...p, p.length]))
  }, [])

  const tap = useCallback(() => {
    setTapping(true)
    setTimeout(() => setTapping(false), 130)
    place()
  }, [place])

  /* ── 타임라인 — 빠르게 채우고 멈춘다 ── */
  useEffect(() => {
    if (reduced) {
      const ids = SPOTS.map((_, i) => setTimeout(place, 70 * i))
      return () => ids.forEach(clearTimeout)
    }
    const ids: ReturnType<typeof setTimeout>[] = []
    ids.push(
      setTimeout(() => {
        const b = shootRef.current?.getBoundingClientRect()
        if (b) setPointer({ x: b.left + b.width / 2 + 8, y: b.top + b.height / 2 + 8 })
      }, 1300)
    )
    let n = 0
    const burst = () => {
      tap()
      n += 1
      if (n < SPOTS.length) ids.push(setTimeout(burst, 145 + n * 12))
      else ids.push(setTimeout(() => setPointer(null), 750))
    }
    ids.push(setTimeout(burst, 2100))
    return () => ids.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  /* ── 공간감 — 포인터를 따라 카드가 깊이별로 밀린다 ──
     margin 이 아니라 translate 로 민다. margin 은 레이아웃 속성이라
     매 프레임 카드 열 장의 레이아웃이 다시 잡힌다. */
  useEffect(() => {
    if (reduced) return
    const el = fieldRef.current
    if (!el) return
    const move = (e: PointerEvent) => {
      const nx = (e.clientX / innerWidth - 0.5) * 2
      const ny = (e.clientY / innerHeight - 0.5) * 2
      el.style.setProperty("--shift-x", `${(-nx * 16).toFixed(1)}px`)
      el.style.setProperty("--shift-y", `${(-ny * 16).toFixed(1)}px`)
    }
    addEventListener("pointermove", move, { passive: true })
    return () => removeEventListener("pointermove", move)
  }, [reduced])

  const submit = () => {
    const text = inputRef.current?.value.trim() ?? ""
    if (!text && !attached) {
      inputRef.current?.focus()
      return
    }
    onStart({ text, template: null, image: attached })
  }

  return (
    <section className="relative isolate grid min-h-svh place-items-center overflow-hidden pb-[12vh]">
      {/* ── 카드 필드 ── */}
      <div
        ref={fieldRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden sm:block"
      >
        {placed.map((i) => (
          <FlyCard key={i} index={i} shootRef={shootRef} onUse={(t) => onStart({ text: "", template: t, image: attached })} />
        ))}
      </div>

      {/* ── 본문 ── */}
      <div className="pointer-events-none relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <h1 className="pointer-events-auto flex flex-col items-center font-anton text-4xl leading-[0.96] tracking-tight uppercase sm:text-6xl lg:text-7xl">
          <RiseLine delay="0.2s">Forget the cost.</RiseLine>
          <RiseLine delay="0.35s">Focus only on creating</RiseLine>
        </h1>

        {/* 인풋 — 카드를 끌어다 놓을 수 있다 */}
        <div
          ref={shellRef}
          onDragEnter={(e) => {
            e.preventDefault()
            setDropping(true)
          }}
          onDragOver={(e) => {
            /* preventDefault 를 안 하면 브라우저가 드롭을 조용히 거절한다 */
            e.preventDefault()
            e.dataTransfer.dropEffect = "copy"
          }}
          onDragLeave={(e) => {
            if (!shellRef.current?.contains(e.relatedTarget as Node)) setDropping(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            setDropping(false)
            const text = e.dataTransfer.getData("text/plain")
            if (text && inputRef.current) {
              inputRef.current.value = text
              inputRef.current.focus()
            }
          }}
          className={cn(
            "pointer-events-auto flex w-[min(35rem,92vw)] items-center gap-2 rounded-xl border bg-card p-2 text-left shadow-sm transition-[border-color,box-shadow]",
            dropping && "border-primary ring-3 ring-primary/15"
          )}
        >
          {attached ? (
            <span className="flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-muted px-2.5 text-xs font-semibold">
              이미지 1장
              <button type="button" aria-label="첨부 취소" onClick={() => setAttached(false)}>
                <X className="size-3" />
              </button>
            </span>
          ) : null}
          <input
            ref={inputRef}
            type="text"
            aria-label="만들고 싶은 영상"
            placeholder="A golden retriever bursting through tall grass, slow motion"
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="rounded-full"
            aria-label="이미지 · 영상 첨부"
            onClick={() => setAttached(true)}
          >
            <Paperclip />
          </Button>
          <Button ref={shootRef} type="button" className="font-bold" onClick={submit}>
            Shoot
          </Button>
        </div>

        <a
          href="#templates"
          className="pointer-events-auto font-anton text-xs tracking-[0.14em] text-muted-foreground uppercase hover:text-foreground"
        >
          Browse all templates
        </a>
      </div>

      <a
        href="#templates"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <span className="font-anton text-xs tracking-[0.14em] uppercase">Scroll to explore</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 motion-safe:animate-bounce">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      {/* 포인터 — 화면 밖에서 들어와 Shoot 을 짚는다 */}
      {pointer ? (
        <span
          aria-hidden
          className="pointer-events-none fixed z-40 size-7 -translate-x-1/2 -translate-y-1/2 drop-shadow-md transition-transform duration-1000 ease-out"
          style={{
            left: 0,
            top: 0,
            transform: `translate(${pointer.x}px, ${pointer.y}px) translate(-50%,-50%) scale(${tapping ? 0.78 : 1})`,
            transitionDuration: tapping ? "120ms" : undefined,
          }}
        >
          <svg viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1.3" strokeLinejoin="round">
            <path d="M5.5 2.6 18.8 11l-5.7 1.5-2.5 5.6z" />
          </svg>
        </span>
      ) : null}
    </section>
  )
}

/* 잘린 창 안에서 한 줄씩 올라온다. 창 밖으로 나간 부분이 잘려
 * 글자가 바닥에서 솟는 것처럼 보인다 — 1.2s expo-out, 줄마다 0.15s 간격. */
function RiseLine({ delay, children }: { delay: string; children: React.ReactNode }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <span
        className="block motion-safe:animate-[retake-rise_1.2s_cubic-bezier(0.16,1,0.3,1)_both]"
        style={{ animationDelay: delay }}
      >
        {children}
      </span>
    </span>
  )
}

/* Shoot 버튼 한가운데서 출발해 제자리에 앉는다.
 * .slot 이 시차·표류(translate·transform), .card 가 비행(transform),
 * .face 가 호버 확대(transform) — 한 요소에 겹치면 서로를 덮어쓴다. */
function FlyCard({
  index,
  shootRef,
  onUse,
}: {
  index: number
  shootRef: React.RefObject<HTMLButtonElement | null>
  onUse: (t: Template) => void
}) {
  const spot = SPOTS[index]
  const tpl = TEMPLATES[index % TEMPLATES.length]
  const [out, setOut] = useState(false)
  const [rest, setRest] = useState("")
  const [start, setStart] = useState("")

  useEffect(() => {
    const measure = () => {
      const b = shootRef.current?.getBoundingClientRect()
      const sx = b ? b.left + b.width / 2 - innerWidth / 2 : 0
      const sy = b ? b.top + b.height / 2 - innerHeight / 2 : 0
      setStart(`translate(-50%,-50%) translate(${sx}px,${sy}px) scale(.24)`)
      const x = ((spot.x - 50) / 100) * innerWidth
      const y = ((spot.y - 50) / 100) * innerHeight
      setRest(`translate(-50%,-50%) translate(${x}px,${y}px) rotate(${spot.rot}deg)`)
    }
    measure()
    addEventListener("resize", measure)
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOut(true)))
    return () => {
      removeEventListener("resize", measure)
      cancelAnimationFrame(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="absolute top-1/2 left-1/2 motion-safe:animate-[retake-float_11s_ease-in-out_infinite]"
      style={{
        translate: `calc(var(--shift-x,0px) * ${spot.depth}) calc(var(--shift-y,0px) * ${spot.depth})`,
        transition: "translate 550ms cubic-bezier(0.22,1,0.36,1)",
        animationDuration: `${9 + (index % 5) * 1.4}s`,
        animationDelay: `${-index * 0.7}s`,
        willChange: "translate",
      }}
    >
      <div
        draggable
        title={tpl.name}
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", tpl.desc)
          e.dataTransfer.effectAllowed = "copy"
        }}
        onClick={() => onUse(tpl)}
        className={cn("group pointer-events-auto absolute top-0 left-0 cursor-grab active:cursor-grabbing", spot.w)}
        style={{
          transform: out ? rest : start,
          opacity: out ? 1 : 0,
          transition: "transform 1.05s cubic-bezier(0.16,1,0.3,1), opacity 450ms ease",
        }}
      >
        <div
          className="relative overflow-hidden rounded-xl shadow-xl transition-transform duration-300 ease-out group-hover:scale-[1.07]"
          style={{ aspectRatio: spot.ratio }}
        >
          <Clip src={VIDEOS[index % VIDEOS.length]} view="hero" tone={index} />
          {/* 이름표가 아니라 프롬프트를 담는다. 카드 안쪽이라 모서리에 맞춰 잘린다 */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-2.5 bg-linear-to-t from-black/55 to-transparent p-3.5 pt-10 opacity-0 transition-[opacity,translate] duration-300 ease-out translate-y-2.5 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="line-clamp-2 text-sm leading-tight font-medium text-white drop-shadow-md">
              {tpl.desc}
            </span>
            <Button
              type="button"
              size="xs"
              className="rounded-full bg-white text-foreground hover:bg-white/90"
              onClick={(e) => {
                e.stopPropagation()
                onUse(tpl)
              }}
            >
              템플릿 사용하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
