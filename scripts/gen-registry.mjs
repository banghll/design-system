/* design-system.json 을 생성한다.
 *
 * 왜 필요한가 — 이 레포에는 컴포넌트 60개, 패턴 74개, 블록 200여 개가 있는데
 * 그 목록은 «렌더된 웹사이트» 로만 존재했다. 새 화면을 짤 때 사람은 브라우저를
 * 열어 훑어보면 되지만, 에이전트는 그럴 수 없다. 무엇이 있는지 한 파일로
 * 읽을 수 없으면 결국 «Tailwind 로 새로 짜는 쪽» 이 언제나 더 싸다.
 * 실제로 그렇게 됐다 — /reel 첫 판은 이미 있는 InputGroup·Item·Bubble 대신
 * div 를 새로 짰다.
 *
 * 그래서 목록을 기계가 읽는 형태로 낸다. 이 파일이 정본이 아니라 «색인» 이다.
 * 정본은 언제나 코드 쪽이고, 여기 있는 값은 전부 코드에서 뽑아낸다.
 *
 * 실행: node scripts/gen-registry.mjs
 */
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const read = (p) => fs.readFileSync(path.join(root, p), "utf8")

/* ── 토큰 ───────────────────────────────────────────────
 * :root 에 적힌 것만 센다. @theme inline 은 파생이라 «고칠 수 있는 값» 이 아니다. */
function tokens() {
  const css = read("app/globals.css")
  const rootBlock = css.slice(css.indexOf(":root {"), css.indexOf("\n}", css.indexOf(":root {")))
  const out = {}
  for (const m of rootBlock.matchAll(/^\s*(--[a-z0-9-]+):\s*([^;]+);/gim)) {
    out[m[1]] = m[2].trim()
  }
  const pick = (re) =>
    Object.fromEntries(Object.entries(out).filter(([k]) => re.test(k)))
  return {
    color: pick(/^--(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|chart|sidebar)/),
    shape: pick(/^--(radius|spacing-base)/),
    control: pick(/^--(h-|pad-|gap-)/),
    type: pick(/^--font-/),
  }
}

/* ── 컴포넌트 ───────────────────────────────────────────
 * 설명은 gen-components.mjs 의 DOC 이 정본이다. 두 벌로 적으면 갈라진다. */
function componentDocs() {
  const src = read("scripts/gen-components.mjs")
  const a = src.indexOf("const DOC = {")
  const b = src.indexOf("\n}\n", a)
  const body = src.slice(a, b + 2).replace("const DOC =", "")
  // 안전하게 JSON 으로 못 바꾸므로, 키와 네 문장만 훑는다
  const docs = {}
  const re = /^\s{2}"?([a-z0-9-]+)"?:\s*\[\s*\n\s*"((?:[^"\\]|\\.)*)",\s*\n\s*"((?:[^"\\]|\\.)*)",\s*\n\s*"((?:[^"\\]|\\.)*)",\s*\n\s*"((?:[^"\\]|\\.)*)",\s*\n\s*\]/gm
  for (const m of body.matchAll(re)) {
    docs[m[1]] = {
      what: { ko: m[2], en: m[4] },
      when: { ko: m[3], en: m[5] },
    }
  }
  return docs
}

function components() {
  const docs = componentDocs()
  const groups = {}
  const gsrc = read("scripts/gen-components.mjs")
  const ga = gsrc.indexOf("const GROUPS = [")
  const gb = gsrc.indexOf("\n]", ga)
  for (const m of gsrc.slice(ga, gb).matchAll(/\["([a-z-]+)",\s*\[([^\]]*)\]\]/g)) {
    for (const id of m[2].matchAll(/"([^"]+)"/g)) groups[id[1]] = m[1]
  }

  const dir = "components/ui"
  return fs
    .readdirSync(path.join(root, dir))
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => {
      const id = f.replace(/\.tsx$/, "")
      const src = read(`${dir}/${f}`)
      const ex = new Set()
      for (const m of src.matchAll(/^export\s*\{([^}]*)\}/gm)) {
        for (const n of m[1].split(",")) {
          const name = n.trim().split(/\s+as\s+/).pop()
          if (name && /^[A-Za-z]/.test(name)) ex.add(name)
        }
      }
      for (const m of src.matchAll(/^export function ([A-Za-z0-9_]+)/gm)) ex.add(m[1])

      /* 크기 · 변형은 cva 에서 뽑는다. «size 를 쓸 수 있나» 는 조립할 때
       * 가장 먼저 묻는 것이고, 파일을 열어야만 알 수 있으면 안 물어본다. */
      const variants = {}
      const va = src.indexOf("variants: {")
      if (va > -1) {
        const chunk = src.slice(va, va + 2500)
        for (const m of chunk.matchAll(/^\s{6}([a-zA-Z]+):\s*\{([\s\S]*?)^\s{6}\},/gm)) {
          const keys = [...m[2].matchAll(/^\s{8}"?([a-zA-Z-]+)"?:/gm)].map((k) => k[1])
          if (keys.length) variants[m[1]] = keys
        }
      }

      const example = fs.existsSync(
        path.join(root, `components/examples/${id}-example.tsx`)
      )
        ? `components/examples/${id}-example.tsx`
        : null

      return {
        id,
        group: groups[id] ?? null,
        import: `@/components/ui/${id}`,
        file: `${dir}/${f}`,
        exports: [...ex].sort(),
        variants,
        example,
        doc: docs[id] ?? null,
      }
    })
}

