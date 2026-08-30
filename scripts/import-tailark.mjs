/* Tailark 블록을 격리해서 옮긴다.
 *
 * Tailark 은 레지스트리 도메인(oss-tailark.com)이 죽어 있어 `shadcn add` 로는 못 받는다.
 * MIT 라 소스를 직접 옮기는 것은 문제가 없고, 라이선스 파일도 함께 둔다.
 *
 * 규칙은 fetch-3p.mjs 와 같다 — 이름이 우리 것과 겹치는 ui 컴포넌트는 우리 것을 쓰고,
 * 그 레포 고유 부품(svg 로고, magicui, motion-primitives)만 3p/ 안으로 가져온다.
 *
 * 우리는 Radix 기반이므로 radix 베이스만 쓴다. base(Base UI) 쪽은 가져오지 않는다.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { dirname, join, sep } from "node:path"

const SRC = "vendor/tailark"
const OUT = "components/3p/tailark"
const VARIANTS = ["mist", "dusk", "veil"]

const OURS = new Set(
  readdirSync("components/ui")
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(/\.tsx$/, ""))
)

if (!existsSync(SRC)) {
  console.error(`${SRC} 가 없다. 먼저:\n  git clone --depth 1 https://github.com/tailark/blocks ${SRC}`)
  process.exit(1)
}

/* 지우기로 한 블록은 다시 가져오지 않는다.
 * 이 목록이 없으면 스크립트를 한 번 더 돌리는 순간 전부 되살아난다 —
 * "안 쓰기로 했다" 는 결정이 파일 삭제보다 오래 살아야 한다. */
const REMOVED = new Set(
  existsSync("data/removed-blocks.json")
    ? JSON.parse(readFileSync("data/removed-blocks.json", "utf8")).removed
    : []
)

const pulled = new Set()

/* 그 레포 고유 파일을 3p 안으로 끌어온다. 이미 옮겼으면 다시 안 옮긴다. */
function pull(relFromRegistry) {
  const from = join(SRC, "registry", relFromRegistry)
  const to = join(OUT, "_shared", relFromRegistry.replace(/\//g, "__"))
  /* import 경로는 항상 슬래시다. Windows 에서 join 이 만든 역슬래시가
   * 문자열에 그대로 들어가면 파서가 이스케이프로 읽는다. */
  const importPath = to.split(sep).join("/")
  if (pulled.has(to)) return importPath
  /* 훅은 .ts, 컴포넌트는 .tsx 다. 확장자를 하나만 보면 훅을 통째로 놓친다. */
  const src = [from, from + ".tsx", from + ".ts"].find(
    (p) => existsSync(p) && !statSync(p).isDirectory()
  )
  if (!src) return null
  const ext = src.endsWith(".ts") ? ".ts" : ".tsx"
  mkdirSync(dirname(to + ext), { recursive: true })
  writeFileSync(to + ext, rewrite(readFileSync(src, "utf8")), "utf8")
  pulled.add(to)
  return importPath
}

function rewrite(code) {
  return (
    code
      /* 베이스의 ui — 이름이 겹치면 우리 것, 아니면 끌어온다 */
      .replace(
        /@\/registry\/bases\/radix\/[a-z]+\/ui\/([a-z0-9-]+)/g,
        (_m, stem) => {
          if (OURS.has(stem)) return `@/components/ui/${stem}`
          /* 어느 베이스에 있는지 모르니 셋 다 본다. */
          for (const v of VARIANTS) {
            const t = pull(`bases/radix/${v}/ui/${stem}`)
            if (t) return `@/${t}`
          }
          /* 원본에 오타가 있는 경우가 있다(kdb). 형제로 남겨 두면
           * 검증 단계가 그 블록을 목록에서 빼 준다 — 조용히 깨지지 않는다. */
          return `./${stem}`
        }
      )
      /* core 의 고유 부품 — svg 로고, magicui, motion-primitives */
      .replace(/@\/registry\/core\/ui\/([a-z0-9-]+)\/([a-z0-9-]+)/g, (_m, dir, stem) => {
        const t = pull(`core/ui/${dir}/${stem}`)
        return t ? `@/${t}` : `./${stem}`
      })
      .replace(/@\/registry\/core\/lib\/utils/g, "@/lib/utils")
      .replace(/@\/registry\/core\/hooks\/([a-z0-9-]+)/g, (_m, stem) => {
        const t = pull(`core/hooks/${stem}`)
        /* 못 찾으면 @/lib/utils 로 돌리지 않는다 — 거기 없는 이름을 부르면
         * 검증을 통과한 뒤 런타임에 터진다. 형제로 남겨 검증이 잡게 한다. */
        return t ? `@/${t}` : `./${stem}`
      })
      /* 같은 블록 폴더 안의 형제 파일. 블록 하나를 폴더 하나로 눌러 담으므로
       * 하위 경로가 남아 있으면 전부 형제로 접는다 — ./five/theme-switcher → ./theme-switcher */
      .replace(/@\/registry\/bases\/radix\/[a-z]+\/blocks\/[a-z-]+\//g, "./")
      .replace(/from\s+'(\.{1,2}\/[^']*?)'/g, (_m, p) => {
        const stem = p.split("/").filter(Boolean).pop()
        return OURS.has(stem) ? `from '@/components/ui/${stem}'` : `from './${stem}'`
      })
      .replace(/from\s+"(\.{1,2}\/[^"]*?)"/g, (_m, p) => {
        const stem = p.split("/").filter(Boolean).pop()
        return OURS.has(stem) ? `from "@/components/ui/${stem}"` : `from "./${stem}"`
      })
  )
}

