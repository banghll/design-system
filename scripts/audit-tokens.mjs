/* 편집 패널이 «거짓말» 을 하고 있는지 검사한다.
 *
 * 레시피에 슬롯이 있으면 편집 패널에는 그 줄이 생긴다. 그런데 그 이름을
 * 실제 컴포넌트 코드가 쓰지 않으면, 값을 바꿔도 화면은 그대로다.
 * 사용자에게는 «고장» 으로 보이고, 실제로도 고장이다 —
 * 열어 놓은 손잡이가 아무 데도 연결돼 있지 않은 것이다.
 *
 * 이 검사는 그 어긋남을 숫자로 만든다. 슬롯마다 CSS 변수 이름을 만들고,
 * 그 이름을 코드(components · app · lib)가 실제로 읽는지 본다.
 * 읽지 않으면 «죽은 슬롯» 이다.
 *
 * 실행: npm run audit          — 요약과 죽은 슬롯 목록
 *       npm run audit -- --json — 기계가 읽을 형태
 *       npm run audit -- --strict — 죽은 슬롯이 하나라도 있으면 exit 1 (CI 용)
 *
 * $wired 플래그는 사람이 손으로 적는 «주장» 이고, 이 검사는 «사실» 이다.
 * 둘이 어긋나면 플래그를 고친다 — 검사를 고치는 게 아니라.
 */
import fs from "node:fs"
import path from "node:path"

const args = process.argv.slice(2)
const asJson = args.includes("--json")
const strict = args.includes("--strict")

const components = JSON.parse(fs.readFileSync("data/components.json", "utf8"))
const globals = fs.readFileSync("app/globals.css", "utf8")

/* lib/tokens.ts 와 같은 규칙. 바뀌면 함께 고친다. */
const OPEN_PROPS = [
  "height", "paddingX", "radius", "fontSize", "gap",
  "surface", "surfaceForeground", "activeSurface", "activeSurfaceForeground",
]
const FLAT_PROPS = [
  "radius", "gap", "surface", "surfaceForeground",
  "activeSurface", "activeSurfaceForeground",
]
const kebab = (p) =>
  p === "paddingX" ? "padding-x"
  : p === "fontSize" ? "font-size"
  : p === "surfaceForeground" ? "surface-foreground"
  : p === "activeSurface" ? "active-surface"
  : p === "activeSurfaceForeground" ? "active-surface-foreground"
  : p
const varName = (c, p, size) => (size ? `--${c}-${size}-${kebab(p)}` : `--${c}-${kebab(p)}`)

/* 코드를 모은다. globals.css 는 «선언하는 쪽» 이라 소비자에서 뺀다 —
 * 선언만으로 «쓰인다» 고 세면 전부 통과해 버려 검사가 무의미해진다. */
const sources = []
const files = []
const skip = new Set(["node_modules", ".next", "out", ".git"])
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.(tsx|ts|jsx|js|css)$/.test(e.name) && p !== path.join("app", "globals.css")) {
      files.push(p)
      sources.push(fs.readFileSync(p, "utf8"))
    }
  }
}
for (const root of ["components", "app", "lib"]) if (fs.existsSync(root)) walk(root)
const haystack = sources.join("\n")

