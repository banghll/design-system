/* /examples 페이지를 생성한다. 직접 고치지 말 것.
 * shadcn/ui 레포(MIT)의 컴포넌트별 표준 예제를 군으로 묶고, 각각에 쓰임을 붙인다.
 * /kit 이 우리가 쓴 예시라면, 여기는 원작자가 의도한 쓰임이다. */
import fs from "node:fs"

const list = JSON.parse(fs.readFileSync("components/examples/_list.json", "utf8"))

/* 컴포넌트 → 언제 쓰나. 한 줄이면 충분하고, 길면 안 읽는다. */
const NOTE = {
  button: "화면에서 무언가를 실행시키는 기본 단위. 주·보조·위험을 variant 로 가른다",
  "button-group": "성격이 같은 버튼을 하나의 덩어리로. 기간·보기 전환 같은 배타 선택",
  toggle: "눌린 상태가 남는 버튼. 굵게·기울임 같은 서식",
  "toggle-group": "토글 여러 개를 한 축으로 묶는다. 단일·다중 선택",
  kbd: "단축키 표기. 실행이 아니라 안내다",
  input: "한 줄 값. 기본·비활성·오류 상태를 다 갖춰야 한다",
  "input-group": "입력 앞뒤에 아이콘·단위·버튼을 붙일 때",
  "input-otp": "인증번호처럼 자릿수가 정해진 입력",
  textarea: "여러 줄 값. 길이 제한이 있으면 같이 보여준다",
  "native-select": "브라우저 기본 선택. 모바일에서 가장 익숙하다",
  select: "직접 그린 선택. 그룹·구분선·아이콘이 필요할 때",
  combobox: "선택지가 많아 검색이 필요할 때",
  checkbox: "서로 무관한 항목을 여러 개 켠다",
  "radio-group": "서로 배타적인 것 중 하나",
  switch: "즉시 반영되는 on/off. 저장 버튼이 없다",
  slider: "범위 안의 값. 정확한 숫자보다 감각이 중요할 때",
  label: "입력과 짝을 이룬다. 클릭하면 입력으로 초점이 간다",
  field: "라벨 · 입력 · 설명 · 오류를 한 벌로 묶는 폼의 최소 단위",
  questionnaire: "여러 문항을 순서대로 받는 설문",
  badge: "상태·분류를 짧게. 누르는 것이 아니다",
  avatar: "사람이나 팀을 식별. 이미지가 없으면 이니셜",
  alert: "화면 안에 머무는 안내. 사라지지 않는다",
  card: "관련된 내용을 한 덩어리로 묶는 면",
  item: "목록의 한 줄. 아이콘 + 제목 + 설명 + 액션",
  empty: "보여줄 것이 없을 때. 다음 행동을 반드시 둔다",
  marker: "새로 생긴 것·바뀐 것을 표시",
  bubble: "말풍선. 보낸 사람에 따라 좌우가 갈린다",
  message: "대화 한 줄. 아바타 · 본문 · 시각",
  attachment: "붙인 파일. 올리는 중·실패 상태를 갖는다",
  progress: "끝이 정해진 작업의 진행률",
  spinner: "끝을 모르는 대기",
  skeleton: "올 내용의 자리를 미리 잡는다. 최종 레이아웃과 같은 모양",
  separator: "구분선. 여백으로 안 되는 자리에만",
  "aspect-ratio": "비율을 고정한다. 이미지·영상 자리",
  breadcrumb: "지금 어디인지, 어디서 왔는지",
  pagination: "긴 목록을 쪽으로 나눈다",
  tabs: "같은 자리에서 내용을 바꾼다. 서로 배타적인 묶음",
  accordion: "길어서 다 못 보여줄 때 접는다",
  collapsible: "한 덩어리를 접었다 편다",
  "navigation-menu": "제품 상단의 주 탐색. 하위 메뉴를 펼친다",
  menubar: "데스크톱 앱 스타일 메뉴 줄",
  table: "행과 열이 있는 데이터. 정렬·합계",
  chart: "추세와 비교. recharts 위에 우리 토큰을 씌운다",
  calendar: "날짜 하나 또는 범위",
  carousel: "가로로 넘기는 목록",
  command: "검색으로 실행하는 명령 팔레트",
  "scroll-area": "넘치는 내용을 자체 스크롤로. 페이지를 밀지 않는다",
  resizable: "사용자가 폭을 조절하는 분할 화면",
  "message-scroller": "새 메시지가 오면 아래로 따라가는 대화 목록",
  dialog: "지금 하던 일을 멈추고 처리해야 할 때",
  "alert-dialog": "되돌릴 수 없는 일. 확인 없이 못 지나간다",
  sheet: "옆에서 밀려 나오는 패널. 맥락을 안 잃는다",
  drawer: "아래에서 올라오는 패널. 모바일에 맞다",
  popover: "누른 자리 옆에 붙는 작은 면",
  "dropdown-menu": "한 버튼에 딸린 동작 목록",
  "context-menu": "우클릭으로 여는 그 자리의 동작",
  tooltip: "hover 로만 보이는 짧은 설명. 필수 정보를 넣지 않는다",
  "hover-card": "hover 로 미리보기. 링크를 안 눌러도 알게",
  sonner: "작업 결과를 잠깐 알린다. 조용한 성공이 기본",
}

