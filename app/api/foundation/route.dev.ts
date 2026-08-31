/* 파운데이션을 고친다 — 더하고, 바꾸고, 지운다.
 *
 * 예전에는 화면에서 색을 더해도 그건 그 브라우저의 인라인 스타일이었다.
 * 새로고침하면 사라지고, 레포에는 안 들어가고, 컴포넌트 편집기의 «면 색»
 * 목록에도 안 떴다 — 더할 수는 있는데 쓸 수는 없는 색이었다.
 * 여기서 고치면 data/foundation.json 이 바뀌고, globals.css 가 다시 생성되고,
 * 그때부터 그 색은 다른 색들과 똑같은 자격을 갖는다.
 *
 * 흐름은 두 걸음이다.
 *   1) POST { change }            → 파운데이션을 고치고 «정리할 것» 목록을 돌려준다
 *   2) POST { fixes }             → 그중 사람이 고른 것만 레시피에 반영한다
 *
 * 한 걸음으로 하지 않는 이유 — 지우는 순간 그 이름을 가리키던 자리들이 전부
 * 어딘가로 옮겨져야 하는데, 어디로 옮길지는 추측이 섞인다. 추측을 조용히
 * 실행하면 나중에 «내가 언제 이걸 바꿨지» 가 된다. 보여 주고 고르게 한다.
 *
 * 개발 중에만 쓴다 — 배포된 앱이 자기 소스를 고치는 일은 없어야 한다. */
import { execFile } from "node:child_process"
import { existsSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { promisify } from "node:util"
import { fileURLToPath } from "node:url"
import { NextResponse } from "next/server"

import {
  applyFixes,
  normalizeName,
  plan,
  type Change,
  type Fix,
  type FoundationData,
} from "@/lib/reconcile"

const run = promisify(execFile)

/* cwd 가 프로젝트라는 보장이 없다. 이 파일 자신의 위치에서 올라가며 찾는다. */
function projectRoot() {
  const here = (() => {
    try {
      return dirname(fileURLToPath(import.meta.url))
    } catch {
      return null
    }
  })()
  const seen = new Set<string>()
  for (const start of [here, process.cwd()]) {
    let dir = start
    while (dir && !seen.has(dir)) {
      seen.add(dir)
      if (existsSync(join(dir, "package.json")) && existsSync(join(dir, "data"))) return dir
      const up = dirname(dir)
      if (up === dir) break
      dir = up
    }
  }
  return null
}

const ROOT = projectRoot()
const FOUNDATION = ROOT ? join(ROOT, "data", "foundation.json") : null
const COMPONENTS = ROOT ? join(ROOT, "data", "components.json") : null

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(file, "utf8")) as T
}

/* 값이 바뀌면 globals.css 도 함께 바뀌어야 한다. 여기서 안 돌리면
 * 「저장했는데 화면은 그대로」 가 되고, 그건 이 도구가 고치려던 바로 그 증상이다. */
async function regenerate() {
  if (!ROOT) return
  await run(process.execPath, [join("scripts", "gen-tokens.mjs")], { cwd: ROOT })
  /* 색인도 따라온다 — 안 돌리면 검색과 상세 화면이 옛 목록을 계속 보여 준다. */
  await run(process.execPath, [join("scripts", "gen-registry.mjs")], { cwd: ROOT }).catch(() => {})
}

function guard() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "개발 중에만 고칠 수 있습니다." }, { status: 403 })
  }
  if (!FOUNDATION || !COMPONENTS) {
    return NextResponse.json({ error: "data/ 를 찾지 못했습니다." }, { status: 500 })
  }
  return null
}

export async function GET() {
  if (!FOUNDATION) return NextResponse.json({ error: "data/ 없음" }, { status: 500 })
  return NextResponse.json({ foundation: await readJson<FoundationData>(FOUNDATION) })
}

