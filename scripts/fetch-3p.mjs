/* 서드파티 블록을 격리해서 받아온다.
 *
 * `npx shadcn add <url>` 을 그냥 쓰면 그 레지스트리가 들고 온 components/ui/*.tsx 가
 * 우리 것을 덮어쓴다 — 남의 button.tsx 가 우리 button.tsx 를 대체하면
 * 시스템 전체가 조용히 갈라진다. 그래서 직접 받아서 격리한다.
 *
 *  · registry:ui 는 버린다. 우리 컴포넌트를 쓴다.
 *  · registry:block / component / page 만 가져와 3p/<출처>/<이름>/ 에 둔다.
 *  · import 경로를 우리 것으로 고쳐 쓴다.
 *
 * 사용:  node scripts/fetch-3p.mjs <출처키> <레지스트리 URL 템플릿> <이름...>
 * 예:    node scripts/fetch-3p.mjs launch "https://www.launchuicomponents.com/r/{name}.json" hero faq
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

/* 우리가 이미 가진 ui 컴포넌트 이름. 이름이 겹치면 우리 것을 쓴다. */
const OURS = new Set(
  readdirSync("components/ui")
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(/\.tsx$/, ""))
)

const [source, template, ...names] = process.argv.slice(2)
if (!source || !template || !names.length) {
  console.error("사용법: node scripts/fetch-3p.mjs <출처키> <URL템플릿> <이름...>")
  process.exit(1)
}

const ROOT = `components/3p/${source}`

/* 이 레지스트리들이 쓰는 경로를 우리 경로로 옮긴다.
 * 남의 ui 컴포넌트는 안 받으므로, 그 import 는 전부 우리 것을 가리키게 한다. */
/* 한 블록의 파일을 폴더 하나로 눌러 담는다. 그러면 경로 규칙이 아주 단순해진다 —
 * 이름이 우리 것과 겹치는 ui 컴포넌트는 우리 것을 가리키고, 나머지는 전부 형제(./)다.
 * 레지스트리마다 자기만의 깊은 경로(@/components/shadcn-space/blocks/... , @/assets/...)를
 * 쓰는데, 어차피 평평하게 담으므로 마지막 조각만 남기면 된다. */
