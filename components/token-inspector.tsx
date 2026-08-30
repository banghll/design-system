/* Hallmark · component: inspector · genre: modern-minimal · theme: project-locked
 * states: default · hover · focus · active · disabled · loading · error · success
 *
 * Pick an element, edit what it's made of.
 *
 * The first pass changed the token globally on every slider tick. Two problems.
 * It was slow — every keystroke repainted 210 cards. And it was frightening:
 * you nudged one card's padding and the whole catalogue moved before you had
 * decided anything.
 *
 * So editing is now local. Changes land on the selected element only, as inline
 * style, which is instant. Pressing Apply writes them to the token, and only
 * then does everything else follow. Preview and commit are separate acts.
 *
 * Properties are grouped by what you're actually trying to do — Text, Border,
 * Padding, Gap — with number fields, because a row of unlabelled sliders tells
 * you nothing about which one is which. The box model gets the diagram it
 * deserves: four sides you can type into. */
"use client"

import { Check, Link2, Link2Off, MousePointerClick, RotateCcw, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { useLang } from "@/components/lang"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LINE_TOKENS,
  SLOT_LABEL,
  SLOT_TOKENS,
  SURFACE_TOKENS,
  TEXT_TOKENS,
} from "@/lib/slot-tokens"
import { readPx } from "@/lib/token-read"
import { cn } from "@/lib/utils"

/* Compare what's painted against what the tokens hold. String compare fails —
 * oklch and rgb spell the same colour differently — so drop both to pixels. */
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