export async function POST(req: Request) {
  const denied = guard()
  if (denied) return denied

  let body: { change?: Change; fixes?: Fix[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "본문을 읽을 수 없습니다." }, { status: 400 })
  }

  const foundation = await readJson<FoundationData>(FOUNDATION!)
  const components = await readJson<Record<string, unknown>>(COMPONENTS!)

  /* ── 2단계: 고른 정리만 반영한다 ─────────────────────────── */
  if (body.fixes?.length) {
    const next = applyFixes(components, body.fixes)
    /* merge · drop · pair 는 파운데이션 쪽 일이라 여기서 함께 처리한다. */
    for (const fix of body.fixes) {
      const name = fix.where.replace(/^color\./, "")
      if (fix.kind === "drop" && fix.where.startsWith("color.")) delete foundation.color[name]
      if (fix.kind === "merge" && fix.where.startsWith("color.")) delete foundation.color[name]
      if (fix.kind === "pair" && fix.to) {
        /* 짝이 되는 글자색은 면의 반대편에서 시작한다 — 흰 면에 흰 글자를
         * 만들어 두면 «왜 안 보이지» 로 돌아온다. */
        foundation.color[fix.to] = {
          light: "oklch(0.985 0 0)",
          dark: "oklch(0.205 0 0)",
          $doc: `«${fix.from}» 면 위에 얹히는 글자`,
        }
      }
    }
    await writeFile(COMPONENTS!, JSON.stringify(next, null, 2) + "\n", "utf8")
    await writeFile(FOUNDATION!, JSON.stringify(foundation, null, 2) + "\n", "utf8")
    await regenerate()
    return NextResponse.json({ foundation, applied: body.fixes.length })
  }

  /* ── 1단계: 파운데이션을 고치고 정리 목록을 만든다 ────────── */
  const change = body.change
  if (!change) return NextResponse.json({ error: "무엇을 고칠지가 없습니다." }, { status: 400 })

  const before = JSON.parse(JSON.stringify(foundation)) as FoundationData
  const name = normalizeName(change.name)
  if (!name) return NextResponse.json({ error: "이름이 필요합니다." }, { status: 400 })

  foundation.color ??= {}
  foundation.text ??= {}
  const bucket = change.layer === "color" ? foundation.color : foundation.text

  switch (change.kind) {
    case "add":
      if (bucket[name]) {
        return NextResponse.json({ error: `«${name}» 은 이미 있습니다.` }, { status: 400 })
      }
      bucket[name] = change.value as never
      break
    case "update":
      if (!bucket[name]) {
        return NextResponse.json({ error: `«${name}» 이 없습니다.` }, { status: 404 })
      }
      bucket[name] = change.value as never
      break
    case "remove":
      if (!bucket[name]) {
        return NextResponse.json({ error: `«${name}» 이 없습니다.` }, { status: 404 })
      }
      delete bucket[name]
      break
    case "rename": {
      const to = normalizeName(change.to)
      if (!bucket[name]) {
        return NextResponse.json({ error: `«${name}» 이 없습니다.` }, { status: 404 })
      }
      if (bucket[to]) {
        return NextResponse.json({ error: `«${to}» 은 이미 있습니다.` }, { status: 400 })
      }
      bucket[to] = bucket[name]
      delete bucket[name]
      break
    }
    default:
      return NextResponse.json({ error: "모르는 변경입니다." }, { status: 400 })
  }

  await writeFile(FOUNDATION!, JSON.stringify(foundation, null, 2) + "\n", "utf8")
  try {
    await regenerate()
  } catch (e) {
    /* 되돌린다. 반쯤 반영된 상태로 두면 데이터와 CSS 가 어긋난 채 남는다. */
    await writeFile(FOUNDATION!, JSON.stringify(before, null, 2) + "\n", "utf8")
    return NextResponse.json(
      { error: `생성에 실패해 되돌렸습니다: ${e instanceof Error ? e.message : String(e)}` },
      { status: 500 }
    )
  }

  const fixes = plan(foundation, components, { ...change, name } as Change, before)
  return NextResponse.json({ foundation, fixes })
}
