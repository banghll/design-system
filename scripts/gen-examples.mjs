/* /examples 페이지를 생성한다. 직접 고치지 말 것.
 * shadcn/ui 레포의 컴포넌트별 공식 예제를 컴포넌트 이름순으로 늘어놓는다.
 * /kit 이 우리가 쓴 예시라면, 여기는 원작자가 의도한 표준 예시다. */
import fs from "node:fs"

const list = JSON.parse(fs.readFileSync("components/examples/_list.json", "utf8"))

const SOLO = list.filter(n=>/^sidebar/.test(n))
const entries = list.filter(n=>!/^sidebar/.test(n)).map((n) => {
  const src = fs.readFileSync(`components/examples/${n}.tsx`, "utf8")
  const m =
    src.match(/export default function ([A-Za-z0-9_]+)/) ||
    src.match(/export function ([A-Za-z0-9_]+)/)
  const isDefault = /export default function/.test(src)
  return { id: n, comp: m[1], isDefault, name: n.replace(/-example$/, "") }
})

const imports = entries
  .map((e, i) =>
    e.isDefault
      ? `import E${i} from "@/components/examples/${e.id}"`
      : `import { ${e.comp} as E${i} } from "@/components/examples/${e.id}"`
  )
  .join("\n")

const items = entries
  .map((e, i) => `  { id: ${JSON.stringify(e.name)}, file: ${JSON.stringify(e.id)}, Comp: E${i} },`)
  .join("\n")

const soloLinks = SOLO.map(
  (n) =>
    `          <a key="${n}" href="/examples/${n}" className="rounded-md border px-3 py-2 text-xs">${n}</a>`
).join("\n")

const page = `/* 공식 예제 카탈로그 — scripts/gen-examples.mjs 가 생성한다. 직접 고치지 말 것.
 * shadcn/ui 레포(MIT)의 컴포넌트별 예제 ${entries.length}개.
 * /kit 은 우리가 쓴 예시, 여기는 원작자가 의도한 표준 예시다.
 */
"use client"

import { CatalogShell } from "@/components/catalog-shell"

${imports}

const ITEMS = [
${items}
]

export default function ExamplesPage() {
  return (
    <CatalogShell>
    <main className="mx-auto w-full max-w-[1400px] px-6 py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">공식 예제 ${entries.length + SOLO.length}개</h1>
        <p className="text-muted-foreground mt-2 max-w-[62ch] text-sm">
          shadcn/ui 레포에 들어 있는 컴포넌트별 표준 예제다. 레지스트리로는 배포되지
          않아 레포에서 직접 받아왔다. <strong>/kit</strong> 이 우리가 쓴 예시라면,
          여기는 원작자가 의도한 쓰임이다.
        </p>
      </header>

      <nav className="mb-10 flex flex-wrap gap-1.5">
        {ITEMS.map((i) => (
          <a key={i.id} href={\`#\${i.id}\`} className="rounded-md border px-2 py-1 text-[11px]">
            {i.id}
          </a>
        ))}
      </nav>

      <section className="mb-10 rounded-lg border p-5">
        <h2 className="mb-1 text-sm font-medium">앱 셸 예제</h2>
        <p className="text-muted-foreground mb-3 text-xs">화면 전체를 쓰는 예제라 각자 라우트로 열린다</p>
        <div className="flex flex-wrap gap-2">
${soloLinks}
        </div>
      </section>

      <div className="flex flex-col gap-10">
        {ITEMS.map(({ id, file, Comp }) => (
          <section key={id} id={id} className="scroll-mt-6">
            <div className="mb-3 flex items-baseline gap-3 border-t pt-5">
              <h2 className="text-base font-medium">{id}</h2>
              <code className="text-muted-foreground text-[11px]">
                components/examples/{file}.tsx
              </code>
            </div>
            <div className="rounded-lg border p-6">
              <Comp />
            </div>
          </section>
        ))}
      </div>
    </main>
    </CatalogShell>
  )
}
`

/* 사이드바 예제는 화면 전체를 쓰는 앱 셸이라 인라인으로 넣으면 다른 예제를 덮는다.
 * 각자 라우트로 뺀다. */
for (const n of SOLO) {
  const src = fs.readFileSync(`components/examples/${n}.tsx`, "utf8")
  const m =
    src.match(/export default function ([A-Za-z0-9_]+)/) ||
    src.match(/export function ([A-Za-z0-9_]+)/)
  const isDefault = /export default function/.test(src)
  const imp = isDefault
    ? `import C from "@/components/examples/${n}"`
    : `import { ${m[1]} as C } from "@/components/examples/${n}"`
  fs.mkdirSync(`app/examples/${n}`, { recursive: true })
  fs.writeFileSync(
    `app/examples/${n}/page.tsx`,
    `/* ${n} — 앱 셸 예제라 화면 전체를 쓴다 */\n${imp}\n\nexport default function Page() {\n  return <C />\n}\n`
  )
}

fs.mkdirSync("app/examples", { recursive: true })
fs.writeFileSync("app/examples/page.tsx", page)
console.log(`인라인 ${entries.length}개 + 단독 라우트 ${SOLO.length}개 → app/examples`)