/* ── 패턴 ───────────────────────────────────────────────
 * 컴포넌트를 조립해 한 가지 쓰임을 푼 것. 새 화면은 여기서 시작하는 게 맞다. */
function patterns() {
  const src = read("app/patterns/page.tsx")
  const out = []
  const re =
    /\{ id: "([^"]+)", group: "([^"]+)", title: "((?:[^"\\]|\\.)*)", note: \{ ko: "((?:[^"\\]|\\.)*)", en: "((?:[^"\\]|\\.)*)" \}, src: "([^"]+)", wide: (true|false), Comp: (P\d+) \}/g
  for (const m of src.matchAll(re)) {
    /* 패턴은 이름을 바꿔 들여온다 — import { AccountAccess as P0 } from "…" */
    const importLine = src.match(
      new RegExp(`import \{ ([A-Za-z0-9_]+) as ${m[8]} \} from "([^"]+)"`)
    )
    out.push({
      id: m[1],
      group: m[2],
      title: m[3],
      note: { ko: m[4], en: m[5] },
      wide: m[7] === "true",
      export: importLine?.[1] ?? null,
      import: importLine?.[2] ?? null,
    })
  }
  return out
}

/* ── 블록 ───────────────────────────────────────────────
 * 화면 한 벌. 통째로 가져다 고치는 용도라 목록과 경로만 있으면 된다. */
function blocks() {
  const out = []
  const own = read("lib/block-catalog.ts")
  for (const m of own.matchAll(/id:\s*"([^"]+)"[\s\S]{0,200}?group:\s*"([^"]+)"/g)) {
    out.push({ id: m[1], group: m[2], kind: "shadcn", route: `/blocks/view/${m[1]}` })
  }
  const third = read("lib/third-party-catalog.ts")
  for (const m of third.matchAll(/id:\s*"([^"]+)"[\s\S]{0,300}?source:\s*"([^"]+)"/g)) {
    out.push({ id: m[1], kind: "third-party", source: m[2], route: `/blocks/view3p/${m[1]}` })
  }
  return out
}

const registry = {
  $schema: "https://nation-a.local/design-system-registry",
  version: 1,
  /* 날짜는 넣지 않는다. 매번 바뀌면 실제로 바뀐 게 없는데도 diff 가 생긴다. */
  rule: "새 화면은 이 목록에서 고른다. 여기 없는 것을 새로 만들기 전에 반드시 보고한다.",
  tokens: tokens(),
  components: components(),
  patterns: patterns(),
  blocks: blocks(),
}

fs.writeFileSync(
  path.join(root, "design-system.json"),
  JSON.stringify(registry, null, 2) + "\n"
)

console.log(
  `design-system.json — 컴포넌트 ${registry.components.length} · 패턴 ${registry.patterns.length} · 블록 ${registry.blocks.length} · 토큰 ${
    Object.values(registry.tokens).reduce((n, g) => n + Object.keys(g).length, 0)
  }`
)
