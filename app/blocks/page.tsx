/* 블록 갤러리 — 공식 shadcn 블록을 종류별로 모아 링크한다.
 * 블록은 하나가 한 화면이라 갤러리에 나란히 넣을 수 없다. 목록 + 실제 라우트로 연다.
 * 목록은 app/blocks/ 를 직접 읽어 만든다 — 손으로 관리하지 않는다.
 */
import fs from "node:fs"
import path from "node:path"

import Link from "next/link"

import { Badge } from "@/components/ui/badge"

const GROUPS: { key: string; title: string; note: string }[] = [
  { key: "sidebar", title: "앱 셸", note: "사이드바 + 본문. 제품 화면의 뼈대" },
  { key: "dashboard", title: "대시보드", note: "지표 · 차트 · 데이터 테이블 한 벌" },
  { key: "login", title: "로그인", note: "인증 진입 화면" },
  { key: "signup", title: "가입", note: "계정 생성 화면" },
  { key: "calendar", title: "캘린더", note: "날짜 선택의 변형들" },
  { key: "chart", title: "차트", note: "recharts 기반 기본형" },
]

function readBlocks() {
  const dir = path.join(process.cwd(), "app", "blocks")
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
}

export default function BlocksIndex() {
  const blocks = readBlocks()
  const grouped = GROUPS.map((g) => ({
    ...g,
    items: blocks.filter((b) => b.startsWith(g.key)),
  })).filter((g) => g.items.length > 0)
  const other = blocks.filter(
    (b) => !GROUPS.some((g) => b.startsWith(g.key))
  )

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="secondary">공식 shadcn</Badge>
          <Badge variant="outline">{blocks.length}개</Badge>
        </div>
        <h1 className="text-title-xl">블록</h1>
        <p className="text-body-sm text-subtle mt-2 max-w-[62ch]">
          낱개 컴포넌트를 조립해 놓은 완성 화면이다. 블록 하나가 화면 하나라
          갤러리에 나란히 놓을 수 없어, 각각을 실제 라우트로 연다. 색과 타이포는
          slate 파운데이션을 그대로 물려받는다.
        </p>
        <p className="text-body-sm text-subtle mt-3">
          <Link href="/kit" className="underline underline-offset-4">
            낱개 컴포넌트 갤러리 →
          </Link>
        </p>
      </header>

      <div className="flex flex-col gap-10">
        {grouped.map((g) => (
          <section key={g.key}>
            <div className="mb-4 border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-baseline gap-3">
                <h2 className="text-heading-md">{g.title}</h2>
                <span className="text-caption-2xs text-subtle">
                  {g.items.length}개
                </span>
              </div>
              <p className="text-body-sm text-subtle mt-1">{g.note}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {g.items.map((b) => (
                <Link
                  key={b}
                  href={`/blocks/${b}`}
                  className="text-body-sm rounded-lg border px-3 py-2.5 transition-colors"
                  style={{
                    borderColor: "var(--color-border-faint)",
                    background: "var(--color-card)",
                  }}
                >
                  {b}
                </Link>
              ))}
            </div>
          </section>
        ))}

        {other.length > 0 ? (
          <section>
            <div className="mb-4 border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
              <h2 className="text-heading-md">그 외</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {other.map((b) => (
                <Link
                  key={b}
                  href={`/blocks/${b}`}
                  className="text-body-sm rounded-lg border px-3 py-2.5"
                  style={{
                    borderColor: "var(--color-border-faint)",
                    background: "var(--color-card)",
                  }}
                >
                  {b}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
