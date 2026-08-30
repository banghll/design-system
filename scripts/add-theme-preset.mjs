/* tweakcn 레지스트리 항목을 전환기 프리셋 목록에 등록한다.
 *
 * `shadcn add <url>` 은 globals.css 의 :root / .dark 를 통째로 갈아끼운다 —
 * 그러면 그 테마가 곧 기본값이 되고, 되돌리려면 파일을 되살려야 한다.
 * 같은 값을 프리셋으로도 넣어 두면 목록에서 골라 비교하고 되돌릴 수 있다.
 *
 *   node scripts/add-theme-preset.mjs <레지스트리 URL> <키> "<표시 이름>"
 */
import { readFileSync, writeFileSync } from "node:fs"

const [url, key, label] = process.argv.slice(2)
if (!url || !key || !label) {
  console.error("사용법: node scripts/add-theme-preset.mjs <url> <key> <label>")
  process.exit(1)
}

const item = await fetch(url).then((r) => r.json())
const { light, dark } = item.cssVars ?? {}
if (!light || !dark) {
  console.error("cssVars.light / cssVars.dark 가 없다 — 테마 항목이 아니다.")
  process.exit(1)
}

const FILE = "lib/theme-presets.ts"
const src = readFileSync(FILE, "utf8")
if (src.includes(`  "${key}": {`)) {
  console.log(`이미 있다: ${key}`)
  process.exit(0)
}

const vars = (o) =>
  Object.entries(o)
    .map(([k, v]) => `        ${JSON.stringify(k)}: ${JSON.stringify(String(v))},`)
    .join("\n")

const entry = `  ${JSON.stringify(key)}: {
    label: ${JSON.stringify(label)},
    styles: {
      light: {
${vars(light)}
      },
      dark: {
${vars(dark)}
      },
    },
  },
`

/* 마지막 `};` 앞에 끼워 넣는다. */
const at = src.lastIndexOf("};")
writeFileSync(FILE, src.slice(0, at) + entry + src.slice(at), "utf8")
console.log(`등록: ${key} (${label}) — light ${Object.keys(light).length}개 · dark ${Object.keys(dark).length}개`)
