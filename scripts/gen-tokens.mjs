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
  "height", "paddingX", "radius", "fontSize", "gap", "surface", "surfaceForeground",
]
/* 크기와 무관하게 컴포넌트 전체에 걸리는 것 */
const FLAT_PROPS = ["radius", "gap", "surface", "surfaceForeground"]

const kebab = (p) =>
  p === "paddingX"
    ? "padding-x"
    : p === "fontSize"
      ? "font-size"
      : p === "surfaceForeground"
        ? "surface-foreground"
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

/* --- 끼워 넣기 --- */
const css = fs.readFileSync("app/globals.css", "utf8")
const a = css.indexOf(BEGIN)
const b = css.indexOf(END)
if (a < 0 || b < 0) {
  throw new Error(
    `app/globals.css 에 표시 구획이 없다. :root 안에 아래 두 줄을 넣을 것:\n${BEGIN}\n${END}`
  )
}

const next =
  css.slice(0, a + BEGIN.length) + "\n" + lines.join("\n") + "\n" + css.slice(b)

fs.writeFileSync("app/globals.css", next)
console.log(
  `globals.css — 파운데이션 4 · 컴포넌트 변수 ${count}개 (${
    Object.keys(components).filter((k) => !k.startsWith("$")).length
  }개 컴포넌트)`
)
