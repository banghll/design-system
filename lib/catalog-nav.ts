/* 카탈로그 내비 매니페스트.
 *
 * 사이드바와 각 페이지가 같은 데이터를 본다 — 목록이 두 벌로 갈라지지 않게.
 * section 의 id 는 페이지 안 앵커와 같아야 한다.
 *
 * 설명문은 { ko, en } 한 쌍으로 둔다. 이 문장들은 사람만 읽는 게 아니라
 * 화면을 짜는 에이전트가 "무엇을 언제 고를지" 판단하는 근거가 된다.
 * 그래서 형용사가 아니라 정의와 조건으로 쓴다. */

import type { Copy } from "@/components/lang"
import { BLOCK_GROUPS, BLOCKS } from "@/lib/block-catalog"

export type Section = {
  id: string
  label: Copy
  note: Copy
  count?: number
}

export type Page = {
  href: string
  label: Copy
  icon: string
  summary: Copy
  sections: Section[]
}

/* 패턴 — 카드 하나가 한 쓰임.
 * 이름만으로는 "무엇의 빈 상태인지" 를 알 수 없어, 조건까지 적는다. */
export const PATTERN_SECTIONS: Section[] = [
  {
    id: "empty",
    label: {
      ko: "빈 상태 — 아직 아무것도 없을 때",
      en: "Empty — nothing here yet",
    },
    note: {
      ko: "데이터가 0건인 화면. 세 가지가 섞이기 쉬운데 서로 다르다 — 처음이라 비었을 때(다음에 할 일을 알려준다), 검색 결과가 없을 때(조건을 되돌릴 길을 준다), 권한이 없어 못 볼 때(누구에게 요청할지 적는다). 어느 쪽이든 막다른 화면이 되면 안 된다.",
      en: "Screens with zero rows. Three cases get confused: first-run (tell them what to do next), no search results (offer a way back), and no permission (say who to ask). None of them may be a dead end.",
    },
    count: 5,
  },
  {
    id: "loading",
    label: {
      ko: "로딩 — 아직 오지 않았을 때",
      en: "Loading — not here yet",
    },
    note: {
      ko: "요청은 갔는데 답이 안 온 구간. 0.3초 안에 끝날 것 같으면 아무것도 띄우지 않고, 그보다 길면 들어갈 자리의 모양대로 뼈대를 그린다. 스피너는 크기를 예측할 수 없을 때만.",
      en: "The gap between request and answer. Under ~0.3s show nothing; longer than that, draw the skeleton in the shape of what's coming. Spinners are for when you can't predict the size.",
    },
    count: 3,
  },
  {
    id: "notice",
    label: {
      ko: "알림 — 먼저 말해야 할 때",
      en: "Notices — speaking first",
    },
    note: {
      ko: "사용자가 찾지 않았는데 시스템이 먼저 꺼내는 말. 지금 화면을 막을 만큼 급하면 다이얼로그, 읽고 넘어가면 되면 배너, 방금 한 일의 결과면 토스트. 급하지 않은 것을 다이얼로그로 띄우는 게 가장 흔한 실수다.",
      en: "Things the system says without being asked. Urgent enough to block? A dialog. Read-and-move-on? A banner. Result of what they just did? A toast. Blocking on the non-urgent is the usual mistake.",
    },
    count: 6,
  },
  {
    id: "form",
    label: { ko: "폼 · 설정 — 값을 받을 때", en: "Forms — taking input" },
    note: {
      ko: "사용자가 값을 넣고 시스템이 저장하는 구간. 언제 검사하고(입력 중이 아니라 칸을 떠날 때), 오류를 어디에 붙이고(칸 바로 아래), 저장을 언제 알릴지(설정은 즉시, 문서는 명시적으로)가 정해져 있어야 한다.",
      en: "Where the user supplies values and the system stores them. Settle three things: when you validate (on blur, not on keystroke), where errors sit (under the field), and how saving is confirmed (settings save instantly, documents save explicitly).",
    },
    count: 17,
  },
  {
    id: "metric",
    label: { ko: "지표 · 차트 — 숫자를 읽힐 때", en: "Metrics — making numbers read" },
    note: {
      ko: "숫자 하나로 상태를 알리는 자리. 값만 있으면 크고 작음을 판단할 수 없으므로 비교 대상(지난주 대비, 목표 대비)이 늘 같이 있어야 한다. 추세가 중요하면 카드가 아니라 차트다.",
      en: "Where one number carries the state. A value alone can't be judged big or small — always pair it with a comparison (vs. last week, vs. target). If the trend matters more than the value, it's a chart, not a card.",
    },
    count: 16,
  },
  {
    id: "list",
    label: { ko: "목록 · 표 — 여러 개를 다룰 때", en: "Lists — many at once" },
    note: {
      ko: "같은 종류가 여러 건 있는 화면. 훑어보는 게 목적이면 목록, 값끼리 비교하는 게 목적이면 표. 표를 골랐다면 정렬·필터·건수·페이지 넷 중 무엇을 뺄지 먼저 정한다.",
      en: "Many of the same kind. Scanning? A list. Comparing values across rows? A table. If it's a table, decide up front which of sort, filter, count and paging you are leaving out.",
    },
    count: 7,
  },
  {
    id: "media",
    label: { ko: "미디어 · 파일 — 올리고 재생할 때", en: "Media — upload and playback" },
    note: {
      ko: "이미지·소리·영상·첨부. 올리는 쪽은 진행률과 실패한 파일을 개별로 보여 줘야 하고, 보는 쪽은 화면 비율을 미리 잡아 두어야 로드될 때 레이아웃이 튀지 않는다.",
      en: "Images, audio, video, attachments. On the way in, show per-file progress and per-file failure. On the way out, reserve the aspect ratio up front so nothing jumps when it loads.",
    },
    count: 6,
  },
  {
    id: "device",
    label: { ko: "기기 제어 — 물리 상태를 바꿀 때", en: "Device control — changing physical state" },
    note: {
      ko: "화면 밖의 무언가가 실제로 움직이는 조작. 화면 안의 토글과 다른 점은 '요청함'과 '반영됨' 사이에 지연이 있다는 것 — 그 중간 상태를 반드시 보여 준다.",
      en: "Controls where something outside the screen actually moves. Unlike an in-app toggle, there is a lag between requested and applied — that middle state must be visible.",
    },
    count: 3,
  },
  {
    id: "dev",
    label: { ko: "개발 · 운영 — 만드는 쪽이 볼 때", en: "Developer surfaces — for the people building" },
    note: {
      ko: "최종 사용자가 아니라 만들고 운영하는 사람이 보는 화면. 로그·환경 변수·API 키·배포 상태. 정보 밀도를 높게 잡아도 되는 유일한 자리다.",
      en: "Screens for the people building and operating, not the end user. Logs, environment variables, API keys, deploy status. The one place where high information density is the right default.",
    },
    count: 5,
  },
  {
    id: "ai",
    label: { ko: "AI 대화 — 에이전트와 주고받을 때", en: "AI conversation — talking with an agent" },
    note: {
      ko: "답이 한 번에 오지 않고 흘러나오며, 중간에 도구를 쓰고, 틀릴 수 있는 대화. 그래서 일반 채팅과 다르다 — 진행 중임을 보이고, 무엇을 근거로 했는지 열어 주고, 멈출 수 있어야 한다.",
      en: "Answers that stream instead of arriving, call tools midway, and can be wrong. That's what separates it from chat: show that it's working, expose what it relied on, and let the user stop it.",
    },
    count: 6,
  },
]

