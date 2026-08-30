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

import {
  Check,
  ChevronRight,
  Plus,
  Copy as CopyIcon,
  FilePlus,
  Loader2,
  RotateCcw,
  MousePointerClick,
  Save,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useCallback, useEffect, useRef, useState } from "react"

import type { SavedTheme } from "@/app/api/themes/route.dev"
import { type Copy, useLang } from "@/components/lang"
import { TokenInspector } from "@/components/token-inspector"
import { readPx } from "@/lib/token-read"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { toast } from "sonner"

/* 패널 폭. 본문 여백과 패널 자체가 같은 값을 봐야 어긋나지 않는다. */
const PANEL = "23rem"
const OPEN_KEY = "ds-editor-open"
const EDITS_KEY = "ds-editor-edits"

/* 사용자가 직접 더한 색 이름.
 *
 * 팔레트는 닫혀 있어야 한다는 게 원칙이지만, 닫아 두기만 하면 필요한 이름이
 * 생겼을 때 갈 곳이 없어 결국 컴포넌트 안에 hex 를 적게 된다. 그래서 더하는
 * 길을 열되, 더한 것이 «내가 더한 것» 으로 보이게 표시하고 지울 수 있게 한다. */
const CUSTOM_KEY = "ds-editor-custom"

type CustomToken = { name: string; value: string }

function readCustom(): CustomToken[] {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_KEY) ?? "[]") as CustomToken[]
  } catch {
    return []
  }
}

/* 간격 슬라이더 — 값이 아니라 "기준의 몇 배" 로 다룬다.
 * px 로 직접 적게 하면 밀도 토큰을 바꿨을 때 이 값만 따로 놀게 된다. */
const SPACE_TOKENS: {
  name: string
  group: Copy
  label: Copy
  note: Copy
  min: number
  max: number
  step: number
}[] = [
  {
    name: "h-control",
    group: { ko: "전체 기준", en: "Baseline" },
    label: { ko: "컨트롤 높이", en: "Control height" },
    note: {
      ko: "한 줄에 나란히 서는 것들이 받는 기준. 버튼·입력의 기본 크기와 셀렉트·토글이 전부 여기서 온다",
      en: "The baseline for everything that stands in a row — button and input defaults, selects and toggles.",
    },
    min: 6,
    max: 14,
    step: 0.5,
  },
  {
    name: "pad-control",
    group: { ko: "전체 기준", en: "Baseline" },
    label: { ko: "컨트롤 좌우 여백", en: "Control padding" },
    note: {
      ko: "같은 방식으로 좌우 여백이 내려온다",
      en: "Horizontal room comes down the same way",
    },
    min: 1,
    max: 8,
    step: 0.5,
  },
  {
    name: "h-tab",
    group: { ko: "탭", en: "Tabs" },
    label: { ko: "높이", en: "Height" },
    note: {
      ko: "버튼보다 한 단 작게 둔다. 같은 높이면 «전환» 이 «실행» 처럼 읽힌다",
      en: "Keep it a step under the button — matched heights make switching look like doing",
    },
    min: 5,
    max: 14,
    step: 0.5,
  },
  {
    name: "pad-tab",
    group: { ko: "탭", en: "Tabs" },
    label: { ko: "좌우 여백", en: "Padding" },
    note: {
      ko: "탭이 여럿일 때 이 값이 전체 너비를 정한다",
      en: "With several tabs, this decides the strip’s whole width",
    },
    min: 0.5,
    max: 6,
    step: 0.5,
  },
  {
    name: "gap-text",
    group: { ko: "글줄", en: "Text" },
    label: { ko: "글줄 사이", en: "Between lines" },
    note: {
      ko: "제목과 설명처럼 «이어 말하는» 두 줄 사이. 넓히면 두 얘기로 읽힌다",
      en: "Between a title and its description. Widen it and they read as two things",
    },
    min: 0,
    max: 4,
    step: 0.5,
  },
]

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

/* 파일 API 가 없을 때의 보관소.
 *
 * 공유용 정적 빌드에는 서버가 없다. 그 자리에서 테마를 만들어 본 사람이
 * 저장을 눌렀을 때 «실패» 만 보는 것보다는, 자기 브라우저에 남는 편이 낫다.
 * 대신 그건 그 사람 브라우저에만 있고 레포에는 안 들어온다. */
