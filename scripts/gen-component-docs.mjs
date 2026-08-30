/* lib/component-docs.ts — 상세 페이지가 읽는 설명 사본.
 *
 * 정본은 scripts/gen-components.mjs 의 DOC 이다. 상세 페이지에서 그 파일을
 * 직접 읽을 수는 없어(빌드 스크립트라) 여기서 뽑아 둔다. 두 벌이 되는 것이
 * 마음에 들지는 않지만, 설명을 상세 페이지에 또 적는 것보다는 낫다 —
 * 그쪽은 갈라져도 아무도 모른다.
 *
 * 실행: node scripts/gen-component-docs.mjs
 */
import fs from "node:fs"

const src = fs.readFileSync("scripts/gen-components.mjs", "utf8")
const a = src.indexOf("const DOC = {")
const body = src.slice(a, src.indexOf("\n}\n", a))

const re =
  /^\s{2}"?([a-z0-9-]+)"?:\s*\[\s*\n\s*"((?:[^"\\]|\\.)*)",\s*\n\s*"((?:[^"\\]|\\.)*)",/gm

const all = {}
for (const m of body.matchAll(re)) all[m[1]] = { what: m[2], when: m[3] }

const wanted = Object.keys(
  JSON.parse(fs.readFileSync("data/components.json", "utf8"))
).filter((k) => !k.startsWith("$"))

const picked = Object.fromEntries(
  wanted.filter((k) => all[k]).map((k) => [k, all[k]])
)

fs.writeFileSync(
  "lib/component-docs.ts",
  `/* 생성물 — node scripts/gen-component-docs.mjs. 직접 고치지 말 것.
 * 정본은 scripts/gen-components.mjs 의 DOC 이다. */
export const DOCS: Record<string, { what: string; when: string }> = ${JSON.stringify(
    picked,
    null,
    2
  )}
`
)

console.log(`component-docs — ${Object.keys(picked).join(" · ")}`)
