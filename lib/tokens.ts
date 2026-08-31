/* 토큰 두 층을 읽고 푸는 곳.
 *
 * 층이 둘인 이유 — 파운데이션은 «값이 적히는 자리»이고 컴포넌트는 «그 값을 어떻게
 * 쓰는가»다. 예전에는 --h-button 같은 것이 :root 에 섞여 있어서, 버튼 하나를 손보려면
 * 전역을 건드려야 했다. 그러면 그게 전역인지 버튼 것인지 아무도 모르게 된다.
 *
 * 컴포넌트 값은 반드시 파운데이션을 가리킨다. 리터럴을 허용하면 첫날부터
 * 한두 개가 새고, 반년 뒤에는 파운데이션이 아무것도 정하지 못한다.
 *
 * 이 파일은 생성 스크립트(node)와 브라우저(편집 패널)가 함께 쓴다. */

export type Foundation = {
  spacing: { base: string }
  radius: { base: string }
  control: { height: string; paddingX: string }
  text: Record<string, string>
  /* 색도 이 층의 값이다. 여기 있어야 컴포넌트 편집기가 «고를 수 있는 면 색» 을
   * 손으로 적어 두지 않고 파운데이션에서 읽어 온다 — 색을 더하면 바로 쓸 수 있게. */
  color?: Record<string, { light: string; dark?: string; $doc?: string }>
}

/** 여는 속성. 이 목록 밖은 열지 않는다 — 더 열면 토큰이 아니라 그냥 CSS다. */
export const OPEN_PROPS = [
  "height",
  "paddingX",
  "radius",
  "fontSize",
  "gap",
  /* 면 색. 탭 띠나 배지처럼 «이 면이 무슨 색인가» 가 컴포넌트의 정체성인 것들이
   * 있는데, 파운데이션에서 --muted 를 찾아 바꾸는 길밖에 없었다. 어느 컴포넌트가
   * 어느 색을 쓰는지 화면에서 보이지 않으면 그건 편집할 수 있는 게 아니다. */
  "surface",
  "surfaceForeground",
  /* 골라진 상태의 면. 탭·토글처럼 «지금 이거» 를 색으로 말하는 것들은
   * 고른 면의 색이 안 열리면 절반만 편집할 수 있는 셈이다. */
  "activeSurface",
  "activeSurfaceForeground",
] as const

/** 크기 계열과 색 계열은 고르는 방식이 다르다 */
export const COLOR_PROPS = [
  "surface",
  "surfaceForeground",
  "activeSurface",
  "activeSurfaceForeground",
] as const

export type OpenProp = (typeof OPEN_PROPS)[number]

export type ComponentRecipe = {
  /** 크기와 무관하게 이 컴포넌트 전체에 걸리는 값 */
  radius?: string
  gap?: string
  surface?: string
  surfaceForeground?: string
  activeSurface?: string
  activeSurfaceForeground?: string
  sizes?: Record<string, Partial<Record<OpenProp, string>>>
  /** 화면 설명용 — 색인과 상세 페이지가 읽는다 */
  $doc?: string
  /** 이 레시피가 실제 컴포넌트 코드에 연결돼 있는가 */
  $wired?: boolean
}

export type Components = Record<string, ComponentRecipe>

/** CSS 변수 이름. 이 함수 하나만 보면 이름 규칙이 전부 보인다. */
export function varName(component: string, prop: OpenProp, size?: string) {
  const kebab =
    prop === "paddingX"
      ? "padding-x"
      : prop === "fontSize"
        ? "font-size"
        : prop === "surfaceForeground"
          ? "surface-foreground"
          : prop === "activeSurface"
            ? "active-surface"
            : prop === "activeSurfaceForeground"
              ? "active-surface-foreground"
              : prop
  return size ? `--${component}-${size}-${kebab}` : `--${component}-${kebab}`
}

/**
 * 참조를 CSS 값으로 푼다.
 *
 *   spacing.9        → calc(var(--spacing) * 9)
 *   radius.md        → var(--radius-md)
 *   text.sm          → var(--text-sm)
 *   control.height   → var(--h-control)
 *
 * 못 알아듣는 것은 조용히 넘기지 않고 던진다. 오타 하나가 «왜 안 바뀌지» 로
 * 바뀌어 돌아오는 것보다, 생성할 때 멈추는 편이 싸다.
 */
export function resolveRef(ref: string): string {
  const [ns, ...rest] = ref.split(".")
  const key = rest.join(".")

  switch (ns) {
    case "spacing": {
      const n = Number(key)
      if (!Number.isFinite(n)) throw new Error(`spacing 참조가 숫자가 아니다: ${ref}`)
      return `calc(var(--spacing) * ${n})`
    }
    case "radius":
      return key === "base" ? "var(--radius)" : `var(--radius-${key})`
    case "text":
      return `var(--text-${key})`
    case "color":
      return `var(--${key})`
    case "control":
      if (key === "height") return "var(--h-control)"
      if (key === "paddingX") return "var(--pad-control)"
      throw new Error(`control 에는 height · paddingX 만 있다: ${ref}`)
    default:
      throw new Error(
        `모르는 참조 «${ref}». 리터럴은 쓸 수 없다 — foundation 에 이름을 먼저 만들 것.`
      )
  }
}

/** 참조가 실제 px 로 얼마인지. 편집 패널이 «지금 몇 px 인가» 를 보여 줄 때 쓴다. */
export function refToPx(ref: string, f: Foundation, rootFontPx = 16): number | null {
  const rem = (v: string) => {
    const m = /^([\d.]+)rem$/.exec(v.trim())
    return m ? parseFloat(m[1]) * rootFontPx : null
  }
  const [ns, ...rest] = ref.split(".")
  const key = rest.join(".")
  const spacingPx = rem(f.spacing.base) ?? 4
  const radiusPx = rem(f.radius.base) ?? 10

  switch (ns) {
    case "spacing":
      return Number(key) * spacingPx
    case "radius": {
      const step: Record<string, number> = {
        base: 0, sm: -4, md: -2, lg: 0, xl: 4, "2xl": 8, "3xl": 14, "4xl": 22,
      }
      return radiusPx + (step[key] ?? 0)
    }
    case "text":
      return rem(f.text[key] ?? "")
    case "color":
      return null
    case "control":
      return key === "height"
        ? refToPx(f.control.height, f, rootFontPx)
        : refToPx(f.control.paddingX, f, rootFontPx)
    default:
      return null
  }
}

/** 한 컴포넌트의 레시피를 CSS 변수 목록으로 편다. */
export function flatten(
  name: string,
  recipe: ComponentRecipe
): { name: string; ref: string; prop: OpenProp; size?: string }[] {
  const out: { name: string; ref: string; prop: OpenProp; size?: string }[] = []
  for (const prop of [
    "radius",
    "gap",
    "surface",
    "surfaceForeground",
    "activeSurface",
    "activeSurfaceForeground",
  ] as const) {
    const ref = recipe[prop]
    if (ref) out.push({ name: varName(name, prop), ref, prop })
  }
  for (const [size, props] of Object.entries(recipe.sizes ?? {})) {
    for (const prop of OPEN_PROPS) {
      const ref = props[prop]
      if (ref) out.push({ name: varName(name, prop, size), ref, prop, size })
    }
  }
  return out
}
