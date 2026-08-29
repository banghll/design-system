/* shadcn/ui 공개 레포(MIT)의 컴포넌트 예제를 통째로 받아온다.
 * registry 로는 배포되지 않는 것들이라 레포에서 직접 가져오고,
 * import 경로만 우리 구조로 바꾼다. */
import fs from "node:fs"
import path from "node:path"

const BASE = "apps/v4/registry/bases/radix/examples"
const DEST = path.join(process.cwd(), "components", "examples")

const api = async (p) => {
  const r = await fetch(
    `https://api.github.com/repos/shadcn-ui/ui/contents/${encodeURI(p)}?ref=main`,
    { headers: { "user-agent": "node", accept: "application/vnd.github+json" } }
  )
  if (!r.ok) throw new Error(`${r.status} ${p}`)
  return r.json()
}

const raw = async (p) => {
  const r = await fetch(`https://raw.githubusercontent.com/shadcn-ui/ui/main/${p}`, {
    headers: { "user-agent": "node" },
  })
  if (!r.ok) throw new Error(`${r.status} ${p}`)
  return r.text()
}

const rewrite = (s) =>
  s
    .split("@/registry/bases/radix/ui/").join("@/components/ui/")
    .split("@/registry/bases/base/ui/").join("@/components/ui/")
    .split("@/registry/bases/radix/lib/").join("@/lib/")
    .split("@/registry/bases/radix/hooks/").join("@/hooks/")
    .split("@/registry/bases/radix/examples/").join("@/components/examples/")
    .split("@/registry/bases/radix/components/").join("@/components/blocks/_shared/")
    .split("@/registry/new-york-v4/ui/").join("@/components/ui/")

const items = await api(BASE)
fs.mkdirSync(DEST, { recursive: true })

let ok = 0
const names = []
for (const it of items) {
  if (it.type !== "file" || !/\.tsx?$/.test(it.name)) continue
  try {
    const body = await raw(`${BASE}/${it.name}`)
    fs.writeFileSync(path.join(DEST, it.name), rewrite(body))
    ok++
    if (it.name.endsWith("-example.tsx")) names.push(it.name.replace(".tsx", ""))
  } catch (e) {
    console.log(`실패 ${it.name} — ${e.message}`)
  }
}
fs.writeFileSync(path.join(DEST, "_list.json"), JSON.stringify(names.sort(), null, 1))
console.log(`${ok}개 파일 · 예제 ${names.length}개`)
