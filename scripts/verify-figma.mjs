/* Figma 에 지은 것과 코드에서 잰 것을 숫자로 맞춰 본다.
 *
 * «만들었다» 와 «맞게 만들었다» 는 다른 말이다. 눈으로 보면 다 그럴듯해 보이고,
 * 1~2px 어긋난 것은 스크린샷으로 절대 안 보인다. 그런데 그 1px 이 실제로
 * Figma 와 코드가 갈라지기 시작하는 지점이다.
 *
 * 사용: Figma 쪽에서 읽어 온 JSON 을 파일로 두고
 *   node scripts/verify-figma.mjs scripts/.cache/_figma-readback.json button
 */
import { readFileSync } from "node:fs"

const [readbackPath, component = "button"] = process.argv.slice(2)
if (!readbackPath) throw new Error("되읽은 JSON 경로를 줄 것")

const fig = JSON.parse(readFileSync(readbackPath, "utf8"))
const spec = JSON.parse(readFileSync("data/figma-spec.json", "utf8"))
const light = spec.modes.light

/* Figma 변형 이름 → 측정 키.  "Variant=outline, Size=lg" → "button/outline/lg/default" */
const toKey = (name) => {
  const v = /Variant=([\w-]+)/.exec(name)
  const s = /Size=([\w-]+)/.exec(name)
  if (!v || !s) return null
  return `${component}/${v[1]}/${s[1]}/default`
}

let checks = 0
const bad = []
const cmp = (name, field, a, b, tol = 0) => {
  checks++
  if (a == null && b == null) return
  if (typeof a === "number" && typeof b === "number") {
    if (Math.abs(a - b) > tol) bad.push({ name, field, code: a, figma: b })
    return
  }
  if (a !== b) bad.push({ name, field, code: a, figma: b })
}

for (const f of fig) {
  const key = toKey(f.name)
  const s = key && light[key]
  if (!s) {
    bad.push({ name: f.name, field: "(측정값 없음)", code: key, figma: "-" })
    continue
  }
  cmp(f.name, "height", s.height, f.h)
  cmp(f.name, "paddingX", s.padding.left, f.px)
  cmp(f.name, "radius", s.radius.tl, f.r)
  cmp(f.name, "gap", s.layout.gap, f.gap)
  cmp(f.name, "fontSize", s.text.size, f.fs)
  cmp(f.name, "lineHeight", s.text.lineHeight, f.lh)

  const codeAlpha = s.fill ? s.fill.a : null
  const figAlpha = f.fill === "none" ? null : f.fill
  cmp(f.name, "fillAlpha", codeAlpha, figAlpha, 0.003)

  const codeStroke = s.border.color ? s.border.width : 0
  cmp(f.name, "strokeWeight", codeStroke, f.stroke)
}

if (bad.length) {
  console.log(`■ 어긋난 자리 ${bad.length}건`)
  for (const b of bad) console.log(`  ${b.name.padEnd(34)} ${b.field.padEnd(12)} 코드 ${b.code} · figma ${b.figma}`)
} else {
  console.log("어긋남 없음.")
}
console.log(`\n대조 ${checks}건 · 어긋남 ${bad.length}건 (${component})`)
process.exit(bad.length ? 1 : 0)
