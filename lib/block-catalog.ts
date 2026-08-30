/* 블록 카탈로그 — 무엇이고 언제 고르는지.
 *
 * 화면을 만들 때 첫 결정은 "어떤 뼈대에 얹을 것인가"다. 사이드바만 17종이라
 * 이름(sidebar-07)만 보고는 고를 수 없다. 그래서 정의(what)와 선택 조건(when)을
 * 값으로 적어 둔다 — 목록 화면과 에이전트가 같은 문장을 본다.
 *
 * when 은 취향이 아니라 조건으로 쓴다. "깔끔할 때" 가 아니라
 * "메뉴가 20개 안쪽이고 depth 가 없을 때". 조건이라야 판단에 쓸 수 있다. */

import type { Copy } from "@/components/lang"

export type BlockMeta = {
  /** 라우트 이름. /blocks/<id> */
  id: string
  /** 사람이 읽는 이름 */
  title: Copy
  /** 무엇인가 — 구조의 정의 */
  what: Copy
  /** 언제 고르나 — 판단 조건 */
  when: Copy
  /** 구조를 이루는 특징 */
  tags: string[]
  group: string
}

export const BLOCKS: BlockMeta[] = [
  /* ── 앱 셸 ───────────────────────────────────────────── */
  {
    id: "sidebar-ours",
    group: "sidebar",
    title: { ko: "카탈로그 셸 (우리 것)", en: "Catalog shell (ours)" },
    what: {
      ko: "2단 사이드바. 상위 항목은 페이지 이동, 옆 화살표는 그 페이지 안의 구획 목록을 펼친다. 구획을 누르면 페이지를 옮기지 않고 해당 위치로 스크롤한다.",
      en: "A two-level sidebar. The top item navigates; the chevron beside it unfolds that page's sections. Picking a section scrolls in place instead of navigating.",
    },
    when: {
      ko: "페이지 수는 적은데 한 페이지 안의 항목이 많을 때. 문서·카탈로그·긴 설정 화면. 페이지마다 항목이 고르게 흩어져 있다면 평범한 1단 메뉴가 낫다.",
      en: "Few pages, many items inside each one — docs, catalogs, long settings. If items are spread evenly across many pages, a flat menu serves better.",
    },
    tags: ["Collapsible", "ScrollArea", "anchor", "2-level"],
  },
  {
    id: "sidebar-01",
    group: "sidebar",
    title: { ko: "기본 사이드바", en: "Basic sidebar" },
    what: {
      ko: "구획으로 묶인 평평한 메뉴 하나. 상단에 버전 선택기와 검색창이 붙는다.",
      en: "One flat menu grouped into sections, with a version switcher and search at the top.",
    },
    when: {
      ko: "메뉴가 20개 안쪽이고 하위 depth 가 없을 때. 다른 것을 고를 뚜렷한 이유가 없다면 여기서 시작한다.",
      en: "Under twenty items, no nesting. Start here unless you have a specific reason not to.",
    },
    tags: ["flat", "search", "version switcher"],
  },
  {
    id: "sidebar-02",
    group: "sidebar",
    title: { ko: "접히는 구획", en: "Collapsible sections" },
    what: {
      ko: "구획 제목 자체가 접기 버튼이다. 안 보는 묶음은 통째로 접어 둔다.",
      en: "Each section header is itself the toggle — fold away the groups you aren't using.",
    },
    when: {
      ko: "구획은 여럿인데 사용자가 늘 한두 개만 오갈 때. 목록이 화면 높이를 넘어서면 고려한다.",
      en: "Several sections but people only live in one or two. Worth it once the list runs past the viewport.",
    },
    tags: ["section fold", "Collapsible"],
  },
  {
    id: "sidebar-03",
    group: "sidebar",
    title: { ko: "하위 메뉴 (항상 펼침)", en: "Sub-items, always open" },
    what: {
      ko: "메뉴 아래 하위 항목이 들여쓰기로 늘 보인다. 접히지 않는다.",
      en: "Child items sit indented under their parent and never fold away.",
    },
    when: {
      ko: "depth 가 2단이고 전체 항목이 20개 안쪽일 때. 구조를 늘 보여 주는 게 이득인 규모에서만 성립한다.",
      en: "Two levels and under twenty items total — only worth it at a size where showing everything helps.",
    },
    tags: ["2 levels", "SidebarMenuSub"],
  },
  {
    id: "sidebar-04",
    group: "sidebar",
    title: { ko: "떠 있는 사이드바", en: "Floating sidebar" },
    what: {
      ko: 'variant="floating". 본문과 떨어져 카드처럼 배경 위에 떠 있다.',
      en: 'variant="floating" — detached from the content, resting on the background like a card.',
    },
    when: {
      ko: "배경에 색이나 이미지가 있을 때, 또는 제품보다 도구처럼 보이게 하고 싶을 때. 여백을 더 먹으므로 조밀한 업무 화면에는 맞지 않는다.",
      en: "When the background carries color or imagery, or you want it to read as a tool. It costs margin, so skip it on dense work screens.",
    },
    tags: ["floating", "2 levels"],
  },
  {
    id: "sidebar-05",
    group: "sidebar",
    title: { ko: "접히는 하위 메뉴", en: "Collapsible sub-items" },
    what: {
      ko: "상위를 눌러야 하위가 펼쳐진다. 03 의 접히는 판.",
      en: "Children appear only when the parent is opened — the folding version of 03.",
    },
    when: {
      ko: "depth 2단인데 항목이 20개를 넘을 때. 관리자 화면 대부분이 여기에 해당한다.",
      en: "Two levels with more than twenty items. Most admin surfaces land here.",
    },
    tags: ["2 levels", "fold"],
  },
  {
    id: "sidebar-06",
    group: "sidebar",
    title: { ko: "카드형 구획", en: "Sections as cards" },
    what: {
      ko: "구획마다 카드로 감싸 시각적으로 완전히 분리한다.",
      en: "Each section is wrapped in its own card, fully separated.",
    },
    when: {
      ko: "구획끼리 성격이 달라 섞이면 안 될 때 — 프로젝트 / 계정 / 결제처럼 소유자가 다른 것들.",
      en: "When sections are different in kind and must not blur together — project vs. account vs. billing.",
    },
    tags: ["Card", "hard separation"],
  },
  {
    id: "sidebar-07",
    group: "sidebar",
    title: { ko: "아이콘으로 접힘", en: "Collapses to icons" },
    what: {
      ko: 'collapsible="icon". 접으면 아이콘 열만 남는다. 팀 전환기가 위, 사용자 메뉴가 아래에 고정된다.',
      en: 'collapsible="icon" — folds down to a strip of icons. Team switcher pinned top, user menu pinned bottom.',
    },
    when: {
      ko: "본문이 넓어야 하는 제품 — 에디터, 넓은 표, 캔버스. SaaS 기본형에 가장 가깝다.",
      en: "Products where the canvas needs the width — editors, wide tables, drawing surfaces. The closest thing to a SaaS default.",
    },
    tags: ["icon fold", "team switcher", "user menu"],
  },
  {
    id: "sidebar-08",
    group: "sidebar",
    title: { ko: "인셋(안쪽) 사이드바", en: "Inset sidebar" },
    what: {
      ko: 'variant="inset". 본문이 둥근 판으로 한 겹 안에 들어가고, 보조 내비가 아래에 따로 붙는다.',
      en: 'variant="inset" — the content sits on an inset rounded panel, with secondary nav pinned below.',
    },
    when: {
      ko: "주 메뉴와 '도움말 · 설정' 같은 보조 메뉴를 시각적으로 나눠야 할 때. 요즘 shadcn 대시보드의 기본 모양이다.",
      en: "When primary nav and support nav (help, settings) need visual separation. The current shadcn dashboard default.",
    },
    tags: ["inset", "secondary nav"],
  },
  {
    id: "sidebar-09",
    group: "sidebar",
    title: { ko: "두 겹 사이드바", en: "Two-column sidebar" },
    what: {
      ko: "아이콘 열 + 그 옆의 목록 열. 아이콘을 바꾸면 옆 목록이 통째로 바뀐다.",
      en: "An icon rail plus a list column. Switching the icon swaps the entire list beside it.",
    },
    when: {
      ko: "'큰 분류 → 그 안의 목록' 이 항상 같이 보여야 할 때. 메일함, 알림함이 전형이다.",
      en: "When category and its contents must stay visible together — mailboxes and inboxes are the archetype.",
    },
    tags: ["dual column", "icon fold"],
  },
  {
    id: "sidebar-10",
    group: "sidebar",
    title: { ko: "팝오버 안의 사이드바", en: "Sidebar in a popover" },
    what: {
      ko: 'collapsible="none" 사이드바를 팝오버 안에 넣어 어디서든 띄운다.',
      en: 'A collapsible="none" sidebar placed inside a popover so it can be summoned anywhere.',
    },
    when: {
      ko: "본 화면에 셸을 둘 자리가 없는데 탐색은 필요할 때. 임베드 위젯, 좁은 화면.",
      en: "When there is no room for a shell but you still need navigation — embedded widgets, narrow viewports.",
    },
    tags: ["Popover", "none"],
  },
  {
    id: "sidebar-11",
    group: "sidebar",
    title: { ko: "파일 트리", en: "File tree" },
    what: {
      ko: "폴더를 접었다 펴는 트리. 깊이에 제한이 없다.",
      en: "A folding tree of folders with no depth limit.",
    },
    when: {
      ko: "구조가 사용자 데이터로 정해질 때 — 파일, 폴더, 조직도. 메뉴가 고정이면 트리를 쓰지 않는다.",
      en: "When the structure comes from user data — files, folders, org charts. Never for a fixed menu.",
    },
    tags: ["tree", "unbounded depth"],
  },
  {
    id: "sidebar-12",
    group: "sidebar",
    title: { ko: "달력이 든 사이드바", en: "Sidebar with a calendar" },
    what: {
      ko: "사이드바 안에 날짜 선택기와 캘린더 목록이 들어간다.",
      en: "A date picker and calendar list living inside the sidebar.",
    },
    when: {
      ko: "날짜 선택이 곧 탐색인 제품 — 일정, 예약, 로그 뷰어.",
      en: "When picking a date is how you navigate — schedules, bookings, log viewers.",
    },
    tags: ["Calendar", "DatePicker"],
  },
  {
    id: "sidebar-13",
    group: "sidebar",
    title: { ko: "설정 다이얼로그", en: "Settings dialog" },
    what: {
      ko: "다이얼로그 안에 사이드바를 두어 설정 탭을 만든다.",
      en: "A sidebar inside a dialog, turning settings into tabs.",
    },
    when: {
      ko: "설정 묶음이 5개를 넘어 탭으로는 모자라지만, 사용자를 지금 화면에서 떼어 놓고 싶지 않을 때.",
      en: "More than five setting groups — too many for tabs — but you don't want to take the user off the current screen.",
    },
    tags: ["Dialog", "settings"],
  },
  {
    id: "sidebar-14",
    group: "sidebar",
    title: { ko: "오른쪽 사이드바", en: "Right-side sidebar" },
    what: {
      ko: 'side="right". 본문이 왼쪽, 패널이 오른쪽.',
      en: 'side="right" — content on the left, panel on the right.',
    },
    when: {
      ko: "패널이 탐색이 아니라 '지금 선택한 것의 속성'일 때. 디자인 툴의 인스펙터 자리다.",
      en: "When the panel holds properties of the current selection rather than navigation — the inspector slot.",
    },
    tags: ["right", "inspector"],
  },
  {
    id: "sidebar-15",
    group: "sidebar",
    title: { ko: "좌우 양쪽", en: "Both sides" },
    what: {
      ko: "왼쪽은 탐색, 오른쪽은 보조 정보(달력 · 즐겨찾기), 본문은 가운데.",
      en: "Navigation left, context right (calendar, favorites), content in the middle.",
    },
    when: {
      ko: "탐색과 맥락 정보가 둘 다 상주해야 할 때. 1280px 이상을 전제로 한다 — 그보다 좁으면 오른쪽을 시트로 내린다.",
      en: "When navigation and context must both stay resident. Assumes 1280px+; below that, demote the right panel to a sheet.",
    },
    tags: ["both sides", "3 columns"],
  },
  {
    id: "sidebar-16",
    group: "sidebar",
    title: { ko: "고정 헤더 + 사이드바", en: "Sticky header + sidebar" },
    what: {
      ko: "상단에 붙어 있는 사이트 헤더 아래로 사이드바와 본문이 들어간다.",
      en: "A sticky site header spanning the top, with sidebar and content beneath it.",
    },
    when: {
      ko: "전역 검색·계정처럼 사이드바보다 상위에 있어야 하는 요소가 있을 때. 사이드바를 바꿔도 그대로 남는 것들.",
      en: "When something outranks the sidebar — global search, account — and must survive changing sections.",
    },
    tags: ["sticky header", "inset"],
  },

  /* ── 대시보드 ────────────────────────────────────────── */
  {
    id: "dashboard-01",
    group: "dashboard",
    title: { ko: "대시보드", en: "Dashboard" },
    what: {
      ko: "지표 카드 4개 + 면적 차트 + 정렬 · 필터 · 행 드래그가 되는 데이터 테이블 한 벌.",
      en: "Four metric cards, an area chart, and a data table with sorting, filtering and row dragging.",
    },
    when: {
      ko: "숫자로 상태를 훑고 목록에서 개별 건으로 들어가는 화면. 관리자 첫 페이지의 표준형이다.",
      en: "Scan the state in numbers, then drill into a single record. The standard admin landing page.",
    },
    tags: ["metric cards", "Chart", "DataTable", "inset"],
  },

  /* ── 쇼케이스 ────────────────────────────────────────── */
  {
    id: "preview",
    group: "preview",
    title: { ko: "쇼케이스 1", en: "Showcase 1" },
    what: {
      ko: "카드 · 폼 · 표 · 차트를 한 화면에 모아 스타일 전체를 한눈에 비교하게 만든 화면.",
      en: "Cards, forms, tables and charts gathered on one screen so a whole style can be judged at once.",
    },
    when: {
      ko: "테마나 프리셋을 바꿔 보고 전체 인상을 확인할 때만. 제품 화면으로 복사해 쓰는 것이 아니다.",
      en: "Only for judging a theme or preset. Not a screen to copy into a product.",
    },
    tags: ["theme check", "mixed"],
  },
  {
    id: "preview-02",
    group: "preview",
    title: { ko: "쇼케이스 2", en: "Showcase 2" },
    what: {
      ko: "같은 목적의 다른 조합 — 목록 · 설정 · 알림 위주.",
      en: "Same purpose, different mix — lists, settings and notices.",
    },
    when: {
      ko: "폼과 목록이 많은 제품의 인상을 볼 때.",
      en: "When the product is mostly forms and lists.",
    },
    tags: ["theme check", "forms"],
  },
  {
    id: "preview-03",
    group: "preview",
    title: { ko: "쇼케이스 3", en: "Showcase 3" },
    what: { ko: "차트와 데이터가 많은 조합.", en: "The chart- and data-heavy mix." },
    when: {
      ko: "데이터 제품의 인상을 볼 때 — 차트 색 다섯 계열이 실제로 구분되는지 확인한다.",
      en: "When the product is data-first — check that the five chart series actually separate.",
    },
    tags: ["theme check", "charts"],
  },

  /* ── 로그인 ─────────────────────────────────────────── */
  {
    id: "login-01",
    group: "login",
    title: { ko: "가운데 카드", en: "Centered card" },
    what: {
      ko: "이메일 + 비밀번호 카드가 화면 한가운데 놓인다.",
      en: "An email and password card centered in the viewport.",
    },
    when: {
      ko: "브랜드를 앞세울 필요가 없는 내부 도구·업무 제품의 기본값.",
      en: "The default for internal tools and work products, where brand isn't doing the selling.",
    },
    tags: ["card", "centered"],
  },
  {
    id: "login-02",
    group: "login",
    title: { ko: "좌우 분할", en: "Split" },
    what: { ko: "왼쪽 폼, 오른쪽 이미지.", en: "Form on the left, image on the right." },
    when: {
      ko: "브랜드 이미지나 제품 스크린샷을 같이 보여 주고 싶을 때. 이미지가 없으면 01 을 쓴다.",
      en: "When brand imagery or a product shot earns its place. Without a real image, use 01.",
    },
    tags: ["2 columns", "image"],
  },
  {
    id: "login-03",
    group: "login",
    title: { ko: "소셜 우선", en: "Social first" },
    what: {
      ko: "소셜 로그인 버튼이 위, 구분선 아래에 이메일이 놓인다.",
      en: "Social buttons on top, a divider, then email below.",
    },
    when: {
      ko: "실제 가입 경로의 절반 이상이 소셜일 때. 그렇지 않으면 순서를 뒤집는 게 맞다.",
      en: "When more than half of real sign-ins come through social. Otherwise flip the order.",
    },
    tags: ["OAuth", "divider"],
  },
  {
    id: "login-04",
    group: "login",
    title: { ko: "이미지 배경", en: "Image background" },
    what: { ko: "화면 전체 이미지 위에 폼을 얹는다.", en: "The form sits over a full-bleed image." },
    when: {
      ko: "첫인상이 전환에 영향을 주는 소비자 제품. 이미지 위 글자 대비를 반드시 확인한다.",
      en: "Consumer products where first impression moves conversion. Verify text contrast over the image.",
    },
    tags: ["background image"],
  },
  {
    id: "login-05",
    group: "login",
    title: { ko: "매직 링크", en: "Magic link" },
    what: { ko: "이메일 한 칸만. 비밀번호 항목이 없다.", en: "One email field. No password at all." },
    when: {
      ko: "비밀번호를 아예 두지 않기로 한 제품. 메일이 늦게 도착할 때의 안내 문구가 함께 있어야 한다.",
      en: "Products that decided against passwords. Ship the 'mail is slow' copy alongside it.",
    },
    tags: ["single field", "passwordless"],
  },

  /* ── 가입 ───────────────────────────────────────────── */
  {
    id: "signup-01",
    group: "signup",
    title: { ko: "가운데 카드", en: "Centered card" },
    what: { ko: "이름 · 이메일 · 비밀번호 한 벌.", en: "Name, email, password." },
    when: {
      ko: "가입 항목이 3~4개로 끝날 때. 그보다 많으면 단계를 나눈다.",
      en: "When sign-up is three or four fields. More than that, split it into steps.",
    },
    tags: ["card", "centered"],
  },
  {
    id: "signup-02",
    group: "signup",
    title: { ko: "좌우 분할", en: "Split" },
    what: { ko: "왼쪽 폼, 오른쪽 이미지.", en: "Form left, image right." },
    when: {
      ko: "가입할 이유를 옆에서 계속 설득해야 할 때.",
      en: "When the reason to sign up still needs arguing beside the form.",
    },
    tags: ["2 columns", "image"],
  },
  {
    id: "signup-03",
    group: "signup",
    title: { ko: "소셜 우선", en: "Social first" },
    what: { ko: "소셜 버튼 위, 이메일 아래.", en: "Social buttons above, email below." },
    when: {
      ko: "마찰을 최대한 줄여야 하는 제품. 나중에 프로필을 채우게 하는 흐름과 함께 쓴다.",
      en: "When friction is the enemy. Pair it with a fill-in-your-profile-later flow.",
    },
    tags: ["OAuth"],
  },
  {
    id: "signup-04",
    group: "signup",
    title: { ko: "이미지 배경", en: "Image background" },
    what: { ko: "전면 이미지 위 폼.", en: "Form over a full-bleed image." },
    when: {
      ko: "브랜드 인상이 전환율에 직접 영향을 주는 소비자 제품.",
      en: "Consumer products where brand impression moves the number directly.",
    },
    tags: ["background image"],
  },
  {
    id: "signup-05",
    group: "signup",
    title: { ko: "약관 동의형", en: "With consent" },
    what: {
      ko: "체크박스로 약관·개인정보 동의를 개별로 받는다.",
      en: "Individual checkboxes for terms and privacy consent.",
    },
    when: {
      ko: "동의 항목이 법적으로 분리돼야 할 때. 국내 서비스는 대개 여기에 해당한다.",
      en: "When consent must be legally separable — the norm for Korean services.",
    },
    tags: ["Checkbox", "consent"],
  },

  /* ── 캘린더 ─────────────────────────────────────────── */
  {
    id: "calendars",
    group: "calendars",
    title: { ko: "캘린더 모음", en: "Calendar variants" },
    what: {
      ko: "라우트가 아니라 Calendar 컴포넌트의 변형 38개를 한 페이지에 모아 놓은 것.",
      en: "Not a route but 38 variants of the Calendar component gathered on one page.",
    },
    when: {
      ko: "날짜 UI 를 고를 때. 단일 · 범위 · 다중 · 드롭다운 이동 · 최소 최대 제한 중 무엇이 필요한지 여기서 정한다.",
      en: "When choosing a date UI — single, range, multiple, dropdown navigation, min/max bounds. Decide here.",
    },
    tags: ["Calendar", "38 variants"],
  },
]

