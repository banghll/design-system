/* 색을 CSS 에서 데이터로 옮긴다. 한 번만 도는 스크립트.
 *
 * 왜 옮기는가 — 파운데이션을 «더하고 지울 수 있게» 하려면 색이 어딘가
 * 편집 가능한 곳에 있어야 한다. 지금은 globals.css 의 :root 와 .dark 에
 * 손으로 적혀 있어서, 화면에서 색을 하나 더해도 그건 그 브라우저의
 * 인라인 스타일일 뿐이었다 — 새로고침하면 사라지고, 레포에는 남지 않고,
 * 컴포넌트 편집기의 «면 색» 목록에도 안 뜬다. 그래서 더해도 쓸 수가 없었다.
 *
 * 옮기고 나면 색도 간격·모서리와 같은 층에 선다.
 *   data/foundation.json  →  gen-tokens  →  globals.css 의 표시된 구획
 *
 * 실행: node scripts/migrate-colors.mjs
 */
import fs from "node:fs"

const CSS = "app/globals.css"
const FOUNDATION = "data/foundation.json"

const css = fs.readFileSync(CSS, "utf8")
const foundation = JSON.parse(fs.readFileSync(FOUNDATION, "utf8"))

if (foundation.color) {
  console.log("이미 옮겼다. 아무것도 하지 않는다.")
  process.exit(0)
}

/* 값이 색인 것만 고른다. --font-pretendard 처럼 :root 에 같이 사는
 * 다른 것들은 여기 대상이 아니다.
 *
 * var(--x) 는 여기서 «색» 으로 치지 않는다. 그렇게 열어 두면 생성 구획 안의
 * --button-md-height: var(--h-control) 같은 것까지 전부 색으로 딸려 온다
 * (실제로 처음에 32개가 아니라 240개가 옮겨졌다). 별칭인 색은 아래에서
 * 가리키는 이름이 이미 색일 때만 따로 받는다. */
