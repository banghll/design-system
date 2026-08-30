/* /components 를 생성한다. 직접 고치지 말 것.
 *
 * 예전에는 컴포넌트 갤러리(/kit)와 공식 예제(/examples)가 따로 있었다.
 * 확인해보니 52개가 같은 컴포넌트에 예제만 다른 것이었고, 공식 쪽이 12개 더 많았다.
 * 두 벌을 두면 어느 쪽이 정본인지 알 수 없어 하나로 합쳤다 — 예제는 원작자 것을 쓴다.
 *
 * 설명은 [무엇 ko, 언제 ko, 무엇 en, 언제 en].
 * "무엇" 은 정의로, "언제" 는 판단 조건으로 쓴다. 취향을 쓰면 에이전트가 쓸 수 없다. */
import fs from "node:fs"

const list = JSON.parse(fs.readFileSync("components/examples/_list.json", "utf8"))

const DOC = {
  button: [
    "누르면 무언가가 실행되는 가장 작은 단위. 상태를 바꾸거나 화면을 옮긴다.",
    "화면당 default 는 하나. 나머지는 secondary · outline · ghost 로 내리고, 되돌릴 수 없는 것만 destructive 로 올린다.",
    "The smallest unit that makes something happen — changes state or moves you.",
    "One default per screen. Everything else steps down to secondary, outline or ghost; only the irreversible steps up to destructive.",
  ],
  "button-group": [
    "성격이 같은 버튼을 하나의 덩어리로 붙인 것.",
    "기간(일 · 주 · 월)이나 보기 전환처럼 서로 배타적인 선택. 개별 버튼으로 나열하면 그 배타성이 안 보인다.",
    "Buttons of the same kind fused into one unit.",
    "Mutually exclusive choices — day/week/month, view switches. Listed separately, that exclusivity disappears.",
  ],
  toggle: [
    "눌린 상태가 남는 버튼.",
    "굵게 · 기울임처럼 켜고 끄는 서식. 누르는 즉시 반영되고 저장 버튼이 없다.",
    "A button that stays pressed.",
    "On/off formatting like bold or italic. It applies on press; there is no save step.",
  ],
  "toggle-group": [
    "토글 여러 개를 한 축으로 묶은 것.",
    "정렬 방향처럼 하나만(single), 서식처럼 여러 개(multiple). 어느 쪽인지 만들기 전에 정한다.",
    "Several toggles bound to one axis.",
    "single for alignment, multiple for formatting. Decide which before you build it.",
  ],
  kbd: [
    "단축키를 글자로 표기한 것.",
    "실행하는 것이 아니라 알려주는 것. 메뉴 항목 오른쪽이나 툴팁 안에 둔다.",
    "A keyboard shortcut, written out.",
    "It informs, it doesn't execute. Park it at the right edge of a menu item or inside a tooltip.",
  ],
  input: [
    "한 줄짜리 값을 받는 자리.",
    "기본 · 값 있음 · 비활성 · 오류 네 상태를 모두 갖춰야 한다. 오류는 색만이 아니라 문구로 무엇을 고쳐야 하는지 말한다.",
    "A single line that takes a value.",
    "All four states must exist: empty, filled, disabled, error. An error needs words that say what to fix, not just a color.",
  ],
  "input-group": [
    "입력 앞뒤에 아이콘 · 단위 · 버튼을 붙인 것.",
    "검색창의 돋보기, 주소의 .com, 전송 버튼. 입력과 부속이 한 덩어리로 읽혀야 할 때.",
    "An input with icons, units or buttons attached to its edges.",
    "The magnifier in a search box, the .com on a domain, a send button — when field and fitting must read as one thing.",
  ],
  "input-otp": [
    "자릿수가 정해진 입력.",
    "인증번호. 칸을 나눠 몇 자리인지 눈으로 알 수 있게 한다.",
    "An input with a fixed number of characters.",
    "Verification codes. Splitting the boxes tells the eye the length before typing starts.",
  ],
  textarea: [
    "여러 줄짜리 값을 받는 자리.",
    "길이 제한이 있으면 남은 글자 수를 함께 보여준다. 제출한 뒤에 알리면 늦다.",
    "A multi-line field.",
    "If there's a limit, show what's left while typing. Telling them after submit is too late.",
  ],
  "native-select": [
    "브라우저가 그리는 선택 목록.",
    "모바일에서 가장 익숙하고 접근성이 공짜다. 그룹 · 아이콘이 필요 없다면 이쪽이 낫다.",
    "A select drawn by the browser itself.",
    "Most familiar on mobile and accessible for free. If you don't need groups or icons, this is the better choice.",
  ],
  select: [
    "직접 그린 선택 목록.",
    "그룹 · 구분선 · 아이콘이 필요할 때. 대신 접근성을 스스로 책임져야 한다.",
    "A select we draw ourselves.",
    "When you need groups, separators or icons — and are willing to own the accessibility.",
  ],
  combobox: [
    "검색이 붙은 선택.",
    "선택지가 열 개를 넘어 눈으로 훑기 어려울 때.",
    "A select with search attached.",
    "Past about ten options, when scanning stops working.",
  ],
  checkbox: [
    "서로 무관한 항목을 각각 켜고 끄는 것.",
    "항목끼리 영향을 주지 않을 때. 하나만 골라야 하면 radio-group 이다.",
    "Independent items switched on and off individually.",
    "When choices don't affect each other. If only one may be chosen, that's a radio group.",
  ],
  "radio-group": [
    "서로 배타적인 것 중 하나만 고르는 것.",
    "선택지가 다섯을 넘으면 select 로 바꾼다. 그 이상은 나열이 오히려 안 읽힌다.",
    "One choice from a mutually exclusive set.",
    "Past five options, switch to a select — listing them stops helping.",
  ],
  switch: [
    "즉시 반영되는 on/off.",
    "저장 버튼이 없는 설정. 저장을 눌러야 반영되는 설정이라면 checkbox 를 쓴다.",
    "An on/off that takes effect immediately.",
    "For settings with no save button. If it needs a save, use a checkbox instead.",
  ],
  slider: [
    "범위 안에서 값을 고르는 것.",
    "정확한 숫자보다 감각이 중요할 때. 정확해야 한다면 숫자 입력을 나란히 둔다.",
    "Picking a value within a range.",
    "When feel matters more than the exact number. If precision matters, pair it with a numeric field.",
  ],
  label: [
    "입력과 짝을 이루는 이름표.",
    "누르면 입력으로 초점이 간다. htmlFor 를 빠뜨리면 그 이점이 사라진다.",
    "The name attached to an input.",
    "Clicking it focuses the field. Drop htmlFor and you lose that entirely.",
  ],
  field: [
    "라벨 · 입력 · 설명 · 오류를 한 벌로 묶은 폼의 최소 단위.",
    "폼을 만들 때는 Input 을 직접 쓰지 말고 Field 로 감싼다. 오류가 들어갈 자리가 미리 잡혀 있어 나중에 레이아웃이 안 흔들린다.",
    "Label, input, description and error as one unit — the atom of a form.",
    "Never place a bare Input in a form; wrap it. The error slot is reserved up front, so the layout doesn't shift later.",
  ],
  questionnaire: [
    "여러 문항을 순서대로 받는 구조.",
    "온보딩 · 설문처럼 한 번에 다 보여주면 부담스러운 것.",
    "A structure that asks several questions in sequence.",
    "Onboarding and surveys — anything that intimidates when shown all at once.",
  ],
  badge: [
    "상태나 분류를 짧게 표시하는 라벨.",
    "누르는 것이 아니다. 누를 수 있어야 하면 Button 이거나 Toggle 이다.",
    "A short label for status or category.",
    "It isn't pressable. If it needs to be, it's a Button or a Toggle.",
  ],
  avatar: [
    "사람이나 팀을 식별하는 작은 이미지.",
    "이미지가 없을 때의 이니셜 폴백을 반드시 둔다 — 실제로는 없는 경우가 더 많다.",
    "A small image identifying a person or team.",
    "Always ship the initials fallback. In practice, missing images are the common case.",
  ],
  alert: [
    "화면 안에 머무는 안내.",
    "사라지지 않는다. 잠깐 알리고 끝날 것은 Toast(sonner) 다.",
    "A notice that stays on the page.",
    "It does not dismiss itself. If it should, that's a toast.",
  ],
  card: [
    "관련된 내용을 한 덩어리로 묶는 면.",
    "모든 것을 카드에 넣지 않는다. 카드 안에 카드를 넣으면 위계가 무너진다.",
    "A surface grouping related content.",
    "Not everything belongs in one. Nesting cards collapses the hierarchy.",
  ],
  item: [
    "목록의 한 줄.",
    "아이콘 · 제목 · 설명 · 액션이 세로 레인을 맞춰 정렬된다. 줄마다 구조가 달라지면 목록이 아니다.",
    "One row of a list.",
    "Icon, title, description and action stay in vertical lanes. If rows differ structurally, it isn't a list.",
  ],
  empty: [
    "보여줄 것이 없을 때의 화면.",
    "막다른 화면을 만들지 않는다. 다음 행동을 카드 안에 둔다.",
    "The screen when there is nothing to show.",
    "Never a dead end — the next action belongs inside the card.",
  ],
  marker: [
    "새로 생긴 것 · 바뀐 것을 표시하는 점.",
    "많이 쓰면 아무것도 새것이 아니게 된다. 읽으면 사라져야 한다.",
    "A dot marking what's new or changed.",
    "Overuse and nothing reads as new. It must clear once seen.",
  ],
  bubble: [
    "말풍선.",
    "보낸 사람에 따라 좌우가 갈린다. 사람 간 대화에 쓴다 — AI 대화는 AI Elements 쪽이다.",
    "A speech bubble.",
    "Sides split by sender. For human conversation; AI conversation lives in AI Elements.",
  ],
  message: [
    "대화 한 줄. 아바타 · 본문 · 시각.",
    "사람이 여럿인 대화. 보낸 사람이 한눈에 구분돼야 한다.",
    "One turn of a conversation — avatar, body, timestamp.",
    "Multi-person threads, where the sender must be identifiable at a glance.",
  ],
  attachment: [
    "대화나 폼에 붙인 파일.",
    "올리는 중 · 실패 상태를 갖는다. 실패는 원인(용량 · 형식)까지 말해야 다시 시도할 수 있다.",
    "A file attached to a message or form.",
    "It has uploading and failed states. Failure must name the cause — size, format — or retrying is guesswork.",
  ],
  progress: [
    "끝이 정해진 작업의 진행률.",
    "끝을 모르면 Spinner 다. 오래 걸리면 남은 시간과 취소를 함께 둔다.",
    "Progress on work with a known end.",
    "If the end is unknown, that's a spinner. If it's long, add remaining time and a way to cancel.",
  ],
  spinner: [
    "끝을 모르는 대기 표시.",
    "3초를 넘길 것 같으면 무엇을 기다리는지 문구를 붙인다. 도는 원만으로는 멈춘 것처럼 보인다.",
    "A wait of unknown length.",
    "Past three seconds, say what is being waited on. A spinning circle alone reads as broken.",
  ],
  skeleton: [
    "올 내용의 자리를 미리 잡아 두는 뼈대.",
    "최종 레이아웃과 같은 모양이어야 한다. 다르면 로드되는 순간 화면이 튄다.",
    "A placeholder shaped like what's coming.",
    "It must match the final layout. If it doesn't, the screen jumps on arrival.",
  ],
  separator: [
    "구분선.",
    "여백으로 나눌 수 없는 자리에만. 선이 많아지면 화면이 격자로 갇힌다.",
    "A dividing line.",
    "Only where whitespace can't do the job. Too many and the screen turns into a grid cage.",
  ],
  "aspect-ratio": [
    "비율을 고정하는 상자.",
    "이미지 · 영상 자리. 로드 전후로 레이아웃이 흔들리지 않게 미리 자리를 잡는다.",
    "A box that holds a fixed ratio.",
    "For images and video — reserves the space so nothing shifts when the asset lands.",
  ],
  breadcrumb: [
    "지금 어디인지, 어디서 왔는지.",
    "계층이 두 단계를 넘을 때만 값을 한다. 평평한 사이트에서는 자리만 차지한다.",
    "Where you are and how you got here.",
    "Only earns its space past two levels of hierarchy. On a flat site it's decoration.",
  ],
  pagination: [
    "긴 목록을 쪽으로 나누는 것.",
    "무한 스크롤과 달리 특정 지점으로 되돌아올 수 있다. 위치를 기억해야 하는 목록에 쓴다.",
    "Splitting a long list into pages.",
    "Unlike infinite scroll, you can return to a specific spot. Use it when position must be recoverable.",
  ],
  tabs: [
    "같은 자리에서 내용을 바꾸는 것.",
    "서로 배타적이고 동시에 볼 필요가 없는 묶음. 탭 안에 탭을 넣지 않는다.",
    "Swapping content in the same place.",
    "For sets that are mutually exclusive and never needed side by side. Never nest tabs.",
  ],
  accordion: [
    "길어서 다 보여줄 수 없는 것을 접어 두는 것.",
    "숨기기 전에 '이게 이 화면에 있어야 하나' 를 먼저 묻는다. 대개는 아니다.",
    "Folding away what's too long to show at once.",
    "Before hiding it, ask whether it belongs on this screen at all. Usually it doesn't.",
  ],
  collapsible: [
    "한 덩어리를 접었다 펴는 것.",
    "Accordion 과 달리 여러 개가 동시에 열려 있어도 된다.",
    "One block that folds and unfolds.",
    "Unlike an accordion, several may be open at once.",
  ],
  "navigation-menu": [
    "제품 상단의 주 탐색.",
    "하위 메뉴가 있을 만큼 사이트가 클 때. 링크가 두세 개면 그냥 링크를 나열한다.",
    "The product's top-level navigation.",
    "For sites large enough to have submenus. Two or three links? Just list them.",
  ],
  menubar: [
    "데스크톱 앱 스타일의 메뉴 줄.",
    "편집기처럼 명령이 아주 많고, 사용자가 그 앱에 오래 머무를 때.",
    "A desktop-app style menu bar.",
    "For editor-class surfaces with many commands and users who stay a long time.",
  ],
  table: [
    "행과 열로 정렬된 데이터.",
    "값끼리 비교하는 게 목적일 때. 모바일 가로 스크롤을 반드시 처리하고, 열이 너무 많으면 카드 목록으로 바꾼다.",
    "Data aligned in rows and columns.",
    "When comparison across rows is the point. Handle horizontal scroll on mobile; past a certain width, switch to cards.",
  ],
  chart: [
    "추세와 비교를 그림으로.",
    "recharts 위에 우리 토큰을 씌운 것. 색은 chart-1 부터 5 까지 순서대로 쓴다 — 순서가 곧 의미다.",
    "Trend and comparison, drawn.",
    "recharts wearing our tokens. Use chart-1 through 5 in order — the order carries meaning.",
  ],
  calendar: [
    "날짜 하나 또는 범위를 고르는 것.",
    "입력이 하나뿐이라면 날짜 입력창이 더 빠를 수 있다. 달력은 주변 날짜의 맥락이 필요할 때 값을 한다.",
    "Picking a date or a range.",
    "For a single value, a date field may be faster. A calendar earns its space when surrounding dates matter.",
  ],
  carousel: [
    "가로로 넘겨 보는 목록.",
    "중요한 것을 캐러셀 뒤에 숨기지 않는다. 첫 장만 보고 넘어가는 사람이 대부분이다.",
    "A list you swipe through sideways.",
    "Never hide anything important past the first slide — most people never advance it.",
  ],
  command: [
    "검색으로 실행하는 명령 팔레트.",
    "숙련 사용자를 위한 지름길. 어떤 기능의 유일한 경로로 두면 안 된다.",
    "A searchable command palette.",
    "A shortcut for experienced users. It must never be the only path to a feature.",
  ],
  "scroll-area": [
    "넘치는 내용을 자기 안에서 스크롤하는 상자.",
    "페이지 전체를 밀지 않아야 할 때. 사이드바 · 목록 · 팝오버 안쪽.",
    "A box that scrolls its own overflow.",
    "When the page itself must stay put — sidebars, lists, the inside of popovers.",
  ],
  resizable: [
    "사용자가 폭을 조절하는 분할 화면.",
    "목록과 본문을 같이 보면서 어느 쪽에 무게를 둘지 사용자가 정하게 할 때.",
    "A split view the user can resize.",
    "When list and detail are both visible and the user should decide which gets the weight.",
  ],
  "message-scroller": [
    "새 메시지가 오면 아래로 따라가는 대화 목록.",
    "사용자가 위로 올려 읽는 중이면 따라가지 않아야 한다. 이 예외를 빠뜨리면 읽기를 방해한다.",
    "A message list that follows new arrivals downward.",
    "It must stop following while the user is scrolled up reading. Miss that and it fights them.",
  ],
  dialog: [
    "지금 하던 일을 멈추고 처리해야 하는 것.",
    "남용하면 흐름이 계속 끊긴다. 뒤 화면을 보여 주는 Sheet 가 나은 경우가 많다.",
    "Something that must be dealt with before continuing.",
    "Overused, it chops the flow to pieces. A sheet — which keeps the background visible — is often the better answer.",
  ],
  "alert-dialog": [
    "되돌릴 수 없는 일 앞의 확인.",
    "확인 없이 지나갈 수 없다. 되돌릴 수 있는 일에는 쓰지 말고, 실행한 뒤 '되돌리기' 를 주는 편이 낫다.",
    "A confirmation before something irreversible.",
    "It cannot be dismissed past. For reversible actions, skip it and offer undo afterward instead.",
  ],
  sheet: [
    "화면 옆에서 밀려 나오는 패널.",
    "뒤 화면이 보여 맥락을 잃지 않는다. 설정 · 필터 · 상세 보기.",
    "A panel sliding in from the edge.",
    "The background stays visible, so context survives. Settings, filters, detail views.",
  ],
  drawer: [
    "화면 아래에서 올라오는 패널.",
    "모바일에서 엄지가 닿는 자리. 데스크톱에서는 Sheet 가 맞다.",
    "A panel rising from the bottom.",
    "Where a thumb reaches on mobile. On desktop, a sheet is the right shape.",
  ],
  popover: [
    "누른 자리 옆에 붙는 작은 면.",
    "초점을 완전히 가져가지 않는다. 짧은 설정이나 설명.",
    "A small surface anchored to what you pressed.",
    "It doesn't take focus away entirely. For short settings or explanations.",
  ],
  "dropdown-menu": [
    "한 버튼에 딸린 동작 목록.",
    "선택이 아니라 실행이다. 값을 고르는 것이라면 Select 다.",
    "A list of actions hanging off one button.",
    "These execute, they don't select. If a value is being chosen, that's a Select.",
  ],
  "context-menu": [
    "우클릭으로 여는 그 자리의 동작.",
    "유일한 경로로 두지 않는다. 모바일에는 우클릭이 없다.",
    "Actions opened by right-click, scoped to what's under the cursor.",
    "Never the only path — there is no right-click on mobile.",
  ],
  tooltip: [
    "hover 로만 보이는 짧은 설명.",
    "필수 정보를 넣지 않는다. 터치 기기에서는 존재하지 않는 것과 같다.",
    "A short explanation that appears on hover.",
    "Never put required information here. On touch devices it effectively doesn't exist.",
  ],
  "hover-card": [
    "hover 로 보는 미리보기.",
    "링크를 누르지 않고도 무엇인지 알게 한다. 역시 터치에서는 뜨지 않는다.",
    "A preview shown on hover.",
    "Lets people know what a link holds without opening it. Also absent on touch.",
  ],
  sonner: [
    "작업 결과를 잠깐 알리는 토스트.",
    "이미 눈에 보이는 결과에는 띄우지 않는다. 조용한 성공이 기본이고, 실패만 말한다.",
    "A toast reporting the result of an action.",
    "Don't announce what's already visible. Silent success is the default; speak up on failure.",
  ],
  sidebar: [
    "앱 셸의 좌측 탐색.",
    "제품 화면의 뼈대. 접힘 · 아이콘 전용 · 인셋 변형이 있고, 고르는 기준은 블록 탭에 정리돼 있다.",
    "The app shell's left-hand navigation.",
    "The frame of a product screen. Folding, icon-only and inset variants exist — the selection criteria live in the Blocks tab.",
  ],
  "sidebar-floating": [
    "본문과 떨어져 떠 있는 사이드바.",
    "배경에 색이나 이미지가 있을 때. 여백을 더 먹으므로 조밀한 화면에는 맞지 않는다.",
    "A sidebar detached from the content.",
    "When the background carries color or imagery. It costs margin, so not for dense screens.",
  ],
  "sidebar-icon": [
    "아이콘만 남기고 접히는 사이드바.",
    "본문이 넓어야 하는 작업 도구 — 에디터, 넓은 표, 캔버스.",
    "A sidebar that folds down to icons.",
    "For tools where the canvas needs the width — editors, wide tables, drawing surfaces.",
  ],
  "sidebar-inset": [
    "본문이 둥근 판으로 한 겹 안에 들어간 형태.",
    "주 메뉴와 보조 메뉴를 시각적으로 나눠야 할 때. 요즘 대시보드의 기본 모양이다.",
    "The content sits on an inset rounded panel.",
    "When primary and secondary navigation need separation. The current dashboard default.",
  ],
}

