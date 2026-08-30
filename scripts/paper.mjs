/* Paper 에 붙는 릴레이.
 *
 * Paper 는 MCP 서버로 등록돼 있지 않지만, 실행 중인 데스크톱 앱이
 * 127.0.0.1 의 한 포트에서 MCP 를 열어 둔다. 그래서 직접 말을 건다 —
 * 등록을 기다릴 이유도, 앱을 끌 이유도 없다.
 *
 * (실행 파일에 `paper mcp` 로 붙는 길도 있지만 그건 데스크톱 앱을 꺼야 한다.
 *  사용자가 열어 둔 작업을 끊는 대신 열려 있는 쪽에 붙는다.)
 *
 * 사용:
 *   node scripts/paper.mjs list
 *   node scripts/paper.mjs call <도구> '<JSON>'
 */
import { execSync } from "node:child_process"

/* 포트는 실행할 때마다 달라질 수 있다. Paper 프로세스가 듣고 있는 포트를 찾는다. */
function findPort() {
  if (process.env.PAPER_PORT) return Number(process.env.PAPER_PORT)
  try {
    const out = execSync(
      `powershell -NoProfile -Command "Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | ForEach-Object { $p = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue; if ($p -and $p.ProcessName -like '*aper*') { $_.LocalPort } } | Select-Object -First 1"`,
      { encoding: "utf8" }
    ).trim()
    if (out) return Number(out)
  } catch {
    /* 포트를 못 찾으면 아래에서 알린다. */
  }
  return null
}

const PORT = findPort()
if (!PORT) {
  console.error(
    "Paper 가 듣고 있는 포트를 찾지 못했다. Paper 를 켜 두었는지 확인하거나 PAPER_PORT 로 알려주면 된다."
  )
  process.exit(1)
}

const URL_ = `http://127.0.0.1:${PORT}/mcp`
let session = null
let id = 0

/* 응답이 SSE(event: message / data: {...}) 로 오기도 하고 JSON 으로 오기도 한다.
 * 둘 다 받아 넘긴다 — 형식이 아니라 내용이 필요한 것이므로. */
function parse(text) {
  const line = text
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.startsWith("data: "))
  const body = line ? line.slice(6) : text
  return JSON.parse(body)
}

async function rpc(method, params, notify = false) {
  const headers = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
  }
  if (session) headers["mcp-session-id"] = session

  const res = await fetch(URL_, {
    method: "POST",
    headers,
    body: JSON.stringify(
      notify ? { jsonrpc: "2.0", method, params } : { jsonrpc: "2.0", id: ++id, method, params }
    ),
  })

  const sid = res.headers.get("mcp-session-id")
  if (sid) session = sid
  if (notify) return null

  const text = await res.text()
  if (!text.trim()) return null
  const msg = parse(text)
  if (msg.error) throw new Error(JSON.stringify(msg.error))
  return msg.result
}

export async function init() {
  const r = await rpc("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "design-system", version: "1" },
  })
  await rpc("notifications/initialized", {}, true)
  return r
}

export const tools = () => rpc("tools/list", {})
export const call = (name, args) => rpc("tools/call", { name, arguments: args ?? {} })

/** 도구 결과에서 글자만 뽑는다. content 배열을 매번 헤집지 않으려고. */
export function textOf(result) {
  return (result?.content ?? [])
    .map((c) => c.text ?? "")
    .join("\n")
    .trim()
}

/* 파일 이름이 -paper.mjs 로 끝나는 스크립트가 이걸 import 하면 endsWith 로는
 * 구분되지 않는다. 경로의 마지막 조각이 정확히 paper.mjs 일 때만 CLI 로 동작한다. */
if (process.argv[1]?.split(/[\\/]/).pop() === "paper.mjs") {
  const [cmd, a, b] = process.argv.slice(2)
  try {
    const info = await init()
    if (cmd === "list") {
      const { tools: ts } = await tools()
      console.log(`${info.serverInfo?.name} ${info.serverInfo?.version} · 포트 ${PORT}`)
      console.log(`도구 ${ts.length}개\n`)
      for (const t of ts) {
        const req = t.inputSchema?.required ?? []
        console.log(`  ${t.name}(${req.join(", ")})`)
        console.log(`    ${(t.description ?? "").split("\n")[0].slice(0, 110)}`)
      }
    } else if (cmd === "call") {
      const r = await call(a, b ? JSON.parse(b) : {})
      console.log(textOf(r).slice(0, 4000) || JSON.stringify(r).slice(0, 4000))
    } else {
      console.log("list | call <도구> <JSON>")
    }
  } catch (e) {
    console.error("실패:", e.message)
    process.exitCode = 1
  }
}
