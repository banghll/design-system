/* 카탈로그 내비 매니페스트.
 * 사이드바와 각 페이지가 같은 데이터를 본다 — 목록이 두 벌로 갈라지지 않게.
 * section 의 id 는 페이지 안 앵커와 같아야 한다. */

export type Section = {
  id: string
  label: string
  note: string
  count?: number
}

export type Page = {
  href: string
  label: string
  icon: string
  summary: string
  sections: Section[]
}

/* 컴포넌트 갤러리 — 우리가 쓴 예시 */
export const KIT_SECTIONS: Section[] = [
  {
    id: "g-action",
    label: "액션 · 입력",
    note: "누르면 무언가 일어나거나, 사용자가 값을 넣는 것",
  },
  { id: "g-display", label: "표시", note: "상태와 내용을 보여주는 것" },
  {
    id: "g-nav",
    label: "탐색 · 데이터",
    note: "위치를 옮기고, 접고 펴고, 목록과 표를 다루는 것",
  },
  {
    id: "g-overlay",
    label: "오버레이 · 팝업",
    note: "포털로 화면 위에 그려진다 — 트리거를 눌러야 보인다",
  },
  { id: "g-ai", label: "AI Elements", note: "대화 · 사고 과정 · 근거" },
  { id: "g-ai2", label: "AI · 산출물", note: "에이전트가 만들어낸 결과" },
]

/* 패턴 — 카드 하나가 한 쓰임 */
export const PATTERN_SECTIONS: Section[] = [
  {
    id: "empty",
    label: "빈 상태",
    note: "보여줄 것이 없을 때. 막다른 화면이 아니라 다음 행동이 있어야 한다",
    count: 5,
  },
  { id: "loading", label: "로딩 · 전이", note: "아직 오지 않았거나, 오는 중일 때", count: 3 },
  {
    id: "notice",
    label: "알림 · 안내",
    note: "사용자가 찾지 않아도 먼저 말해야 하는 것",
    count: 6,
  },
  { id: "form", label: "폼 · 설정", note: "값을 받고 저장하는 것", count: 17 },
  { id: "metric", label: "지표 · 차트", note: "숫자와 추세를 읽히게 하는 것", count: 16 },
  { id: "list", label: "목록 · 표", note: "여러 개를 나란히 다루는 것", count: 7 },
  { id: "media", label: "미디어 · 파일", note: "이미지 · 소리 · 업로드", count: 6 },
  { id: "device", label: "기기 제어", note: "물리 기기의 상태를 바꾸는 것", count: 3 },
  { id: "dev", label: "개발 · 운영", note: "만드는 사람이 보는 화면", count: 5 },
  { id: "ai", label: "AI 대화", note: "에이전트와 주고받는 형태", count: 6 },
]

/* 공식 예제 — 컴포넌트별 표준 쓰임. 이름이 곧 컴포넌트다. */
export const EXAMPLE_GROUPS: { id: string; label: string; note: string; members: string[] }[] = [
  {
    id: "e-action",
    label: "액션",
    note: "누르면 무언가 일어나는 것",
    members: ["button", "button-group", "toggle", "toggle-group", "kbd"],
  },
  {
    id: "e-input",
    label: "입력",
    note: "값을 받는 것",
    members: [
      "input",
      "input-group",
      "input-otp",
      "textarea",
      "native-select",
      "select",
      "combobox",
      "checkbox",
      "radio-group",
      "switch",
      "slider",
      "label",
      "field",
      "questionnaire",
    ],
  },
  {
    id: "e-display",
    label: "표시",
    note: "상태와 내용을 보여주는 것",
    members: [
      "badge",
      "avatar",
      "alert",
      "card",
      "item",
      "empty",
      "marker",
      "bubble",
      "message",
      "attachment",
      "progress",
      "spinner",
      "skeleton",
      "separator",
      "aspect-ratio",
    ],
  },
  {
    id: "e-nav",
    label: "탐색",
    note: "위치를 옮기고 접고 펴는 것",
    members: [
      "breadcrumb",
      "pagination",
      "tabs",
      "accordion",
      "collapsible",
      "navigation-menu",
      "menubar",
    ],
  },
  {
    id: "e-data",
    label: "데이터",
    note: "목록 · 표 · 차트 · 날짜",
    members: [
      "table",
      "chart",
      "calendar",
      "carousel",
      "command",
      "scroll-area",
      "resizable",
      "message-scroller",
    ],
  },
  {
    id: "e-overlay",
    label: "오버레이",
    note: "화면 위에 떠서 초점을 가져가는 것",
    members: [
      "dialog",
      "alert-dialog",
      "sheet",
      "drawer",
      "popover",
      "dropdown-menu",
      "context-menu",
      "tooltip",
      "hover-card",
      "sonner",
    ],
  },
]

/* 블록 — 완성 화면 */
export const BLOCK_SECTIONS: Section[] = [
  { id: "sidebar", label: "앱 셸", note: "사이드바 + 본문. 제품 화면의 뼈대", count: 16 },
  {
    id: "dashboard",
    label: "대시보드",
    note: "지표 · 차트 · 데이터 테이블 한 벌",
    count: 1,
  },
  {
    id: "preview",
    label: "쇼케이스",
    note: "create 페이지의 미리보기. 레지스트리엔 껍데기만 있어 레포에서 직접 받아왔다",
    count: 3,
  },
  { id: "login", label: "로그인", note: "인증 진입 화면", count: 5 },
  { id: "signup", label: "가입", note: "계정 생성 화면", count: 5 },
  {
    id: "calendars",
    label: "캘린더 · 차트",
    note: "라우트가 아니라 컴포넌트 — 38개를 한 페이지에 모아 놓았다",
    count: 1,
  },
]

export const PAGES: Page[] = [
  {
    href: "/",
    label: "파운데이션",
    icon: "palette",
    summary: "색과 타이포. 값의 출처",
    sections: [],
  },
  {
    href: "/kit",
    label: "컴포넌트",
    icon: "component",
    summary: "낱개 109개 — 우리가 쓴 예시",
    sections: KIT_SECTIONS,
  },
  {
    href: "/examples",
    label: "공식 예제",
    icon: "file-stack",
    summary: "컴포넌트별 표준 쓰임 64개",
    sections: EXAMPLE_GROUPS.map(({ id, label, note, members }) => ({
      id,
      label,
      note,
      count: members.length,
    })),
  },
  {
    href: "/patterns",
    label: "패턴",
    icon: "boxes",
    summary: "카드 74개 — 언제 쓰는지로 묶었다",
    sections: PATTERN_SECTIONS,
  },
  {
    href: "/blocks",
    label: "블록",
    icon: "blocks",
    summary: "완성 화면 31개",
    sections: BLOCK_SECTIONS,
  },
]