const readVar = (n: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${n}`).trim()

function matchToken(value: string, candidates: string[]) {
  const target = toPixel(value)
  if (!target || target.endsWith(",0")) return null
  for (const name of candidates) {
    const v = readVar(name)
    if (v && toPixel(v) === target) return name
  }
  return null
}

/* Every CSS property the inspector can edit, and which token it commits to.
 * A property with no token can still be previewed — it just can't go global,
 * and the panel says so rather than pretending. */
type Prop = {
  css: string
  label: { ko: string; en: string }
  /* The token this commits to, if any. */
  token?: string
  unit: "px" | "num"
  min: number
  max: number
}

const TEXT_PROPS: Prop[] = [
  { css: "fontSize", label: { ko: "글자 크기", en: "Size" }, unit: "px", min: 8, max: 72 },
  { css: "fontWeight", label: { ko: "굵기", en: "Weight" }, unit: "num", min: 100, max: 900 },
  { css: "lineHeight", label: { ko: "행간", en: "Line height" }, unit: "px", min: 8, max: 96 },
  {
    css: "letterSpacing",
    label: { ko: "자간", en: "Tracking" },
    unit: "px",
    min: -4,
    max: 8,
  },
]

const BORDER_PROPS: Prop[] = [
  {
    css: "borderTopWidth",
    label: { ko: "두께", en: "Width" },
    unit: "px",
    min: 0,
    max: 12,
  },
  {
    css: "borderRadius",
    label: { ko: "모서리", en: "Radius" },
    token: "radius",
    unit: "px",
    min: 0,
    max: 40,
  },
]

const SIDES = ["Top", "Right", "Bottom", "Left"] as const

type Picked = {
  el: HTMLElement
  slot: string
  rect: DOMRect
  /* Which token this element's padding commits to, if any. */
  padToken: string | null
  surface: string | null
  text: string | null
  line: string | null
}

function inspect(el: HTMLElement): Picked | null {
  const slotEl = el.closest<HTMLElement>("[data-slot]")
  if (!slotEl) return null
  const slot = slotEl.dataset.slot ?? ""
  const cs = getComputedStyle(slotEl)
  const tokens = SLOT_TOKENS[slot] ?? []

  return {
    el: slotEl,
    slot,
    rect: slotEl.getBoundingClientRect(),
    padToken:
      tokens.find((t) => t.startsWith("pad-")) ??
      (tokens.includes("h-control") ? "pad-control" : null),
    surface: matchToken(cs.backgroundColor, SURFACE_TOKENS),
    text: matchToken(cs.color, TEXT_TOKENS),
    line: matchToken(cs.borderTopColor, LINE_TOKENS),
  }
}

/* A number field, not a slider. Four unlabelled sliders in a column are four
 * unknowns; four fields with names are four decisions. */
function NumField({
  value,
  onChange,
  suffix,
  min,
  max,
  label,
  className,
}: {
  value: number
  onChange: (n: number) => void
  suffix?: string
  min?: number
  max?: number
  label: string
  className?: string
}) {
  const [draft, setDraft] = useState(String(value))
  useEffect(() => setDraft(String(value)), [value])

  const commit = (raw: string) => {
    const n = parseFloat(raw)
    if (Number.isNaN(n)) {
      setDraft(String(value))
      return
    }
    const clamped = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n))
    setDraft(String(clamped))
    onChange(clamped)
  }

  return (
    <div className={cn("relative", className)}>
      <Input
        aria-label={label}
        value={draft}
        inputMode="decimal"
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit((e.target as HTMLInputElement).value)
          /* Arrow keys step the value — the thing sliders were good at, kept. */
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault()
            const step = e.shiftKey ? 10 : 1
            commit(String((parseFloat(draft) || 0) + (e.key === "ArrowUp" ? step : -step)))
          }
        }}
        className="h-7 pr-6 text-center font-mono text-xs tabular-nums"
      />
      {suffix ? (
        <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 font-mono text-[10px]">
          {suffix}
        </span>
      ) : null}
    </div>
  )
}

export function TokenInspector({
  active,
  onExit,
  setToken,
}: {
  active: boolean
  onExit: () => void
  setToken: (name: string, value: string) => void
}) {
  const { t, lang } = useLang()
  const [hover, setHover] = useState<DOMRect | null>(null)
  const [picked, setPicked] = useState<Picked | null>(null)
  const [dirty, setDirty] = useState<Record<string, string>>({})
  const [linked, setLinked] = useState(true)
  const [applied, setApplied] = useState(false)
  const panel = useRef<HTMLDivElement>(null)

  const refresh = useCallback(() => {
    setPicked((p) => (p ? { ...p, rect: p.el.getBoundingClientRect() } : p))
  }, [])

  /* Read a live value off the selected element, not off the token — the element
   * may already carry a local edit that hasn't been committed. */
  const read = useCallback(
    (prop: string) => {
      if (!picked) return 0
      const v = getComputedStyle(picked.el)[prop as "fontSize"]
      return parseFloat(String(v)) || 0
    },
    [picked]
  )

  /* Local edit. Instant, and scoped to one element. */
  const setLocal = useCallback(
    (prop: string, value: string) => {
      if (!picked) return
      picked.el.style.setProperty(
        prop.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()),
        value
      )
      setDirty((d) => ({ ...d, [prop]: value }))
      setApplied(false)
      refresh()
    },
    [picked, refresh]
  )

  const revert = useCallback(() => {
    if (!picked) return
    for (const prop of Object.keys(dirty)) {
      picked.el.style.removeProperty(prop.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()))
    }
    setDirty({})
    setApplied(false)
    refresh()
  }, [picked, dirty, refresh])

  /* Commit. Only now does the rest of the system move. */
  const apply = useCallback(() => {
    if (!picked || !Object.keys(dirty).length) return
    const base = readPx("spacing-base") ?? 4

    for (const [prop, value] of Object.entries(dirty)) {
      const px = parseFloat(value)
      if (prop === "borderRadius") setToken("radius", `${px}px`)
      else if (prop.startsWith("padding") && picked.padToken) {
        setToken(picked.padToken, `calc(var(--spacing) * ${(px / base).toFixed(2)})`)
      }
      /* Text and border-width have no token behind them yet. They stay local;
       * the footer says which ones did and didn't travel. */
    }

    /* Clear the local overrides so the element shows the token's value —
     * otherwise the inline style masks whether the commit actually worked. */
    for (const prop of Object.keys(dirty)) {
      picked.el.style.removeProperty(prop.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()))
    }
    setDirty({})
    setApplied(true)
    window.setTimeout(() => setApplied(false), 2000)
    refresh()
  }, [picked, dirty, setToken, refresh])

  useEffect(() => {
    if (!active) {
      setHover(null)
      setPicked(null)
      setDirty({})
      return
    }
    const isOurs = (n: EventTarget | null) =>
      n instanceof Node && (panel.current?.contains(n) ?? false)

    const onMove = (e: MouseEvent) => {
      if (isOurs(e.target)) return
      const slotEl = (e.target as HTMLElement)?.closest?.<HTMLElement>("[data-slot]")
      setHover(slotEl ? slotEl.getBoundingClientRect() : null)
    }
    const onClick = (e: MouseEvent) => {
      if (isOurs(e.target)) return
      e.preventDefault()
      e.stopPropagation()
      const hit = inspect(e.target as HTMLElement)
      if (hit) {
        setPicked(hit)
        setDirty({})
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (picked) setPicked(null)
      else onExit()
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
  const W = 320
  const left = picked
    ? Math.min(Math.max(8, picked.rect.left), window.innerWidth - W - 8)
    : 0
  const top = picked
    ? window.innerHeight - picked.rect.bottom > 400
      ? picked.rect.bottom + 8
      : Math.max(8, window.innerHeight - 420)
    : 0

  const count = Object.keys(dirty).length
  const committable = Object.keys(dirty).filter(
    (p) => p === "borderRadius" || (p.startsWith("padding") && picked?.padToken)
  ).length

  return (
    <>
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

      {!picked ? (
        <div className="bg-popover text-popover-foreground pointer-events-none fixed bottom-6 left-1/2 z-[61] flex -translate-x-1/2 items-center gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg">
          <MousePointerClick className="size-4" />
          {lang === "ko" ? "고칠 요소를 누르세요 · Esc" : "Click an element · Esc"}
        </div>
      ) : null}

      {picked ? (
        <div
          ref={panel}
          className="bg-popover text-popover-foreground fixed z-[61] flex max-h-[25rem] flex-col overflow-hidden rounded-xl border shadow-xl"
          style={{ top, left, width: W }}
        >
          <div className="flex items-start justify-between gap-2 px-4 pt-3 pb-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                {SLOT_LABEL[picked.slot] ? t(SLOT_LABEL[picked.slot]) : picked.slot}
              </p>
              <code className="text-muted-foreground text-[11px]">{picked.slot}</code>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                revert()
                setPicked(null)
              }}
              aria-label={lang === "ko" ? "닫기" : "Close"}
            >
              <X className="size-4" />
            </Button>
          </div>

          <Tabs defaultValue="box" className="flex min-h-0 flex-1 flex-col">
            <div className="px-4">
              <TabsList className="w-full">
                {[
                  ["box", "여백", "Box"],
                  ["text", "텍스트", "Text"],
                  ["border", "테두리", "Border"],
                  ["color", "색", "Color"],
                ].map(([v, ko, en]) => (
                  <TabsTrigger key={v} value={v} className="flex-1 text-xs">
                    {lang === "ko" ? ko : en}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              {/* Box model — the four sides, typed into the diagram itself. */}
              <TabsContent value="box" className="mt-0">
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-xs">
                    {lang === "ko" ? "안쪽 여백" : "Padding"}
                  </Label>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setLinked((v) => !v)}
                    aria-pressed={linked}
                    className="text-muted-foreground gap-1"
                  >
                    {linked ? <Link2 className="size-3" /> : <Link2Off className="size-3" />}
                    {linked
                      ? lang === "ko"
                        ? "네 면 함께"
                        : "All sides"
                      : lang === "ko"
                        ? "따로"
                        : "Each side"}
                  </Button>
                </div>

                <div className="border-border/70 bg-muted/30 flex flex-col items-center gap-1.5 rounded-lg border border-dashed p-3">
                  <NumField
                    label="padding top"
                    className="w-16"
                    value={read("paddingTop")}
                    min={0}
                    max={96}
                    onChange={(n) =>
                      linked
                        ? SIDES.forEach((s) => setLocal(`padding${s}`, `${n}px`))
                        : setLocal("paddingTop", `${n}px`)
                    }
                  />
                  <div className="flex w-full items-center gap-2">
                    <NumField
                      label="padding left"
                      className="w-16"
                      value={read("paddingLeft")}
                      min={0}
                      max={96}
                      onChange={(n) =>
                        linked
                          ? SIDES.forEach((s) => setLocal(`padding${s}`, `${n}px`))
                          : setLocal("paddingLeft", `${n}px`)
                      }
                    />
                    <div className="bg-background text-muted-foreground flex h-12 flex-1 items-center justify-center rounded border font-mono text-[10px] tabular-nums">
                      {Math.round(picked.rect.width)} × {Math.round(picked.rect.height)}
                    </div>
                    <NumField
                      label="padding right"
                      className="w-16"
                      value={read("paddingRight")}
                      min={0}
                      max={96}
                      onChange={(n) =>
                        linked
                          ? SIDES.forEach((s) => setLocal(`padding${s}`, `${n}px`))
                          : setLocal("paddingRight", `${n}px`)
                      }
                    />
                  </div>
                  <NumField
                    label="padding bottom"
                    className="w-16"
                    value={read("paddingBottom")}
                    min={0}
                    max={96}
                    onChange={(n) =>
                      linked
                        ? SIDES.forEach((s) => setLocal(`padding${s}`, `${n}px`))
                        : setLocal("paddingBottom", `${n}px`)
                    }
                  />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <Label className="text-xs">{lang === "ko" ? "간격" : "Gap"}</Label>
                  <NumField
                    label="gap"
                    className="w-20"
                    suffix="px"
                    value={read("gap")}
                    min={0}
                    max={96}
                    onChange={(n) => setLocal("gap", `${n}px`)}
                  />
                </div>

                {picked.padToken ? (
                  <p className="text-muted-foreground mt-3 text-[11px] leading-snug">
                    {lang === "ko"
                      ? `적용하면 --${picked.padToken} 으로 저장돼, 같은 토큰을 쓰는 곳이 함께 바뀝니다.`
                      : `Apply writes --${picked.padToken}, and everything on that token follows.`}
                  </p>
                ) : (
                  <p className="text-muted-foreground mt-3 text-[11px] leading-snug">
                    {lang === "ko"
                      ? "이 요소의 여백에는 아직 토큰이 없습니다. 미리보기까지만 됩니다."
                      : "No token behind this element's padding yet — preview only."}
                  </p>
                )}
              </TabsContent>

              <TabsContent value="text" className="mt-0 flex flex-col gap-3">
                {TEXT_PROPS.map((p) => (
                  <div key={p.css} className="flex items-center justify-between gap-3">
                    <Label className="text-xs">{lang === "ko" ? p.label.ko : p.label.en}</Label>
                    <NumField
                      label={p.css}
                      className="w-20"
                      suffix={p.unit === "px" ? "px" : undefined}
                      value={read(p.css)}
                      min={p.min}
                      max={p.max}
                      onChange={(n) =>
                        setLocal(p.css, p.unit === "px" ? `${n}px` : String(n))
                      }
                    />
                  </div>
                ))}
                <p className="text-muted-foreground text-[11px] leading-snug">
                  {lang === "ko"
                    ? "글자 값에는 토큰이 없어 이 요소에만 남습니다. 시험해 보고 마음에 들면 컴포넌트에 반영하세요."
                    : "Type has no token behind it — these stay on this element. Try it, then move it into the component."}
                </p>
              </TabsContent>

              <TabsContent value="border" className="mt-0 flex flex-col gap-3">
                {BORDER_PROPS.map((p) => (
                  <div key={p.css} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Label className="text-xs">
                        {lang === "ko" ? p.label.ko : p.label.en}
                      </Label>
                      {p.token ? (
                        <code className="text-muted-foreground block text-[10px]">
                          --{p.token}
                        </code>
                      ) : null}
                    </div>
                    <NumField
                      label={p.css}
                      className="w-20"
                      suffix="px"
                      value={read(p.css)}
                      min={p.min}
                      max={p.max}
                      onChange={(n) => setLocal(p.css, `${n}px`)}
                    />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="color" className="mt-0 flex flex-col gap-2">
                {(
                  [
                    ["surface", picked.surface, lang === "ko" ? "면" : "Surface"],
                    ["text", picked.text, lang === "ko" ? "글자" : "Text"],
                    ["line", picked.line, lang === "ko" ? "선" : "Line"],
                  ] as const
                ).map(([key, name, label]) =>
                  name ? (
                    <div key={key} className="flex items-center gap-2">
                      <label className="focus-within:ring-ring size-6 shrink-0 cursor-pointer overflow-hidden rounded border focus-within:ring-2">
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
                      <span className="text-muted-foreground w-10 shrink-0 text-xs">
                        {label}
                      </span>
                      <code className="min-w-0 flex-1 truncate text-xs">--{name}</code>
                    </div>
                  ) : null
                )}
                <p className="text-muted-foreground mt-1 text-[11px] leading-snug">
                  {lang === "ko"
                    ? "색은 토큰이라 고르는 즉시 전체에 반영됩니다."
                    : "Colours are tokens — picking one applies everywhere at once."}
                </p>
              </TabsContent>
            </div>

            <Separator />

            {/* Preview and commit are different acts, so they get different buttons. */}
            <div className="flex items-center gap-2 px-4 py-3">
              <span className="text-muted-foreground min-w-0 flex-1 text-[11px] leading-snug">
                {applied ? (
                  <span className="text-foreground inline-flex items-center gap-1">
                    <Check className="size-3" />
                    {lang === "ko" ? "전체에 적용됨" : "Applied everywhere"}
                  </span>
                ) : count ? (
                  lang === "ko" ? (
                    <>
                      이 요소에만 {count}개 미리보기 중
                      {committable < count ? ` · ${committable}개만 토큰으로 저장됨` : null}
                    </>
                  ) : (
                    <>
                      {count} previewed here
                      {committable < count ? ` · ${committable} can commit` : null}
                    </>
                  )
                ) : lang === "ko" ? (
                  "값을 고치면 이 요소에서 먼저 보입니다"
                ) : (
                  "Edits preview on this element first"
                )}
              </span>
              <Button variant="ghost" size="xs" onClick={revert} disabled={!count}>
                <RotateCcw className="size-3" />
                {lang === "ko" ? "되돌리기" : "Revert"}
              </Button>
              <Button size="xs" onClick={apply} disabled={!committable}>
                {lang === "ko" ? "전체 적용" : "Apply"}
              </Button>
            </div>
          </Tabs>
        </div>
      ) : null}
    </>
  )
}
