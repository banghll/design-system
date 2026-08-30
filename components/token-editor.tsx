/* 파운데이션 편집기.
 *
 * 토큰을 값으로만 보여 주면 "이걸 바꾸면 무엇이 바뀌는가"가 안 읽힌다.
 * 여기서 색·모서리·밀도·글꼴을 직접 밀어 보면, 화면에 있는 컴포넌트 109개와
 * 패턴 74개가 그 자리에서 같이 움직인다 — 그게 토큰이 하는 일의 정의다.
 *
 * 처음에는 Sheet(모달)로 만들었는데 그게 이 도구의 목적과 정면으로 어긋났다.
 * 모달은 뒤 화면을 어둡게 덮고 바깥을 누르면 닫힌다 — 확인하려는 대상을 가리고,
 * 확인하려고 누르면 도구가 사라진다. 그래서 상주 패널로 바꿨다.
 *  · 오버레이 없음 — 뒤 화면이 원래 색 그대로 보인다
 *  · 초점을 가두지 않음 — 편집기를 열어 둔 채 페이지를 돌아다닐 수 있다
 *  · 닫기는 X 하나뿐 — 실수로 닫히지 않는다
 *  · 본문에 오른쪽 여백을 줘서 패널이 내용을 덮지 않는다
 *
 * 값은 :root 에 인라인으로 얹는다. 원본 CSS 는 건드리지 않으므로
 * 되돌리기는 인라인 속성을 지우는 것으로 끝난다.
 * 마음에 들면 CSS 로 복사해 globals.css 에 붙이면 그때부터 기본값이 된다. */
"use client"

import { Check, Copy as CopyIcon, RotateCcw, SlidersHorizontal, X } from "lucide-react"
import { useTheme } from "next-themes"
import { useCallback, useEffect, useState } from "react"

import { type Copy, useLang } from "@/components/lang"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/* 패널 폭. 본문 여백과 패널 자체가 같은 값을 봐야 어긋나지 않는다. */
const PANEL = "23rem"
const OPEN_KEY = "ds-editor-open"

/* ── 편집 대상 ────────────────────────────────────────────────
 * 전부를 열어 두면 고를 수가 없다. 화면의 인상을 실제로 좌우하는 것만 둔다. */
const COLOR_TOKENS: { name: string; label: Copy; note: Copy }[] = [
  {
    name: "background",
    label: { ko: "배경", en: "Background" },
    note: { ko: "페이지의 가장 바깥 면", en: "The outermost surface of the page" },
  },
  {
    name: "foreground",
    label: { ko: "본문 글자", en: "Foreground" },
    note: { ko: "배경 위에 놓이는 기본 글자색", en: "Default text color on the background" },
  },
  {
    name: "card",
    label: { ko: "카드 면", en: "Card" },
    note: { ko: "배경에서 한 단계 올라온 면", en: "One step above the background" },
  },
  {
    name: "primary",
    label: { ko: "주 액션", en: "Primary" },
    note: { ko: "화면당 하나. 여기서 눌러야 하는 것", en: "One per screen — the thing to press" },
  },
  {
    name: "primary-foreground",
    label: { ko: "주 액션 글자", en: "Primary foreground" },
    note: { ko: "주 액션 위에 얹히는 글자", en: "Text that sits on the primary surface" },
  },
  {
    name: "secondary",
    label: { ko: "보조 면", en: "Secondary" },
    note: { ko: "주 액션 옆의 낮은 강조", en: "Lower emphasis beside the primary action" },
  },
  {
    name: "muted",
    label: { ko: "흐린 면", en: "Muted" },
    note: { ko: "비활성·배경 블록", en: "Disabled states and quiet blocks" },
  },
  {
    name: "muted-foreground",
    label: { ko: "보조 글자", en: "Muted foreground" },
    note: { ko: "설명문·캡션. 본문보다 한 단계 낮게", en: "Captions and helper text, a step below body" },
  },
  {
    name: "accent",
    label: { ko: "강조 면", en: "Accent" },
    note: { ko: "hover·선택된 항목의 면", en: "Hover and selected states" },
  },
  {
    name: "destructive",
    label: { ko: "파괴적 액션", en: "Destructive" },
    note: { ko: "되돌릴 수 없는 것에만", en: "Reserved for what cannot be undone" },
  },
  {
    name: "border",
    label: { ko: "선", en: "Border" },
    note: { ko: "요소를 가르는 기본 선", en: "The default dividing line" },
  },
  {
    name: "input",
    label: { ko: "입력 테두리", en: "Input" },
    note: { ko: "값을 받는 자리의 테두리", en: "Outline of fields that accept input" },
  },
  {
    name: "ring",
    label: { ko: "포커스 링", en: "Ring" },
    note: { ko: "키보드 사용자에게 지금 위치를 알린다", en: "Tells keyboard users where they are" },
  },
  {
    name: "sidebar",
    label: { ko: "사이드바 면", en: "Sidebar" },
    note: { ko: "앱 셸의 좌측 면", en: "The app shell's side surface" },
  },
  { name: "chart-1", label: { ko: "차트 1", en: "Chart 1" }, note: { ko: "계열 순서 = 의미 순서", en: "Series order is meaning order" } },
  { name: "chart-2", label: { ko: "차트 2", en: "Chart 2" }, note: { ko: "", en: "" } },
  { name: "chart-3", label: { ko: "차트 3", en: "Chart 3" }, note: { ko: "", en: "" } },
  { name: "chart-4", label: { ko: "차트 4", en: "Chart 4" }, note: { ko: "", en: "" } },
  { name: "chart-5", label: { ko: "차트 5", en: "Chart 5" }, note: { ko: "", en: "" } },
]

