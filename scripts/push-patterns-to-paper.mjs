/* 뽑아 둔 패턴 카드를 Paper 로 옮긴다.
 *
 * 기존 파일은 건드리지 않는다 — 사용자가 열어 둔 작업이 있고, 예전에 토큰을
 * 지웠다가 캔버스가 통째로 비었던 적이 있다. 새 파일을 만들어 거기에만 쓴다.
 *
 * 토큰은 만들기만 하고 지우지 않는다. 쓰는 값은 전부 shadcn 이름이다.
 *
 * 실행:  node scripts/push-patterns-to-paper.mjs [군이름 ...]
 *        군을 적지 않으면 전부. 한 군씩 나눠 돌리는 편이 안전하다.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { call as rawCall, init, textOf } from "./paper.mjs"

/* Paper 는 실패를 예외가 아니라 isError 로 돌려준다. 그대로 두면
 * 아무것도 안 들어갔는데 «완료» 가 찍힌다 — 실패는 실패로 멈춘다. */
async function call(name, args) {
  const r = await rawCall(name, args)
  if (r?.isError) throw new Error(`${name}: ${textOf(r).slice(0, 300)}`)
  return r
}

const CARDS = JSON.parse(readFileSync("scripts/_paper-patterns.json", "utf8"))
const STATE = "scripts/_paper-state.json"

/* 어느 카드가 어느 군인지는 생성된 패턴 페이지가 이미 알고 있다. */
const page = readFileSync("app/patterns/page.tsx", "utf8")
const groupOf = new Map()
for (const m of page.matchAll(/id: "([^"]+)", group: "([^"]+)"/g)) {
  groupOf.set(m[1], m[2])
}

const GROUPS = [
  ["empty", "빈 상태"],
  ["loading", "로딩"],
  ["notice", "알림"],
  ["form", "폼 · 설정"],
  ["metric", "지표 · 차트"],
  ["list", "목록 · 표"],
  ["media", "미디어 · 파일"],
  ["device", "기기 제어"],
  ["dev", "개발 · 운영"],
  ["ai", "AI 대화"],
]

/* shadcn 라이트 모드 값. Paper 안에서 이 이름들로만 색을 부른다. */
const TOKENS = [
  ["background", "#ffffff"],
  ["foreground", "#252525"],
  ["card", "#ffffff"],
  ["card-foreground", "#252525"],
  ["popover", "#ffffff"],
  ["popover-foreground", "#252525"],
  ["primary", "#343434"],
  ["primary-foreground", "#fbfbfb"],
  ["secondary", "#f7f7f7"],
  ["secondary-foreground", "#343434"],
  ["muted", "#f7f7f7"],
  ["muted-foreground", "#8e8e8e"],
  ["accent", "#f7f7f7"],
  ["accent-foreground", "#343434"],
  ["destructive", "#e7000b"],
  ["border", "#ebebeb"],
  ["input", "#ebebeb"],
  ["ring", "#b5b5b5"],
  ["chart-1", "#d9d9d9"],
  ["chart-2", "#8e8e8e"],
  ["chart-3", "#6d6d6d"],
  ["chart-4", "#5a5a5a"],
  ["chart-5", "#404040"],
]

const wanted = process.argv.slice(2)

await init()

/* ── 파일 ──────────────────────────────────────────────
 * 한 번 만든 파일에 이어 쓴다. 매번 새로 만들면 캔버스가 늘어나기만 한다. */
let state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : {}

if (!state.fileId) {
  const made = textOf(await call("create_file", { name: "shadcn 패턴" }))
  const id = made.match(/[0-9A-Z]{26}/)?.[0]
  if (!id) throw new Error(`파일 id 를 못 읽었다: ${made.slice(0, 200)}`)
  state = { fileId: id, done: [] }
  writeFileSync(STATE, JSON.stringify(state, null, 2))
  console.log(`파일 생성: ${id}`)
}

await call("open_file", { fileId: state.fileId })
console.log(`파일 열림: ${state.fileId}`)

/* ── 토큰 ──────────────────────────────────────────────
 * 만들기만 한다. 이미 있으면 그냥 넘어간다 — 지우는 쪽은 손대지 않는다. */
