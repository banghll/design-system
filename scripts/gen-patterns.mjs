/* /patterns 페이지를 생성한다.
 * preview 블록 3개는 카드 74개가 한 캔버스에 뭉쳐 있어 "무엇이 있는지" 파악이 안 된다.
 * 여기서는 출처(어느 preview 에 있었는지)가 아니라 용도로 묶고, 하나씩 떼어 놓는다.
 * 설명은 각 카드의 실제 CardTitle/CardDescription 에서 뽑은 것을 근거로 쓴다.
 */
import fs from "node:fs"

const CARDS = JSON.parse(fs.readFileSync("scripts/_cards.json", "utf8"))

/* id → [군, 언제 쓰나]
 * 군은 "이 화면에서 무슨 일이 벌어지나"로 나눈다. 파일 위치가 아니라 쓰임이 기준이다. */
const META = {
  // ── 빈 상태
  "empty-connect-bank": ["empty", "연동이 안 끝나 데이터가 아직 없을 때. 다음 행동(연결하기)이 카드 안에 있다"],
  "empty-distribute-track": ["empty", "만들었지만 아직 내보내지 않은 항목. 게시 유도"],
  "empty-explore-catalog": ["empty", "탐색을 시작하기 전. 둘러보기로 유도"],
  "no-team-members": ["empty", "협업 공간에 나 혼자일 때. 초대가 다음 행동"],
  "not-found": ["empty", "검색·필터 결과가 0건. 조건을 바꾸도록 유도"],

  // ── 로딩 · 상태 전이
  "loading-card": ["loading", "카드 한 장이 아직 안 왔을 때의 자리표시"],
  "skeleton-loading": ["loading", "목록·본문이 오기 전. 최종 레이아웃과 같은 뼈대를 보여준다"],
  "syncing-state": ["loading", "백그라운드 동기화 중. 화면을 막지 않고 상태만 알린다"],

  // ── 알림 · 안내
  "anomaly-alert": ["notice", "지표가 평소와 다를 때 먼저 알린다. 사용자가 안 찾아봐도 뜬다"],
  "observability-card": ["notice", "기능이 바뀌거나 대체될 때의 전환 안내"],
  "activate-agent-dialog": ["notice", "유료·권한이 필요한 기능을 켜기 전 동의를 받는 자리"],
  faq: ["notice", "같은 질문이 반복될 때. 지원 요청을 줄인다"],
  "qr-connect": ["notice", "다른 기기로 이어가야 할 때. 로그인·페어링"],
  shortcuts: ["notice", "키보드로 빨리 쓰는 사용자를 위한 단축키 안내"],

  // ── 폼 · 설정
  "account-access": ["form", "비밀번호·재인증처럼 위험한 변경. 파괴적 동작을 따로 묶는다"],
  "notification-settings": ["form", "알림 종류별 on/off. 스위치가 여럿인 설정"],
  preferences: ["form", "계정 전반 설정. 여러 항목을 한 카드에 묶는다"],
  "payout-threshold": ["form", "임계값 하나를 정하는 설정. 슬라이더·숫자 입력"],
  "receiving-method": ["form", "선택지 중 하나를 고르고 그에 따라 입력칸이 바뀌는 폼"],
  "new-milestone": ["form", "목표를 새로 만드는 생성 폼. 이름 + 금액 + 기한"],
  "shipping-address": ["form", "주소 입력. 여러 줄 + 우편번호 조합"],
  "github-profile": ["form", "프로필 편집. 아바타 + 이름 + 소개"],
  "contributions-activity": ["form", "공개 범위 설정. 무엇을 남에게 보일지"],
  "social-links": ["form", "링크 여러 개를 붙였다 뗐다 하는 반복 입력"],
  "environment-variables": ["form", "키·값 쌍 관리. 값은 가려두고 필요할 때만 연다"],
  "invite-team": ["form", "이메일로 사람을 부르고 권한을 정한다"],
  "assign-issue": ["form", "여러 명 중에서 고르는 배정. 검색 + 다중 선택"],
  "report-bug": ["form", "오류 신고. 재현 방법을 받아내는 구조"],
  "feedback-form": ["form", "가벼운 의견 수집. 짧게 끝나야 한다"],
  "book-appointment": ["form", "날짜 + 시간대를 함께 고르는 예약"],
  "transfer-funds": ["form", "출금·입금 계좌를 고르고 금액을 넣는 이체. 수수료·도착 시각을 미리 보여준다"],

  // ── 지표 · 차트
  "card-overview": ["metric", "잔액 같은 핵심 숫자 하나를 크게. 보조 정보는 아래로"],
  "claimable-balance": ["metric", "받을 수 있는 금액 + 받기 액션"],
  "usage-card": ["metric", "남은 한도·주기. 초과 전에 알린다"],
  "analytics-card": ["metric", "방문자 같은 총량 + 추세선"],
  visitors: ["metric", "기간별 추이. 막대 하나가 한 구간"],
  "contribution-history": ["metric", "기여·활동을 달력 격자로. 밀도가 곧 정보"],
  "dividend-income": ["metric", "분기별 수입 비교"],
  "stock-performance": ["metric", "가격 추이 선형 차트"],
  "power-usage": ["metric", "시간대별 사용량 + 현재값"],
  "savings-progress": ["metric", "목표 대비 진행률"],
  "savings-targets": ["metric", "여러 목표의 진행 상황을 한 목록에"],
  "index-investing": ["metric", "개념을 설명하는 교육형 카드. 숫자보다 이해가 목적"],
  "bar-chart-card": ["metric", "두 계열 비교 막대"],
  "pie-chart-card": ["metric", "구성비. 항목이 적을 때만"],
  "sleep-report": ["metric", "구간별 상태를 띠로. 수면·집중 같은 연속 데이터"],
  "weekly-fitness-summary": ["metric", "요일별 누적. 주 단위 리듬을 본다"],

  // ── 목록 · 표
  "recent-transactions": ["list", "최근 활동. 금액 + 시각 + 상태"],
  "upcoming-payments": ["list", "예정된 것. 날짜를 골라 필터"],
  payments: ["list", "결제 수단 목록. 기본값 표시 + 추가"],
  "release-catalog": ["list", "발매·릴리스 목록. 썸네일 + 메타"],
  contributors: ["list", "사람 목록. 아바타 + 기여량"],
  "catalog-toolbar": ["list", "목록 위의 도구 줄 — 검색·필터·보기 전환"],
  "sidebar-nav": ["list", "카드 안에 들어가는 좁은 탐색 목록"],

  // ── 미디어
  "album-card": ["media", "표지 + 제목 + 발매일. 음악·영상 항목"],
  "cover-art": ["media", "이미지 업로드 자리. 규격을 미리 알린다"],
  "file-upload": ["media", "드래그 앤 드롭 업로드. 형식·용량 안내 포함"],
  "bar-visualizer": ["media", "오디오 주파수 실시간 표시"],
  "live-waveform": ["media", "마이크 입력 파형. 녹음 중임을 보인다"],
  "icon-preview-grid": ["media", "아이콘 세트를 한눈에 훑는 격자"],

  // ── 기기 제어
  "front-door": ["device", "잠금 같은 두 상태 기기. 현재 상태가 먼저 읽혀야 한다"],
  "kitchen-island": ["device", "밝기·색을 가진 조명 제어"],
  "roller-shades": ["device", "위치를 % 로 조절하는 기기"],

  // ── 개발 · 운영
  invoice: ["dev", "청구서. 항목 + 합계 + 기한"],
  "codespaces-card": ["dev", "개발 환경 상태와 접속"],
  "style-overview": ["dev", "지금 적용된 스타일·폰트를 보여주는 진단 카드"],
  "typography-specimen": ["dev", "타입 스케일 견본"],
  "ui-elements": ["dev", "여러 컨트롤을 한 카드에 모은 확인용"],

  // ── AI 대화
  "simple-chat": ["ai", "가장 기본 형태. 질문 하나 답 하나"],
  "group-chat": ["ai", "사람이 여럿인 대화. 보낸 사람이 구분돼야 한다"],
  "reasoning-chat": ["ai", "모델의 사고 과정을 접었다 펴는 형태"],
  "tool-chat": ["ai", "도구 호출과 그 결과를 대화 안에 보여준다"],
  "sources-chat": ["ai", "답의 근거가 되는 출처를 함께 단다"],
  "files-chat": ["ai", "이미지·문서를 주고받는 대화"],
}

