/* design-system.json 을 «혼자 도는 한 장» 으로 굽는다.
 *
 * 왜 — 카탈로그 사이트는 서버나 정적 호스팅이 있어야 열린다. 그게 준비되기
 * 전에도 남에게 보낼 수 있는 것이 하나는 있어야 해서, 색인만 한 파일에 담는다.
 * 실제 컴포넌트가 렌더되지는 않는다. 대신 «무엇이 있고, 무엇이며, 언제 쓰는가»
 * 와 import 경로·variant 는 전부 들어간다 — 고를 때 실제로 필요한 것들이다.
 *
 * 실행: node scripts/gen-share-page.mjs
 * 결과: scratch 경로에 HTML 한 장 (Artifact 로 올린다)
 */
import fs from "node:fs"
import path from "node:path"

const r = JSON.parse(fs.readFileSync("design-system.json", "utf8"))
const out = process.argv[2] ?? "share-index.html"

const GROUPS = [
  ["c-action", "액션", "Actions", "누르면 상태가 바뀌는 것. 화면당 주 액션은 하나로 유지한다", "Things that change state when pressed. One primary action per screen."],
  ["c-input", "입력", "Inputs", "사용자에게서 값을 받는 것. 선택지 수와 다중 선택 여부가 종류를 정한다", "Things that take a value. Option count and multi-select decide which one."],
  ["c-display", "표시", "Display", "읽기만 하는 것. 조작할 수 없다는 게 눈에 보여야 한다", "Read-only. It must look like it cannot be operated."],
  ["c-nav", "탐색", "Navigation", "위치를 옮기거나, 지금 자리에서 접고 펴는 것", "Moves you somewhere, or folds and unfolds in place."],
  ["c-data", "데이터", "Data", "여러 건을 한 번에 다루는 것. 표 · 차트 · 달력 · 명령 팔레트", "Many records at once — tables, charts, calendars, command palettes."],
  ["c-overlay", "오버레이", "Overlays", "화면 위에 떠서 초점을 가져가는 것. 트리거를 눌러야 보인다", "Floats above and takes focus. Needs a trigger."],
  ["기타", "그 밖", "Other", "셸과 내부 장치. 화면을 짤 때 직접 고르는 일은 드물다", "Shell and internals — rarely picked directly."],
]

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const byGroup = new Map(GROUPS.map(([id]) => [id, []]))
for (const c of r.components) byGroup.get(c.group ?? "기타").push(c)

const chips = (v) =>
  Object.entries(v ?? {})
    .map(
      ([k, vals]) =>
        `<span class="vgroup"><span class="vkey">${esc(k)}</span>${vals
          .map((x) => `<span class="v">${esc(x)}</span>`)
          .join("")}</span>`
    )
    .join("")

const GROUP_WORDS = Object.fromEntries(
  GROUPS.map(([id, ko, en]) => [id, `${ko} ${en}`])
)

const row = (c) => `
<article class="row" data-q="${esc(
  [
    c.id,
    c.import,
    GROUP_WORDS[c.group ?? "기타"],
    c.exports.join(" "),
    c.doc?.what?.ko,
    c.doc?.what?.en,
    c.doc?.when?.ko,
    c.doc?.when?.en,
  ]
    .join(" ")
    .toLowerCase()
)}">
  <header class="rowhead">
    <h3 class="name">${esc(c.id)}</h3>
    <code class="imp">${esc(c.import)}</code>
  </header>
  ${
    c.doc
      ? `<p class="what" lang="ko">${esc(c.doc.what.ko)}</p>
  <p class="what" lang="en">${esc(c.doc.what.en)}</p>
  <p class="when" lang="ko">${esc(c.doc.when.ko)}</p>
  <p class="when" lang="en">${esc(c.doc.when.en)}</p>`
      : `<p class="when" lang="ko">설명이 아직 없습니다. scripts/gen-components.mjs 의 DOC 에 적으면 여기에도 나옵니다.</p>
  <p class="when" lang="en">No definition yet — add it to DOC in scripts/gen-components.mjs.</p>`
  }
  <div class="exports"><span class="xlabel">exports</span> <code>${c.exports.join(", ")}</code></div>
  ${chips(c.variants) ? `<div class="variants">${chips(c.variants)}</div>` : ""}
</article>`

