/* shadcn/ui 공개 레포(MIT)에서 preview 블록을 통째로 받아온다.
 * 레지스트리(ui.shadcn.com/r/...)는 index.tsx 한 장만 배포해서 cards/* 가 빠진 채로 깨진다.
 * 원본 레포에는 전부 있으므로 거기서 직접 받고, import 경로만 우리 alias 로 바꾼다.
 *
 *   node scripts/fetch-preview-block.mjs preview-02 preview-03 preview
 */
import fs from "node:fs"
import path from "node:path"

const OWNER = "shadcn-ui"
const REPO = "ui"
const BRANCH = "main"
const BASE = "apps/v4/registry/bases/radix/blocks"
const DEST_ROOT = path.join(process.cwd(), "components", "blocks")

const api = async (p) => {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${p}?ref=${BRANCH}`, {
    headers: { "user-agent": "node", accept: "application/vnd.github+json" },
  })
  if (!res.ok) throw new Error(`${res.status} ${p}`)
  return res.json()
}

const raw = async (p) => {
  const res = await fetch(`https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${p}`, {
    headers: { "user-agent": "node" },
  })
  if (!res.ok) throw new Error(`${res.status} ${p}`)
  return res.text()
}

/* 원본은 @/registry/bases/radix/blocks/<블록>/... 로 서로를 참조한다.
   우리는 components/blocks/<블록>/... 에 두므로 그 접두사만 갈아끼운다. */
const rewrite = (src) =>
  src
    .split("@/registry/bases/radix/blocks/")
    .join("@/components/blocks/")
    .split("@/registry/bases/radix/ui/")
    .join("@/components/ui/")
    .split("@/registry/bases/radix/lib/")
    .join("@/lib/")
    .split("@/registry/bases/radix/hooks/")
    .join("@/hooks/")

async function walk(repoDir, destDir) {
  const items = await api(repoDir)
  fs.mkdirSync(destDir, { recursive: true })
  let n = 0
  for (const it of items) {
    if (it.type === "dir") {
      n += await walk(`${repoDir}/${it.name}`, path.join(destDir, it.name))
    } else if (/\.(tsx?|json)$/.test(it.name)) {
      const body = await raw(`${repoDir}/${it.name}`)
      fs.writeFileSync(path.join(destDir, it.name), rewrite(body))
      n++
    }
  }
  return n
}

for (const name of process.argv.slice(2)) {
  try {
    const n = await walk(`${BASE}/${name}`, path.join(DEST_ROOT, name))
    console.log(`${name.padEnd(12)} ${n}개 파일`)
  } catch (e) {
    console.log(`${name.padEnd(12)} 실패 — ${e.message}`)
  }
}
