/* 아무도 안 쓰는 공용 부품을 지운다.
 *
 * 블록을 지우면 그 블록만 쓰던 svg 로고나 애니메이션이 남는다. 쓰지 않는 파일이
 * 남아 있으면 다음 사람이 "이건 왜 있지" 를 매번 묻게 된다. */
import { readdirSync, readFileSync, rmSync, statSync } from "node:fs"
import { join } from "node:path"

const SHARED = "components/3p/tailark/_shared"
const used = new Set()

function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) {
      /* 창고 자신은 세지 않는다 — 서로를 참조하는 것만으로 살아남으면 안 된다. */
      if (p.split(/[\\/]/).join("/").endsWith("_shared")) continue
      walk(p)
      continue
    }
    if (!/\.tsx?$/.test(e)) continue
    for (const m of readFileSync(p, "utf8").matchAll(/_shared\/([A-Za-z0-9_-]+)/g)) {
      used.add(m[1])
    }
  }
}

walk("components/3p")

const all = readdirSync(SHARED)
const orphan = all.filter((f) => !used.has(f.replace(/\.tsx?$/, "")))
if (!process.argv.includes("--yes")) {
  console.log(`안 쓰는 공용 부품 ${orphan.length}개 (전체 ${all.length}개)`)
  for (const f of orphan.slice(0, 10)) console.log(`  - ${f}`)
  console.log("지우려면 --yes")
  process.exit(0)
}
for (const f of orphan) rmSync(join(SHARED, f), { force: true })
console.log(`공용 부품 ${all.length}개 중 ${orphan.length}개 제거 → ${all.length - orphan.length}개`)