const FONTS = [
  "DM Sans",
  "Inter",
  "Geist",
  "Outfit",
  "Plus Jakarta Sans",
  "Space Grotesk",
  "Manrope",
  "Sora",
  "IBM Plex Sans",
  "Source Sans 3",
  "Libre Franklin",
  "Instrument Sans",
]

const MONO_FONTS = [
  "JetBrains Mono",
  "Fira Code",
  "IBM Plex Mono",
  "Source Code Pro",
  "Space Mono",
  "Geist Mono",
]

/* 어떤 CSS 색이든 픽셀로 그려 hex 로 돌려준다.
 * <input type="color"> 은 hex 만 받는데 우리 토큰은 oklch 라 변환이 필요하다.
 * 파서를 직접 쓰는 대신 브라우저가 이미 아는 방법으로 읽는다. */
function toHex(css: string): string {
  try {
    const c = document.createElement("canvas")
    c.width = c.height = 1
    const x = c.getContext("2d")
    if (!x) return "#000000"
    x.fillStyle = "#000000"
    x.fillStyle = css
    x.fillRect(0, 0, 1, 1)
    const [r, g, b] = x.getImageData(0, 0, 1, 1).data
    return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`
  } catch {
    return "#000000"
  }
}

function readVar(name: string) {
  if (typeof window === "undefined") return ""
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim()
}

/* 프리셋이 지정한 글꼴처럼, 여기서 고른 글꼴도 그때그때 불러온다. */
function loadFont(family: string) {
  const id = `font-${family.replace(/\s+/g, "-")}`
  if (document.getElementById(id)) return
  const link = document.createElement("link")
  link.id = id
  link.rel = "stylesheet"
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  ).replace(/%20/g, "+")}:wght@300;400;500;600;700&display=swap`
  document.head.appendChild(link)
}

export function TokenEditor() {
  const { t, lang } = useLang()
  const { resolvedTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [swatches, setSwatches] = useState<Record<string, string>>({})
  const [radius, setRadius] = useState(10)
  const [spacing, setSpacing] = useState(4)
  const [copied, setCopied] = useState(false)

  /* 열 때마다, 그리고 모드가 바뀔 때마다 지금 값을 다시 읽는다.
   * 라이트와 다크는 값이 다르므로 편집기도 지금 보고 있는 쪽을 보여 줘야 한다. */
  const sync = useCallback(() => {
    const next: Record<string, string> = {}
    for (const { name } of COLOR_TOKENS) next[name] = toHex(readVar(name))
    setSwatches(next)
    const r = parseFloat(readVar("radius"))
    if (!Number.isNaN(r)) setRadius(Math.round(r * 16))
    const s = parseFloat(readVar("spacing-base") || "0.25")
    if (!Number.isNaN(s)) setSpacing(Number((s * 16).toFixed(2)))
  }, [])

  /* 페이지를 옮겨 다녀도 열린 채로 남는다 — 여러 화면을 오가며 확인하는 도구다. */
  useEffect(() => {
    if (localStorage.getItem(OPEN_KEY) === "1") setOpen(true)
  }, [])

  useEffect(() => {
    if (open) sync()
  }, [open, resolvedTheme, sync])

  /* 패널이 내용을 덮지 않게 본문에 오른쪽 여백을 준다.
   * 오버레이로 가리지 않으니, 자리는 실제로 비켜 줘야 한다. */
  useEffect(() => {
    const b = document.body
    if (open) {
      /* important 로 얹는다. Radix 가 모달을 한 번이라도 열면 스크롤 잠금용
       * `padding-right: 0 !important` 스타일을 body 에 남기는데, 그게 이 여백을
       * 먹어 버린다. 인라인 important 는 시트의 important 보다 세다. */
      b.style.setProperty("padding-right", PANEL, "important")
      b.style.transition = "padding-right 200ms ease"
      localStorage.setItem(OPEN_KEY, "1")
    } else {
      b.style.removeProperty("padding-right")
      localStorage.removeItem(OPEN_KEY)
    }
    return () => {
      b.style.removeProperty("padding-right")
    }
  }, [open])

  /* 블록 미리보기는 iframe 이라 별도 문서다. 부모의 :root 를 바꿔도 안 따라온다 —
   * 화면의 절반이 안 움직이면 "토큰 하나가 전부를 바꾼다" 는 말이 거짓이 된다.
   * 같은 출처라 안을 만질 수 있으므로 같은 값을 함께 얹는다. */
  const applyToFrames = (fn: (root: HTMLElement) => void) => {
    for (const f of Array.from(document.querySelectorAll("iframe"))) {
      try {
        const doc = f.contentDocument
        if (doc?.documentElement) fn(doc.documentElement)
      } catch {
        /* 다른 출처의 iframe 은 건드릴 수 없다. 조용히 넘어간다. */
      }
    }
  }

  const setToken = (name: string, value: string) => {
    document.documentElement.style.setProperty(`--${name}`, value)
    applyToFrames((r) => r.style.setProperty(`--${name}`, value))
    setEdits((e) => ({ ...e, [name]: value }))
    setSwatches((s) => ({ ...s, [name]: toHex(value) }))
  }

  /* 나중에 뜨는 iframe(스크롤해서 새로 만들어지는 미리보기)에도 얹어야 한다.
   * 편집기가 열려 있는 동안만 지켜본다. */
  useEffect(() => {
    if (!open || !Object.keys(edits).length) return
    const paint = () =>
      applyToFrames((r) => {
        for (const [k, v] of Object.entries(edits)) r.style.setProperty(`--${k}`, v)
      })
    paint()
    const id = window.setInterval(paint, 800)
    return () => window.clearInterval(id)
  }, [open, edits])

  const reset = () => {
    const root = document.documentElement
    for (const k of Object.keys(edits)) {
      root.style.removeProperty(`--${k}`)
    }
    applyToFrames((r) => {
      for (const k of Object.keys(edits)) r.style.removeProperty(`--${k}`)
    })
    setEdits({})
    setTimeout(sync, 0)
  }

  const css = [
    resolvedTheme === "dark" ? ".dark {" : ":root {",
    ...Object.entries(edits).map(([k, v]) => `  --${k}: ${v};`),
    "}",
  ].join("\n")

  const copy = () => {
    navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const count = Object.keys(edits).length

  return (
    <>
      <Button
        variant={open ? "secondary" : "outline"}
        size="sm"
        className="w-full justify-start"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <SlidersHorizontal className="size-4" />
        <span className="min-w-0 flex-1 truncate text-left">
          {lang === "ko" ? "파운데이션 편집" : "Edit foundation"}
        </span>
        {count ? (
          <span className="text-muted-foreground text-[11px] tabular-nums">{count}</span>
        ) : null}
      </Button>

      {/* 오버레이 없음. 뒤 화면을 덮지도, 어둡게 하지도 않는다 —
        * 확인하려는 대상을 가리면 이 도구는 쓸모가 없다. */}
      <aside
        hidden={!open}
        aria-label={lang === "ko" ? "파운데이션 편집" : "Edit foundation"}
        className="bg-popover text-popover-foreground fixed inset-y-0 right-0 z-40 flex flex-col border-l shadow-xl"
        style={{ width: PANEL }}
      >
        <div className="flex items-start justify-between gap-3 px-6 pt-6 pb-4">
          <div className="min-w-0">
            <h2 className="font-semibold">
              {lang === "ko" ? "파운데이션 편집" : "Edit foundation"}
            </h2>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {lang === "ko"
                ? "바꾼 값은 왼쪽 화면에 즉시 반영된다. 열어 둔 채로 페이지를 옮겨 다녀도 되고, 원본 파일은 그대로라 언제든 되돌릴 수 있다."
                : "Changes land on the page to the left immediately. Leave it open while you move between pages — the source files are untouched, so you can always revert."}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setOpen(false)}
            aria-label={lang === "ko" ? "편집기 닫기" : "Close editor"}
            className="shrink-0"
          >
            <X className="size-4" />
          </Button>
        </div>

        <Tabs defaultValue="color" className="flex min-h-0 flex-1 flex-col">
          <div className="px-6 pt-4">
            <TabsList className="w-full">
              <TabsTrigger value="color" className="flex-1">
                {lang === "ko" ? "색" : "Color"}
              </TabsTrigger>
              <TabsTrigger value="shape" className="flex-1">
                {lang === "ko" ? "모양" : "Shape"}
              </TabsTrigger>
              <TabsTrigger value="type" className="flex-1">
                {lang === "ko" ? "글꼴" : "Type"}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <TabsContent value="color" className="mt-0 flex flex-col gap-1 p-6">
              <p className="text-muted-foreground mb-3 text-xs leading-relaxed">
                {lang === "ko"
                  ? `지금 편집 중인 모드: ${resolvedTheme === "dark" ? "다크" : "라이트"}. 모드를 바꾸면 그쪽 값을 따로 편집한다.`
                  : `Editing ${resolvedTheme === "dark" ? "dark" : "light"} mode. Switch modes to edit the other set.`}
              </p>
              {COLOR_TOKENS.map((tok) => (
                <div
                  key={tok.name}
                  className="hover:bg-muted/50 -mx-2 flex items-center gap-3 rounded-md px-2 py-1.5"
                >
                  <label className="relative size-8 shrink-0 cursor-pointer overflow-hidden rounded-md border">
                    <span
                      className="block size-full"
                      style={{ background: `var(--${tok.name})` }}
                    />
                    <input
                      type="color"
                      value={swatches[tok.name] ?? "#000000"}
                      onChange={(e) => setToken(tok.name, e.target.value)}
                      className="absolute inset-0 cursor-pointer opacity-0"
                      aria-label={t(tok.label)}
                    />
                  </label>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium">{t(tok.label)}</span>
                      <code className="text-muted-foreground truncate text-[11px]">
                        --{tok.name}
                      </code>
                    </div>
                    {t(tok.note) ? (
                      <p className="text-muted-foreground text-[11px] leading-snug">
                        {t(tok.note)}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="shape" className="mt-0 flex flex-col gap-8 p-6">
              <div>
                <div className="mb-1 flex items-baseline justify-between">
                  <Label>{lang === "ko" ? "모서리" : "Radius"}</Label>
                  <code className="text-muted-foreground text-xs tabular-nums">
                    {radius}px
                  </code>
                </div>
                <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
                  {lang === "ko"
                    ? "기준값 하나가 sm 부터 4xl 까지 일곱 단계를 만든다. 버튼·카드·인풋·팝오버가 한 번에 따라온다."
                    : "One base value derives all seven steps, sm through 4xl. Buttons, cards, inputs and popovers all follow."}
                </p>
                <Slider
                  value={[radius]}
                  min={0}
                  max={24}
                  step={1}
                  onValueChange={([v]) => {
                    setRadius(v)
                    setToken("radius", `${v}px`)
                  }}
                />
              </div>

              <div>
                <div className="mb-1 flex items-baseline justify-between">
                  <Label>{lang === "ko" ? "밀도" : "Density"}</Label>
                  <code className="text-muted-foreground text-xs tabular-nums">
                    {spacing}px
                  </code>
                </div>
                <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
                  {lang === "ko"
                    ? "간격 스케일의 기준. p-4 는 이 값의 4배다. 줄이면 화면 전체가 조밀해지고, 늘리면 숨통이 트인다."
                    : "The base of the spacing scale — p-4 is four times this. Lower it and the whole screen tightens; raise it and it breathes."}
                </p>
                <Slider
                  value={[spacing]}
                  min={3}
                  max={5.5}
                  step={0.25}
                  onValueChange={([v]) => {
                    setSpacing(v)
                    setToken("spacing-base", `${v / 16}rem`)
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="type" className="mt-0 flex flex-col gap-8 p-6">
              <div>
                <Label className="mb-1">{lang === "ko" ? "본문 글꼴" : "Sans"}</Label>
                <p className="text-muted-foreground mb-3 text-xs leading-relaxed">
                  {lang === "ko"
                    ? "한글은 Pretendard 가 계속 맡는다. 여기서 고른 것은 라틴 글자에만 적용된다."
                    : "Pretendard keeps handling Hangul. What you pick here applies to Latin glyphs."}
                </p>
                <Select
                  onValueChange={(v) => {
                    loadFont(v)
                    setToken(
                      "font-sans",
                      `${v}, var(--font-pretendard), ui-sans-serif, sans-serif`
                    )
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="DM Sans" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONTS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1">{lang === "ko" ? "고정폭 글꼴" : "Mono"}</Label>
                <p className="text-muted-foreground mb-3 text-xs leading-relaxed">
                  {lang === "ko"
                    ? "코드와 토큰 값에 쓴다. 숫자 폭이 일정해야 표가 흔들리지 않는다."
                    : "Used for code and token values. Even digit widths keep tables from shifting."}
                </p>
                <Select
                  onValueChange={(v) => {
                    loadFont(v)
                    setToken("font-mono", `${v}, ui-monospace, monospace`)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="JetBrains Mono" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONO_FONTS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </div>

          <Separator />
          <div className="flex flex-col gap-3 p-6">
            {count ? (
              <pre className="bg-muted/50 max-h-32 overflow-auto rounded-md p-3 font-mono text-[11px] leading-relaxed">
                {css}
              </pre>
            ) : (
              <p className="text-muted-foreground text-xs">
                {lang === "ko"
                  ? "아직 바꾼 값이 없다. 무엇이든 하나 밀어 보면 화면이 따라오는 게 보인다."
                  : "Nothing changed yet. Nudge any value and watch the screen follow."}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={reset}
                disabled={!count}
              >
                <RotateCcw className="size-4" />
                {lang === "ko" ? "되돌리기" : "Reset"}
              </Button>
              <Button size="sm" className="flex-1" onClick={copy} disabled={!count}>
                {copied ? <Check className="size-4" /> : <CopyIcon className="size-4" />}
                {copied
                  ? lang === "ko"
                    ? "복사됨"
                    : "Copied"
                  : lang === "ko"
                    ? "CSS 복사"
                    : "Copy CSS"}
              </Button>
            </div>
          </div>
        </Tabs>
      </aside>
    </>
  )
}
