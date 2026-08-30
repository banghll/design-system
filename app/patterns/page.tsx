/* 패턴 카탈로그 — scripts/gen-patterns.mjs 가 생성한다. 직접 고치지 말 것.
 * preview 블록에 뭉쳐 있던 카드 74개를 쓰임별로 떼어 놓았다.
 * 군의 이름과 정의는 lib/catalog-nav.ts 의 PATTERN_SECTIONS 에서 온다 —
 * 사이드바와 이 페이지가 같은 문장을 본다.
 */
"use client"

import { CatalogHeader, CatalogShell, GroupHeader } from "@/components/catalog-shell"
import { useLang } from "@/components/lang"
import { PATTERN_SECTIONS } from "@/lib/catalog-nav"

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

const ITEMS = [
  { id: "account-access", group: "form", title: "Account Access", note: { ko: "비밀번호·재인증처럼 위험한 변경. 파괴적 동작을 따로 묶는다", en: "Risky changes like password or re-auth. Destructive actions kept separate" }, src: "preview-02", Comp: P0 },
  { id: "album-card", group: "media", title: "Synthetic Horizons EP", note: { ko: "표지 + 제목 + 발매일. 음악·영상 항목", en: "Cover, title, release date — a music or video item" }, src: "preview-02", Comp: P1 },
  { id: "card-overview", group: "metric", title: "US$12.94", note: { ko: "핵심 숫자 하나를 크게. 보조 정보는 아래로 내린다", en: "One number, made large. Supporting detail drops below" }, src: "preview-02", Comp: P2 },
  { id: "catalog-toolbar", group: "list", title: "catalog-toolbar", note: { ko: "목록 위의 도구 줄 — 검색 · 필터 · 보기 전환", en: "The bar above a list — search, filter, view switch" }, src: "preview-02", Comp: P3 },
  { id: "claimable-balance", group: "metric", title: "$0.00", note: { ko: "받을 수 있는 금액 + 받기 액션이 한 자리에", en: "An available amount with its claim action in the same place" }, src: "preview-02", Comp: P4 },
  { id: "contribution-history", group: "metric", title: "Contribution History", note: { ko: "활동을 달력 격자로. 밀도 자체가 정보다", en: "Activity as a calendar grid, where density is the information" }, src: "preview-02", Comp: P5 },
  { id: "cover-art", group: "media", title: "cover-art", note: { ko: "이미지 업로드 자리. 규격을 미리 알린다", en: "Image upload that states the spec before the file is picked" }, src: "preview-02", Comp: P6 },
  { id: "dividend-income", group: "metric", title: "Q2 Dividend Income", note: { ko: "분기별 수입 비교", en: "Income compared quarter by quarter" }, src: "preview-02", Comp: P7 },
  { id: "empty-connect-bank", group: "empty", title: "empty-connect-bank", note: { ko: "연동이 안 끝나 데이터가 아직 없을 때. 다음 행동(연결하기)이 카드 안에 있다", en: "Setup isn't finished, so there's no data yet. The next action lives inside the card" }, src: "preview-02", Comp: P8 },
  { id: "empty-distribute-track", group: "empty", title: "empty-distribute-track", note: { ko: "만들었지만 아직 내보내지 않은 항목. 게시로 유도한다", en: "Made but not yet shipped. Nudges toward publishing" }, src: "preview-02", Comp: P9 },
  { id: "empty-explore-catalog", group: "empty", title: "empty-explore-catalog", note: { ko: "탐색을 시작하기 전. 무엇이 있는지 둘러보게 한다", en: "Before browsing starts — invites a look around" }, src: "preview-02", Comp: P10 },
  { id: "faq", group: "notice", title: "faq", note: { ko: "같은 질문이 반복될 때. 지원 요청 자체를 줄인다", en: "When the same question keeps coming — cuts support volume" }, src: "preview-02", Comp: P11 },
  { id: "front-door", group: "device", title: "Front Door", note: { ko: "잠금처럼 두 상태인 기기. 현재 상태가 조작보다 먼저 읽혀야 한다", en: "A two-state device like a lock — current state must read before the control" }, src: "preview-02", Comp: P12 },
  { id: "index-investing", group: "metric", title: "Dollar-Cost Averaging", note: { ko: "개념을 설명하는 교육형 카드. 숫자보다 이해가 목적", en: "An explanatory card — understanding, not numbers, is the point" }, src: "preview-02", Comp: P13 },
  { id: "kitchen-island", group: "device", title: "Kitchen Island", note: { ko: "밝기와 색을 가진 조명 제어", en: "Lighting control with brightness and color" }, src: "preview-02", Comp: P14 },
  { id: "loading-card", group: "loading", title: "loading-card", note: { ko: "카드 한 장이 아직 안 왔을 때의 자리표시", en: "Placeholder while a single card is still in flight" }, src: "preview-02", Comp: P15 },
  { id: "new-milestone", group: "form", title: "Set a new milestone", note: { ko: "목표를 새로 만드는 생성 폼. 이름 + 금액 + 기한", en: "Creating a goal — name, amount, deadline" }, src: "preview-02", Comp: P16 },
  { id: "notification-settings", group: "form", title: "Notifications", note: { ko: "알림 종류별 on/off. 스위치가 여럿인 설정", en: "Per-type notification toggles — a settings screen made of switches" }, src: "preview-02", Comp: P17 },
  { id: "payments", group: "list", title: "payments", note: { ko: "결제 수단 목록. 기본값 표시와 추가", en: "Payment methods — which is default, and how to add" }, src: "preview-02", Comp: P18 },
  { id: "payout-threshold", group: "form", title: "Payout Threshold", note: { ko: "임계값 하나를 정하는 설정. 슬라이더 + 숫자 입력", en: "Setting a single threshold — slider paired with a number field" }, src: "preview-02", Comp: P19 },
  { id: "power-usage", group: "metric", title: "Power Usage", note: { ko: "시간대별 사용량과 현재값", en: "Usage by hour alongside the current reading" }, src: "preview-02", Comp: P20 },
  { id: "preferences", group: "form", title: "Preferences", note: { ko: "계정 전반 설정. 성격이 비슷한 항목을 한 카드에 묶는다", en: "Account-wide preferences, related items grouped into one card" }, src: "preview-02", Comp: P21 },
  { id: "qr-connect", group: "notice", title: "Scan to connect your mobile device", note: { ko: "다른 기기로 이어가야 할 때. 로그인·페어링", en: "Handing off to another device — sign-in, pairing" }, src: "preview-02", Comp: P22 },
  { id: "receiving-method", group: "form", title: "Receiving Method", note: { ko: "선택지에 따라 입력칸이 바뀌는 폼. 분기가 눈에 보여야 한다", en: "Fields change with the choice — the branch must be visible" }, src: "preview-02", Comp: P23 },
  { id: "recent-transactions", group: "list", title: "Recent Transactions", note: { ko: "최근 활동. 금액 + 시각 + 상태", en: "Recent activity — amount, time, status" }, src: "preview-02", Comp: P24 },
  { id: "release-catalog", group: "list", title: "release-catalog", note: { ko: "발매·릴리스 목록. 썸네일 + 메타", en: "Releases — thumbnail plus metadata" }, src: "preview-02", Comp: P25 },
  { id: "roller-shades", group: "device", title: "Living Room", note: { ko: "위치를 백분율로 조절하는 기기", en: "A device positioned by percentage" }, src: "preview-02", Comp: P26 },
  { id: "savings-progress", group: "metric", title: "savings-progress", note: { ko: "목표 대비 진행률. 값보다 남은 거리가 중요할 때", en: "Progress toward a goal, when the gap matters more than the value" }, src: "preview-02", Comp: P27 },
  { id: "savings-targets", group: "metric", title: "Savings Targets", note: { ko: "여러 목표의 진행 상황을 한 목록에", en: "Several goals and their progress in one list" }, src: "preview-02", Comp: P28 },
  { id: "sidebar-nav", group: "list", title: "sidebar-nav", note: { ko: "카드 안에 들어가는 좁은 탐색 목록", en: "A narrow navigation list that lives inside a card" }, src: "preview-02", Comp: P29 },
  { id: "social-links", group: "form", title: "Social Links", note: { ko: "링크 여러 개를 붙였다 뗐다 하는 반복 입력", en: "Repeatable input — links added and removed freely" }, src: "preview-02", Comp: P30 },
  { id: "stock-performance", group: "metric", title: "Stock Performance", note: { ko: "가격 추이 선형 차트", en: "Price movement as a line" }, src: "preview-02", Comp: P31 },
  { id: "syncing-state", group: "loading", title: "syncing-state", note: { ko: "백그라운드 동기화 중. 화면을 막지 않고 상태만 알린다", en: "Syncing in the background — reports state without blocking" }, src: "preview-02", Comp: P32 },
  { id: "transfer-funds", group: "form", title: "Transfer Funds", note: { ko: "계좌를 고르고 금액을 넣는 이체. 수수료와 도착 시각을 미리 보여준다", en: "Transfer — pick accounts, enter amount, see fee and arrival before confirming" }, src: "preview-02", Comp: P33 },
  { id: "upcoming-payments", group: "list", title: "Upcoming Payments", note: { ko: "예정된 것. 날짜를 골라 좁힌다", en: "What's coming, narrowed by date" }, src: "preview-02", Comp: P34 },
  { id: "activate-agent-dialog", group: "notice", title: "Ship faster & safer with Vercel Agent", note: { ko: "유료·권한이 필요한 기능을 켜기 전 동의를 받는 자리", en: "Consent before switching on something paid or privileged" }, src: "preview", Comp: P35 },
  { id: "analytics-card", group: "metric", title: "Analytics", note: { ko: "총량 + 추세선. 값과 방향을 함께 읽힌다", en: "A total with a trend line — value and direction read together" }, src: "preview", Comp: P36 },
  { id: "anomaly-alert", group: "notice", title: "anomaly-alert", note: { ko: "지표가 평소와 다를 때. 사용자가 찾아보지 않아도 먼저 뜬다", en: "A metric left its normal range — surfaced before anyone goes looking" }, src: "preview", Comp: P37 },
  { id: "assign-issue", group: "form", title: "Assign Issue", note: { ko: "여러 명 중에서 고르는 배정. 검색 + 다중 선택", en: "Assignment from many people — search plus multi-select" }, src: "preview", Comp: P38 },
  { id: "bar-chart-card", group: "metric", title: "Traffic channels", note: { ko: "두 계열 비교 막대", en: "Bars comparing two series" }, src: "preview", Comp: P39 },
  { id: "bar-visualizer", group: "media", title: "Audio Frequency Visualizer", note: { ko: "오디오 주파수 실시간 표시", en: "Live audio frequency display" }, src: "preview", Comp: P40 },
  { id: "book-appointment", group: "form", title: "Book Appointment", note: { ko: "날짜와 시간대를 함께 고르는 예약", en: "Booking — date and time slot chosen together" }, src: "preview", Comp: P41 },
  { id: "codespaces-card", group: "dev", title: "codespaces-card", note: { ko: "개발 환경 상태와 접속", en: "Dev environment status and how to connect" }, src: "preview", Comp: P42 },
  { id: "contributions-activity", group: "form", title: "Contributions & Activity", note: { ko: "공개 범위 설정. 무엇을 남에게 보일지 정한다", en: "Visibility settings — deciding what others can see" }, src: "preview", Comp: P43 },
  { id: "contributors", group: "list", title: "Contributors", note: { ko: "사람 목록. 아바타 + 기여량", en: "People — avatar plus contribution volume" }, src: "preview", Comp: P44 },
  { id: "environment-variables", group: "form", title: "Environment Variables", note: { ko: "키·값 쌍 관리. 값은 가려두고 필요할 때만 연다", en: "Key-value management with values masked until asked for" }, src: "preview", Comp: P45 },
  { id: "feedback-form", group: "form", title: "feedback-form", note: { ko: "가벼운 의견 수집. 짧게 끝나야 응답이 온다", en: "Light feedback — it only gets answered if it stays short" }, src: "preview", Comp: P46 },
  { id: "file-upload", group: "media", title: "File Upload", note: { ko: "드래그 앤 드롭 업로드. 형식과 용량 제한을 함께 적는다", en: "Drag-and-drop upload with format and size limits stated" }, src: "preview", Comp: P47 },
  { id: "github-profile", group: "form", title: "Profile", note: { ko: "프로필 편집. 아바타 + 이름 + 소개", en: "Profile editing — avatar, name, bio" }, src: "preview", Comp: P48 },
  { id: "icon-preview-grid", group: "media", title: "icon-preview-grid", note: { ko: "아이콘 세트를 한눈에 훑는 격자", en: "A grid for scanning an icon set at once" }, src: "preview", Comp: P49 },
  { id: "invite-team", group: "form", title: "Invite Team", note: { ko: "이메일로 사람을 부르고 권한을 함께 정한다", en: "Invite by email and assign the role in the same step" }, src: "preview", Comp: P50 },
  { id: "invoice", group: "dev", title: "Invoice #INV-2847", note: { ko: "청구서. 항목 + 합계 + 기한", en: "An invoice — line items, total, due date" }, src: "preview", Comp: P51 },
  { id: "live-waveform", group: "media", title: "Live Audio Waveform", note: { ko: "마이크 입력 파형. 녹음 중임을 몸으로 보인다", en: "Microphone waveform — recording made physically visible" }, src: "preview", Comp: P52 },
  { id: "no-team-members", group: "empty", title: "no-team-members", note: { ko: "협업 공간에 나 혼자일 때. 초대가 다음 행동이다", en: "Alone in a shared space. Inviting is the next move" }, src: "preview", Comp: P53 },
  { id: "not-found", group: "empty", title: "not-found", note: { ko: "검색·필터 결과가 0건. 조건을 되돌릴 길을 준다", en: "Zero results from search or filter. Offers a way back" }, src: "preview", Comp: P54 },
  { id: "observability-card", group: "notice", title: "Observability Plus is replacing Monitoring", note: { ko: "기능이 바뀌거나 대체될 때의 전환 안내", en: "Migration notice when a feature changes or is replaced" }, src: "preview", Comp: P55 },
  { id: "pie-chart-card", group: "metric", title: "Browser Share", note: { ko: "구성비. 항목이 다섯을 넘으면 쓰지 않는다", en: "Composition — not past five slices" }, src: "preview", Comp: P56 },
  { id: "report-bug", group: "form", title: "Report Bug", note: { ko: "오류 신고. 재현 방법을 받아내는 구조", en: "Bug report, structured to extract reproduction steps" }, src: "preview", Comp: P57 },
  { id: "shipping-address", group: "form", title: "Shipping Address", note: { ko: "주소 입력. 여러 줄 + 우편번호 조합", en: "Address entry — multiple lines plus a postal code" }, src: "preview", Comp: P58 },
  { id: "shortcuts", group: "notice", title: "shortcuts", note: { ko: "키보드로 빨리 쓰는 사용자를 위한 단축키 안내", en: "Shortcut reference for keyboard-first users" }, src: "preview", Comp: P59 },
  { id: "skeleton-loading", group: "loading", title: "skeleton-loading", note: { ko: "목록·본문이 오기 전. 최종 레이아웃과 같은 뼈대라 도착해도 화면이 안 튄다", en: "Before a list or body arrives. Matches the final layout so nothing jumps" }, src: "preview", Comp: P60 },
  { id: "sleep-report", group: "metric", title: "Sleep Report", note: { ko: "구간별 상태를 띠로. 수면·집중 같은 연속 데이터", en: "Banded states over time — sleep, focus, other continuous data" }, src: "preview", Comp: P61 },
  { id: "style-overview", group: "dev", title: "style-overview", note: { ko: "지금 적용된 스타일과 폰트를 보여주는 진단 카드", en: "A diagnostic card showing the style and fonts currently applied" }, src: "preview", Comp: P62 },
  { id: "typography-specimen", group: "dev", title: "typography-specimen", note: { ko: "타입 스케일 견본", en: "A type scale specimen" }, src: "preview", Comp: P63 },
  { id: "ui-elements", group: "dev", title: "ui-elements", note: { ko: "여러 컨트롤을 한 카드에 모은 확인용", en: "Assorted controls gathered for checking" }, src: "preview", Comp: P64 },
  { id: "usage-card", group: "metric", title: "5 days remaining in cycle", note: { ko: "남은 한도와 주기. 초과하기 전에 알린다", en: "Remaining quota and cycle — warns before the limit, not after" }, src: "preview", Comp: P65 },
  { id: "visitors", group: "metric", title: "Visitors", note: { ko: "기간별 추이. 막대 하나가 한 구간", en: "Change over periods — one bar per bucket" }, src: "preview", Comp: P66 },
  { id: "weekly-fitness-summary", group: "metric", title: "Weekly Fitness Summary", note: { ko: "요일별 누적. 주 단위 리듬을 본다", en: "Daily totals across a week, to read the weekly rhythm" }, src: "preview", Comp: P67 },
  { id: "files-chat", group: "ai", title: "File review", note: { ko: "이미지·문서를 주고받는 대화", en: "Conversation that passes images and documents" }, src: "preview-03", Comp: P68 },
  { id: "group-chat", group: "ai", title: "Saturday dinner plans", note: { ko: "사람이 여럿인 대화. 보낸 사람이 구분돼야 한다", en: "Multi-person conversation, where the sender must be distinguishable" }, src: "preview-03", Comp: P69 },
  { id: "reasoning-chat", group: "ai", title: "Reasoning trace", note: { ko: "모델의 사고 과정을 접었다 펴는 형태", en: "The model's reasoning, foldable" }, src: "preview-03", Comp: P70 },
  { id: "simple-chat", group: "ai", title: "What can I help you with today?", note: { ko: "가장 기본 형태. 질문 하나에 답 하나", en: "The base case — one question, one answer" }, src: "preview-03", Comp: P71 },
  { id: "sources-chat", group: "ai", title: "Reading list", note: { ko: "답의 근거가 되는 출처를 함께 단다", en: "Answers carrying the sources they relied on" }, src: "preview-03", Comp: P72 },
  { id: "tool-chat", group: "ai", title: "Deployment check", note: { ko: "도구 호출과 그 결과를 대화 안에서 보여준다", en: "Tool calls and their results shown inside the conversation" }, src: "preview-03", Comp: P73 },
]