const section = ([id, ko, en, noteKo, noteEn]) => {
  const list = byGroup.get(id) ?? []
  if (!list.length) return ""
  return `
<section class="group" id="${esc(id)}">
  <div class="ghead">
    <h2><span lang="ko">${esc(ko)}</span><span lang="en">${esc(en)}</span></h2>
    <span class="count">${list.length}</span>
  </div>
  <p class="gnote" lang="ko">${esc(noteKo)}</p>
  <p class="gnote" lang="en">${esc(noteEn)}</p>
  <div class="rows">${list.map(row).join("")}</div>
</section>`
}

const ladder = Object.entries(r.tokens.control)
  .map(([k, v]) => `<tr><th>${esc(k)}</th><td><code>${esc(v)}</code></td></tr>`)
  .join("")

const patternGroups = {}
for (const p of r.patterns) (patternGroups[p.group] ??= []).push(p)
const PATTERN_LABEL = {
  empty: "빈 상태", loading: "로딩", notice: "알림", form: "폼 · 설정",
  metric: "지표 · 차트", list: "목록 · 표", media: "미디어 · 파일",
  device: "기기 제어", dev: "개발 · 운영", ai: "AI 대화",
}

const html = `<title>컴포넌트 무엇과 언제</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
/* 이 시스템은 일부러 무채색이다. 그래서 이 페이지의 «한 방» 도 색이 아니라
   구조와 글자에 둔다 — 강조색은 군 표지와 검색 일치에만 쓴다. */
:root {
  --ground: #fbfaf9;
  --panel: #ffffff;
  --ink: #16181a;
  --ink-soft: #4a4f55;
  --muted: #7b8189;
  --rule: #e5e3e0;
  --rule-soft: #efedea;
  --accent: #3f5a72;
  --accent-soft: #eaeff3;
  --code-bg: #f2f1ee;
  --shadow: 0 1px 2px rgba(20, 24, 28, .05);
  --sans: "DM Sans", "Pretendard Variable", Pretendard, -apple-system, "Malgun Gothic", sans-serif;
  --mono: "JetBrains Mono", ui-monospace, "Cascadia Mono", Consolas, monospace;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --ground: #101214;
    --panel: #16191c;
    --ink: #e8eaec;
    --ink-soft: #b3b9bf;
    --muted: #838a92;
    --rule: #262b30;
    --rule-soft: #1e2226;
    --accent: #8fb4d0;
    --accent-soft: #1b262f;
    --code-bg: #1c2024;
    --shadow: none;
  }
}
:root[data-theme="dark"] {
  --ground: #101214;
  --panel: #16191c;
  --ink: #e8eaec;
  --ink-soft: #b3b9bf;
  --muted: #838a92;
  --rule: #262b30;
  --rule-soft: #1e2226;
  --accent: #8fb4d0;
  --accent-soft: #1b262f;
  --code-bg: #1c2024;
  --shadow: none;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--ground);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}
code { font-family: var(--mono); font-size: .86em; }

/* 언어 — 한 쪽만 보인다 */
[lang="en"] { display: none; }
body[data-lang="en"] [lang="ko"] { display: none; }
body[data-lang="en"] [lang="en"] { display: revert; }

.wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px; }

/* ── 머리 ── */
header.top { border-bottom: 1px solid var(--rule); }
.tophead {
  display: flex; flex-wrap: wrap; align-items: flex-end; gap: 20px;
  padding: 56px 0 28px;
}
h1 {
  margin: 0; font-size: clamp(30px, 5vw, 44px); font-weight: 500;
  letter-spacing: -.03em; line-height: 1.05; text-wrap: balance;
}
h1 .n { font-family: var(--mono); font-weight: 400; color: var(--accent); }
.lede { margin: 12px 0 0; max-width: 62ch; color: var(--ink-soft); }
.tools { display: flex; gap: 8px; margin-left: auto; }
button.tool {
  font: inherit; font-size: 13px; color: var(--ink-soft);
  background: var(--panel); border: 1px solid var(--rule);
  border-radius: 8px; padding: 7px 12px; cursor: pointer;
}
button.tool:hover { color: var(--ink); border-color: var(--muted); }
button.tool:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* ── 검색 ── */
.searchbar { position: sticky; top: 0; z-index: 5; background: var(--ground); border-bottom: 1px solid var(--rule); }
.searchinner { display: flex; align-items: center; gap: 12px; padding: 12px 0; }
#q {
  flex: 1; min-width: 0; font: inherit; font-size: 15px;
  background: var(--panel); color: var(--ink);
  border: 1px solid var(--rule); border-radius: 10px; padding: 9px 14px;
}
#q:focus { outline: 2px solid var(--accent); outline-offset: 1px; border-color: transparent; }
#q::placeholder { color: var(--muted); }
#hits { font-family: var(--mono); font-size: 13px; color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap; }

/* ── 본문 ── */
.cols { display: grid; grid-template-columns: 190px minmax(0, 1fr); gap: 48px; padding: 36px 0 96px; }
@media (max-width: 860px) { .cols { grid-template-columns: 1fr; gap: 8px; } nav.rail { position: static !important; } }

nav.rail { position: sticky; top: 72px; align-self: start; display: flex; flex-direction: column; gap: 2px; }
nav.rail a {
  display: flex; justify-content: space-between; gap: 10px;
  color: var(--ink-soft); text-decoration: none; font-size: 14px;
  padding: 5px 8px; border-radius: 7px;
}
nav.rail a:hover { background: var(--accent-soft); color: var(--ink); }
nav.rail a span:last-child { font-family: var(--mono); font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
nav.rail .railtitle { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); padding: 0 8px 8px; }

.group { margin-bottom: 56px; scroll-margin-top: 76px; }
.ghead { display: flex; align-items: baseline; gap: 10px; }
.ghead h2 { margin: 0; font-size: 22px; font-weight: 500; letter-spacing: -.02em; }
.count { font-family: var(--mono); font-size: 12px; color: var(--accent); background: var(--accent-soft); border-radius: 999px; padding: 2px 8px; font-variant-numeric: tabular-nums; }
.gnote { margin: 6px 0 18px; color: var(--muted); font-size: 14px; max-width: 66ch; }

.rows { display: flex; flex-direction: column; border-top: 1px solid var(--rule); }
.row { padding: 18px 0; border-bottom: 1px solid var(--rule-soft); }
.row[hidden] { display: none; }
.rowhead { display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px 14px; }
.name { margin: 0; font-family: var(--mono); font-size: 15px; font-weight: 500; letter-spacing: -.01em; }
.imp { color: var(--muted); background: var(--code-bg); border-radius: 6px; padding: 2px 7px; font-size: 12px; }
.what { margin: 7px 0 0; max-width: 68ch; }
.when { margin: 3px 0 0; max-width: 68ch; color: var(--muted); font-size: 14px; }
.exports { margin-top: 9px; font-size: 12px; color: var(--ink-soft); display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
.xlabel { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.exports code { color: var(--ink-soft); }
.variants { display: flex; flex-wrap: wrap; gap: 6px 14px; margin-top: 8px; }
.vgroup { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; }
.vkey { font-family: var(--mono); font-size: 11px; color: var(--muted); margin-right: 2px; }
.v { font-family: var(--mono); font-size: 11px; color: var(--ink-soft); background: var(--code-bg); border-radius: 5px; padding: 1px 6px; }

/* ── 토큰 · 패턴 ── */
.panel { background: var(--panel); border: 1px solid var(--rule); border-radius: 14px; padding: 24px; box-shadow: var(--shadow); }
.panel h2 { margin: 0 0 4px; font-size: 20px; font-weight: 500; letter-spacing: -.02em; }
.panel > p { margin: 0 0 18px; color: var(--muted); font-size: 14px; max-width: 66ch; }
.tablewrap { overflow-x: auto; }
table { border-collapse: collapse; width: 100%; font-size: 13px; }
th, td { text-align: left; padding: 6px 12px 6px 0; border-bottom: 1px solid var(--rule-soft); vertical-align: baseline; }
th { font-family: var(--mono); font-weight: 400; color: var(--ink); white-space: nowrap; }
td code { color: var(--muted); }
.plist { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.plist code { background: var(--code-bg); border-radius: 5px; padding: 2px 7px; color: var(--ink-soft); font-size: 12px; }
.pgroup { margin-bottom: 16px; }
.pgroup h3 { margin: 0; font-size: 13px; font-weight: 500; color: var(--ink); }

footer.end { border-top: 1px solid var(--rule); padding: 28px 0 64px; color: var(--muted); font-size: 13px; }
footer.end p { margin: 0 0 6px; max-width: 70ch; }
a { color: var(--accent); }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>

<body data-lang="ko">
<header class="top">
  <div class="wrap tophead">
    <div>
      <h1>
        <span lang="ko">무엇이고, 언제 쓰는가</span>
        <span lang="en">What it is, when to use it</span>
      </h1>
      <p class="lede" lang="ko">shadcn/ui 위에 올린 디자인 시스템의 컴포넌트 <strong>${r.components.length}개</strong>. 항목마다 <em>정의</em> 한 줄과 <em>고르는 조건</em> 한 줄이 값으로 붙어 있어, 사람과 에이전트가 같은 문장을 보고 고른다.</p>
      <p class="lede" lang="en">The <strong>${r.components.length}</strong> components of a design system built on shadcn/ui. Each carries one line of definition and one line of selection criteria, so people and agents choose from the same sentence.</p>
    </div>
    <div class="tools">
      <button class="tool" id="lang" type="button">EN</button>
      <button class="tool" id="theme" type="button">다크</button>
    </div>
  </div>
</header>

<div class="searchbar">
  <div class="wrap searchinner">
    <input id="q" type="search" placeholder="이름 · 설명으로 찾기 (예: 빈 상태, 오버레이, select)" aria-label="컴포넌트 검색">
    <span id="hits">${r.components.length} / ${r.components.length}</span>
  </div>
</div>

<div class="wrap cols">
  <nav class="rail">
    <div class="railtitle">Groups</div>
    ${GROUPS.filter(([id]) => (byGroup.get(id) ?? []).length)
      .map(
        ([id, ko, en]) =>
          `<a href="#${esc(id)}"><span><span lang="ko">${esc(ko)}</span><span lang="en">${esc(en)}</span></span><span>${
            (byGroup.get(id) ?? []).length
          }</span></a>`
      )
      .join("\n    ")}
  </nav>

  <main>
    ${GROUPS.map(section).join("")}

    <section class="panel" id="tokens" style="margin-bottom:24px">
      <h2><span lang="ko">컨트롤 크기 토큰</span><span lang="en">Control size tokens</span></h2>
      <p lang="ko">xs · sm · 기본 · lg 는 «다른 값» 이 아니라 «기준에서 몇 칸» 이다. 그래서 기준 하나를 옮기면 네 크기가 함께 움직이고, 한 줄에 나란히 선 버튼 · 입력 · 셀렉트가 어긋나지 않는다.</p>
      <p lang="en">xs, sm, default and lg are not separate numbers but steps from a base. Move the base and all four follow, so a button and an input standing in the same row never drift apart.</p>
      <div class="tablewrap"><table><tbody>${ladder}</tbody></table></div>
    </section>

    <section class="panel">
      <h2><span lang="ko">패턴 ${r.patterns.length}개</span><span lang="en">${r.patterns.length} patterns</span></h2>
      <p lang="ko">컴포넌트를 조립해 한 가지 쓰임을 푼 것. 새 화면은 컴포넌트가 아니라 여기서 시작하는 편이 낫다 — 컴포넌트부터 시작하면 언제나 패턴을 다시 짜게 된다.</p>
      <p lang="en">Assemblies that each solve one recurring situation. A new screen should start here rather than at the component layer.</p>
      ${Object.entries(patternGroups)
        .map(
          ([g, list]) => `<div class="pgroup">
        <h3>${esc(PATTERN_LABEL[g] ?? g)} <span class="vkey">${list.length}</span></h3>
        <div class="plist">${list.map((p) => `<code>${esc(p.id)}</code>`).join("")}</div>
      </div>`
        )
        .join("")}
    </section>
  </main>
</div>

<footer class="end">
  <div class="wrap">
    <p lang="ko">이 페이지는 <code>design-system.json</code> 에서 생성됩니다. 정본은 언제나 코드 쪽이고, 여기 있는 값은 전부 거기서 뽑아낸 것입니다.</p>
    <p lang="en">Generated from <code>design-system.json</code>. The code is always the source of truth; every value here is extracted from it.</p>
    <p lang="ko">실제로 렌더된 컴포넌트와 블록 ${r.blocks.length}개는 저장소를 받아 <code>npm run dev</code> 로 볼 수 있습니다.</p>
    <p lang="en">The rendered components and ${r.blocks.length} blocks live in the repository — clone it and run <code>npm run dev</code>.</p>
  </div>
</footer>

<script>
const body = document.body
const q = document.getElementById("q")
const hits = document.getElementById("hits")
const rows = [...document.querySelectorAll(".row")]
const groups = [...document.querySelectorAll(".group")]

/* 검색 — 이름과 두 언어의 설명을 함께 훑는다. 한글로 «빈 상태» 를 쳐도,
   영어로 empty 를 쳐도 같은 것이 나와야 한다. */
function filter() {
  const t = q.value.trim().toLowerCase()
  let n = 0
  for (const r of rows) {
    const on = !t || r.dataset.q.includes(t)
    r.hidden = !on
    if (on) n++
  }
  for (const g of groups) g.hidden = !g.querySelector(".row:not([hidden])")
  hits.textContent = n + " / " + rows.length
}
q.addEventListener("input", filter)

/* 언어 · 모드는 이 브라우저에만 남는다. 없거나 막혀 있어도 화면은 그대로 뜬다. */
const save = (k, v) => { try { localStorage.setItem(k, v) } catch {} }
const load = (k) => { try { return localStorage.getItem(k) } catch { return null } }

const langBtn = document.getElementById("lang")
function setLang(l) {
  body.dataset.lang = l
  langBtn.textContent = l === "ko" ? "EN" : "한국어"
  q.placeholder = l === "ko"
    ? "이름 · 설명으로 찾기 (예: 빈 상태, 오버레이, select)"
    : "Search by name or description (e.g. empty, overlay, select)"
  save("dsx-lang", l)
  if (typeof relabelTheme === "function") relabelTheme()
}
langBtn.addEventListener("click", () => setLang(body.dataset.lang === "ko" ? "en" : "ko"))

const themeBtn = document.getElementById("theme")
const prefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches
function setTheme(t) {
  if (t) document.documentElement.dataset.theme = t
  else delete document.documentElement.dataset.theme
  const dark = t ? t === "dark" : prefersDark()
  themeBtn.textContent = body.dataset.lang === "en" ? (dark ? "Light" : "Dark") : (dark ? "라이트" : "다크")
  save("dsx-theme", t ?? "")
}
themeBtn.addEventListener("click", () => {
  const now = document.documentElement.dataset.theme || (prefersDark() ? "dark" : "light")
  setTheme(now === "dark" ? "light" : "dark")
})
function relabelTheme() {
  const t = document.documentElement.dataset.theme
  const dark = t ? t === "dark" : prefersDark()
  themeBtn.textContent = body.dataset.lang === "en" ? (dark ? "Light" : "Dark") : (dark ? "라이트" : "다크")
}
const saved = load("dsx-theme")
setTheme(saved === "dark" || saved === "light" ? saved : null)
setLang(load("dsx-lang") === "en" ? "en" : "ko")
</script>
</body>
`

fs.writeFileSync(out, html)
console.log(`${out} — ${(fs.statSync(out).size / 1024).toFixed(0)}KB · 컴포넌트 ${r.components.length} · 패턴 ${r.patterns.length}`)