const isColor = (v) => /^(oklch|rgb|hsl|#|color-mix)/i.test(v.trim())
const aliasTarget = (v) => /^var\(--([a-z0-9-]+)\)$/i.exec(v.trim())?.[1]

function block(name, start) {
  const a = css.indexOf(start)
  if (a < 0) throw new Error(`${name} 구획을 못 찾았다`)
  const b = css.indexOf("\n}", a)
  return { a, b, body: css.slice(a + start.length, b) }
}

/* 생성 구획은 통째로 뺀다. 저기 있는 것은 컴포넌트 토큰이고,
 * 그건 이 층의 값이 아니라 이 층을 «가리키는» 값이다. */
const GEN_BEGIN = "/* @generated:tokens"
const GEN_END = "/* @generated:tokens:end */"
function withoutGenerated(body) {
  const a = body.indexOf(GEN_BEGIN)
  if (a < 0) return body
  const b = body.indexOf(GEN_END, a)
  return body.slice(0, a) + body.slice(b + GEN_END.length)
}

function readVars(rawBody) {
  const body = withoutGenerated(rawBody)
  const out = new Map()
  const aliases = []
  for (const m of body.matchAll(/^\s*--([a-z0-9-]+):\s*([^;]+);/gim)) {
    const [, name, value] = m
    if (name.startsWith("font-")) continue
    const v = value.trim()
    if (isColor(v)) out.set(name, v)
    else if (aliasTarget(v)) aliases.push([name, v])
  }
  /* 별칭은 가리키는 이름이 색일 때만. --destructive-foreground: var(--primary-foreground) */
  for (const [name, v] of aliases) if (out.has(aliasTarget(v))) out.set(name, v)
  return out
}

const root = block(":root", ":root {")
const dark = block(".dark", ".dark {")
const light = readVars(root.body)
const darkVars = readVars(dark.body)

/* 설명은 편집기에서 쓰던 것을 그대로 가져온다 — 이름만 있고 «무엇에 쓰는가» 가
 * 없으면 팔레트가 아니라 색 목록이다. */
const DOC = {
  background: "페이지의 가장 바깥 면",
  foreground: "배경 위에 놓이는 기본 글자색",
  card: "배경에서 한 단계 올라온 면",
  "card-foreground": "카드 면 위의 글자",
  popover: "본문 위에 떠오르는 면",
  "popover-foreground": "떠오른 면 위의 글자",
  primary: "화면당 하나. 여기서 눌러야 하는 것",
  "primary-foreground": "주 액션 위에 얹히는 글자",
  secondary: "주 액션 옆의 낮은 강조",
  "secondary-foreground": "보조 면 위의 글자",
  muted: "비활성·배경 블록",
  "muted-foreground": "설명문·캡션. 본문보다 한 단계 낮게",
  accent: "hover·선택된 항목의 면",
  "accent-foreground": "강조 면 위의 글자",
  destructive: "되돌릴 수 없는 것에만",
  "destructive-foreground": "파괴적 액션 위의 글자",
  border: "요소를 가르는 기본 선",
  input: "값을 받는 자리의 테두리",
  ring: "키보드 사용자에게 지금 위치를 알린다",
  "chart-1": "계열 순서 = 의미 순서",
  sidebar: "앱 셸의 좌측 면",
}

const color = {
  $doc: "색. 라이트와 다크는 서로 다른 값이라 한 이름이 두 값을 갖는다.",
}
for (const [name, value] of light) {
  color[name] = {
    light: value,
    ...(darkVars.has(name) ? { dark: darkVars.get(name) } : {}),
    ...(DOC[name] ? { $doc: DOC[name] } : {}),
  }
}
/* 다크에만 있는 이름이 있으면 라이트를 비워 두지 않는다 — 한쪽만 있는 색은
 * 모드를 바꾸는 순간 사라지는 색이 된다. */
for (const [name, value] of darkVars) {
  if (!color[name]) color[name] = { light: value, dark: value }
}

foundation.color = color
fs.writeFileSync(FOUNDATION, JSON.stringify(foundation, null, 2) + "\n")

/* --- globals.css 에서 옮긴 줄을 걷어 내고 표시 구획을 남긴다 --- */
const names = Object.keys(color).filter((k) => !k.startsWith("$"))
const strip = (body) =>
  body
    .split("\n")
    .filter((line) => {
      const m = /^\s*--([a-z0-9-]+):/i.exec(line)
      return !(m && names.includes(m[1]))
    })
    .join("\n")

const ROOT_BEGIN = "  /* @generated:colors — data/foundation.json · node scripts/gen-tokens.mjs */"
const ROOT_END = "  /* @generated:colors:end */"
const DARK_BEGIN = "  /* @generated:colors:dark — 같은 이름의 다크 값 */"
const DARK_END = "  /* @generated:colors:dark:end */"
const THEME_BEGIN = "  /* @generated:theme — 색 이름을 Tailwind 유틸리티로 연다 */"
const THEME_END = "  /* @generated:theme:end */"

let next =
  css.slice(0, root.a + ":root {".length) +
  "\n" + ROOT_BEGIN + "\n" + ROOT_END +
  strip(root.body) +
  css.slice(root.b)

const dark2 = (() => {
  const a = next.indexOf(".dark {")
  const b = next.indexOf("\n}", a)
  return { a, b, body: next.slice(a + ".dark {".length, b) }
})()
next =
  next.slice(0, dark2.a + ".dark {".length) +
  "\n" + DARK_BEGIN + "\n" + DARK_END +
  strip(dark2.body) +
  next.slice(dark2.b)

/* @theme inline 의 --color-* 매핑도 생성 대상으로 만든다.
 * 여기에 이름이 없으면 bg-brand 같은 유틸리티가 안 생겨서, 색을 더해도
 * «클래스로는 못 쓰는 색» 이 된다. */
const themeA = next.indexOf("@theme inline {")
const themeB = themeA + "@theme inline {".length
const themeBody = next.slice(themeB, next.indexOf("\n}", themeA))
const strippedTheme = themeBody
  .split("\n")
  .filter((line) => {
    const m = /^\s*--color-([a-z0-9-]+):/i.exec(line)
    return !(m && names.includes(m[1]))
  })
  .join("\n")
next =
  next.slice(0, themeB) +
  "\n" + THEME_BEGIN + "\n" + THEME_END +
  strippedTheme +
  next.slice(next.indexOf("\n}", themeA))

fs.writeFileSync(CSS, next)
console.log(
  `색 ${names.length}개를 data/foundation.json 으로 옮겼다.\n` +
    `globals.css 에 구획 셋을 남겼다 — node scripts/gen-tokens.mjs 를 돌릴 것.`
)