const GROUPS = [
  ["empty", "빈 상태", "보여줄 것이 없을 때. 막다른 화면이 아니라 다음 행동이 있어야 한다"],
  ["loading", "로딩 · 전이", "아직 오지 않았거나, 오는 중일 때"],
  ["notice", "알림 · 안내", "사용자가 찾지 않아도 먼저 말해야 하는 것"],
  ["form", "폼 · 설정", "값을 받고 저장하는 것"],
  ["metric", "지표 · 차트", "숫자와 추세를 읽히게 하는 것"],
  ["list", "목록 · 표", "여러 개를 나란히 다루는 것"],
  ["media", "미디어 · 파일", "이미지 · 소리 · 업로드"],
  ["device", "기기 제어", "물리 기기의 상태를 바꾸는 것"],
  ["dev", "개발 · 운영", "만드는 사람이 보는 화면"],
  ["ai", "AI 대화", "에이전트와 주고받는 형태"],
]

const all = []
for (const [block, arr] of Object.entries(CARDS)) {
  for (const c of arr) {
    if (!c.exp) continue
    const meta = META[c.file]
    if (!meta) continue
    all.push({ ...c, block, group: meta[0], note: meta[1] })
  }
}

const imports = all
  .map((c, i) => `import { ${c.exp} as P${i} } from "@/components/blocks/${c.block}/cards/${c.file}"`)
  .join("\n")

