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
}

/** 여는 속성. 다섯 개로 못 박는다 — 더 열면 토큰이 아니라 그냥 CSS다. */
export const OPEN_PROPS = [
  "height",
  "paddingX",
  "radius",
  "fontSize",
  "gap",
] as const

export type OpenProp = (typeof OPEN_PROPS)[number]

export type ComponentRecipe = {
  radius?: string
  gap?: string
  sizes?: Record<string, Partial<Record<OpenProp, string>>>
}

export type Components = Record<string, ComponentRecipe>

/** CSS 변수 이름. 이 함수 하나만 보면 이름 규칙이 전부 보인다. */
export function varName(component: string, prop: OpenProp, size?: string) {
  const kebab = prop === "paddingX" ? "padding-x" : prop === "fontSize" ? "font-size" : prop
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
  for (const prop of ["radius", "gap"] as const) {
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
