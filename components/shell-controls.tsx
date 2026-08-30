/* 셸 하단의 조작부 — 모드와 언어.
 *
 * 둘 다 "보기"를 바꾸는 것이지 내용을 바꾸는 게 아니다. 그래서 나란히 둔다.
 * 모드는 토큰의 값을, 언어는 설명문의 언어를 고른다. */
"use client"

import { Languages, Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { useLang } from "@/components/lang"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const MODES = [
  { key: "light", Icon: Sun, ko: "라이트", en: "Light" },
  { key: "dark", Icon: Moon, ko: "다크", en: "Dark" },
  { key: "system", Icon: Monitor, ko: "시스템", en: "System" },
] as const

export function ShellControls() {
  const { theme, setTheme } = useTheme()
  const { lang, setLang } = useLang()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="flex items-center gap-2">
      {/* 모드 — 세 값이라 토글이 아니라 세그먼트로 둔다 */}
      <div className="bg-muted/50 flex min-w-0 flex-1 rounded-md p-0.5">
        {MODES.map(({ key, Icon, ko, en }) => {
          const on = mounted && theme === key
          return (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setTheme(key)}
                  aria-label={lang === "ko" ? ko : en}
                  className={cn(
                    "flex flex-1 items-center justify-center rounded-sm py-1.5 transition-colors",
                    on
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{lang === "ko" ? ko : en}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      {/* 언어 — 두 값이라 누르면 넘어간다 */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setLang(lang === "ko" ? "en" : "ko")}
            className="bg-muted/50 text-muted-foreground hover:text-foreground flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors"
          >
            <Languages className="size-3.5" />
            {lang === "ko" ? "KO" : "EN"}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {lang === "ko" ? "English 로 보기" : "한국어로 보기"}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
