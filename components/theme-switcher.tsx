/* 프리셋 전환기.
 * 프리셋의 키가 우리 CSS 변수와 그대로 맞으므로, :root 에 값을 꽂기만 하면
 * 컴포넌트 109개 · 블록 30개 · 패턴 74개가 한 번에 바뀐다.
 *
 * 폰트만 예외다. --font-sans 를 바꿔도 그 폰트가 로드돼 있지 않으면 폴백으로 떨어지므로,
 * 프리셋이 지정한 패밀리를 Google Fonts 에서 그때그때 불러온다. */
"use client"

import { Check, Palette, RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"

import { defaultPresets, type ThemeVars } from "@/lib/theme-presets"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const KEY = "ds-preset"

/* 프리셋이 쓰는 폰트를 필요할 때만 불러온다. 이미 있으면 다시 넣지 않는다. */
function loadFonts(vars: ThemeVars) {
  const families = new Set<string>()
  for (const k of ["font-sans", "font-serif", "font-mono"]) {
    const v = vars[k]
    if (!v) continue
    const first = v.split(",")[0].replace(/["']/g, "").trim()
    if (first && !/^(ui-|system-|-apple|sans-serif|serif|monospace)/.test(first)) {
      families.add(first)
    }
  }
  for (const f of families) {
    const id = `font-${f.replace(/\s+/g, "-")}`
    if (document.getElementById(id)) continue
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      f
    ).replace(/%20/g, "+")}:wght@300;400;500;600;700&display=swap`
    document.head.appendChild(link)
  }
}

function apply(id: string | null) {
  const root = document.documentElement
  if (!id || !defaultPresets[id]) {
    /* 프리셋을 벗기면 globals.css 의 원래 값으로 돌아간다 —
     * 인라인으로 덮어썼던 것만 지우면 된다. */
    for (const p of Array.from(root.style)) {
      if (p.startsWith("--")) root.style.removeProperty(p)
    }
    return
  }
  const isDark = root.classList.contains("dark")
  const vars = defaultPresets[id].styles[isDark ? "dark" : "light"]
  loadFonts(vars)
  for (const [k, v] of Object.entries(vars)) {
    root.style.setProperty(`--${k}`, v)
  }
}

export function ThemeSwitcher() {
  const [current, setCurrent] = useState<string | null>(null)

  /* 새로고침해도 고른 프리셋이 유지되도록 한다. */
  useEffect(() => {
    const saved = localStorage.getItem(KEY)
    if (saved && defaultPresets[saved]) {
      setCurrent(saved)
      apply(saved)
    }
  }, [])

  const pick = (id: string | null) => {
    setCurrent(id)
    apply(id)
    if (id) localStorage.setItem(KEY, id)
    else localStorage.removeItem(KEY)
  }

  const entries = Object.entries(defaultPresets)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Palette className="size-4" />
          <span className="min-w-0 flex-1 truncate text-left">
            {current ? defaultPresets[current].label : "기본 테마"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-96 w-56 overflow-y-auto">
        <DropdownMenuLabel>프리셋 {entries.length}종</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => pick(null)}>
          <RotateCcw className="size-4" />
          기본으로 되돌리기
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {entries.map(([id, preset]) => (
          <DropdownMenuItem key={id} onClick={() => pick(id)}>
            {current === id ? (
              <Check className="size-4" />
            ) : (
              <span className="size-4" />
            )}
            {preset.label ?? id}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
