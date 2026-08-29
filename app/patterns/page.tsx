/* 패턴 카탈로그 — scripts/gen-patterns.mjs 가 생성한다. 직접 고치지 말 것.
 * preview 블록에 뭉쳐 있던 카드 74개를 용도별로 떼어 놓았다.
 */
"use client"

import { CatalogShell } from "@/components/catalog-shell"

import { AccountAccess as P0 } from "@/components/blocks/preview-02/cards/account-access"
import { AlbumCard as P1 } from "@/components/blocks/preview-02/cards/album-card"
import { CardOverview as P2 } from "@/components/blocks/preview-02/cards/card-overview"
import { CatalogToolbar as P3 } from "@/components/blocks/preview-02/cards/catalog-toolbar"
import { ClaimableBalance as P4 } from "@/components/blocks/preview-02/cards/claimable-balance"
import { ContributionHistory as P5 } from "@/components/blocks/preview-02/cards/contribution-history"
import { CoverArt as P6 } from "@/components/blocks/preview-02/cards/cover-art"
import { DividendIncome as P7 } from "@/components/blocks/preview-02/cards/dividend-income"
import { EmptyConnectBank as P8 } from "@/components/blocks/preview-02/cards/empty-connect-bank"
import { EmptyDistributeTrack as P9 } from "@/components/blocks/preview-02/cards/empty-distribute-track"
import { EmptyExploreCatalog as P10 } from "@/components/blocks/preview-02/cards/empty-explore-catalog"
import { Faq as P11 } from "@/components/blocks/preview-02/cards/faq"
import { FrontDoor as P12 } from "@/components/blocks/preview-02/cards/front-door"
import { IndexInvesting as P13 } from "@/components/blocks/preview-02/cards/index-investing"
import { KitchenIsland as P14 } from "@/components/blocks/preview-02/cards/kitchen-island"
import { LoadingCard as P15 } from "@/components/blocks/preview-02/cards/loading-card"
import { NewMilestone as P16 } from "@/components/blocks/preview-02/cards/new-milestone"
import { NotificationSettings as P17 } from "@/components/blocks/preview-02/cards/notification-settings"
import { Payments as P18 } from "@/components/blocks/preview-02/cards/payments"
import { PayoutThreshold as P19 } from "@/components/blocks/preview-02/cards/payout-threshold"
import { PowerUsage as P20 } from "@/components/blocks/preview-02/cards/power-usage"
import { Preferences as P21 } from "@/components/blocks/preview-02/cards/preferences"
import { QrConnect as P22 } from "@/components/blocks/preview-02/cards/qr-connect"
import { ReceivingMethod as P23 } from "@/components/blocks/preview-02/cards/receiving-method"
import { RecentTransactions as P24 } from "@/components/blocks/preview-02/cards/recent-transactions"
import { ReleaseCatalog as P25 } from "@/components/blocks/preview-02/cards/release-catalog"
import { RollerShades as P26 } from "@/components/blocks/preview-02/cards/roller-shades"
import { SavingsProgress as P27 } from "@/components/blocks/preview-02/cards/savings-progress"
import { SavingsTargets as P28 } from "@/components/blocks/preview-02/cards/savings-targets"
import { SidebarNav as P29 } from "@/components/blocks/preview-02/cards/sidebar-nav"
import { SocialLinks as P30 } from "@/components/blocks/preview-02/cards/social-links"
import { StockPerformance as P31 } from "@/components/blocks/preview-02/cards/stock-performance"
import { SyncingState as P32 } from "@/components/blocks/preview-02/cards/syncing-state"
import { TransferFunds as P33 } from "@/components/blocks/preview-02/cards/transfer-funds"
import { UpcomingPayments as P34 } from "@/components/blocks/preview-02/cards/upcoming-payments"
import { ActivateAgentDialog as P35 } from "@/components/blocks/preview/cards/activate-agent-dialog"
import { AnalyticsCard as P36 } from "@/components/blocks/preview/cards/analytics-card"
import { AnomalyAlert as P37 } from "@/components/blocks/preview/cards/anomaly-alert"
import { AssignIssue as P38 } from "@/components/blocks/preview/cards/assign-issue"
import { BarChartCard as P39 } from "@/components/blocks/preview/cards/bar-chart-card"
import { BarVisualizerCard as P40 } from "@/components/blocks/preview/cards/bar-visualizer"
import { BookAppointment as P41 } from "@/components/blocks/preview/cards/book-appointment"
import { CodespacesCard as P42 } from "@/components/blocks/preview/cards/codespaces-card"
import { ContributionsActivity as P43 } from "@/components/blocks/preview/cards/contributions-activity"
import { Contributors as P44 } from "@/components/blocks/preview/cards/contributors"
import { EnvironmentVariables as P45 } from "@/components/blocks/preview/cards/environment-variables"
import { FeedbackForm as P46 } from "@/components/blocks/preview/cards/feedback-form"
import { FileUpload as P47 } from "@/components/blocks/preview/cards/file-upload"
import { GithubProfile as P48 } from "@/components/blocks/preview/cards/github-profile"
import { IconPreviewGrid as P49 } from "@/components/blocks/preview/cards/icon-preview-grid"
import { InviteTeam as P50 } from "@/components/blocks/preview/cards/invite-team"
import { Invoice as P51 } from "@/components/blocks/preview/cards/invoice"
import { LiveWaveformCard as P52 } from "@/components/blocks/preview/cards/live-waveform"
import { NoTeamMembers as P53 } from "@/components/blocks/preview/cards/no-team-members"
import { NotFound as P54 } from "@/components/blocks/preview/cards/not-found"
import { ObservabilityCard as P55 } from "@/components/blocks/preview/cards/observability-card"
import { PieChartCard as P56 } from "@/components/blocks/preview/cards/pie-chart-card"
import { ReportBug as P57 } from "@/components/blocks/preview/cards/report-bug"
import { ShippingAddress as P58 } from "@/components/blocks/preview/cards/shipping-address"
import { Shortcuts as P59 } from "@/components/blocks/preview/cards/shortcuts"
import { SkeletonLoading as P60 } from "@/components/blocks/preview/cards/skeleton-loading"
import { SleepReport as P61 } from "@/components/blocks/preview/cards/sleep-report"
import { StyleOverview as P62 } from "@/components/blocks/preview/cards/style-overview"
import { TypographySpecimen as P63 } from "@/components/blocks/preview/cards/typography-specimen"
import { UIElements as P64 } from "@/components/blocks/preview/cards/ui-elements"
import { UsageCard as P65 } from "@/components/blocks/preview/cards/usage-card"
import { Visitors as P66 } from "@/components/blocks/preview/cards/visitors"
import { WeeklyFitnessSummary as P67 } from "@/components/blocks/preview/cards/weekly-fitness-summary"
import { FilesChat as P68 } from "@/components/blocks/preview-03/cards/files-chat"
import { GroupChat as P69 } from "@/components/blocks/preview-03/cards/group-chat"
import { ReasoningChat as P70 } from "@/components/blocks/preview-03/cards/reasoning-chat"
import { SimpleChat as P71 } from "@/components/blocks/preview-03/cards/simple-chat"
import { SourcesChat as P72 } from "@/components/blocks/preview-03/cards/sources-chat"
import { ToolChat as P73 } from "@/components/blocks/preview-03/cards/tool-chat"