/* 이어 놓고도 안 먹는 두 번째 경우 — 뒤에 남은 리터럴이 토큰을 덮는다.
 *
 * cn() 은 tailwind-merge 를 쓴다. 같은 갈래의 유틸리티가 둘이면 «뒤엣것» 만
 * 남는다. text-(--dialog-surface-foreground) 뒤에 text-popover-foreground 가
 * 남아 있으면 토큰은 통째로 버려진다 — 코드에 이름은 있으니 위의 검사는
 * 통과하는데, 화면은 안 바뀐다. 이어 붙이는 작업에서 제일 놓치기 쉬운 자리라
 * 검사에 넣어 둔다. */
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const FONT_SIZE_LITERAL = /^text-(xs|sm|base|lg|xl|[2-9]xl|\[)/
const NOT_A_COLOR =
  /^text-(left|right|center|justify|start|end|nowrap|wrap|balance|pretty|ellipsis|clip|current|transparent|inherit)$/
/* bg- 로 시작한다고 다 배경색이 아니다. bg-clip-padding 은 background-clip 이라
 * 색과 갈래가 달라 서로 덮지 않는다 — 여기 안 걸러 두면 멀쩡한 자리가 걸린다. */
const NOT_A_BG =
  /^bg-(clip|origin|repeat|no-repeat|cover|contain|center|top|bottom|left|right|fixed|local|scroll|gradient|blend|none|auto)/
const overridden = []
for (const file of files) {
  const src = fs.readFileSync(file, "utf8")
  src.split("\n").forEach((line, i) => {
    for (const tok of line.match(/[a-z-]+\((?:length:)?--[a-z0-9-]+\)/g) ?? []) {
      const prefix = tok.slice(0, tok.indexOf("("))
      const isFontSize = tok.includes("(length:")
      const after = line.slice(line.indexOf(tok) + tok.length)
      const literals = (after.match(new RegExp(`[\\s"']${escape(prefix)}(?![(])[a-z0-9./\\[\\]%-]+`, "g")) ?? [])
        .map((s) => s.trim())
        /* 변형(hover: · dark:)은 갈래가 달라 덮지 않는다 */
        .filter((s) => !s.includes(":"))
        .filter((s) => {
          if (prefix === "bg-") return !NOT_A_BG.test(s)
          if (prefix !== "text-") return true
          if (NOT_A_COLOR.test(s)) return false
          return isFontSize === FONT_SIZE_LITERAL.test(s)
        })
      if (literals.length) overridden.push({ file, line: i + 1, tok, literals })
    }
  })
}

const rows = []
for (const [id, recipe] of Object.entries(components)) {
  if (id.startsWith("$")) continue
  const slots = []
  for (const p of FLAT_PROPS) {
    if (recipe[p]) slots.push({ label: p, v: varName(id, p) })
  }
  for (const [size, props] of Object.entries(recipe.sizes ?? {})) {
    for (const p of OPEN_PROPS) {
      if (props[p]) slots.push({ label: `${size}.${p}`, v: varName(id, p, size) })
    }
  }
  const live = slots.filter((s) => haystack.includes(s.v))
  const dead = slots.filter((s) => !haystack.includes(s.v))
  const undeclared = slots.filter((s) => !globals.includes(`${s.v}:`))
  rows.push({
    id,
    claimsWired: recipe.$wired !== false,
    slots: slots.length,
    live: live.map((s) => s.label),
    dead: dead.map((s) => s.label),
    undeclared: undeclared.map((s) => s.label),
  })
}

const totals = {
  components: rows.length,
  slots: rows.reduce((n, r) => n + r.slots, 0),
  liveSlots: rows.reduce((n, r) => n + r.live.length, 0),
  deadSlots: rows.reduce((n, r) => n + r.dead.length, 0),
  fully: rows.filter((r) => r.slots && r.dead.length === 0).length,
  partly: rows.filter((r) => r.dead.length && r.live.length).length,
  none: rows.filter((r) => r.slots && !r.live.length).length,
  /* 슬롯이 하나도 없는 것은 «고장» 이 아니다. 자기 스타일을 갖지 않는
   * 구조 컴포넌트라 편집할 값이 없는 것이고, 그건 정직한 상태다. */
  empty: rows.filter((r) => !r.slots).length,
}
/* 플래그와 사실이 어긋나는 것. 여기 걸린 것은 UI 가 사용자에게 거짓을 말한다. */
const lying = rows.filter((r) => r.claimsWired !== (r.dead.length === 0))

if (asJson) {
  console.log(JSON.stringify({ totals, rows, overridden, lying: lying.map((r) => r.id) }, null, 2))
} else {
  const pct = ((totals.liveSlots / totals.slots) * 100).toFixed(1)
  console.log(
    `슬롯 ${totals.liveSlots}/${totals.slots} 연결됨 (${pct}%) — ` +
      `컴포넌트 전부 ${totals.fully} · 일부 ${totals.partly} · 전혀 ${totals.none} · 편집값 없음 ${totals.empty}`
  )
  if (totals.none) {
    console.log("\n■ 편집해도 화면이 전혀 안 바뀌는 컴포넌트")
    for (const r of rows.filter((x) => x.slots && !x.live.length))
      console.log(`  ${r.id.padEnd(18)} 죽은 슬롯 ${r.dead.length}개`)
  }
  if (totals.partly) {
    console.log("\n■ 일부만 반영되는 컴포넌트")
    for (const r of rows.filter((x) => x.dead.length && x.live.length))
      console.log(`  ${r.id.padEnd(18)} 안 먹는 것: ${r.dead.join(" ")}`)
  }
  const undeclared = rows.filter((r) => r.undeclared.length)
  if (undeclared.length) {
    console.log("\n■ globals.css 에 선언조차 없는 슬롯 — npm run gen 을 돌릴 것")
    for (const r of undeclared) console.log(`  ${r.id.padEnd(18)} ${r.undeclared.join(" ")}`)
  }
  if (overridden.length) {
    console.log("\n■ 토큰이 뒤의 리터럴에 덮이는 자리 (이름은 있는데 안 먹는다)")
    for (const o of overridden)
      console.log(`  ${o.file}:${o.line}  ${o.tok} ← ${o.literals.join(" ")}`)
  }
  if (lying.length) {
    console.log("\n■ $wired 플래그가 사실과 다른 것 (UI 가 거짓을 말한다)")
    for (const r of lying)
      console.log(
        `  ${r.id.padEnd(18)} $wired=${r.claimsWired} 인데 죽은 슬롯 ${r.dead.length}개`
      )
  }
  if (!totals.deadSlots) console.log("\n죽은 슬롯 없음. 편집 패널의 모든 줄이 실제로 화면을 바꾼다.")
}

if (strict && (totals.deadSlots || overridden.length)) process.exit(1)