if (!state.tokens) {
  const existing = textOf(await call("get_tokens", {}))
  const missing = TOKENS.filter(([n]) => !existing.includes(`--${n}`))
  if (missing.length) {
    await call("create_tokens", {
      tokens: missing.map(([name, value]) => ({ type: "color", name: `--${name}`, value })),
    })
  }
  state.tokens = true
  writeFileSync(STATE, JSON.stringify(state, null, 2))
  console.log(`토큰 ${missing.length}개 생성 (이미 있던 것 ${TOKENS.length - missing.length}개)`)
}

/* ── 카드 ──────────────────────────────────────────────
 * 군마다 아트보드 하나. 한 번에 다 쓰면 응답이 끊기므로 카드 몇 장씩 나눠 쓴다. */
const CARD_W = 380
const COLS = 3
const GAP = 40
const PAD = 64

let cursorY = 0

for (const [key, label] of GROUPS) {
  if (wanted.length && !wanted.includes(key)) continue
  if (state.done?.includes(key)) {
    console.log(`  ${label} — 이미 넣음, 건너뜀`)
    continue
  }

  const items = CARDS.filter((c) => groupOf.get(c.id) === key)
  if (!items.length) continue

  const rows = Math.ceil(items.length / COLS)
  const maxH = Math.max(...items.map((c) => c.height))
  const boardW = PAD * 2 + CARD_W * COLS + GAP * (COLS - 1)
  const boardH = PAD * 2 + 120 + rows * (maxH + GAP)

  const made = textOf(
    await call("create_artboard", {
      name: `패턴 · ${label}`,
      styles: {
        width: `${boardW}px`,
        height: "fit-content",
        minHeight: `${boardH}px`,
        backgroundColor: "var(--background)",
        x: 0,
        y: cursorY,
      },
    })
  )
  const boardId = made.match(/"?(\d+-\d+)"?/)?.[1] ?? made.match(/[0-9a-z_-]{4,}/i)?.[0]
  console.log(`\n${label} — 아트보드 ${boardId} · 카드 ${items.length}장`)

  /* 머리말을 먼저 쓴다. 무엇을 모아 둔 판인지가 판 안에 있어야 한다. */
  await call("write_html", {
    targetNodeId: boardId,
    mode: "insert-children",
    html: `<div style="display:flex;flex-direction:column;gap:8px;padding:${PAD}px ${PAD}px ${GAP}px ${PAD}px;font-family:DM Sans">
  <div style="font-size:34px;font-weight:600;letter-spacing:-0.02em;color:var(--foreground)">${label}</div>
  <div style="font-size:14px;color:var(--muted-foreground)">shadcn 토큰으로만 그렸습니다 · 카드 ${items.length}장</div>
</div>`,
  })

  /* 카드는 3장씩 끊어 보낸다. 한 번에 보내면 큰 카드에서 응답이 넘친다. */
  for (let i = 0; i < items.length; i += 3) {
    const chunk = items.slice(i, i + 3)
    const cells = chunk
      .map(
        (c) => `<div style="display:flex;flex-direction:column;gap:10px;width:${CARD_W}px">
  <div style="font-size:12px;font-weight:500;color:var(--muted-foreground);font-family:DM Sans">${c.id}</div>
  ${c.html}
</div>`
      )
      .join("")

    await call("write_html", {
      targetNodeId: boardId,
      mode: "insert-children",
      html: `<div style="display:flex;flex-wrap:wrap;gap:${GAP}px;padding:0 ${PAD}px ${GAP}px ${PAD}px;align-items:flex-start">${cells}</div>`,
    })
    process.stdout.write(`  ${Math.min(i + 3, items.length)}/${items.length}\r`)
  }

  cursorY += boardH + 160
  state.done = [...(state.done ?? []), key]
  state.cursorY = cursorY
  writeFileSync(STATE, JSON.stringify(state, null, 2))
  console.log(`  ${items.length}장 완료`)
}

await call("finish_working_on_nodes", {})
console.log(`\n끝. https://app.paper.design/file/${state.fileId}`)
