/* 벤더 코드에 타입 검사 면제를 건다.
 *
 * components/3p 은 남이 쓴 코드다. 우리 규칙(엄격한 타입)을 강요하면
 * 남의 코드를 계속 고쳐야 하고, 원본을 다시 받으면 그 수정이 날아간다.
 * 그래서 경계를 긋는다 — 우리 코드는 엄격하게, 벤더 코드는 있는 그대로.
 *
 * 대신 gen-3p.mjs 의 검증이 "실제로 그려지는가" 는 계속 확인한다.
 * 타입을 안 보는 것과 안 그려지는 것을 방치하는 것은 다른 이야기다. */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const MARK = "// @ts-nocheck"
const NOTE = `/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */`

/* 우리가 쓰지 않은 코드가 사는 곳. 원본을 그대로 두는 것이 목적이다.
 * components/ui 는 제외한다 — 받아온 것이지만 우리가 손보고 시스템의 바닥으로 삼는다. */
const VENDORED = [
  "components/ai-elements",
  "components/blocks",
  "components/examples",
]

const files = []
;(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.tsx?$/.test(e) && e !== "_registry.ts") files.push(p)
  }
})("components/3p")
for (const d of VENDORED) {
  ;(function walk(dir) {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e)
      if (statSync(p).isDirectory()) walk(p)
      else if (/.tsx?$/.test(e)) files.push(p)
    }
  })(d)
}

let n = 0
for (const p of files) {
  const code = readFileSync(p, "utf8")
  if (code.includes(MARK)) continue
  /* "use client" 는 첫 구문이어야 하지만 주석은 그 위에 와도 된다. */
  writeFileSync(p, `${MARK}\n${NOTE}\n${code}`, "utf8")
  n++
}
console.log(`벤더 표시: 파일 ${n}개 (3p + ${VENDORED.join(" + ")})`)
