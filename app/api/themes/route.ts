/* 직접 만든 테마를 파일에 저장한다.
 *
 * 브라우저에만 두면 이 컴퓨터에서만 존재한다. 테마는 "이 시스템은 이렇게 생겼다" 는
 * 결정이라 팀이 함께 봐야 하고, 커밋할 수 있어야 한다.
 *
 * 개발 중에만 쓴다 — 배포된 앱이 자기 소스를 고치는 일은 없어야 한다. */
import { existsSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { NextResponse } from "next/server"

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
      if (existsSync(join(dir, "package.json")) && existsSync(join(dir, "data")))
        return dir
      const up = dirname(dir)
      if (up === dir) break
      dir = up
    }
  }
  return null
}

const ROOT = projectRoot()
const FILE = ROOT ? join(ROOT, "data", "themes.json") : null

export type SavedTheme = {
  id: string
  name: string
  /* 어느 모드에서 만든 값인지. 라이트와 다크는 값이 다르다. */
  mode: "light" | "dark"
  vars: Record<string, string>
  at: string
}

async function read(): Promise<SavedTheme[]> {
  if (!FILE) return []
  try {
    const parsed = JSON.parse(await readFile(FILE, "utf8"))
    return Array.isArray(parsed.themes) ? parsed.themes : []
  } catch {
    return []
  }
}

export async function GET() {
  return NextResponse.json({ themes: await read() })
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "개발 중에만 저장할 수 있습니다." },
      { status: 403 }
    )
  }
  if (!FILE) {
    return NextResponse.json(
      { error: "data/themes.json 을 찾지 못했습니다." },
      { status: 500 }
    )
  }

  let body: { save?: SavedTheme; remove?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "본문을 읽을 수 없습니다." }, { status: 400 })
  }

  let themes = await read()

  if (body.remove) {
    themes = themes.filter((t) => t.id !== body.remove)
  }

  if (body.save) {
    const s = body.save
    if (!s.id || !s.name?.trim()) {
      return NextResponse.json({ error: "이름이 필요합니다." }, { status: 400 })
    }
    if (!s.vars || !Object.keys(s.vars).length) {
      return NextResponse.json(
        { error: "바꾼 값이 없어 저장할 것이 없습니다." },
        { status: 400 }
      )
    }
    /* 같은 id 면 덮어쓴다 — 이름을 고쳐 다시 저장하는 흐름을 위해. */
    themes = [...themes.filter((t) => t.id !== s.id), { ...s, name: s.name.trim() }]
  }

  themes.sort((a, b) => a.at.localeCompare(b.at))

  try {
    await writeFile(FILE, JSON.stringify({ themes }, null, 2) + "\n", "utf8")
  } catch (e) {
    return NextResponse.json(
      { error: `저장 실패: ${e instanceof Error ? e.message : String(e)}` },
      { status: 500 }
    )
  }
  return NextResponse.json({ themes })
}
