/* 공식 예제 카탈로그 — scripts/gen-examples.mjs 가 생성한다. 직접 고치지 말 것.
 * shadcn/ui 레포(MIT)의 컴포넌트별 예제 64개.
 */
"use client"

import { CatalogHeader, CatalogShell, GroupHeader } from "@/components/catalog-shell"

import E0 from "@/components/examples/accordion-example"
import E1 from "@/components/examples/alert-dialog-example"
import E2 from "@/components/examples/alert-example"
import E3 from "@/components/examples/aspect-ratio-example"
import E4 from "@/components/examples/attachment-example"
import E5 from "@/components/examples/avatar-example"
import E6 from "@/components/examples/badge-example"
import E7 from "@/components/examples/breadcrumb-example"
import E8 from "@/components/examples/bubble-example"
import E9 from "@/components/examples/button-example"
import E10 from "@/components/examples/button-group-example"
import E11 from "@/components/examples/calendar-example"
import E12 from "@/components/examples/card-example"
import E13 from "@/components/examples/carousel-example"
import E14 from "@/components/examples/chart-example"
import E15 from "@/components/examples/checkbox-example"
import E16 from "@/components/examples/collapsible-example"
import E17 from "@/components/examples/combobox-example"
import E18 from "@/components/examples/command-example"
import { ComponentExample as E19 } from "@/components/examples/component-example"
import E20 from "@/components/examples/context-menu-example"
import E21 from "@/components/examples/dialog-example"
import E22 from "@/components/examples/drawer-example"
import E23 from "@/components/examples/dropdown-menu-example"
import E24 from "@/components/examples/empty-example"
import E25 from "@/components/examples/field-example"
import E26 from "@/components/examples/hover-card-example"
import E27 from "@/components/examples/input-example"
import E28 from "@/components/examples/input-group-example"
import E29 from "@/components/examples/input-otp-example"
import E30 from "@/components/examples/item-example"
import E31 from "@/components/examples/kbd-example"
import E32 from "@/components/examples/label-example"
import E33 from "@/components/examples/marker-example"
import E34 from "@/components/examples/menubar-example"
import E35 from "@/components/examples/message-example"
import E36 from "@/components/examples/message-scroller-example"
import E37 from "@/components/examples/native-select-example"
import E38 from "@/components/examples/navigation-menu-example"
import E39 from "@/components/examples/pagination-example"
import E40 from "@/components/examples/popover-example"
import E41 from "@/components/examples/progress-example"
import E42 from "@/components/examples/questionnaire-example"
import E43 from "@/components/examples/radio-group-example"
import E44 from "@/components/examples/resizable-example"
import E45 from "@/components/examples/scroll-area-example"
import E46 from "@/components/examples/select-example"
import E47 from "@/components/examples/separator-example"
import E48 from "@/components/examples/sheet-example"
import E49 from "@/components/examples/skeleton-example"
import E50 from "@/components/examples/slider-example"
import E51 from "@/components/examples/sonner-example"
import E52 from "@/components/examples/spinner-example"
import E53 from "@/components/examples/switch-example"
import E54 from "@/components/examples/table-example"
import E55 from "@/components/examples/tabs-example"
import E56 from "@/components/examples/textarea-example"
import E57 from "@/components/examples/toggle-example"
import E58 from "@/components/examples/toggle-group-example"
import E59 from "@/components/examples/tooltip-example"

