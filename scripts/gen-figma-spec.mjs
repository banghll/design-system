/* 렌더된 컴포넌트를 재서 data/figma-spec.json 을 만든다.
 *
 * 왜 재는가 — Figma 로 옮길 때 «비슷하게» 는 쓸모가 없다. 버튼 높이가 1px 다르면
 * 그 버튼이 들어간 모든 화면이 어긋나고, 그때부터 Figma 와 코드 중 어느 쪽이
 * 맞는지 아무도 모르게 된다.
 *
 * 토큰 값을 그대로 옮기는 방법도 있지만 그것만으로는 부족하다. calc() 와 상속,
 * tailwind-merge 가 실제로 어떤 값을 내놓는지는 그려 봐야 안다 — 실제로
 * «이름은 있는데 리터럴에 덮여 안 먹는» 자리가 있었다. 그래서 결과를 잰다.
 *
 * 라이트·다크 두 벌을 잰다. Figma 변수의 모드가 그 둘이다.
 *
 * 준비:  정적 빌드가 떠 있어야 한다
 *        npm run share  후  node scripts/serve-out.mjs  (또는 npm run dev)
 * 실행:  node scripts/gen-figma-spec.mjs
 *        BASE_URL=http://localhost:3000 node scripts/gen-figma-spec.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import puppeteer from "puppeteer-core"

const BASE = process.env.BASE_URL ?? "http://localhost:4321"
const OUT = "data/figma-spec.json"

const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
]
const chrome = process.env.CHROME_PATH ?? CANDIDATES.find((p) => existsSync(p))
if (!chrome) throw new Error("크롬을 못 찾았다. CHROME_PATH 로 알려줄 것.")

const foundation = JSON.parse(readFileSync("data/foundation.json", "utf8"))
const IDS = ["button", "input", "badge", "card", "tabs"]

/* 브라우저 안에서 도는 측정 함수.
 *
 * 재는 것은 «Figma 가 표현할 수 있는 것» 으로 한정한다. box-shadow 의 spread 나
 * ring 처럼 Figma 쪽에 그대로 옮길 수 없는 것은 재도 쓸 데가 없다. */