const LOCAL_THEMES = "ds-themes-local"

function readLocalThemes(): SavedTheme[] {
  try {
    const raw = localStorage.getItem(LOCAL_THEMES)
    return raw ? (JSON.parse(raw) as SavedTheme[]) : []
  } catch {
    return []
  }
}

function writeLocalThemes(body: object): SavedTheme[] {
  const list = readLocalThemes()
  const b = body as { remove?: string; name?: string; mode?: string; vars?: object }
  const next = b.remove
    ? list.filter((t) => t.id !== b.remove)
    : [
        ...list,
        {
          id: `local-${list.length + 1}-${b.name}`,
          name: b.name ?? "이름 없음",
          mode: (b.mode ?? "light") as SavedTheme["mode"],
          at: "",
          vars: (b.vars ?? {}) as SavedTheme["vars"],
        },
      ]
  try {
    localStorage.setItem(LOCAL_THEMES, JSON.stringify(next))
  } catch {}
  return next
}

/** 서버가 없다는 뜻. 실패가 아니라 다른 경로로 가라는 신호다. */
class OfflineStore extends Error {}

export function TokenEditor() {
  const { t, lang } = useLang()
  const { resolvedTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [swatches, setSwatches] = useState<Record<string, string>>({})
  const [radius, setRadius] = useState(10)
  const [spacing, setSpacing] = useState(4)
  const [space, setSpace] = useState<Record<string, number>>({})
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState("")
  const [saved, setSaved] = useState<SavedTheme[]>([])
  const [saving, setSaving] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const [picking, setPicking] = useState(false)
  const [custom, setCustom] = useState<CustomToken[]>([])
  const [newName, setNewName] = useState("")

  useEffect(() => setCustom(readCustom()), [])

  /* 더한 색은 :root 에 얹어 둔다. 지우면 이름째로 사라진다 —
   * 값만 지우고 이름을 남기면 «없는 색을 가리키는 참조» 가 생긴다. */
  const saveCustom = (next: CustomToken[]) => {
    setCustom(next)
    try {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(next))
    } catch {}
    for (const t of next) document.documentElement.style.setProperty(`--${t.name}`, t.value)
  }

  const addCustom = () => {
    const name = newName.trim().replace(/^--/, "").replace(/[^a-z0-9-]/gi, "-").toLowerCase()
    if (!name) return
    if (custom.some((c) => c.name === name) || COLOR_TOKENS.some((c) => c.name === name)) {
      toast.error(lang === "ko" ? "이미 있는 이름입니다" : "That name already exists")
      return
    }
    saveCustom([...custom, { name, value: "#888888" }])
    setNewName("")
  }

  const removeCustom = (name: string) => {
    document.documentElement.style.removeProperty(`--${name}`)
    saveCustom(custom.filter((c) => c.name !== name))
  }

  /* 열 때마다, 그리고 모드가 바뀔 때마다 지금 값을 다시 읽는다.
   * 라이트와 다크는 값이 다르므로 편집기도 지금 보고 있는 쪽을 보여 줘야 한다. */
  const sync = useCallback(() => {
    const next: Record<string, string> = {}
    for (const { name } of COLOR_TOKENS) next[name] = toHex(readVar(name))
    setSwatches(next)
    /* 값이 calc 나 rem 으로 적혀 있어도 px 로 받아 온다 —
     * 문자열을 직접 파싱하면 calc 에서 NaN 이 나와 슬라이더가 최솟값으로 튄다. */
    const r = readPx("radius")
    if (r != null) setRadius(Math.round(r))
    const base = readPx("spacing-base") ?? 4
    setSpacing(Number(base.toFixed(2)))

    /* 컴포넌트 간격은 기준으로 나눠 배수로 되돌린다. */
    const mult: Record<string, number> = {}
    for (const tok of SPACE_TOKENS) {
      const px = readPx(tok.name)
      if (px != null && base) mult[tok.name] = Number((px / base).toFixed(2))
    }
    setSpace(mult)
  }, [])

  /* 페이지를 옮겨 다녀도 열린 채로, 바꾼 값도 그대로 남는다.
   * 파운데이션에서 색을 밀고 컴포넌트 탭으로 건너가 확인하는 게 이 도구의 쓰임인데,
   * 이동할 때마다 값이 초기화되면 그 일을 할 수가 없다. */
  useEffect(() => {
    if (localStorage.getItem(OPEN_KEY) === "1") setOpen(true)
    try {
      const saved = JSON.parse(localStorage.getItem(EDITS_KEY) ?? "{}")
      if (saved && typeof saved === "object" && Object.keys(saved).length) {
        const root = document.documentElement
        for (const [k, v] of Object.entries(saved)) {
          root.style.setProperty(`--${k}`, String(v))
        }
        setEdits(saved as Record<string, string>)
      }
    } catch {
      /* 저장된 값이 깨졌으면 그냥 없는 셈 친다. */
    }
  }, [])

  /* 바뀔 때마다 기록한다. 새로고침해도, 다른 탭으로 가도 남는다. */
  useEffect(() => {
    if (Object.keys(edits).length) {
      localStorage.setItem(EDITS_KEY, JSON.stringify(edits))
    } else {
      localStorage.removeItem(EDITS_KEY)
    }
  }, [edits])

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

  /* 편집한 값을 계속 얹어 둔다.
   *
   * 두 가지를 막는다.
   *  1) 나중에 뜨는 iframe — 스크롤하다 새로 만들어진 미리보기에는 값이 없다.
   *  2) 프리셋이 덮어쓰는 것 — 테마 전환기는 마운트될 때 저장된 프리셋을
   *     :root 에 다시 얹는데, 그때 편집한 값이 지워진다. 편집기가 더 나중의,
   *     더 구체적인 의도이므로 위에 남아야 한다. */
  useEffect(() => {
    const keys = Object.keys(edits)
    if (!keys.length) return
    const paint = () => {
      const root = document.documentElement
      for (const [k, v] of Object.entries(edits)) {
        if (root.style.getPropertyValue(`--${k}`) !== v) {
          root.style.setProperty(`--${k}`, v)
        }
      }
      applyToFrames((r) => {
        for (const [k, v] of Object.entries(edits)) r.style.setProperty(`--${k}`, v)
      })
    }
    paint()
    const id = window.setInterval(paint, 800)
    return () => window.clearInterval(id)
  }, [edits])

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

  /* 저장한 테마 목록을 읽어 온다.
   *
   * 개발 중에는 data/themes.json 이 정본이라 다른 컴퓨터에서도 같은 목록이 뜬다.
   * 공유용 정적 빌드에는 그 API 가 없으므로 브라우저 안에만 저장한다 —
   * 보는 사람이 «저장이 안 되네» 로 멈추는 대신, 자기 브라우저에서는 되게. */
  useEffect(() => {
    if (!open) return
    fetch("/api/themes")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setSaved(j.themes ?? []))
      .catch(() => setSaved(readLocalThemes()))
  }, [open])

  const push = async (body: object) => {
    setSaving(true)
    try {
      const res = await fetch("/api/themes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.status === 404 || res.status === 405) throw new OfflineStore()
      const j = await res.json()
      if (!res.ok) throw new Error(j.error ?? "저장하지 못했습니다")
      setSaved(j.themes ?? [])
      return true
    } catch (e) {
      if (e instanceof OfflineStore || e instanceof TypeError) {
        setSaved(writeLocalThemes(body))
        return true
      }
      toast.error(e instanceof Error ? e.message : String(e))
      return false
    } finally {
      setSaving(false)
    }
  }

  const save = async () => {
    if (!count) return
    /* 이름이 없으면 막는 대신 무엇이 필요한지 말하고 그 칸으로 데려간다. */
    if (!name.trim()) {
      nameRef.current?.focus()
      toast(
        lang === "ko" ? "이름을 붙여야 저장할 수 있습니다" : "Name it first",
        {
          description:
            lang === "ko"
              ? "나중에 목록에서 알아보려면 이름이 필요합니다."
              : "You'll need it to recognise this later.",
        }
      )
      return
    }
    const ok = await push({
      save: {
        id: `t${Date.now().toString(36)}`,
        name,
        mode: resolvedTheme === "dark" ? "dark" : "light",
        vars: edits,
        at: new Date().toISOString(),
      },
    })
    if (ok) {
      toast.success(
        lang === "ko" ? `«${name}» 으로 저장했습니다` : `Saved as "${name}"`,
        {
          description:
            lang === "ko"
              ? "data/themes.json 에 기록됐습니다. 커밋하면 다른 컴퓨터에서도 보입니다."
              : "Written to data/themes.json — commit it and every machine sees it.",
        }
      )
      setName("")
    }
  }

  const remove = (id: string) => push({ remove: id })

  /* 저장한 테마를 다시 얹는다. 지금 값을 밀어내는 것이므로,
   * 얹기 전에 지금 얹혀 있던 것을 먼저 걷어낸다 — 두 테마가 섞이면 안 된다. */
  const apply = (th: SavedTheme) => {
    const root = document.documentElement
    for (const k of Object.keys(edits)) root.style.removeProperty(`--${k}`)
    for (const [k, v] of Object.entries(th.vars)) root.style.setProperty(`--${k}`, v)
    applyToFrames((r) => {
      for (const [k, v] of Object.entries(th.vars)) r.style.setProperty(`--${k}`, v)
    })
    setEdits(th.vars)
    setName(th.name)
    setTimeout(sync, 0)
    if (th.mode !== resolvedTheme) {
      toast(
        lang === "ko"
          ? `이 테마는 ${th.mode === "dark" ? "다크" : "라이트"} 모드에서 만든 값입니다`
          : `Saved in ${th.mode} mode`,
        {
          description:
            lang === "ko"
              ? "지금 모드와 달라 대비가 어긋나 보일 수 있습니다."
              : "Contrast may look off in the current mode.",
        }
      )
    }
  }

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
        <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-2">
          <h2 className="min-w-0 truncate text-sm font-semibold">
            {lang === "ko" ? "파운데이션 편집" : "Edit foundation"}
          </h2>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant={picking ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => setPicking((v) => !v)}
              aria-pressed={picking}
              title={
                picking
                  ? lang === "ko"
                    ? "고르는 중 · Esc 로 나가기"
                    : "Picking · Esc to exit"
                  : lang === "ko"
                    ? "화면에서 요소 골라 고치기"
                    : "Pick an element on screen"
              }
              aria-label={
                lang === "ko" ? "화면에서 요소 골라 고치기" : "Pick an element on screen"
              }
            >
              <MousePointerClick className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpen(false)}
              aria-label={lang === "ko" ? "편집기 닫기" : "Close editor"}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>


        <Tabs defaultValue="color" className="flex min-h-0 flex-1 flex-col">
          <div className="px-4 pt-2">
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
            <TabsContent value="color" className="mt-0 flex flex-col gap-1 p-4">
              <p className="text-muted-foreground mb-3 text-xs leading-relaxed">
                {lang === "ko"
                  ? `지금 편집 중인 모드: ${resolvedTheme === "dark" ? "다크" : "라이트"}. 모드를 바꾸면 그쪽 값을 따로 편집한다.`
                  : `Editing ${resolvedTheme === "dark" ? "dark" : "light"} mode. Switch modes to edit the other set.`}
              </p>
              {custom.map((tok) => (
                <div
                  key={tok.name}
                  className="hover:bg-muted/50 -mx-2 flex items-center gap-3 rounded-md px-2 py-1.5"
                >
                  <label className="relative size-8 shrink-0 cursor-pointer overflow-hidden rounded-md border">
                    <span className="block size-full" style={{ background: tok.value }} />
                    <input
                      type="color"
                      value={tok.value}
                      onChange={(e) =>
                        saveCustom(
                          custom.map((c) =>
                            c.name === tok.name ? { ...c, value: e.target.value } : c
                          )
                        )
                      }
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </label>
                  <div className="min-w-0 flex-1">
                    <code className="text-xs">--{tok.name}</code>
                    <p className="text-muted-foreground text-[11px]">
                      {lang === "ko" ? "내가 더한 색" : "Added by you"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCustom(tok.name)}
                    aria-label={lang === "ko" ? `${tok.name} 지우기` : `Delete ${tok.name}`}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}

              {/* 더하기. 팔레트를 닫아 두기만 하면 필요한 이름이 생겼을 때
                * 컴포넌트 안에 hex 를 적게 된다 — 그것보다는 이름을 늘리는 편이 낫다. */}
              <div className="mt-2 flex gap-2">
                <Input
                  size="sm"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addCustom()
                  }}
                  placeholder={lang === "ko" ? "새 색 이름 (예: brand)" : "New color name"}
                  className="flex-1"
                />
                <Button size="sm" variant="outline" onClick={addCustom} disabled={!newName.trim()}>
                  <Plus className="size-4" />
                  {lang === "ko" ? "더하기" : "Add"}
                </Button>
              </div>

              <Separator className="my-3" />

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

            <TabsContent value="shape" className="mt-0 flex flex-col gap-6 p-4">
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

              <Separator />

              {/* 위 둘은 화면 전체에 걸리고, 아래는 컴포넌트 하나씩에 걸린다.
                * 배수로 다루므로 밀도를 바꾸면 이것들도 함께 따라온다. */}
              <div>
                <Label className="mb-1 block">
                  {lang === "ko" ? "컴포넌트 간격" : "Component spacing"}
                </Label>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {lang === "ko"
                    ? "값이 아니라 «기준의 몇 배» 로 다룬다. px 로 직접 적으면 위의 밀도를 바꿨을 때 이 값만 따로 놀게 된다."
                    : "Set as multiples of the base, not raw pixels — otherwise these stop following when you change density above."}
                </p>
              </div>

              {SPACE_TOKENS.map((tok, i) => {
                const v = space[tok.name] ?? tok.min
                /* 묶음이 바뀌는 자리에만 이름을 세운다. 항목마다 붙이면
                 * 이름이 열 번 반복돼 오히려 안 읽힌다. */
                const newGroup = i === 0 || SPACE_TOKENS[i - 1].group.en !== tok.group.en
                return (
                  <div key={tok.name}>
                    {newGroup ? (
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-foreground text-xs font-semibold">
                          {t(tok.group)}
                        </span>
                        <Separator className="flex-1" />
                      </div>
                    ) : null}
                    <div className="mb-1 flex items-baseline justify-between gap-3">
                      <Label>{t(tok.label)}</Label>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <code className="text-muted-foreground text-xs tabular-nums">
                          ×{v} · {Math.round(v * spacing)}px
                        </code>
                        {/* 값을 직접 적을 수 있어야 한다 — 슬라이더로는
                          * «정확히 이 값» 을 맞추기 어렵다. */}
                        <Input
                          aria-label={`${t(tok.label)} 배수`}
                          value={String(v)}
                          inputMode="decimal"
                          onChange={(e) => {
                            const n = parseFloat(e.target.value)
                            if (Number.isNaN(n)) return
                            const c = Math.min(tok.max, Math.max(tok.min, n))
                            setSpace((s) => ({ ...s, [tok.name]: c }))
                            setToken(tok.name, `calc(var(--spacing) * ${c})`)
                          }}
                          className="h-6 w-14 px-1 text-center font-mono text-xs tabular-nums"
                        />
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
                      {t(tok.note)}
                    </p>
                    <Slider
                      value={[v]}
                      min={tok.min}
                      max={tok.max}
                      step={tok.step}
                      onValueChange={([n]) => {
                        setSpace((s) => ({ ...s, [tok.name]: n }))
                        setToken(tok.name, `calc(var(--spacing) * ${n})`)
                      }}
                    />
                  </div>
                )
              })}
            </TabsContent>

            <TabsContent value="type" className="mt-0 flex flex-col gap-6 p-4">
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
          {/* 아래 칸은 «지금 값을 어떻게 할 것인가» 만 맡는다.
            * 예전에는 여기에 CSS 미리보기까지 늘 펼쳐져 있어서 슬라이더가
            * 화면 밖으로 밀렸다 — 확인용은 접어 두고, 손이 가는 것만 남긴다. */}
          <div className="flex flex-col gap-2 p-4">
            <div className="flex gap-2">
              <Input
                ref={nameRef}
                size="sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void save()
                }}
                placeholder={
                  lang === "ko" ? "이름을 붙여 저장" : "Name it, then save"
                }
                disabled={!count}
                className="flex-1"
              />
              <Button size="sm" onClick={() => void save()} disabled={!count || saving}>
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                {lang === "ko" ? "저장" : "Save"}
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-muted-foreground mr-auto text-[11px] tabular-nums">
                {count
                  ? lang === "ko"
                    ? `바꾼 값 ${count}개`
                    : `${count} changed`
                  : lang === "ko"
                    ? "바꾼 값 없음"
                    : "Nothing changed"}
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  reset()
                  setName("")
                  setTimeout(() => nameRef.current?.focus(), 0)
                  toast(lang === "ko" ? "새 테마를 시작합니다" : "Started a new theme", {
                    description:
                      lang === "ko"
                        ? "기본값에서 시작합니다. 값을 바꾸고 이름을 붙여 저장하세요."
                        : "Back to defaults. Change values, name it, save.",
                  })
                }}
              >
                <FilePlus className="size-3.5" />
                {lang === "ko" ? "새로" : "New"}
              </Button>
              <Button variant="ghost" size="xs" onClick={reset} disabled={!count}>
                <RotateCcw className="size-3.5" />
                {lang === "ko" ? "되돌리기" : "Reset"}
              </Button>
              <Button variant="ghost" size="xs" onClick={copy} disabled={!count}>
                {copied ? <Check className="size-3.5" /> : <CopyIcon className="size-3.5" />}
                {copied
                  ? lang === "ko"
                    ? "복사됨"
                    : "Copied"
                  : "CSS"}
              </Button>
            </div>

            {/* 저장한 것들. 목록이 길어지면 이 칸만 스크롤한다 —
              * 위의 슬라이더를 밀어내지 않게. */}
            {saved.length ? (
              <details className="group/saved">
                <summary className="text-muted-foreground hover:text-foreground flex cursor-pointer list-none items-center gap-1.5 py-1 text-[11px]">
                  <ChevronRight className="size-3.5 transition-transform group-open/saved:rotate-90" />
                  {lang === "ko"
                    ? `저장한 테마 ${saved.length}개`
                    : `${saved.length} saved`}
                </summary>
                <div className="mt-1 flex max-h-40 flex-col gap-0.5 overflow-y-auto">
                  {saved.map((th) => (
                    <div
                      key={th.id}
                      className="hover:bg-muted/50 -mx-2 flex items-center gap-2 rounded-md px-2 py-1"
                    >
                      <button
                        type="button"
                        onClick={() => apply(th)}
                        className="min-w-0 flex-1 truncate text-left text-sm"
                      >
                        {th.name}
                      </button>
                      <span className="text-muted-foreground shrink-0 text-[11px] tabular-nums">
                        {th.mode === "dark"
                          ? lang === "ko"
                            ? "다크"
                            : "dark"
                          : lang === "ko"
                            ? "라이트"
                            : "light"}
                        {" · "}
                        {Object.keys(th.vars).length}
                      </span>
                      <button
                        type="button"
                        onClick={() => void remove(th.id)}
                        aria-label={
                          lang === "ko" ? `${th.name} 지우기` : `Delete ${th.name}`
                        }
                        className="text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </details>
            ) : null}

            {count ? (
              <details>
                <summary className="text-muted-foreground hover:text-foreground cursor-pointer list-none py-1 text-[11px]">
                  {lang === "ko" ? "바뀐 CSS 보기" : "Show changed CSS"}
                </summary>
                <pre className="bg-muted/50 mt-1 max-h-32 overflow-auto rounded-md p-2 font-mono text-[11px] leading-relaxed">
                  {css}
                </pre>
              </details>
            ) : null}
          </div>
        </Tabs>
      </aside>

      <TokenInspector
        active={picking}
        onExit={() => setPicking(false)}
        setToken={setToken}
      />
    </>
  )
}