/* 군의 이름과 정의는 lib/catalog-nav.ts 가 정본이다.
 * 여기서는 어떤 컴포넌트가 어느 군에 들어가는지만 정한다. */
const GROUPS = [
  ["c-action", ["button", "button-group", "toggle", "toggle-group", "kbd"]],
  ["c-input", ["field", "input", "input-group", "input-otp", "textarea", "native-select", "select", "combobox", "checkbox", "radio-group", "switch", "slider", "label", "questionnaire"]],
  ["c-display", ["card", "item", "badge", "avatar", "alert", "empty", "marker", "bubble", "message", "attachment", "progress", "spinner", "skeleton", "separator", "aspect-ratio"]],
  ["c-nav", ["breadcrumb", "pagination", "tabs", "accordion", "collapsible", "navigation-menu", "menubar"]],
  ["c-data", ["table", "chart", "calendar", "carousel", "command", "scroll-area", "resizable", "message-scroller"]],
  ["c-overlay", ["dialog", "alert-dialog", "sheet", "drawer", "popover", "dropdown-menu", "context-menu", "tooltip", "hover-card", "sonner"]],
]

const SHELL = ["sidebar", "sidebar-floating", "sidebar-icon", "sidebar-inset"]

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

const byName = new Map(entries.map((e, i) => [e.name, i]))