const GROUPS = [
  {
    id: "e-action",
    label: "액션",
    note: "누르면 무언가 일어나는 것",
    items: [
      { id: "button", file: "button-example", note: "화면에서 무언가를 실행시키는 기본 단위. 주·보조·위험을 variant 로 가른다", Comp: E9 },
      { id: "button-group", file: "button-group-example", note: "성격이 같은 버튼을 하나의 덩어리로. 기간·보기 전환 같은 배타 선택", Comp: E10 },
      { id: "toggle", file: "toggle-example", note: "눌린 상태가 남는 버튼. 굵게·기울임 같은 서식", Comp: E57 },
      { id: "toggle-group", file: "toggle-group-example", note: "토글 여러 개를 한 축으로 묶는다. 단일·다중 선택", Comp: E58 },
      { id: "kbd", file: "kbd-example", note: "단축키 표기. 실행이 아니라 안내다", Comp: E31 },
    ],
  },
  {
    id: "e-input",
    label: "입력",
    note: "값을 받는 것",
    items: [
      { id: "input", file: "input-example", note: "한 줄 값. 기본·비활성·오류 상태를 다 갖춰야 한다", Comp: E27 },
      { id: "input-group", file: "input-group-example", note: "입력 앞뒤에 아이콘·단위·버튼을 붙일 때", Comp: E28 },
      { id: "input-otp", file: "input-otp-example", note: "인증번호처럼 자릿수가 정해진 입력", Comp: E29 },
      { id: "textarea", file: "textarea-example", note: "여러 줄 값. 길이 제한이 있으면 같이 보여준다", Comp: E56 },
      { id: "native-select", file: "native-select-example", note: "브라우저 기본 선택. 모바일에서 가장 익숙하다", Comp: E37 },
      { id: "select", file: "select-example", note: "직접 그린 선택. 그룹·구분선·아이콘이 필요할 때", Comp: E46 },
      { id: "combobox", file: "combobox-example", note: "선택지가 많아 검색이 필요할 때", Comp: E17 },
      { id: "checkbox", file: "checkbox-example", note: "서로 무관한 항목을 여러 개 켠다", Comp: E15 },
      { id: "radio-group", file: "radio-group-example", note: "서로 배타적인 것 중 하나", Comp: E43 },
      { id: "switch", file: "switch-example", note: "즉시 반영되는 on/off. 저장 버튼이 없다", Comp: E53 },
      { id: "slider", file: "slider-example", note: "범위 안의 값. 정확한 숫자보다 감각이 중요할 때", Comp: E50 },
      { id: "label", file: "label-example", note: "입력과 짝을 이룬다. 클릭하면 입력으로 초점이 간다", Comp: E32 },
      { id: "field", file: "field-example", note: "라벨 · 입력 · 설명 · 오류를 한 벌로 묶는 폼의 최소 단위", Comp: E25 },
      { id: "questionnaire", file: "questionnaire-example", note: "여러 문항을 순서대로 받는 설문", Comp: E42 },
    ],
  },
  {
    id: "e-display",
    label: "표시",
    note: "상태와 내용을 보여주는 것",
    items: [
      { id: "badge", file: "badge-example", note: "상태·분류를 짧게. 누르는 것이 아니다", Comp: E6 },
      { id: "avatar", file: "avatar-example", note: "사람이나 팀을 식별. 이미지가 없으면 이니셜", Comp: E5 },
      { id: "alert", file: "alert-example", note: "화면 안에 머무는 안내. 사라지지 않는다", Comp: E2 },
      { id: "card", file: "card-example", note: "관련된 내용을 한 덩어리로 묶는 면", Comp: E12 },
      { id: "item", file: "item-example", note: "목록의 한 줄. 아이콘 + 제목 + 설명 + 액션", Comp: E30 },
      { id: "empty", file: "empty-example", note: "보여줄 것이 없을 때. 다음 행동을 반드시 둔다", Comp: E24 },
      { id: "marker", file: "marker-example", note: "새로 생긴 것·바뀐 것을 표시", Comp: E33 },
      { id: "bubble", file: "bubble-example", note: "말풍선. 보낸 사람에 따라 좌우가 갈린다", Comp: E8 },
      { id: "message", file: "message-example", note: "대화 한 줄. 아바타 · 본문 · 시각", Comp: E35 },
      { id: "attachment", file: "attachment-example", note: "붙인 파일. 올리는 중·실패 상태를 갖는다", Comp: E4 },
      { id: "progress", file: "progress-example", note: "끝이 정해진 작업의 진행률", Comp: E41 },
      { id: "spinner", file: "spinner-example", note: "끝을 모르는 대기", Comp: E52 },
      { id: "skeleton", file: "skeleton-example", note: "올 내용의 자리를 미리 잡는다. 최종 레이아웃과 같은 모양", Comp: E49 },
      { id: "separator", file: "separator-example", note: "구분선. 여백으로 안 되는 자리에만", Comp: E47 },
      { id: "aspect-ratio", file: "aspect-ratio-example", note: "비율을 고정한다. 이미지·영상 자리", Comp: E3 },
    ],
  },
  {
    id: "e-nav",
    label: "탐색",
    note: "위치를 옮기고 접고 펴는 것",
    items: [
      { id: "breadcrumb", file: "breadcrumb-example", note: "지금 어디인지, 어디서 왔는지", Comp: E7 },
      { id: "pagination", file: "pagination-example", note: "긴 목록을 쪽으로 나눈다", Comp: E39 },
      { id: "tabs", file: "tabs-example", note: "같은 자리에서 내용을 바꾼다. 서로 배타적인 묶음", Comp: E55 },
      { id: "accordion", file: "accordion-example", note: "길어서 다 못 보여줄 때 접는다", Comp: E0 },
      { id: "collapsible", file: "collapsible-example", note: "한 덩어리를 접었다 편다", Comp: E16 },
      { id: "navigation-menu", file: "navigation-menu-example", note: "제품 상단의 주 탐색. 하위 메뉴를 펼친다", Comp: E38 },
      { id: "menubar", file: "menubar-example", note: "데스크톱 앱 스타일 메뉴 줄", Comp: E34 },
    ],
  },
  {
    id: "e-data",
    label: "데이터",
    note: "목록 · 표 · 차트 · 날짜",
    items: [
      { id: "table", file: "table-example", note: "행과 열이 있는 데이터. 정렬·합계", Comp: E54 },
      { id: "chart", file: "chart-example", note: "추세와 비교. recharts 위에 우리 토큰을 씌운다", Comp: E14 },
      { id: "calendar", file: "calendar-example", note: "날짜 하나 또는 범위", Comp: E11 },
      { id: "carousel", file: "carousel-example", note: "가로로 넘기는 목록", Comp: E13 },
      { id: "command", file: "command-example", note: "검색으로 실행하는 명령 팔레트", Comp: E18 },
      { id: "scroll-area", file: "scroll-area-example", note: "넘치는 내용을 자체 스크롤로. 페이지를 밀지 않는다", Comp: E45 },
      { id: "resizable", file: "resizable-example", note: "사용자가 폭을 조절하는 분할 화면", Comp: E44 },
      { id: "message-scroller", file: "message-scroller-example", note: "새 메시지가 오면 아래로 따라가는 대화 목록", Comp: E36 },
    ],
  },
  {
    id: "e-overlay",
    label: "오버레이",
    note: "화면 위에 떠서 초점을 가져가는 것",
    items: [
      { id: "dialog", file: "dialog-example", note: "지금 하던 일을 멈추고 처리해야 할 때", Comp: E21 },
      { id: "alert-dialog", file: "alert-dialog-example", note: "되돌릴 수 없는 일. 확인 없이 못 지나간다", Comp: E1 },
      { id: "sheet", file: "sheet-example", note: "옆에서 밀려 나오는 패널. 맥락을 안 잃는다", Comp: E48 },
      { id: "drawer", file: "drawer-example", note: "아래에서 올라오는 패널. 모바일에 맞다", Comp: E22 },
      { id: "popover", file: "popover-example", note: "누른 자리 옆에 붙는 작은 면", Comp: E40 },
      { id: "dropdown-menu", file: "dropdown-menu-example", note: "한 버튼에 딸린 동작 목록", Comp: E23 },
      { id: "context-menu", file: "context-menu-example", note: "우클릭으로 여는 그 자리의 동작", Comp: E20 },
      { id: "tooltip", file: "tooltip-example", note: "hover 로만 보이는 짧은 설명. 필수 정보를 넣지 않는다", Comp: E59 },
      { id: "hover-card", file: "hover-card-example", note: "hover 로 미리보기. 링크를 안 눌러도 알게", Comp: E26 },
      { id: "sonner", file: "sonner-example", note: "작업 결과를 잠깐 알린다. 조용한 성공이 기본", Comp: E51 },
    ],
  },
  {
    id: "e-etc",
    label: "그 외",
    note: "군에 넣지 않은 것",
    items: [
      { id: "component", file: "component-example", note: "", Comp: E19 },
    ],
  },
]

