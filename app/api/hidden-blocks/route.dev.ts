/* 숨긴 블록 목록을 파일에 기록한다.
 *
 * localStorage 에 두면 이 브라우저에서만 사라진다. 그건 "정리" 가 아니라
 * "내 눈에서만 치우기" 다. 카탈로그를 큐레이션하는 일이므로 결과가 파일에 남아야
 * 커밋되고, 다른 컴퓨터에서도, 다른 사람에게도 같은 목록이 보인다.
 *
 * 개발 중에만 연다. 배포된 앱이 자기 소스를 고치는 일은 없어야 한다 —
 * 그때는 이 파일이 이미 커밋되어 정답으로 굳어 있다. */
import { existsSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { NextResponse } from "next/server"

/* 서버의 cwd 가 프로젝트 폴더라는 보장이 없다 — dev 서버를 어디서 띄웠느냐에 따라
 * 상위 폴더가 되기도 한다(여기서는 실제로 그랬다). 그래서 cwd 를 믿지 않고,
 * 이 파일 자신의 위치에서 package.json 이 있는 곳까지 올라가며 찾는다.
 * 못 찾으면 조용히 엉뚱한 곳에 쓰는 대신 실패한다. */
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
const FILE = ROOT ? join(ROOT, "data", "hidden-blocks.json") : null

async function read(): Promise<string[]> {
  if (!FILE) return []
  try {
    const raw = await readFile(FILE, "utf8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed.hidden) ? parsed.hidden : []
  } catch {
    return []
  }
}

export async function GET() {
  return NextResponse.json({ hidden: await read() })
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      {
        error:
          "개발 중에만 고칠 수 있습니다. 배포본에서는 data/hidden-blocks.json 이 이미 정해진 값입니다.",
      },
      { status: 403 }
    )
  }

  if (!FILE) {
    return NextResponse.json(
      { error: "data/hidden-blocks.json 을 찾지 못했습니다." },
      { status: 500 }
    )
  }

  let body: { hide?: unknown; restore?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "본문을 읽을 수 없습니다." }, { status: 400 })
  }

  const asIds = (v: unknown) =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []

  const hide = asIds(body.hide)
  const restore = new Set(asIds(body.restore))

  const next = [...new Set([...(await read()), ...hide])]
    .filter((id) => !restore.has(id))
    .sort()

  try {
    await writeFile(FILE, JSON.stringify({ hidden: next }, null, 2) + "\n", "utf8")
  } catch (e) {
    /* 쓰기 실패는 삼키지 않는다. 화면에서는 성공한 것처럼 보이고
     * 새로고침하면 되돌아가 있는 게 가장 나쁜 결과다. */
    return NextResponse.json(
      { error: `저장 실패: ${e instanceof Error ? e.message : String(e)}` },
      { status: 500 }
    )
  }
  return NextResponse.json({ hidden: next })
}