const GROUPS = [
  ["e-action", "액션", "누르면 무언가 일어나는 것", ["button", "button-group", "toggle", "toggle-group", "kbd"]],
  ["e-input", "입력", "값을 받는 것", ["input", "input-group", "input-otp", "textarea", "native-select", "select", "combobox", "checkbox", "radio-group", "switch", "slider", "label", "field", "questionnaire"]],
  ["e-display", "표시", "상태와 내용을 보여주는 것", ["badge", "avatar", "alert", "card", "item", "empty", "marker", "bubble", "message", "attachment", "progress", "spinner", "skeleton", "separator", "aspect-ratio"]],
  ["e-nav", "탐색", "위치를 옮기고 접고 펴는 것", ["breadcrumb", "pagination", "tabs", "accordion", "collapsible", "navigation-menu", "menubar"]],
  ["e-data", "데이터", "목록 · 표 · 차트 · 날짜", ["table", "chart", "calendar", "carousel", "command", "scroll-area", "resizable", "message-scroller"]],
  ["e-overlay", "오버레이", "화면 위에 떠서 초점을 가져가는 것", ["dialog", "alert-dialog", "sheet", "drawer", "popover", "dropdown-menu", "context-menu", "tooltip", "hover-card", "sonner"]],
]

const SOLO = list.filter((n) => /^sidebar/.test(n))
const entries = list
  .filter((n) => !/^sidebar/.test(n))
  .map((n) => {
    const src = fs.readFileSync(`components/examples/${n}.tsx`, "utf8")
    const m =
      src.match(/export default function ([A-Za-z0-9_]+)/) ||
      src.match(/export function ([A-Za-z0-9_]+)/)
    return {
      id: n,
      comp: m[1],
      isDefault: /export default function/.test(src),
      name: n.replace(/-example$/, ""),
    }
  })

const imports = entries
  .map((e, i) =>
    e.isDefault
      ? `import E${i} from "@/components/examples/${e.id}"`
      : `import { ${e.comp} as E${i} } from "@/components/examples/${e.id}"`
  )
  .join("\n")

const byName = new Map(entries.map((e, i) => [e.name, i]))
const grouped = GROUPS.map(([id, label, note, members]) => ({
  id,
  label,
  note,
  members: members.filter((m) => byName.has(m)),
}))
const placed = new Set(grouped.flatMap((g) => g.members))
const rest = entries.map((e) => e.name).filter((n) => !placed.has(n))
if (rest.length) {
  grouped.push({ id: "e-etc", label: "그 외", note: "군에 넣지 않은 것", members: rest })
}

const groupsLiteral = grouped
  .map(
    (g) =>
      `  {\n    id: ${JSON.stringify(g.id)},\n    label: ${JSON.stringify(g.label)},\n    note: ${JSON.stringify(g.note)},\n    items: [\n${g.members
        .map(
          (m) =>
            `      { id: ${JSON.stringify(m)}, file: ${JSON.stringify(
              entries[byName.get(m)].id
            )}, note: ${JSON.stringify(NOTE[m] ?? "")}, Comp: E${byName.get(m)} },`
        )
        .join("\n")}\n    ],\n  },`
  )
  .join("\n")

const soloLinks = SOLO.map(
  (n) =>
    `          <a key="${n}" href="/examples/${n}" className="bg-card hover:border-foreground/30 rounded-lg border px-3 py-2.5 text-sm transition-colors">${n.replace(
      "-example",
      ""
    )}</a>`
).join("\n")

const page = `/* 공식 예제 카탈로그 — scripts/gen-examples.mjs 가 생성한다. 직접 고치지 말 것.
 * shadcn/ui 레포(MIT)의 컴포넌트별 예제 ${entries.length + SOLO.length}개.
 */
"use client"

import { CatalogHeader, CatalogShell, GroupHeader } from "@/components/catalog-shell"

${imports}

const GROUPS = [
${groupsLiteral}
]

export default function ExamplesPage() {
  return (
    <CatalogShell>
      <main className="mx-auto w-full max-w-[1200px] px-6 py-12 lg:px-10">
        <CatalogHeader title="공식 예제" count="${entries.length + SOLO.length}개">
          shadcn/ui 레포에 들어 있는 컴포넌트별 표준 예제다. 레지스트리로는 배포되지
          않아 레포에서 직접 받아왔다. 컴포넌트 갤러리가 우리가 쓴 예시라면, 여기는
          원작자가 의도한 쓰임이다.
        </CatalogHeader>

        <section className="mb-12">
          <GroupHeader
            title="앱 셸"
            note="화면 전체를 쓰는 예제라 각자 라우트로 열린다"
            count={${SOLO.length}}
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
${soloLinks}
          </div>
        </section>

        <div className="flex flex-col gap-14">
          {GROUPS.map((g) => (
            <section key={g.id} id={g.id} className="scroll-mt-6">
              <GroupHeader title={g.label} note={g.note} count={g.items.length} />
              <div className="flex flex-col gap-8">
                {g.items.map(({ id, file, note, Comp }) => (
                  <article key={id} id={id} className="scroll-mt-6">
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-sm font-medium">{id}</h3>
                        <code className="text-muted-foreground text-[11px]">
                          components/examples/{file}.tsx
                        </code>
                      </div>
                      {note ? (
                        <p className="text-muted-foreground mt-0.5 max-w-[60ch] text-xs">
                          {note}
                        </p>
                      ) : null}
                    </div>
                    <div className="rounded-lg border p-6">
                      <Comp />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </CatalogShell>
  )
}
`

/* 사이드바 예제는 화면 전체를 쓰는 앱 셸이라 인라인으로 넣으면 다른 예제를 덮는다. */
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
console.log(
  `군 ${grouped.length}개 · 인라인 ${entries.length}개 + 앱 셸 ${SOLO.length}개`
)