const GROUPS: [string, string, string][] = [
  [
    "empty",
    "빈 상태",
    "보여줄 것이 없을 때. 막다른 화면이 아니라 다음 행동이 있어야 한다"
  ],
  [
    "loading",
    "로딩 · 전이",
    "아직 오지 않았거나, 오는 중일 때"
  ],
  [
    "notice",
    "알림 · 안내",
    "사용자가 찾지 않아도 먼저 말해야 하는 것"
  ],
  [
    "form",
    "폼 · 설정",
    "값을 받고 저장하는 것"
  ],
  [
    "metric",
    "지표 · 차트",
    "숫자와 추세를 읽히게 하는 것"
  ],
  [
    "list",
    "목록 · 표",
    "여러 개를 나란히 다루는 것"
  ],
  [
    "media",
    "미디어 · 파일",
    "이미지 · 소리 · 업로드"
  ],
  [
    "device",
    "기기 제어",
    "물리 기기의 상태를 바꾸는 것"
  ],
  [
    "dev",
    "개발 · 운영",
    "만드는 사람이 보는 화면"
  ],
  [
    "ai",
    "AI 대화",
    "에이전트와 주고받는 형태"
  ]
]

const ITEMS = [
  { id: "account-access", group: "form", title: "Account Access", note: "비밀번호·재인증처럼 위험한 변경. 파괴적 동작을 따로 묶는다", src: "preview-02", Comp: P0 },
  { id: "album-card", group: "media", title: "Synthetic Horizons EP", note: "표지 + 제목 + 발매일. 음악·영상 항목", src: "preview-02", Comp: P1 },
  { id: "card-overview", group: "metric", title: "US$12.94", note: "잔액 같은 핵심 숫자 하나를 크게. 보조 정보는 아래로", src: "preview-02", Comp: P2 },
  { id: "catalog-toolbar", group: "list", title: "catalog-toolbar", note: "목록 위의 도구 줄 — 검색·필터·보기 전환", src: "preview-02", Comp: P3 },
  { id: "claimable-balance", group: "metric", title: "$0.00", note: "받을 수 있는 금액 + 받기 액션", src: "preview-02", Comp: P4 },
  { id: "contribution-history", group: "metric", title: "Contribution History", note: "기여·활동을 달력 격자로. 밀도가 곧 정보", src: "preview-02", Comp: P5 },
  { id: "cover-art", group: "media", title: "cover-art", note: "이미지 업로드 자리. 규격을 미리 알린다", src: "preview-02", Comp: P6 },
  { id: "dividend-income", group: "metric", title: "Q2 Dividend Income", note: "분기별 수입 비교", src: "preview-02", Comp: P7 },
  { id: "empty-connect-bank", group: "empty", title: "empty-connect-bank", note: "연동이 안 끝나 데이터가 아직 없을 때. 다음 행동(연결하기)이 카드 안에 있다", src: "preview-02", Comp: P8 },
  { id: "empty-distribute-track", group: "empty", title: "empty-distribute-track", note: "만들었지만 아직 내보내지 않은 항목. 게시 유도", src: "preview-02", Comp: P9 },
  { id: "empty-explore-catalog", group: "empty", title: "empty-explore-catalog", note: "탐색을 시작하기 전. 둘러보기로 유도", src: "preview-02", Comp: P10 },
  { id: "faq", group: "notice", title: "faq", note: "같은 질문이 반복될 때. 지원 요청을 줄인다", src: "preview-02", Comp: P11 },
  { id: "front-door", group: "device", title: "Front Door", note: "잠금 같은 두 상태 기기. 현재 상태가 먼저 읽혀야 한다", src: "preview-02", Comp: P12 },
  { id: "index-investing", group: "metric", title: "Dollar-Cost Averaging", note: "개념을 설명하는 교육형 카드. 숫자보다 이해가 목적", src: "preview-02", Comp: P13 },
  { id: "kitchen-island", group: "device", title: "Kitchen Island", note: "밝기·색을 가진 조명 제어", src: "preview-02", Comp: P14 },
  { id: "loading-card", group: "loading", title: "loading-card", note: "카드 한 장이 아직 안 왔을 때의 자리표시", src: "preview-02", Comp: P15 },
  { id: "new-milestone", group: "form", title: "Set a new milestone", note: "목표를 새로 만드는 생성 폼. 이름 + 금액 + 기한", src: "preview-02", Comp: P16 },
  { id: "notification-settings", group: "form", title: "Notifications", note: "알림 종류별 on/off. 스위치가 여럿인 설정", src: "preview-02", Comp: P17 },
  { id: "payments", group: "list", title: "payments", note: "결제 수단 목록. 기본값 표시 + 추가", src: "preview-02", Comp: P18 },
  { id: "payout-threshold", group: "form", title: "Payout Threshold", note: "임계값 하나를 정하는 설정. 슬라이더·숫자 입력", src: "preview-02", Comp: P19 },
  { id: "power-usage", group: "metric", title: "Power Usage", note: "시간대별 사용량 + 현재값", src: "preview-02", Comp: P20 },
  { id: "preferences", group: "form", title: "Preferences", note: "계정 전반 설정. 여러 항목을 한 카드에 묶는다", src: "preview-02", Comp: P21 },
  { id: "qr-connect", group: "notice", title: "Scan to connect your mobile device", note: "다른 기기로 이어가야 할 때. 로그인·페어링", src: "preview-02", Comp: P22 },
  { id: "receiving-method", group: "form", title: "Receiving Method", note: "선택지 중 하나를 고르고 그에 따라 입력칸이 바뀌는 폼", src: "preview-02", Comp: P23 },
  { id: "recent-transactions", group: "list", title: "Recent Transactions", note: "최근 활동. 금액 + 시각 + 상태", src: "preview-02", Comp: P24 },
  { id: "release-catalog", group: "list", title: "release-catalog", note: "발매·릴리스 목록. 썸네일 + 메타", src: "preview-02", Comp: P25 },
  { id: "roller-shades", group: "device", title: "Living Room", note: "위치를 % 로 조절하는 기기", src: "preview-02", Comp: P26 },
  { id: "savings-progress", group: "metric", title: "savings-progress", note: "목표 대비 진행률", src: "preview-02", Comp: P27 },
  { id: "savings-targets", group: "metric", title: "Savings Targets", note: "여러 목표의 진행 상황을 한 목록에", src: "preview-02", Comp: P28 },
  { id: "sidebar-nav", group: "list", title: "sidebar-nav", note: "카드 안에 들어가는 좁은 탐색 목록", src: "preview-02", Comp: P29 },
  { id: "social-links", group: "form", title: "Social Links", note: "링크 여러 개를 붙였다 뗐다 하는 반복 입력", src: "preview-02", Comp: P30 },
  { id: "stock-performance", group: "metric", title: "Stock Performance", note: "가격 추이 선형 차트", src: "preview-02", Comp: P31 },
  { id: "syncing-state", group: "loading", title: "syncing-state", note: "백그라운드 동기화 중. 화면을 막지 않고 상태만 알린다", src: "preview-02", Comp: P32 },
  { id: "transfer-funds", group: "form", title: "Transfer Funds", note: "출금·입금 계좌를 고르고 금액을 넣는 이체. 수수료·도착 시각을 미리 보여준다", src: "preview-02", Comp: P33 },
  { id: "upcoming-payments", group: "list", title: "Upcoming Payments", note: "예정된 것. 날짜를 골라 필터", src: "preview-02", Comp: P34 },
  { id: "activate-agent-dialog", group: "notice", title: "Ship faster & safer with Vercel Agent", note: "유료·권한이 필요한 기능을 켜기 전 동의를 받는 자리", src: "preview", Comp: P35 },
  { id: "analytics-card", group: "metric", title: "Analytics", note: "방문자 같은 총량 + 추세선", src: "preview", Comp: P36 },
  { id: "anomaly-alert", group: "notice", title: "anomaly-alert", note: "지표가 평소와 다를 때 먼저 알린다. 사용자가 안 찾아봐도 뜬다", src: "preview", Comp: P37 },
  { id: "assign-issue", group: "form", title: "Assign Issue", note: "여러 명 중에서 고르는 배정. 검색 + 다중 선택", src: "preview", Comp: P38 },
  { id: "bar-chart-card", group: "metric", title: "Traffic channels", note: "두 계열 비교 막대", src: "preview", Comp: P39 },
  { id: "bar-visualizer", group: "media", title: "Audio Frequency Visualizer", note: "오디오 주파수 실시간 표시", src: "preview", Comp: P40 },
  { id: "book-appointment", group: "form", title: "Book Appointment", note: "날짜 + 시간대를 함께 고르는 예약", src: "preview", Comp: P41 },
  { id: "codespaces-card", group: "dev", title: "codespaces-card", note: "개발 환경 상태와 접속", src: "preview", Comp: P42 },
  { id: "contributions-activity", group: "form", title: "Contributions & Activity", note: "공개 범위 설정. 무엇을 남에게 보일지", src: "preview", Comp: P43 },
  { id: "contributors", group: "list", title: "Contributors", note: "사람 목록. 아바타 + 기여량", src: "preview", Comp: P44 },
  { id: "environment-variables", group: "form", title: "Environment Variables", note: "키·값 쌍 관리. 값은 가려두고 필요할 때만 연다", src: "preview", Comp: P45 },
  { id: "feedback-form", group: "form", title: "feedback-form", note: "가벼운 의견 수집. 짧게 끝나야 한다", src: "preview", Comp: P46 },
  { id: "file-upload", group: "media", title: "File Upload", note: "드래그 앤 드롭 업로드. 형식·용량 안내 포함", src: "preview", Comp: P47 },
  { id: "github-profile", group: "form", title: "Profile", note: "프로필 편집. 아바타 + 이름 + 소개", src: "preview", Comp: P48 },
  { id: "icon-preview-grid", group: "media", title: "icon-preview-grid", note: "아이콘 세트를 한눈에 훑는 격자", src: "preview", Comp: P49 },
  { id: "invite-team", group: "form", title: "Invite Team", note: "이메일로 사람을 부르고 권한을 정한다", src: "preview", Comp: P50 },
  { id: "invoice", group: "dev", title: "Invoice #INV-2847", note: "청구서. 항목 + 합계 + 기한", src: "preview", Comp: P51 },
  { id: "live-waveform", group: "media", title: "Live Audio Waveform", note: "마이크 입력 파형. 녹음 중임을 보인다", src: "preview", Comp: P52 },
  { id: "no-team-members", group: "empty", title: "no-team-members", note: "협업 공간에 나 혼자일 때. 초대가 다음 행동", src: "preview", Comp: P53 },
  { id: "not-found", group: "empty", title: "not-found", note: "검색·필터 결과가 0건. 조건을 바꾸도록 유도", src: "preview", Comp: P54 },
  { id: "observability-card", group: "notice", title: "Observability Plus is replacing Monitoring", note: "기능이 바뀌거나 대체될 때의 전환 안내", src: "preview", Comp: P55 },
  { id: "pie-chart-card", group: "metric", title: "Browser Share", note: "구성비. 항목이 적을 때만", src: "preview", Comp: P56 },
  { id: "report-bug", group: "form", title: "Report Bug", note: "오류 신고. 재현 방법을 받아내는 구조", src: "preview", Comp: P57 },
  { id: "shipping-address", group: "form", title: "Shipping Address", note: "주소 입력. 여러 줄 + 우편번호 조합", src: "preview", Comp: P58 },
  { id: "shortcuts", group: "notice", title: "shortcuts", note: "키보드로 빨리 쓰는 사용자를 위한 단축키 안내", src: "preview", Comp: P59 },
  { id: "skeleton-loading", group: "loading", title: "skeleton-loading", note: "목록·본문이 오기 전. 최종 레이아웃과 같은 뼈대를 보여준다", src: "preview", Comp: P60 },
  { id: "sleep-report", group: "metric", title: "Sleep Report", note: "구간별 상태를 띠로. 수면·집중 같은 연속 데이터", src: "preview", Comp: P61 },
  { id: "style-overview", group: "dev", title: "style-overview", note: "지금 적용된 스타일·폰트를 보여주는 진단 카드", src: "preview", Comp: P62 },
  { id: "typography-specimen", group: "dev", title: "typography-specimen", note: "타입 스케일 견본", src: "preview", Comp: P63 },
  { id: "ui-elements", group: "dev", title: "ui-elements", note: "여러 컨트롤을 한 카드에 모은 확인용", src: "preview", Comp: P64 },
  { id: "usage-card", group: "metric", title: "5 days remaining in cycle", note: "남은 한도·주기. 초과 전에 알린다", src: "preview", Comp: P65 },
  { id: "visitors", group: "metric", title: "Visitors", note: "기간별 추이. 막대 하나가 한 구간", src: "preview", Comp: P66 },
  { id: "weekly-fitness-summary", group: "metric", title: "Weekly Fitness Summary", note: "요일별 누적. 주 단위 리듬을 본다", src: "preview", Comp: P67 },
  { id: "files-chat", group: "ai", title: "File review", note: "이미지·문서를 주고받는 대화", src: "preview-03", Comp: P68 },
  { id: "group-chat", group: "ai", title: "Saturday dinner plans", note: "사람이 여럿인 대화. 보낸 사람이 구분돼야 한다", src: "preview-03", Comp: P69 },
  { id: "reasoning-chat", group: "ai", title: "Reasoning trace", note: "모델의 사고 과정을 접었다 펴는 형태", src: "preview-03", Comp: P70 },
  { id: "simple-chat", group: "ai", title: "What can I help you with today?", note: "가장 기본 형태. 질문 하나 답 하나", src: "preview-03", Comp: P71 },
  { id: "sources-chat", group: "ai", title: "Reading list", note: "답의 근거가 되는 출처를 함께 단다", src: "preview-03", Comp: P72 },
  { id: "tool-chat", group: "ai", title: "Deployment check", note: "도구 호출과 그 결과를 대화 안에 보여준다", src: "preview-03", Comp: P73 },
]

export default function PatternsPage() {
  return (
    <CatalogShell>
    <main className="mx-auto w-full max-w-[1400px] px-6 py-12">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold">패턴 74개</h1>
        <p className="text-muted-foreground mt-2 max-w-[62ch] text-sm">
          preview 블록 세 개에 뭉쳐 있던 카드를 하나씩 떼어, 어느 파일에 있었는지가
          아니라 <strong>언제 쓰는지</strong>로 묶었다. 각 카드는 그대로 복사해 쓸 수 있다.
        </p>
      </header>

      <nav className="mb-10 flex flex-wrap gap-2">
        {GROUPS.map(([key, title]) => (
          <a
            key={key}
            href={`#${key}`}
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