function rewrite(code, name) {
  const flatten = (spec) => {
    if (spec === "@/lib/utils") return spec
    const stem = spec.split("/").filter(Boolean).pop()
    return OURS.has(stem) ? `@/components/ui/${stem}` : `./${stem}`
  }
  return code.replace(
    /(from\s+|import\s*\(\s*)(["'])((?:@\/|\.{1,2}\/)[^"']+)\2/g,
    (_m, head, q, spec) => `${head}${q}${flatten(spec)}${q}`
  )
}

/* 지우기로 한 블록은 다시 가져오지 않는다.
 * 이 목록이 없으면 스크립트를 한 번 더 돌리는 순간 전부 되살아난다 —
 * "안 쓰기로 했다" 는 결정이 파일 삭제보다 오래 살아야 한다. */
const REMOVED = new Set(
  existsSync("data/removed-blocks.json")
    ? JSON.parse(readFileSync("data/removed-blocks.json", "utf8")).removed
    : []
)

const skipped = []
const written = []
const missing = []

/* 이름 앞에 + 를 붙인 항목은 목록에 올리지 않고 부품 창고로만 쓴다.
 * 레지스트리들은 블록이 쓰는 공용 파일(section · footer 껍데기 같은 것)을
 * 별도 항목에 몰아 두는 일이 많다. 그것까지 받아야 블록이 실제로 그려진다. */
const pool = new Map()
const poolNames = names.filter((n) => n.startsWith("+")).map((n) => n.slice(1))
const blockNames = names.filter((n) => !n.startsWith("+"))

for (const name of poolNames) {
  try {
    const res = await fetch(template.replace("{name}", name))
    if (!res.ok) {
      skipped.push(`+${name} — HTTP ${res.status}`)
      continue
    }
    const item = await res.json()
    for (const f of item.files ?? []) {
      if (!f.content) continue
      const stem = f.path.split("/").pop().replace(/\.tsx?$/, "")
      if (!pool.has(stem)) pool.set(stem, f.content)
    }
  } catch (e) {
    skipped.push(`+${name} — ${e.message}`)
  }
}
if (pool.size) console.log(`  부품 창고 ${pool.size}개 (${poolNames.join(", ")})`)

for (const name of blockNames) {
  if (REMOVED.has(`${source}-${name}`)) {
    skipped.push(`${name} — 지우기로 한 블록`)
    continue
  }
  const url = template.replace("{name}", name)
  let item
  try {
    const res = await fetch(url)
    if (!res.ok) {
      skipped.push(`${name} — HTTP ${res.status}`)
      continue
    }
    item = await res.json()
  } catch (e) {
    skipped.push(`${name} — ${e.message}`)
    continue
  }

  const files = item.files ?? []
  let count = 0

  for (const f of files) {
    if (!f.content) continue
    const base = f.path.split("/").pop()
    const stem = base.replace(/\.tsx?$/, "")

    /* 이름이 우리 것과 겹치는 ui 컴포넌트만 버린다.
     * 남의 button.tsx 가 우리 것을 덮으면 시스템이 조용히 갈라진다.
     * 반대로 우리에게 없는 것(glow · mockup · screenshot 같은 그 레포 고유 부품)은
     * 가져와야 블록이 실제로 그려진다 — 다만 3p/ 안에 가둬 둔다. */
    if (f.type === "registry:ui" && OURS.has(stem)) {
      skipped.push(`${name}/${base} — 우리 것과 이름이 겹쳐 우리 것을 쓴다`)
      continue
    }

    const out = join(ROOT, name, base)
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, rewrite(f.content, name, stem), "utf8")
    count++
  }

  /* 이 항목이 부르는 ./형제 가 실제로 있는지 확인하고, 없으면 창고에서 데려온다.
   * 데려온 파일이 또 형제를 부를 수 있어 더 나올 게 없을 때까지 돈다. */
  const dir = join(ROOT, name)
  if (count) {
    for (let round = 0; round < 5; round++) {
      const have = new Set(
        readdirSync(dir)
          .filter((f) => f.endsWith(".tsx"))
          .map((f) => f.replace(/\.tsx$/, ""))
      )
      let added = 0
      for (const f of readdirSync(dir).filter((f) => f.endsWith(".tsx"))) {
        const code = readFileSync(join(dir, f), "utf8")
        for (const m of code.matchAll(/from\s+["']\.\/([a-z0-9-]+)["']/g)) {
          const stem = m[1]
          if (have.has(stem) || OURS.has(stem)) continue
          const src = pool.get(stem)
          if (!src) {
            missing.push(`${name}/${stem}`)
            continue
          }
          writeFileSync(join(dir, `${stem}.tsx`), rewrite(src, name), "utf8")
          have.add(stem)
          added++
          count++
        }
      }
      if (!added) break
    }
    written.push({ name, count, deps: item.dependencies ?? [] })
    console.log(`  ${name} — 파일 ${count}개`)
  } else {
    skipped.push(`${name} — 가져올 파일 없음`)
  }
}

console.log(`\n[${source}] 받은 항목 ${written.length}개`)

const deps = [...new Set(written.flatMap((w) => w.deps))]
if (deps.length) console.log(`필요한 패키지: ${deps.join(" ")}`)
if (missing.length) {
  console.log(`
못 찾은 형제 ${missing.length}건 — 창고 항목(+이름)을 더 지정해야 한다:`)
  for (const m of [...new Set(missing)].slice(0, 20)) console.log(`  - ${m}`)
}
if (skipped.length) {
  console.log(`\n건너뜀 ${skipped.length}건:`)
  for (const s of skipped.slice(0, 20)) console.log(`  - ${s}`)
}
