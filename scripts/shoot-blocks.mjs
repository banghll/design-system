/* 블록 미리보기를 이미지로 미리 찍어 둔다.
 *
 * 목록에 iframe 을 210개 두면 카드 하나마다 Next 앱이 통째로 부팅된다.
 * 게으르게 만들어도 스크롤해 내려가면 결국 다 살아나고, 한 번 산 것은 안 죽는다 —
 * 목록이 무거운 게 아니라 목록이 앱 210개인 것이 문제다.
 *
 * 그래서 한 번 찍어 둔다. 목록은 이미지를 보고, 실제로 눌러 볼 수 있어야 하는
 * 상세 화면에서만 진짜를 띄운다. 미리보기는 어차피 축소돼 있어 조작할 수 없었으니
 * 잃는 것이 없다.
 *
 * 준비:  dev 서버가 떠 있어야 한다 (npm run dev)
 * 실행:  node scripts/shoot-blocks.mjs           — 없는 것만
 *        node scripts/shoot-blocks.mjs --all     — 전부 다시
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import puppeteer from "puppeteer-core"

const BASE = process.env.BASE_URL ?? "http://localhost:3000"
const OUT = "public/thumbs"
const MANIFEST = "data/thumbs.json"
const ALL = process.argv.includes("--all")

/* 카드가 화면에서 차지하는 크기는 490×306 남짓이다. 1440 폭으로 렌더하되
 * 배율을 반으로 낮춰 720×450 으로 저장한다 — 화면에 필요한 것보다 조금 크고,
 * 파일은 원본의 4분의 1이다. */
const W = 1440
const H = 900
const SCALE = 0.5

/* 시스템에 깔린 크롬을 쓴다. 브라우저를 따로 내려받으면 200MB 가 붙는데,
 * 이미 있는 것을 쓰면 그럴 이유가 없다. */
const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
]
const exe = process.env.CHROME_PATH ?? CANDIDATES.find((p) => existsSync(p))
if (!exe) {
  console.error(
    "크롬을 찾지 못했다. CHROME_PATH 환경 변수로 경로를 알려주면 된다."
  )
  process.exit(1)
}

/* 무엇을 찍을지 — 공식 블록과 서드파티 블록의 라우트 */
const officialIds = [
  ...new Set(
    readFileSync("lib/block-catalog.ts", "utf8")
      .matchAll(/^\s{4}id:\s*"([^"]+)"/gm)
  ),
].map((m) => m[1])

const thirdPartyIds = [
  ...readFileSync("lib/third-party-catalog.ts", "utf8").matchAll(
    /^\s{4}id:\s*"([^"]+)"/gm
  ),
].map((m) => m[1])

const targets = [
  ...officialIds.map((id) => ({ id, url: `${BASE}/blocks/${id}` })),
  ...thirdPartyIds.map((id) => ({ id, url: `${BASE}/blocks/3p/${id}` })),
]

mkdirSync(OUT, { recursive: true })

/* dev 서버가 떠 있는지 먼저 본다. 없으면 210번 실패하는 대신 한 번에 알린다. */
try {
  const res = await fetch(BASE, { method: "HEAD" })
  if (!res.ok) throw new Error(String(res.status))
} catch {
  console.error(`${BASE} 에 연결할 수 없다. 먼저 npm run dev 를 띄운다.`)
  process.exit(1)
}

const browser = await puppeteer.launch({
  executablePath: exe,
  headless: true,
  args: ["--hide-scrollbars", "--disable-gpu"],
})

const done = []
const failed = []
let shot = 0

/* 한 번에 여러 장을 찍으면 dev 서버가 컴파일에 밀린다.
 * 탭 세 개면 충분히 빠르고, 서버가 버틴다. */
const LANES = 3
const queue = targets.slice()

async function lane(n) {
  const page = await browser.newPage()
  await page.setViewport({ width: W, height: H, deviceScaleFactor: SCALE })

  while (queue.length) {
    const t = queue.shift()
    const file = join(OUT, `${t.id}.webp`)
    if (!ALL && existsSync(file)) {
      done.push(t.id)
      continue
    }
    try {
      await page.goto(t.url, { waitUntil: "networkidle2", timeout: 45000 })
      /* 폰트와 이미지가 자리를 잡을 시간. 이게 없으면 글꼴이 바뀌기 전 모습이 찍힌다. */
      await page.evaluate(() => document.fonts?.ready)
      await new Promise((r) => setTimeout(r, 350))
      await page.screenshot({ path: file, type: "webp", quality: 72 })
      done.push(t.id)
      shot++
      if (shot % 20 === 0) console.log(`  ${shot}장…`)
    } catch (e) {
      failed.push(`${t.id} — ${e.message.split("\n")[0]}`)
    }
  }
  await page.close()
}

console.log(`대상 ${targets.length}개 · 레인 ${LANES}개 · ${exe.split(/[\\/]/).pop()}`)
await Promise.all(Array.from({ length: LANES }, (_, i) => lane(i)))
await browser.close()

/* 어떤 것이 이미지로 준비됐는지 목록을 남긴다.
 * 화면이 이 목록을 보고 이미지를 쓸지 iframe 으로 떨어질지 정한다 —
 * 파일이 있나 없나를 요청해서 확인하면 그게 또 210번이다. */
writeFileSync(
  MANIFEST,
  JSON.stringify({ ids: done.sort(), width: W * SCALE, height: H * SCALE }, null, 2) + "\n",
  "utf8"
)

console.log(`\n찍음 ${shot}장 · 이미 있던 것 ${done.length - shot}장 · 전체 ${done.length}장`)
if (failed.length) {
  console.log(`실패 ${failed.length}건:`)
  for (const f of failed.slice(0, 15)) console.log(`  - ${f}`)
}