const items = all
  .map(
    (c, i) =>
      `  { id: ${JSON.stringify(c.file)}, group: ${JSON.stringify(c.group)}, title: ${JSON.stringify(c.title || c.file)}, note: ${JSON.stringify(c.note)}, src: ${JSON.stringify(c.block)}, Comp: P${i} },`
  )
  .join("\n")

const page = `/* 패턴 카탈로그 — scripts/gen-patterns.mjs 가 생성한다. 직접 고치지 말 것.
 * preview 블록에 뭉쳐 있던 카드 ${all.length}개를 용도별로 떼어 놓았다.
 */
"use client"

import { CatalogShell } from "@/components/catalog-shell"

${imports}

const GROUPS: [string, string, string][] = ${JSON.stringify(GROUPS, null, 2)}

const ITEMS = [
${items}
]

export default function PatternsPage() {
  return (
    <CatalogShell>
    <main className="mx-auto w-full max-w-[1400px] px-6 py-12">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold">패턴 ${all.length}개</h1>
        <p className="text-muted-foreground mt-2 max-w-[62ch] text-sm">
          preview 블록 세 개에 뭉쳐 있던 카드를 하나씩 떼어, 어느 파일에 있었는지가
          아니라 <strong>언제 쓰는지</strong>로 묶었다. 각 카드는 그대로 복사해 쓸 수 있다.
        </p>
      </header>

      <nav className="mb-10 flex flex-wrap gap-2">
        {GROUPS.map(([key, title]) => (
          <a
            key={key}
            href={\`#\${key}\`}
            className="rounded-full border px-3 py-1.5 text-xs"
          >
            {title} {ITEMS.filter((i) => i.group === key).length}
          </a>
        ))}
      </nav>

      <div className="flex flex-col gap-14">
        {GROUPS.map(([key, title, why]) => {
          const items = ITEMS.filter((i) => i.group === key)
          if (!items.length) return null
          return (
            <section key={key} id={key} className="scroll-mt-6">
              <div className="mb-6 border-t pt-6">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <span className="text-muted-foreground text-xs">{items.length}개</span>
                </div>
                <p className="text-muted-foreground mt-1 max-w-[60ch] text-sm">{why}</p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {items.map(({ id, title, note, src, Comp }) => (
                  <article key={id} className="flex min-w-0 flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium">{title}</span>
                        <code className="text-muted-foreground text-[11px]">{id}</code>
                      </div>
                      <p className="text-muted-foreground text-xs">{note}</p>
                    </div>
                    <div className="[&_[data-slot=card]]:w-full">
                      <Comp />
                    </div>
                    <code className="text-muted-foreground text-[10px]">
                      components/blocks/{src}/cards/{id}.tsx
                    </code>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </main>
    </CatalogShell>
  )
}
`

fs.mkdirSync("app/patterns", { recursive: true })
fs.writeFileSync("app/patterns/page.tsx", page)
console.log(`패턴 ${all.length}개 · 군 ${GROUPS.length}개 → app/patterns/page.tsx`)