function measure() {
  const px = (v) => (v && v.endsWith("px") ? Math.round(parseFloat(v) * 100) / 100 : v)
  /* Figma 는 0~1 의 RGBA 를 쓴다. 브라우저가 어떤 색 공간으로 계산했든
   * 화면에 찍히는 sRGB 값으로 환산해 넘긴다 — 눈에 보이는 것이 정본이다. */
  /* 색은 캔버스에 한 번 칠해서 픽셀을 읽는다.
   *
   * getComputedStyle 은 oklch()·lab() 을 그대로 돌려준다. 브라우저마다 표기가
   * 달라 문자열을 파싱하면 언젠가 깨지고, 실제로 처음에 그래서 색이 전부
   * null 로 나왔다. 캔버스는 «화면에 찍히는 sRGB» 를 그대로 준다 —
   * 눈에 보이는 것이 정본이므로 이쪽이 맞다. */
  const cv = document.createElement("canvas")
  cv.width = cv.height = 1
  const ctx = cv.getContext("2d", { willReadFrequently: true })

  const rgba = (v) => {
    if (!v || v === "none" || v === "transparent") return null
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = "#000"
    ctx.fillStyle = v
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
    if (a === 0) return null
    return {
      r: +(r / 255).toFixed(4),
      g: +(g / 255).toFixed(4),
      b: +(b / 255).toFixed(4),
      a: +(a / 255).toFixed(4),
      hex:
        "#" +
        [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("") +
        (a < 255 ? a.toString(16).padStart(2, "0") : ""),
      css: v,
    }
  }

  const read = (el) => {
    const s = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return {
      width: Math.round(r.width * 100) / 100,
      height: Math.round(r.height * 100) / 100,
      padding: {
        top: px(s.paddingTop),
        right: px(s.paddingRight),
        bottom: px(s.paddingBottom),
        left: px(s.paddingLeft),
      },
      radius: {
        tl: px(s.borderTopLeftRadius),
        tr: px(s.borderTopRightRadius),
        br: px(s.borderBottomRightRadius),
        bl: px(s.borderBottomLeftRadius),
      },
      border: {
        width: px(s.borderTopWidth),
        color: rgba(s.borderTopColor),
      },
      fill: rgba(s.backgroundColor),
      text: {
        color: rgba(s.color),
        size: px(s.fontSize),
        weight: s.fontWeight,
        lineHeight: px(s.lineHeight),
        letterSpacing: px(s.letterSpacing),
        family: s.fontFamily,
      },
      layout: {
        display: s.display,
        direction: s.flexDirection,
        gap: px(s.columnGap === "normal" ? "0px" : s.columnGap),
        rowGap: px(s.rowGap === "normal" ? "0px" : s.rowGap),
        align: s.alignItems,
        justify: s.justifyContent,
      },
      opacity: +s.opacity,
    }
  }

  /* 파운데이션 색. 화면에 칠해진 값을 그대로 읽는다 — oklch 를 손으로
   * sRGB 로 옮기면 반올림 한 번에 어긋나고, 그 어긋남은 Figma 쪽에만 남는다. */
  const tokens = {}
  const rootStyle = getComputedStyle(document.documentElement)
  for (const name of window.__TOKEN_NAMES__ ?? []) {
    const raw = rootStyle.getPropertyValue("--" + name).trim()
    if (raw) tokens[name] = rgba(raw)
  }

  const out = { $tokens: tokens }
  for (const box of document.querySelectorAll("[data-export]")) {
    const target = box.firstElementChild
    if (!target) continue
    const node = read(target)
    /* 자식도 한 겹 잰다 — 카드처럼 안에 구조가 있는 것은 겉만 재면
     * Figma 에서 속을 다시 손으로 짜야 한다. */
    node.children = [...target.children].map((c) => ({
      slot: c.getAttribute("data-slot") ?? c.tagName.toLowerCase(),
      text: (c.textContent ?? "").trim().slice(0, 40),
      ...read(c),
    }))
    node.label = (target.textContent ?? "").trim().slice(0, 40)
    out[box.getAttribute("data-export")] = node
  }
  return out
}

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new",
  args: ["--force-color-profile=srgb", "--font-render-hinting=none"],
})

const spec = { $doc: "렌더 결과를 잰 값. 손으로 고치지 말 것 — node scripts/gen-figma-spec.mjs", foundation, modes: {} }

for (const mode of ["light", "dark"]) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 1 })
  /* 테마는 저장된 값이 정한다. 페이지가 뜨기 전에 심어 둬야 첫 그림부터 맞는다. */
  await page.evaluateOnNewDocument(
    (m, names) => {
      try {
        localStorage.setItem("theme", m)
      } catch {}
      window.__TOKEN_NAMES__ = names
    },
    mode,
    Object.keys(foundation.color).filter((k) => !k.startsWith("$"))
  )

  const byId = {}
  for (const id of IDS) {
    const url = `${BASE}/export/${id}/`
    const res = await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 })
    if (!res || !res.ok()) throw new Error(`${url} — ${res ? res.status() : "응답 없음"}`)
    /* 글꼴이 늦게 오면 글자 크기가 잠깐 다르게 잡힌다 */
    await page.evaluate(() => document.fonts.ready)
    const measured = await page.evaluate(measure)
    if (measured.$tokens) {
      spec.colors ??= {}
      spec.colors[mode] = measured.$tokens
      delete measured.$tokens
    }
    Object.assign(byId, measured)
    process.stdout.write(`  ${mode} · ${id}\r`)
  }
  spec.modes[mode] = byId
  await page.close()
}

await browser.close()

writeFileSync(OUT, JSON.stringify(spec, null, 2) + "\n")
const n = Object.keys(spec.modes.light).length
console.log(`\n${OUT} — 변형 ${n}개 × 모드 2벌 측정`)
