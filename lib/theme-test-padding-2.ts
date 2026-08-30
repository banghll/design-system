import type { CSSProperties } from "react"

/* 저장된 테마 «Test padding 2» 를 화면 하나에 입히는 값.
 *
 * data/themes.json 이 정본이지만, 거기에는 «바꾼 값» 만 들어 있다.
 * 라이트에서 만든 테마라 글자색·선색이 빠져 있고, 그대로 다크 위에 얹으면
 * 흰 바탕에 흰 글자가 된다 — 실제로 한 번 그렇게 됐다.
 * 그래서 빠진 짝을 여기서 채워 둔다.
 *
 * --spacing-base 가 아니라 --spacing 을 덮는다. 기준값은 :root 에서 한 번
 * 계산돼 자식에게 «계산된 값» 으로 내려오므로, 아래에서 -base 를 바꿔 봐야
 * 아무 일도 일어나지 않는다. */
export const TEST_PADDING_2: CSSProperties = {
  /* 테마에 담긴 값 */
  "--background": "#fafafa",
  "--card": "#ffffff",
  "--sidebar": "#ffffff",
  "--primary": "#292929",
  "--primary-foreground": "#f0f0f0",
  "--secondary": "#f2f2f2",
  "--muted": "#f2f2f2",
  "--accent": "#f7f7f7",
  "--input": "#dedede",
  "--font-sans": "Geist, var(--font-pretendard), ui-sans-serif, sans-serif",
  "--spacing": "0.25rem",
  "--pad-card": "calc(var(--spacing) * 5)",
  "--h-control": "calc(var(--spacing) * 10)",
  "--pad-control": "calc(var(--spacing) * 4)",
  "--h-button": "calc(var(--spacing) * 12)",
  "--pad-button": "calc(var(--spacing) * 6)",
  "--h-input": "calc(var(--spacing) * 11.5)",
  "--pad-input": "calc(var(--spacing) * 4)",
  "--h-tab": "calc(var(--spacing) * 12)",

  /* 테마에 없어서 채우는 짝 */
  "--foreground": "#252525",
  "--card-foreground": "#252525",
  "--popover": "#ffffff",
  "--popover-foreground": "#252525",
  "--secondary-foreground": "#292929",
  "--accent-foreground": "#292929",
  "--muted-foreground": "#737373",
  "--border": "#e5e5e5",
  "--ring": "#a3a3a3",
  "--sidebar-foreground": "#252525",
  "--destructive": "#e7000b",
  "--pad-tab": "calc(var(--spacing) * 3)",
  "--gap-text": "calc(var(--spacing) * 1)",
} as CSSProperties