export default function PatternsPage() {
  const { t, lang } = useLang()

  return (
    <CatalogShell
      toc={PATTERN_SECTIONS.map((s) => ({ id: s.id, label: s.label }))}
    >
      <main className="mx-auto w-full max-w-[1200px] px-6 py-14 lg:px-10">
        <CatalogHeader
          title={{ ko: "패턴", en: "Patterns" }}
          count={lang === "ko" ? "74개" : "74"}
        >
          {lang === "ko" ? (
            <>
              <b>패턴은 컴포넌트를 조립해 한 가지 상황을 푼 결과다.</b> 버튼과 카드가
              무엇인지 아는 것과, 빈 화면을 어떻게 채울지 아는 것은 다른 문제다 —
              그 사이를 메우는 층이 여기다.
              <br />
              <br />
              모든 카드는 우리 <code>components/ui</code> 를 참조한다. 컴포넌트를
              고치면 여기 74장이 함께 바뀐다는 뜻이고, 반대로 여기서 마음에 드는 것을
              찾았다면 그대로 복사해 쓸 수 있다는 뜻이다.
            </>
          ) : (
            <>
              <b>A pattern is components assembled to solve one situation.</b> Knowing
              what a button and a card are is a different problem from knowing how to
              fill an empty screen. This layer covers the gap.
              <br />
              <br />
              Every card here references our own <code>components/ui</code>. Change a
              component and all 74 change with it — and anything you like here can be
              copied out as-is.
            </>
          )}
        </CatalogHeader>

        <div className="flex flex-col gap-16">
          {PATTERN_SECTIONS.map((section) => {
            const items = ITEMS.filter((i) => i.group === section.id)
            if (!items.length) return null
            return (
              <section key={section.id} id={section.id} className="scroll-mt-6">
                <GroupHeader
                  title={section.label}
                  note={section.note}
                  count={items.length}
                />

                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {items.map(({ id, title, note, src, Comp }) => (
                    <article key={id} className="flex min-w-0 flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-medium">{title}</span>
                          <code className="text-muted-foreground text-[11px]">{id}</code>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          {t(note)}
                        </p>
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
