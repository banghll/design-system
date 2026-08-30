/* 목록에서 뺀 블록을 실제로 지운다.
 *
 * 숨기기는 되돌릴 수 있는 결정이고, 이건 되돌릴 수 없는 결정이다.
 * 그래서 두 단계로 나눠 뒀다 — 먼저 화면에서 골라 빼 보고, 확신이 서면 지운다.
 *
 * 지운 id 는 data/removed-blocks.json 에 남긴다. 그러지 않으면 다음에
 * import-tailark.mjs 나 fetch-3p.mjs 를 돌리는 순간 전부 되살아난다.
 * "안 쓰기로 했다" 는 결정이 파일 삭제보다 오래 살아야 한다.
 *
 * 되돌리려면: removed-blocks.json 에서 id 를 빼고 가져오기 스크립트를 다시 돌린다.
 *
 * 실행:  node scripts/prune-blocks.mjs          — 무엇을 지울지 보여주기만
 *        node scripts/prune-blocks.mjs --yes    — 실제로 지우기
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const GO = process.argv.includes("--yes")

const HIDDEN = "data/hidden-blocks.json"
const REMOVED = "data/removed-blocks.json"

const hidden = JSON.parse(readFileSync(HIDDEN, "utf8")).hidden ?? []
const removed = existsSync(REMOVED)
  ? (JSON.parse(readFileSync(REMOVED, "utf8")).removed ?? [])
  : []

if (!hidden.length) {
  console.log("숨긴 블록이 없다. 먼저 블록 탭에서 «목록 정리» 로 골라 뺀다.")
  process.exit(0)
}

/* id 에서 실제 폴더를 찾는다. tailark 은 id 가 곧 폴더, 나머지는 접두사를 뗀다. */
function folderFor(id) {
  if (id.startsWith("tailark-")) return `components/3p/tailark/${id.slice(8)}`
  if (id.startsWith("launch-")) return `components/3p/launch/${id.slice(7)}`
  if (id.startsWith("space-")) return `components/3p/space/${id.slice(6)}`
  return null
}

const plan = []
const skipped = []

for (const id of hidden) {
  const folder = folderFor(id)
  if (!folder) {
    /* 공식 블록은 이 스크립트로 지우지 않는다. 시스템의 기준선이라
     * 빼려면 그 결정을 따로, 의식적으로 해야 한다. */
    skipped.push(`${id} — 공식 블록이라 건드리지 않는다`)
    continue
  }
  if (!existsSync(folder)) {
    skipped.push(`${id} — 폴더가 이미 없다`)
    continue
  }
  plan.push({ id, folder, thumb: `public/thumbs/${id}.webp` })
}

console.log(`지울 대상 ${plan.length}개`)
for (const p of plan.slice(0, 8)) console.log(`  - ${p.folder}`)
if (plan.length > 8) console.log(`  … 그 외 ${plan.length - 8}개`)
if (skipped.length) {
  console.log(`\n건너뜀 ${skipped.length}건:`)
  for (const s of skipped.slice(0, 10)) console.log(`  - ${s}`)
}

if (!GO) {
  console.log("\n실제로 지우려면 --yes 를 붙인다.")
  process.exit(0)
}

for (const p of plan) {
  rmSync(p.folder, { recursive: true, force: true })
  if (existsSync(p.thumb)) rmSync(p.thumb, { force: true })
}

/* tailark 의 목록 파일에서도 뺀다 — gen-3p 가 이걸 읽는다. */
const T_INDEX = "components/3p/tailark/_index.json"
if (existsSync(T_INDEX)) {
  const gone = new Set(plan.map((p) => p.id))
  const kept = JSON.parse(readFileSync(T_INDEX, "utf8")).filter(
    (b) => !gone.has(`tailark-${b.id}`)
  )
  writeFileSync(T_INDEX, JSON.stringify(kept, null, 2), "utf8")
}

/* 결정을 남긴다. 이게 없으면 다음 import 에서 전부 되살아난다. */
const nextRemoved = [...new Set([...removed, ...plan.map((p) => p.id)])].sort()
writeFileSync(REMOVED, JSON.stringify({ removed: nextRemoved }, null, 2) + "\n", "utf8")

/* 숨김 목록은 비운다 — 이제 숨긴 게 아니라 없는 것이다. */
const stillHidden = hidden.filter((id) => !plan.some((p) => p.id === id))
writeFileSync(HIDDEN, JSON.stringify({ hidden: stillHidden }, null, 2) + "\n", "utf8")

console.log(`\n지웠다 ${plan.length}개.`)
console.log(`제외 목록에 기록: ${REMOVED} (${nextRemoved.length}개)`)
console.log("이제 node scripts/gen-3p.mjs 를 돌려 카탈로그를 다시 만든다.")
