/* lucide 가 걷어낸 이름을 지금 있는 것으로 바꾼다.
 *
 * lucide 는 브랜드 아이콘(Github · Twitter · Linkedin)을 라이브러리에서 뺐다.
 * 서드파티 블록들은 그 전에 쓰인 코드라 그대로 두면 임포트가 터진다.
 * 브랜드 로고를 흉내내는 대신, 뜻이 통하는 일반 아이콘으로 바꾼다 —
 * 없는 로고를 그리는 것보다 "링크"라고 말하는 편이 정직하다.
 *
 * LucideIcon 타입도 이름이 바뀌어 존재하지 않으므로 컴포넌트 타입으로 대체한다. */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const RENAME = {
  Github: "Code2",
  Twitter: "Send",
  Linkedin: "Link2",
}

const files = []
function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.tsx?$/.test(e)) files.push(p)
  }
}
walk("components/3p")

let touched = 0
for (const p of files) {
  let code = readFileSync(p, "utf8")
  const before = code

  /* lucide import 문 안에서만 바꾼다. 본문의 같은 단어(문자열 'Github')는 두고,
   * JSX 로 쓰인 자리는 아래에서 따로 바꾼다. */
  code = code.replace(
    /import\s*\{([^}]+)\}\s*from\s*(["'])lucide-react\2/g,
    (m, names, q) => {
      const list = names
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const bare = s.replace(/^type\s+/, "")
          if (bare === "LucideIcon") return null
          if (RENAME[bare]) return `${RENAME[bare]} as ${bare}`
          return s
        })
        .filter(Boolean)
      return `import { ${list.join(", ")} } from ${q}lucide-react${q}`
    }
  )

  /* LucideIcon 타입 자리 */
  if (/\bLucideIcon\b/.test(code)) {
    code = code.replace(/\bLucideIcon\b/g, "ComponentType<Record<string, unknown>>")
    if (!/from ["']react["']/.test(code)) {
      /* "use client" 는 파일의 첫 구문이어야 한다. 그 위에 얹으면 지시자가 아니게 된다. */
      code = /^\s*["']use client["'];?/.test(code)
        ? code.replace(
            /^(\s*["']use client["'];?\s*\n)/,
            '$1import type { ComponentType } from "react"\n'
          )
        : `import type { ComponentType } from "react"\n${code}`
    } else {
      code = code.replace(
        /import\s+(type\s+)?\{([^}]*)\}\s*from\s*(["'])react\3/,
        (m, t, names, q) =>
          /ComponentType/.test(names)
            ? m
            : `import ${t ?? ""}{${names.trimEnd()}, ComponentType } from ${q}react${q}`
      )
    }
  }

  if (code !== before) {
    writeFileSync(p, code, "utf8")
    touched++
  }
}

console.log(`아이콘 정리: 파일 ${touched}개`)