const imports = entries
  .map((e, i) =>
    e.isDefault
      ? `import X${i} from "@/components/examples/${e.id}"`
      : `import { ${e.comp} as X${i} } from "@/components/examples/${e.id}"`
  )
  .join("\n")

const doc = (n) => {
  const d = DOC[n] ?? ["", "", "", ""]
  return `what: { ko: ${JSON.stringify(d[0])}, en: ${JSON.stringify(
    d[2]
  )} }, when: { ko: ${JSON.stringify(d[1])}, en: ${JSON.stringify(d[3])} }`
}

const grouped = GROUPS.map(([id, members]) => ({
  id,
  members: members.filter((m) => byName.has(m)),
}))

const groupsLiteral = grouped
  .map(
    (g) => `  {
    id: ${JSON.stringify(g.id)},
    items: [
${g.members
  .map((m) => `      { id: ${JSON.stringify(m)}, ${doc(m)}, Comp: X${byName.get(m)} },`)
  .join("\n")}
    ],
  },`
  )
  .join("\n")

const shellLiteral = SHELL.map(
  (s) =>
    `  { id: ${JSON.stringify(s)}, href: ${JSON.stringify(
      `/blocks/${s}-example`
    )}, ${doc(s)} },`
).join("\n")

const page = `/* 컴포넌트 — scripts/gen-components.mjs 가 생성한다. 직접 고치지 말 것.
 * 예제는 shadcn/ui 레포(MIT)의 공식 예제를 쓴다. 우리가 따로 쓴 예시와 겹쳐서 하나로 합쳤다.
 * 군의 이름과 정의는 lib/catalog-nav.ts 에서 온다 — 사이드바와 같은 문장을 본다.
 */
"use client"

import Link from "next/link"

import { SectionAi } from "@/components/ai-demos/section-ai"
import { SectionAi2 } from "@/components/ai-demos/section-ai2"
import { CatalogHeader, CatalogShell, GroupHeader } from "@/components/catalog-shell"
import { OpenState } from "@/components/examples/open-states"
import { useLang } from "@/components/lang"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import { PAGES } from "@/lib/catalog-nav"
import EDITABLE from "@/data/components.json"

${imports}

const GROUPS = [
${groupsLiteral}
]

const SHELL = [
${shellLiteral}
]

const SECTIONS = PAGES.find((p) => p.href === "/components")!.sections
const sec = (id: string) => SECTIONS.find((s) => s.id === id)!

/* 토큰 레시피가 있는 것만 편집 화면이 있다. 목록에서 그걸 알 수 있어야
 * «어디까지 손댈 수 있는가» 가 보인다 — 파일럿이 끝나면 이 배지가 늘어난다. */
const editable = new Set(Object.keys(EDITABLE).filter((k) => !k.startsWith("$")))

export default function ComponentsPage() {
  const { t, lang } = useLang()

  return (
    <CatalogShell toc={SECTIONS.map((s) => ({ id: s.id, label: s.label }))}>
      <main className="mx-auto w-full max-w-[1100px] px-6 py-14 lg:px-10">
        <CatalogHeader
          title={{ ko: "컴포넌트", en: "Components" }}
          count={lang === "ko" ? "109개" : "109"}
        >
          {lang === "ko" ? (
            <>
              <b>컴포넌트는 더 쪼개면 의미를 잃는 단위다.</b> 버튼을 반으로 나누면
              버튼이 아니게 되는 그 지점 — 시스템이 값을 부여하는 가장 작은 조각이다.
              shadcn/ui 61개와 AI Elements 48개가 있다.
              <br />
              <br />
              예제는 원작자가 쓴 공식 예제를 그대로 쓴다. 각 항목에{" "}
              <b>무엇이고 언제 쓰는지</b>를 붙였는데, 이 문장은 사람만 읽는 게 아니라
              화면을 짜는 에이전트가 고를 때 근거로 삼는 것이다. 그래서 &quot;깔끔할
              때&quot; 같은 취향이 아니라 &quot;선택지가 다섯을 넘을 때&quot; 같은
              조건으로 썼다.
              <br />
              <br />
              이것들을 조립한 결과는{" "}
              <Link href="/patterns" className="underline underline-offset-4">
                패턴
              </Link>
              , 화면 한 벌로 완성된 것은{" "}
              <Link href="/blocks" className="underline underline-offset-4">
                블록
              </Link>
              에 있다.
            </>
          ) : (
            <>
              <b>A component is the unit that loses meaning if split further.</b> Cut a
              button in half and it stops being a button — that boundary is the
              smallest piece the system assigns value to. 61 from shadcn/ui, 48 from AI
              Elements.
              <br />
              <br />
              The examples are the authors&apos; own. Each entry carries{" "}
              <b>what it is and when to use it</b> — written for the agent composing a
              screen as much as for you. That is why it reads &quot;past five
              options&quot; rather than &quot;when it feels cleaner&quot;.
              <br />
              <br />
              Assembled, they become{" "}
              <Link href="/patterns" className="underline underline-offset-4">
                patterns
              </Link>
              ; finished as whole screens, they become{" "}
              <Link href="/blocks" className="underline underline-offset-4">
                blocks
              </Link>
              .
            </>
          )}
        </CatalogHeader>

        <div className="flex flex-col gap-20">
          {GROUPS.map((g) => (
            <section key={g.id} id={g.id} className="scroll-mt-6">
              <GroupHeader
                title={sec(g.id).label}
                note={sec(g.id).note}
                count={g.items.length}
              />
              <div className="flex flex-col gap-10">
                {g.items.map(({ id, what, when, Comp }) => (
                  <article key={id} id={id} className="scroll-mt-6">
                    <div className="mb-3">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h3 className="text-xl font-semibold tracking-tight">{id}</h3>
                        <code className="text-muted-foreground text-[11px]">
                          components/ui/{id}.tsx
                        </code>
                        {editable.has(id) ? (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="ml-auto bg-background"
                          >
                            <Link href={"/components/" + id}>
                              <SlidersHorizontal />
                              {lang === "ko" ? "편집" : "Edit"}
                            </Link>
                          </Button>
                        ) : null}
                      </div>
                      <p className="mt-1.5 max-w-[68ch] text-sm leading-relaxed">
                        {t(what)}
                      </p>
                      <p className="text-muted-foreground mt-1 max-w-[68ch] text-sm leading-relaxed">
                        {t(when)}
                      </p>
                    </div>
                    <div className="bg-card rounded-lg border p-6">
                      <Comp />
                      <OpenState id={id} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <section id="c-shell" className="scroll-mt-6">
            <GroupHeader
              title={sec("c-shell").label}
              note={sec("c-shell").note}
              count={SHELL.length}
            />
            <div className="grid gap-3 md:grid-cols-2">
              {SHELL.map((s) => (
                <Link
                  key={s.id}
                  href={s.href}
                  className="bg-card hover:border-foreground/30 flex flex-col gap-1.5 rounded-lg border p-4 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{s.id}</span>
                    <Badge variant="secondary">
                      {lang === "ko" ? "열기" : "Open"}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed">{t(s.what)}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {t(s.when)}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <SectionAi />
          <SectionAi2 />
        </div>
      </main>
    </CatalogShell>
  )
}
`

fs.mkdirSync("app/components", { recursive: true })
fs.writeFileSync("app/components/page.tsx", page)
console.log(`군 ${grouped.length}개 · 컴포넌트 ${entries.length}개 + 앱 셸 ${SHELL.length}개`)
