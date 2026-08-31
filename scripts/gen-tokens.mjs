/* data/foundation.json + data/components.json → app/globals.css
 *
 * globals.css 를 통째로 쓰지 않고, 표시해 둔 구획만 갈아 끼운다.
 * 색·다크모드·애니메이션은 사람이 손으로 관리하는 것이라 건드리면 안 된다.
 *
 * 실행: node scripts/gen-tokens.mjs
 */
import fs from "node:fs"

const BEGIN = "  /* @generated:tokens — node scripts/gen-tokens.mjs. 직접 고치지 말 것 */"
const END = "  /* @generated:tokens:end */"

const foundation = JSON.parse(fs.readFileSync("data/foundation.json", "utf8"))
const components = JSON.parse(fs.readFileSync("data/components.json", "utf8"))

/* --- lib/tokens.ts 와 같은 규칙 (ts 를 node 에서 직접 못 읽어 옮겨 적는다).
 *     바뀌면 양쪽을 함께 고친다 — 아래 자체 검사가 어긋나면 멈춘다. --- */
const OPEN_PROPS = [
  "height", "paddingX", "radius", "fontSize", "gap",
  "surface", "surfaceForeground", "activeSurface", "activeSurfaceForeground",
]
/* 크기와 무관하게 컴포넌트 전체에 걸리는 것 */
const FLAT_PROPS = [
  "radius", "gap", "surface", "surfaceForeground",
  "activeSurface", "activeSurfaceForeground",
]

const kebab = (p) =>
  p === "paddingX"
    ? "padding-x"
    : p === "fontSize"
      ? "font-size"
      : p === "surfaceForeground"
        ? "surface-foreground"
        : p === "activeSurface"
          ? "active-surface"
          : p === "activeSurfaceForeground"
            ? "active-surface-foreground"
            : p

const varName = (c, p, size) =>
  size ? `--${c}-${size}-${kebab(p)}` : `--${c}-${kebab(p)}`

function resolveRef(ref) {
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

/* --- 파운데이션 --- */
const lines = []
lines.push("  /* 파운데이션 — data/foundation.json */")
lines.push(`  --spacing-base: ${foundation.spacing.base};`)
lines.push(`  --radius: ${foundation.radius.base};`)
lines.push(`  --h-control: ${resolveRef(foundation.control.height)};`)
lines.push(`  --pad-control: ${resolveRef(foundation.control.paddingX)};`)

/* --- 컴포넌트 --- */
let count = 0
for (const [name, recipe] of Object.entries(components)) {
  if (name.startsWith("$")) continue
  lines.push("")
  lines.push(`  /* ${name} — ${recipe.$doc ?? ""} */`)

  for (const prop of FLAT_PROPS) {
    if (!recipe[prop]) continue
    lines.push(`  ${varName(name, prop)}: ${resolveRef(recipe[prop])};`)
    count++
  }
  for (const [size, props] of Object.entries(recipe.sizes ?? {})) {
    for (const prop of OPEN_PROPS) {
      const ref = props[prop]
      if (!ref) continue
      lines.push(`  ${varName(name, prop, size)}: ${resolveRef(ref)};`)
      count++
    }
  }
}

/* --- 색 ---
 *
 * 색도 이 층의 값이다. 예전에는 globals.css 에 손으로 적혀 있어서,
 * 화면에서 색을 더해도 그 브라우저의 인라인 스타일로만 남았다 —
 * 새로고침하면 사라지고, 컴포넌트 편집기의 «면 색» 목록에도 안 떴다.
 * 여기서 만들어 내면 더한 색이 다른 색들과 똑같은 자격을 갖는다. */
const colors = Object.entries(foundation.color ?? {}).filter(([k]) => !k.startsWith("$"))

const lightLines = []
const darkLines = []
const themeLines = []
for (const [name, def] of colors) {
  if (def.$doc) lightLines.push(`  /* ${def.$doc} */`)
  lightLines.push(`  --${name}: ${def.light};`)
  /* 다크 값이 없으면 라이트를 그대로 쓴다 — 한쪽만 적힌 색을 만들지 않는다. */
  if (def.dark && def.dark !== def.light) darkLines.push(`  --${name}: ${def.dark};`)
  themeLines.push(`  --color-${name}: var(--${name});`)
}

/* --- 끼워 넣기 --- */
let css = fs.readFileSync("app/globals.css", "utf8")

function splice(source, begin, end, body, what) {
  const a = source.indexOf(begin)
  const b = source.indexOf(end)
  if (a < 0 || b < 0) {
    throw new Error(
      `app/globals.css 에 ${what} 구획이 없다. 아래 두 줄을 넣을 것:\n${begin}\n${end}`
    )
  }
  return source.slice(0, a + begin.length) + "\n" + body.join("\n") + "\n" + source.slice(b)
}

css = splice(css, BEGIN, END, lines, "@generated:tokens")
css = splice(
  css,
  "  /* @generated:colors — data/foundation.json · node scripts/gen-tokens.mjs */",
  "  /* @generated:colors:end */",
  lightLines,
  "@generated:colors"
)
css = splice(
  css,
  "  /* @generated:colors:dark — 같은 이름의 다크 값 */",
  "  /* @generated:colors:dark:end */",
  darkLines,
  "@generated:colors:dark"
)
css = splice(
  css,
  "  /* @generated:theme — 색 이름을 Tailwind 유틸리티로 연다 */",
  "  /* @generated:theme:end */",
  themeLines,
  "@generated:theme"
)

fs.writeFileSync("app/globals.css", css)
console.log(
  `globals.css — 파운데이션 4 · 색 ${colors.length}개 · 컴포넌트 변수 ${count}개 (${
    Object.keys(components).filter((k) => !k.startsWith("$")).length
  }개 컴포넌트)`
)