export default function ExamplesPage() {
  return (
    <CatalogShell>
      <main className="mx-auto w-full max-w-[1200px] px-6 py-12 lg:px-10">
        <CatalogHeader title="공식 예제" count="64개">
          shadcn/ui 레포에 들어 있는 컴포넌트별 표준 예제다. 레지스트리로는 배포되지
          않아 레포에서 직접 받아왔다. 컴포넌트 갤러리가 우리가 쓴 예시라면, 여기는
          원작자가 의도한 쓰임이다.
        </CatalogHeader>

        <section className="mb-12">
          <GroupHeader
            title="앱 셸"
            note="화면 전체를 쓰는 예제라 각자 라우트로 열린다"
            count={4}
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <a key="sidebar-example" href="/examples/sidebar-example" className="bg-card hover:border-foreground/30 rounded-lg border px-3 py-2.5 text-sm transition-colors">sidebar</a>
          <a key="sidebar-floating-example" href="/examples/sidebar-floating-example" className="bg-card hover:border-foreground/30 rounded-lg border px-3 py-2.5 text-sm transition-colors">sidebar-floating</a>
          <a key="sidebar-icon-example" href="/examples/sidebar-icon-example" className="bg-card hover:border-foreground/30 rounded-lg border px-3 py-2.5 text-sm transition-colors">sidebar-icon</a>
          <a key="sidebar-inset-example" href="/examples/sidebar-inset-example" className="bg-card hover:border-foreground/30 rounded-lg border px-3 py-2.5 text-sm transition-colors">sidebar-inset</a>
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
