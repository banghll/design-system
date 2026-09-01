/* 이 흐름은 라이트 모드 전용이다(§9 «다크 모드 MVP 제외»).
 *
 * 앱 기본 테마는 다크라 그냥 두면 화면이 검게 나온다. 색을 다시 적는 대신
 * 시스템이 이미 가진 테마 스위치를 쓴다 — 토큰 이름은 그대로고 값만 바뀐다.
 * 나갈 때 원래 모드로 되돌린다. */
"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"

export function ForceLight() {
  const { theme, setTheme } = useTheme()
  const prev = useRef(theme)

  useEffect(() => {
    setTheme("light")
    const back = prev.current
    return () => setTheme(back ?? "system")
  }, [setTheme])

  return null
}
