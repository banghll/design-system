/* 요소를 눌러 그 자리의 토큰을 고친다.
 *
 * 패널의 슬라이더는 "무엇을 고칠지" 를 이미 아는 사람에게만 쓸모가 있다.
 * 화면을 보다가 "이 여백" 이라고 짚는 쪽이 실제로 하는 일에 가깝다 —
 * 그래서 요소를 누르면 그것이 무엇으로 만들어졌는지 보여주고 거기서 고치게 한다.
 *
 * 무엇을 쓰는지는 두 갈래로 알아낸다.
 *  · 간격 · 크기 — data-slot 으로 찾는다. shadcn 컴포넌트가 이미 달고 있어
 *    새로 표시를 붙일 필요가 없다.
 *  · 색 — 화면에 그려진 값과 토큰 값을 맞춰 본다. 적어 두는 것보다 정확하다.
 *    컴포넌트가 어떤 변형을 쓰고 있는지까지 그대로 읽히기 때문이다. */
"use client"

import { MousePointerClick, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { useLang } from "@/components/lang"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  LINE_TOKENS,
  SLOT_LABEL,
  SLOT_TOKENS,
  SURFACE_TOKENS,
  TEXT_TOKENS,
  TOKEN_SPECS,
} from "@/lib/slot-tokens"
import { readPx } from "@/lib/token-read"
import { cn } from "@/lib/utils"

/* 화면에 그려진 색과 토큰 값이 같은지 본다.
 * 문자열로 비교하면 oklch 와 rgb 가 달라 보이므로 픽셀로 내려서 맞춘다. */
function toPixel(css: string): string | null {
  try {
    const c = document.createElement("canvas")
    c.width = c.height = 1
    const x = c.getContext("2d")
    if (!x) return null
    x.clearRect(0, 0, 1, 1)
    x.fillStyle = "#000000"
    x.fillStyle = css
    x.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = x.getImageData(0, 0, 1, 1).data
    return `${r},${g},${b},${a}`
  } catch {
    return null
  }
}

function readVar(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim()
}

/** 이 색이 어느 토큰인지 — 후보 중에서 픽셀이 같은 것을 찾는다. */
function matchToken(value: string, candidates: string[]) {
  const target = toPixel(value)
  if (!target || target.endsWith(",0")) return null
  for (const name of candidates) {
    const v = readVar(name)
    if (v && toPixel(v) === target) return name
  }
  return null
}

type Picked = {
  el: HTMLElement
  slot: string
  rect: DOMRect
  spaceTokens: string[]
  surface: string | null
  text: string | null
  line: string | null
}

function inspect(el: HTMLElement): Picked | null {
  /* 가장 가까운 data-slot 을 그 요소의 정체로 본다. 없으면 고를 수 없다 —
   * 아무 div 나 고르게 하면 무엇을 고쳤는지 알 수 없다. */
  const slotEl = el.closest<HTMLElement>("[data-slot]")
  if (!slotEl) return null
  const slot = slotEl.dataset.slot ?? ""
  const cs = getComputedStyle(slotEl)

  return {
    el: slotEl,
    slot,
    rect: slotEl.getBoundingClientRect(),
    spaceTokens: SLOT_TOKENS[slot] ?? ["radius"],
    surface: matchToken(cs.backgroundColor, SURFACE_TOKENS),
    text: matchToken(cs.color, TEXT_TOKENS),
    line: matchToken(cs.borderTopColor, LINE_TOKENS),
  }
}