export const BLOCK_GROUPS: { key: string; title: Copy; note: Copy }[] = [
  {
    key: "sidebar",
    title: { ko: "앱 셸", en: "App shell" },
    note: {
      ko: "본문이 어디에 놓이고 탐색이 어디에 붙는지를 정하는 층. 나머지 모든 것이 이 안에 들어가므로 가장 먼저, 그리고 가장 되돌리기 어려운 결정이다. 고르는 기준은 취향이 아니라 메뉴 개수 · depth · 본문이 필요한 폭이다.",
      en: "The layer that decides where content sits and where navigation attaches. Everything else goes inside it, which makes this the first and the hardest-to-reverse decision. Choose on item count, depth, and how much width the content needs — not on taste.",
    },
  },
  {
    key: "dashboard",
    title: { ko: "대시보드", en: "Dashboard" },
    note: {
      ko: "지표 · 차트 · 데이터 테이블이 한 벌로 묶인 화면. 위에서 숫자로 상태를 읽고, 아래 목록에서 개별 건으로 내려가는 순서를 전제로 한다.",
      en: "Metrics, chart and data table as one set. It assumes a top-down reading: state in numbers above, individual records below.",
    },
  },
  {
    key: "preview",
    title: { ko: "쇼케이스", en: "Showcase" },
    note: {
      ko: "제품 화면이 아니다. 여러 컴포넌트를 일부러 한 화면에 몰아넣어, 테마를 바꿨을 때 전체 인상이 어떻게 달라지는지 비교하기 위한 자리다.",
      en: "Not product screens. Components are deliberately crowded onto one page so you can compare the whole impression when a theme changes.",
    },
  },
  {
    key: "login",
    title: { ko: "로그인", en: "Sign in" },
    note: {
      ko: "인증 진입 화면. 다섯 종의 차이는 장식이 아니라 진입 경로의 차이다 — 실제 사용자가 어떤 경로로 들어오는지를 보고 고른다.",
      en: "The authentication entry point. The five differ by entry path, not decoration — pick by how your users actually arrive.",
    },
  },
  {
    key: "signup",
    title: { ko: "가입", en: "Sign up" },
    note: {
      ko: "계정을 만드는 화면. 로그인과 짝을 이루되 항목 수와 동의 처리가 다르다. 항목이 다섯 개를 넘으면 한 화면에 넣지 않는다.",
      en: "Where an account is created. It mirrors sign-in but differs in field count and consent handling. Past five fields, stop putting it on one screen.",
    },
  },
  {
    key: "calendars",
    title: { ko: "캘린더", en: "Calendars" },
    note: {
      ko: "라우트가 아니라 컴포넌트 변형 모음. 날짜 UI 를 정할 때 어떤 선택지가 있는지 한 번에 훑는 자리다.",
      en: "Component variants rather than routes — one place to survey every option before settling on a date UI.",
    },
  },
]
