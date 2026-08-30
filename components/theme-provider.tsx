/* 라이트 · 다크 · 시스템.
 *
 * 디자인 시스템은 두 모드를 같은 이름으로 설명할 수 있어야 한다.
 * --background 가 라이트에선 흰 면, 다크에선 검은 면 — 이름은 그대로고 값만 바뀐다.
 * 그래서 컴포넌트 코드에는 어느 모드인지가 한 글자도 나오지 않는다. */
"use client"

import { ThemeProvider as NextThemes } from "next-themes"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemes>
  )
}
