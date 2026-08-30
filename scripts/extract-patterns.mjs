/* 패턴 카드를 Paper 로 옮길 수 있는 HTML 로 뽑아낸다.
 *
 * 우리 화면의 마크업은 Tailwind 클래스로 되어 있어 그대로 옮기면 Paper 쪽에서
 * 아무 스타일도 안 붙는다. 그래서 브라우저에게 다 그리게 한 뒤, 계산된 스타일을
 * 인라인으로 굳혀서 가져온다.
 *
 * 다만 색은 굳히지 않는다. rgb 로 굳혀 버리면 Paper 안에서 토큰을 바꿔도 안 따라오고,
 * 그러면 "shadcn 기준으로 만들어 달라" 는 말이 무의미해진다. 화면에서 읽은 색을
 * 토큰 값과 맞춰 보고, 같으면 var(--토큰) 으로 되돌린다.
 *
 * 준비:  dev 서버가 떠 있어야 한다 (npm run dev)
 * 실행:  node scripts/extract-patterns.mjs
 * 결과:  scripts/_paper-patterns.json
 */
import { existsSync, writeFileSync } from "node:fs"
import puppeteer from "puppeteer-core"

const BASE = process.env.BASE_URL ?? "http://localhost:3000"
const OUT = "scripts/_paper-patterns.json"

const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
]
const exe = process.env.CHROME_PATH ?? CANDIDATES.find((p) => existsSync(p))
if (!exe) {
  console.error("크롬을 찾지 못했다. CHROME_PATH 로 알려주면 된다.")
  process.exit(1)
}

const browser = await puppeteer.launch({
  executablePath: exe,
  headless: true,
  args: ["--hide-scrollbars"],
})
const page = await browser.newPage()
await page.setViewport({ width: 1600, height: 1200 })

/* 라이트 모드로 뽑는다. Paper 는 밝은 캔버스가 기본이고,
 * 어두운 값으로 뽑으면 캔버스 위에서 검은 사각형만 늘어선다. */
await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }])
await page.goto(`${BASE}/patterns`, { waitUntil: "networkidle2", timeout: 90000 })
await page.evaluate(() => {
  document.documentElement.classList.remove("dark")
  document.documentElement.classList.add("light")
  localStorage.removeItem("ds-preset")
  localStorage.removeItem("ds-editor-edits")
})
await page.reload({ waitUntil: "networkidle2" })
await page.evaluate(() => document.fonts?.ready)
await new Promise((r) => setTimeout(r, 1200))