export function TokenInspector({
  active,
  onExit,
  setToken,
  spacing,
}: {
  active: boolean
  onExit: () => void
  setToken: (name: string, value: string) => void
  /** 지금 밀도 기준값(px). 배수를 px 로 보여줄 때 쓴다. */
  spacing: number
}) {
  const { t, lang } = useLang()
  const [hover, setHover] = useState<DOMRect | null>(null)
  const [picked, setPicked] = useState<Picked | null>(null)
  const panel = useRef<HTMLDivElement>(null)

  /* 고른 요소가 스크롤로 움직이면 표시도 따라가야 한다.
   * 안 따라가면 엉뚱한 자리를 가리키게 된다. */
  const refresh = useCallback(() => {
    setPicked((p) => (p ? { ...p, rect: p.el.getBoundingClientRect() } : p))
  }, [])

  useEffect(() => {
    if (!active) {
      setHover(null)
      setPicked(null)
      return
    }

    const isOurs = (n: EventTarget | null) =>
      n instanceof Node && (panel.current?.contains(n) ?? false)

    const onMove = (e: MouseEvent) => {
      if (isOurs(e.target)) return
      const el = e.target as HTMLElement
      const slotEl = el?.closest?.<HTMLElement>("[data-slot]")
      setHover(slotEl ? slotEl.getBoundingClientRect() : null)
    }

    const onClick = (e: MouseEvent) => {
      if (isOurs(e.target)) return
      /* 고르는 동안에는 링크와 버튼이 작동하면 안 된다 —
       * 누르자마자 페이지가 바뀌면 고를 수가 없다. */
      e.preventDefault()
      e.stopPropagation()
      const hit = inspect(e.target as HTMLElement)
      if (hit) setPicked(hit)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (picked) setPicked(null)
        else onExit()
      }
    }

    document.addEventListener("mousemove", onMove, true)
    document.addEventListener("click", onClick, true)
    document.addEventListener("keydown", onKey)
    window.addEventListener("scroll", refresh, true)
    window.addEventListener("resize", refresh)
    return () => {
      document.removeEventListener("mousemove", onMove, true)
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("keydown", onKey)
      window.removeEventListener("scroll", refresh, true)
      window.removeEventListener("resize", refresh)
    }
  }, [active, picked, onExit, refresh])

  if (!active) return null

  const r = picked?.rect ?? hover

  /* 패널은 고른 요소 아래에 붙이되 화면 밖으로 나가지 않게 민다. */
  const W = 300
  const left = picked
    ? Math.min(Math.max(8, picked.rect.left), window.innerWidth - W - 8)
    : 0
  const belowSpace = picked ? window.innerHeight - picked.rect.bottom : 0
  const top = picked
    ? belowSpace > 320
      ? picked.rect.bottom + 8
      : Math.max(8, picked.rect.top - 320)
    : 0

  return (
    <>
      {/* 지금 무엇을 가리키고 있는지. 테두리만 그리고 클릭은 통과시킨다. */}
      {r ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none fixed z-[60] rounded-sm ring-2 transition-[top,left,width,height] duration-75",
            picked ? "ring-primary" : "ring-primary/50"
          )}
          style={{ top: r.top, left: r.left, width: r.width, height: r.height }}
        />
      ) : null}

      {/* 안내 — 고르기 전에는 무엇을 하라는 말이 필요하다 */}
      {!picked ? (
        <div className="bg-popover text-popover-foreground pointer-events-none fixed bottom-6 left-1/2 z-[61] flex -translate-x-1/2 items-center gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg">
          <MousePointerClick className="size-4" />
          {lang === "ko"
            ? "고칠 요소를 누르세요 · Esc 로 나가기"
            : "Click an element to edit it · Esc to exit"}
        </div>
      ) : null}

      {picked ? (
        <div
          ref={panel}
          className="bg-popover text-popover-foreground fixed z-[61] flex max-h-[19rem] flex-col overflow-hidden rounded-xl border shadow-xl"
          style={{ top, left, width: W }}
        >
          <div className="flex items-start justify-between gap-2 px-4 pt-3 pb-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                {SLOT_LABEL[picked.slot] ? t(SLOT_LABEL[picked.slot]) : picked.slot}
              </p>
              <code className="text-muted-foreground text-[11px]">
                data-slot=&quot;{picked.slot}&quot;
              </code>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setPicked(null)}
              aria-label={lang === "ko" ? "선택 해제" : "Deselect"}
            >
              <X className="size-4" />
            </Button>
          </div>

          <Separator />

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            {/* 이 요소가 실제로 쓰고 있는 색. 화면에서 읽어 맞춘 것이라
              * 변형(secondary 버튼 등)까지 그대로 나온다. */}
            {picked.surface || picked.text || picked.line ? (
              <div className="mb-4 flex flex-col gap-2">
                <Label className="text-xs">
                  {lang === "ko" ? "쓰고 있는 색" : "Colors in use"}
                </Label>
                {(
                  [
                    ["surface", picked.surface, lang === "ko" ? "면" : "Surface"],
                    ["text", picked.text, lang === "ko" ? "글자" : "Text"],
                    ["line", picked.line, lang === "ko" ? "선" : "Line"],
                  ] as const
                ).map(([key, name, label]) =>
                  name ? (
                    <div key={key} className="flex items-center gap-2">
                      <label className="size-6 shrink-0 cursor-pointer overflow-hidden rounded border">
                        <span
                          className="block size-full"
                          style={{ background: `var(--${name})` }}
                        />
                        <input
                          type="color"
                          className="sr-only"
                          onChange={(e) => setToken(name, e.target.value)}
                          aria-label={name}
                        />
                      </label>
                      <span className="text-muted-foreground w-8 shrink-0 text-xs">
                        {label}
                      </span>
                      <code className="min-w-0 flex-1 truncate text-xs">--{name}</code>
                    </div>
                  ) : null
                )}
              </div>
            ) : null}

            {/* 간격과 크기 — data-slot 이 알려 준 것들 */}
            {picked.spaceTokens.length ? (
              <div className="flex flex-col gap-5">
                <Label className="text-xs">
                  {lang === "ko" ? "간격 · 크기" : "Spacing and size"}
                </Label>
                {picked.spaceTokens.map((name) => {
                  const spec = TOKEN_SPECS[name]
                  if (!spec) return null
                  /* calc 로 적힌 값도, rem 도 브라우저에게 물어 px 로 받는다. */
                  const px = readPx(name)
                  const cur =
                    px == null
                      ? null
                      : spec.kind === "multiple"
                        ? Number((px / spacing).toFixed(2))
                        : px
                  const shown = cur ?? spec.min ?? 0
                  return (
                    <div key={name}>
                      <div className="mb-1 flex items-baseline justify-between gap-2">
                        <span className="text-xs font-medium">{t(spec.label)}</span>
                        <code className="text-muted-foreground shrink-0 text-[11px] tabular-nums">
                          {spec.kind === "multiple"
                            ? `×${shown} · ${Math.round(shown * spacing)}px`
                            : `${shown}px`}
                        </code>
                      </div>
                      <p className="text-muted-foreground mb-2 text-[11px] leading-snug">
                        {t(spec.note)}
                      </p>
                      <Slider
                        value={[shown]}
                        min={spec.min}
                        max={spec.max}
                        step={spec.step}
                        onValueChange={([v]) => {
                          setToken(
                            name,
                            spec.kind === "multiple"
                              ? `calc(var(--spacing) * ${v})`
                              : name === "spacing-base"
                                ? `${v / 16}rem`
                                : `${v}px`
                          )
                          refresh()
                        }}
                      />
                      <div className="mt-1.5">
                        <Badge variant="secondary" className="font-normal">
                          --{name}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-xs leading-relaxed">
                {lang === "ko"
                  ? "이 요소에는 고칠 간격 토큰이 없습니다. 색은 위에서 바꿀 수 있어요."
                  : "This element has no spacing token to edit. Colors are above."}
              </p>
            )}
          </div>

          <Separator />
          <p className="text-muted-foreground px-4 py-2 text-[11px] leading-snug">
            {lang === "ko"
              ? "여기서 바꾸면 같은 토큰을 쓰는 모든 곳이 함께 바뀝니다."
              : "Changing a token here changes everywhere that uses it."}
          </p>
        </div>
      ) : null}
    </>
  )
}