/* 폴더 안에서 이름이 <stem>.tsx 인 파일을 재귀로 찾는다. */
function findFile(root, stem) {
  for (const e of readdirSync(root)) {
    const p = join(root, e)
    if (statSync(p).isDirectory()) {
      const hit = findFile(p, stem)
      if (hit) return hit
    } else if (e === `${stem}.tsx`) return p
  }
  return null
}

/* 출력 폴더의 파일들이 부르는 ./형제 가 실제로 있는지 확인하고, 없으면 데려온다.
 * 데려온 파일이 또 형제를 부를 수 있으므로 더 나올 게 없을 때까지 돈다. */
function resolveSiblings(dir, blockDir) {
  for (let round = 0; round < 5; round++) {
    const have = new Set(
      readdirSync(dir)
        .filter((f) => f.endsWith(".tsx"))
        .map((f) => f.replace(/\.tsx$/, ""))
    )
    let added = 0
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".tsx"))) {
      const code = readFileSync(join(dir, f), "utf8")
      for (const m of code.matchAll(/from\s+['"]\.\/([a-z0-9-]+)['"]/g)) {
        const stem = m[1]
        if (have.has(stem) || stem === "index") continue
        const src = findFile(blockDir, stem)
        if (!src) continue
        writeFileSync(join(dir, `${stem}.tsx`), rewrite(readFileSync(src, "utf8")), "utf8")
        have.add(stem)
        added++
      }
    }
    if (!added) break
  }
}

const index = []

for (const v of VARIANTS) {
  const blocksDir = join(SRC, "registry/bases/radix", v, "blocks")
  if (!existsSync(blocksDir)) continue

  for (const block of readdirSync(blocksDir)) {
    const bd = join(blocksDir, block)
    if (!statSync(bd).isDirectory()) continue

    for (const entry of readdirSync(bd)) {
      const p = join(bd, entry)
      const isDir = statSync(p).isDirectory()

      /* 하위 폴더형(hero-section/one/…) 은 폴더 안 .tsx 를 전부 옮긴다.
       * 대표 파일 하나만 옮기면 그 안에서 부르는 형제가 사라진다. */
      let entryFile = null
      const extra = []
      if (isDir) {
        const tsx = readdirSync(p).filter((f) => f.endsWith(".tsx"))
        if (!tsx.length) continue
        /* 진입 파일. 폴더 이름이 one · two 라 도움이 안 되므로 블록 이름을 먼저 본다 —
         * hero-section/one/ 의 진입은 hero-section.tsx 이지 header.tsx 가 아니다. */
        entryFile =
          tsx.find((f) => f === `${block}.tsx`) ??
          tsx.find((f) => f === "index.tsx") ??
          tsx.find((f) => f === `${entry}.tsx`) ??
          tsx[0]
        extra.push(...tsx.filter((f) => f !== entryFile))
      } else if (entry.endsWith(".tsx")) {
        entryFile = entry
      } else continue

      const variantName = isDir ? entry : entry.replace(/\.tsx$/, "")
      const id = `${v}-${block}-${variantName}`
      const dir = join(OUT, id)
      mkdirSync(dir, { recursive: true })

      const from = isDir ? join(p, entryFile) : p
      writeFileSync(join(dir, "index.tsx"), rewrite(readFileSync(from, "utf8")), "utf8")
      for (const f of extra) {
        writeFileSync(join(dir, f), rewrite(readFileSync(join(p, f), "utf8")), "utf8")
      }

      /* 평평한 파일(eight.tsx)이 형제 폴더의 파일(five/header.tsx)을 부르는 경우가 있다.
       * 블록 폴더 전체에서 이름으로 찾아 데려온다. 못 찾으면 라우트가 통째로 죽는다. */
      resolveSiblings(dir, bd)

      index.push({ id, variant: v, block, name: variantName })
    }
  }
}

/* 라이선스를 코드 옆에 둔다. 출처가 파일에서 떨어지면 안 된다. */
mkdirSync(OUT, { recursive: true })
copyFileSync(join(SRC, "LICENCE.md"), join(OUT, "LICENSE.md"))
writeFileSync(join(OUT, "_index.json"), JSON.stringify(index, null, 2), "utf8")

console.log(`Tailark 블록 ${index.length}개 → ${OUT}`)
console.log(`공용 부품 ${pulled.size}개 → ${OUT}/_shared`)
const kinds = [...new Set(index.map((i) => i.block))]
console.log(`종류 ${kinds.length}: ${kinds.join(", ")}`)