const result = await page.evaluate(() => {
  /* 우리가 Paper 에 만들어 둘 토큰 이름들. 화면에서 읽은 색이 이 중 하나와
   * 같으면 그 이름으로 되돌린다. */
  const COLOR_TOKENS = [
    "background", "foreground", "card", "card-foreground",
    "popover", "popover-foreground", "primary", "primary-foreground",
    "secondary", "secondary-foreground", "muted", "muted-foreground",
    "accent", "accent-foreground", "destructive", "border", "input", "ring",
    "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
  ]

  const px = (v) => {
    const c = document.createElement("canvas")
    c.width = c.height = 1
    const x = c.getContext("2d")
    x.clearRect(0, 0, 1, 1)
    x.fillStyle = "#000"
    x.fillStyle = v
    x.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = x.getImageData(0, 0, 1, 1).data
    return `${r},${g},${b},${a}`
  }

  const cs = getComputedStyle(document.documentElement)
  const tokenPx = new Map()
  for (const n of COLOR_TOKENS) {
    const v = cs.getPropertyValue(`--${n}`).trim()
    if (v) tokenPx.set(px(v), n)
  }

  /* 색이면 토큰으로, 아니면 그대로. */
  const asColor = (v) => {
    if (!v || v === "none") return null
    if (v.startsWith("rgba(0, 0, 0, 0)") || v === "transparent") return "transparent"
    const hit = tokenPx.get(px(v))
    return hit ? `var(--${hit})` : v
  }

  /* 굳혀 갈 속성들. 전부 가져가면 HTML 이 못 알아볼 만큼 커지므로,
   * 화면의 모양을 만드는 것만 고른다. */
  const LAYOUT = [
    "display", "flexDirection", "alignItems", "justifyContent", "gap",
    "gridTemplateColumns", "gridTemplateRows",
    "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
    "marginTop", "marginRight", "marginBottom", "marginLeft",
    "width", "height", "minWidth", "minHeight", "maxWidth",
    "borderRadius", "borderTopWidth", "borderRightWidth",
    "borderBottomWidth", "borderLeftWidth", "borderStyle",
    "fontSize", "fontWeight", "lineHeight", "letterSpacing", "textAlign",
    "textTransform", "whiteSpace", "overflow", "opacity", "boxShadow",
    "position", "top", "right", "bottom", "left", "zIndex",
    "flexGrow", "flexShrink", "flexBasis", "flexWrap", "objectFit",
  ]

  const DEFAULTS = {
    display: "block", flexDirection: "row", alignItems: "normal",
    justifyContent: "normal", gap: "normal", marginTop: "0px",
    marginRight: "0px", marginBottom: "0px", marginLeft: "0px",
    paddingTop: "0px", paddingRight: "0px", paddingBottom: "0px",
    paddingLeft: "0px", borderRadius: "0px", borderTopWidth: "0px",
    borderRightWidth: "0px", borderBottomWidth: "0px", borderLeftWidth: "0px",
    borderStyle: "none", opacity: "1", boxShadow: "none", position: "static",
    zIndex: "auto", flexGrow: "0", flexShrink: "1", flexWrap: "nowrap",
    textTransform: "none", whiteSpace: "normal", overflow: "visible",
    minWidth: "0px", minHeight: "0px", maxWidth: "none", textAlign: "start",
  }

  const kebab = (s) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())

  function serialize(el, depth = 0) {
    if (depth > 14) return ""
    const s = getComputedStyle(el)
    if (s.display === "none" || s.visibility === "hidden") return ""

    const tag = el.tagName.toLowerCase()
    /* svg 는 통째로 넘긴다 — 안을 헤집으면 도형이 흩어진다. */
    if (tag === "svg") {
      const w = s.width === "auto" ? "16px" : s.width
      return el.outerHTML.replace(
        "<svg",
        `<svg style="width:${w};height:${s.height};color:${asColor(s.color) ?? "currentColor"};flex-shrink:0"`
      )
    }
    if (tag === "script" || tag === "style") return ""

    const decl = []
    for (const p of LAYOUT) {
      const v = s[p]
      if (!v || v === DEFAULTS[p]) continue
      if (p === "width" || p === "height") {
        /* 채워 늘어난 값은 굳히지 않는다 — Paper 안에서 다시 흐르게 둔다. */
        if (v === "auto") continue
      }
      decl.push(`${kebab(p)}:${v}`)
    }
    const bg = asColor(s.backgroundColor)
    if (bg && bg !== "transparent") decl.push(`background-color:${bg}`)
    const fg = asColor(s.color)
    if (fg) decl.push(`color:${fg}`)
    if (parseFloat(s.borderTopWidth) > 0) {
      const bc = asColor(s.borderTopColor)
      if (bc) decl.push(`border-color:${bc}`)
    }
    decl.push(`font-family:${s.fontFamily.split(",")[0].replace(/"/g, "")}`)

    const style = decl.join(";")
    const kids = [...el.childNodes]
      .map((n) => {
        if (n.nodeType === 3) {
          const txt = n.textContent ?? ""
          return txt.trim()
            ? txt.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c])
            : ""
        }
        if (n.nodeType === 1) return serialize(n, depth + 1)
        return ""
      })
      .join("")

    if (tag === "img") {
      return `<img src="${el.src}" style="${style}" />`
    }
    /* 빈 상자는 Paper 에서 그냥 사각형이 된다. 그건 그대로 맞다 —
     * 구분선이나 색 칸이 실제로 그런 것이기 때문이다. */
    return `<div style="${style}">${kids}</div>`
  }

  const out = []
  for (const art of document.querySelectorAll("article")) {
    const id = art.querySelector("code")?.textContent?.trim()
    const holder = art.querySelector("div:last-of-type")
    const card = art.querySelector('[data-slot="card"]') ?? holder?.firstElementChild
    if (!id || !card) continue
    const title = art.querySelector("span")?.textContent?.trim() ?? id
    const r = card.getBoundingClientRect()
    if (r.width < 40 || r.height < 24) continue
    out.push({
      id,
      title,
      width: Math.round(r.width),
      height: Math.round(r.height),
      html: serialize(card),
    })
  }
  return out
})

await browser.close()

/* 같은 카드가 두 벌 잡히는 일이 있다 — 서버가 흘려보낸 숨은 사본 때문이다. */
const seen = new Set()
const unique = result.filter((c) => (seen.has(c.id) ? false : (seen.add(c.id), true)))

writeFileSync(OUT, JSON.stringify(unique, null, 1), "utf8")
const kb = Math.round(JSON.stringify(unique).length / 1024)
console.log(`카드 ${unique.length}개 → ${OUT} (${kb}KB)`)
console.log(
  `가장 큰 것: ${unique
    .map((c) => `${c.id} ${Math.round(c.html.length / 1024)}KB`)
    .sort((a, b) => parseInt(b.split(" ")[1]) - parseInt(a.split(" ")[1]))
    .slice(0, 3)
    .join(" · ")}`
)
