/* 로컬 전용 지그. /kit 에서 추출한 Paper 용 HTML 을 디스크로 흘려보낸다.
 * 제품 코드가 아니며 dev 에서만 동작한다. */
import { writeFile } from "node:fs/promises"
import { NextResponse } from "next/server"

const OUT =
  "C:\\Users\\kis85\\AppData\\Local\\Temp\\claude\\C--Users-kis85\\5363209a-6323-49a9-a307-e965154128f0\\scratchpad\\kit-export.json"

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "dev only" }, { status: 404 })
  }
  const body = await req.text()
  await writeFile(OUT, body, "utf8")
  return NextResponse.json({ ok: true, bytes: body.length, path: OUT })
}