/* 블록 — 완성 화면.
 * 목록과 개수를 손으로 적지 않는다. 블록 카탈로그에서 세어 온다. */
export const BLOCK_SECTIONS: Section[] = BLOCK_GROUPS.map((g) => ({
  id: g.key,
  label: g.title,
  note: g.note,
  count: BLOCKS.filter((b) => b.group === g.key).length,
}))

export const PAGES: Page[] = [
  {
    href: "/",
    label: { ko: "파운데이션", en: "Foundation" },
    icon: "palette",
    summary: {
      ko: "색 · 모서리 · 간격 · 타이포. 값이 적히는 유일한 자리",
      en: "Color, radius, spacing, type — the only place values are written",
    },
    sections: [
      {
        id: "f-color",
        label: { ko: "색", en: "Color" },
        note: {
          ko: "면과 그 위의 글자는 항상 짝으로 정의된다. 한쪽만 바꾸면 대비가 무너진다",
          en: "A surface and the text on it are defined as a pair. Change one and contrast breaks",
        },
      },
      {
        id: "f-radius",
        label: { ko: "모서리", en: "Radius" },
        note: {
          ko: "기준값 하나에서 일곱 단계가 파생된다",
          en: "Seven steps derive from a single base value",
        },
      },
      {
        id: "f-spacing",
        label: { ko: "간격", en: "Spacing" },
        note: {
          ko: "4px 배수. 기준을 줄이면 화면 전체의 밀도가 바뀐다",
          en: "Multiples of 4px. Lower the base and the whole screen's density shifts",
        },
      },
      {
        id: "f-type",
        label: { ko: "타이포", en: "Typography" },
        note: {
          ko: "크기 · 굵기 · 색 세 가지로만 위계를 만든다",
          en: "Hierarchy is built from three things only: size, weight, color",
        },
      },
      {
        id: "f-shadow",
        label: { ko: "그림자", en: "Elevation" },
        note: {
          ko: "라이트에서는 그림자로, 다크에서는 면의 밝기로 깊이를 낸다",
          en: "Depth comes from shadow in light mode and from surface lightness in dark",
        },
      },
      {
        id: "f-usage",
        label: { ko: "에이전트 규칙", en: "Rules for agents" },
        note: {
          ko: "이 여섯 줄을 지키면 프리셋을 바꿔도 화면이 안 깨진다",
          en: "Follow these six and swapping presets never breaks a screen",
        },
      },
    ],
  },
  {
    href: "/components",
    label: { ko: "컴포넌트", en: "Components" },
    icon: "component",
    summary: {
      ko: "더 쪼갤 수 없는 단위 109개 — 무엇이고 언제 쓰는지",
      en: "109 indivisible units — what each is and when to reach for it",
    },
    sections: [
      {
        id: "c-action",
        label: { ko: "액션", en: "Actions" },
        note: {
          ko: "누르면 상태가 바뀌는 것. 화면당 주 액션은 하나로 유지한다",
          en: "Press and state changes. Keep exactly one primary action per screen",
        },
        count: 5,
      },
      {
        id: "c-input",
        label: { ko: "입력", en: "Inputs" },
        note: {
          ko: "사용자에게서 값을 받는 것. 선택지 수와 다중 선택 여부가 종류를 정한다",
          en: "Anything that takes a value. The count of options and whether multiple are allowed picks the control",
        },
        count: 14,
      },
      {
        id: "c-display",
        label: { ko: "표시", en: "Display" },
        note: {
          ko: "읽기만 하는 것. 조작할 수 없다는 게 눈에 보여야 한다",
          en: "Read-only. It must look like it can't be operated",
        },
        count: 15,
      },
      {
        id: "c-nav",
        label: { ko: "탐색", en: "Navigation" },
        note: {
          ko: "위치를 옮기거나, 지금 자리에서 접고 펴는 것",
          en: "Moves you somewhere, or folds and unfolds where you already are",
        },
        count: 7,
      },
      {
        id: "c-data",
        label: { ko: "데이터", en: "Data" },
        note: {
          ko: "여러 건을 한 번에 다루는 것. 표 · 차트 · 달력 · 명령 팔레트",
          en: "Many records at once — tables, charts, calendars, command palettes",
        },
        count: 8,
      },
      {
        id: "c-overlay",
        label: { ko: "오버레이", en: "Overlays" },
        note: {
          ko: "화면 위에 떠서 초점을 가져가는 것. 트리거를 눌러야 보인다",
          en: "Floats above and takes focus. Nothing shows until the trigger is pressed",
        },
        count: 10,
      },
      {
        id: "c-shell",
        label: { ko: "앱 셸", en: "App shell" },
        note: {
          ko: "화면 전체의 뼈대. 나머지 모든 것이 이 안에 들어간다",
          en: "The frame for the whole screen. Everything else sits inside it",
        },
        count: 4,
      },
      {
        id: "g-ai",
        label: { ko: "AI Elements", en: "AI Elements" },
        note: {
          ko: "대화 · 사고 과정 · 근거. 답이 흘러나오는 UI 를 위한 것",
          en: "Conversation, reasoning, sources — built for answers that stream",
        },
        count: 15,
      },
      {
        id: "g-ai2",
        label: { ko: "AI 산출물", en: "AI artifacts" },
        note: {
          ko: "에이전트가 만들어낸 결과물을 다루는 자리",
          en: "Where what the agent produced gets handled",
        },
        count: 5,
      },
    ],
  },
  {
    href: "/patterns",
    label: { ko: "패턴", en: "Patterns" },
    icon: "boxes",
    summary: {
      ko: "컴포넌트를 조립해 한 가지 쓰임을 푼 것 74개",
      en: "74 assemblies, each solving one recurring situation",
    },
    sections: PATTERN_SECTIONS,
  },
  {
    href: "/blocks",
    label: { ko: "블록", en: "Blocks" },
    icon: "blocks",
    summary: {
      ko: `화면 한 벌 ${BLOCKS.length}개 — 새 화면의 출발점`,
      en: `${BLOCKS.length} whole screens — where a new page starts`,
    },
    sections: BLOCK_SECTIONS,
  },
]
