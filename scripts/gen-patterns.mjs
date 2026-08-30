/* /patterns 페이지를 생성한다.
 *
 * preview 블록 3개는 카드 74개가 한 캔버스에 뭉쳐 있어 "무엇이 있는지" 파악이 안 된다.
 * 여기서는 출처(어느 preview 에 있었는지)가 아니라 쓰임으로 묶고, 하나씩 떼어 놓는다.
 *
 * 설명은 { ko, en } 한 쌍. 형용사가 아니라 조건으로 쓴다 —
 * 이 문장이 에이전트가 "이 상황에 이걸 쓸까" 를 판단하는 근거가 되기 때문이다.
 */
import fs from "node:fs"

const CARDS = JSON.parse(fs.readFileSync("scripts/.cache/_cards.json", "utf8"))

/* id → [군, 한국어, English] */
const META = {
  // ── 빈 상태
  "empty-connect-bank": ["empty", "연동이 안 끝나 데이터가 아직 없을 때. 다음 행동(연결하기)이 카드 안에 있다", "Setup isn't finished, so there's no data yet. The next action lives inside the card"],
  "empty-distribute-track": ["empty", "만들었지만 아직 내보내지 않은 항목. 게시로 유도한다", "Made but not yet shipped. Nudges toward publishing"],
  "empty-explore-catalog": ["empty", "탐색을 시작하기 전. 무엇이 있는지 둘러보게 한다", "Before browsing starts — invites a look around"],
  "no-team-members": ["empty", "협업 공간에 나 혼자일 때. 초대가 다음 행동이다", "Alone in a shared space. Inviting is the next move"],
  "not-found": ["empty", "검색·필터 결과가 0건. 조건을 되돌릴 길을 준다", "Zero results from search or filter. Offers a way back"],

  // ── 로딩 · 상태 전이
  "loading-card": ["loading", "카드 한 장이 아직 안 왔을 때의 자리표시", "Placeholder while a single card is still in flight"],
  "skeleton-loading": ["loading", "목록·본문이 오기 전. 최종 레이아웃과 같은 뼈대라 도착해도 화면이 안 튄다", "Before a list or body arrives. Matches the final layout so nothing jumps"],
  "syncing-state": ["loading", "백그라운드 동기화 중. 화면을 막지 않고 상태만 알린다", "Syncing in the background — reports state without blocking"],

  // ── 알림 · 안내
  "anomaly-alert": ["notice", "지표가 평소와 다를 때. 사용자가 찾아보지 않아도 먼저 뜬다", "A metric left its normal range — surfaced before anyone goes looking"],
  "observability-card": ["notice", "기능이 바뀌거나 대체될 때의 전환 안내", "Migration notice when a feature changes or is replaced"],
  "activate-agent-dialog": ["notice", "유료·권한이 필요한 기능을 켜기 전 동의를 받는 자리", "Consent before switching on something paid or privileged"],
  faq: ["notice", "같은 질문이 반복될 때. 지원 요청 자체를 줄인다", "When the same question keeps coming — cuts support volume"],
  "qr-connect": ["notice", "다른 기기로 이어가야 할 때. 로그인·페어링", "Handing off to another device — sign-in, pairing"],
  shortcuts: ["notice", "키보드로 빨리 쓰는 사용자를 위한 단축키 안내", "Shortcut reference for keyboard-first users"],

  // ── 폼 · 설정
  "account-access": ["form", "비밀번호·재인증처럼 위험한 변경. 파괴적 동작을 따로 묶는다", "Risky changes like password or re-auth. Destructive actions kept separate"],
  "notification-settings": ["form", "알림 종류별 on/off. 스위치가 여럿인 설정", "Per-type notification toggles — a settings screen made of switches"],
  preferences: ["form", "계정 전반 설정. 성격이 비슷한 항목을 한 카드에 묶는다", "Account-wide preferences, related items grouped into one card"],
  "payout-threshold": ["form", "임계값 하나를 정하는 설정. 슬라이더 + 숫자 입력", "Setting a single threshold — slider paired with a number field"],
  "receiving-method": ["form", "선택지에 따라 입력칸이 바뀌는 폼. 분기가 눈에 보여야 한다", "Fields change with the choice — the branch must be visible"],
  "new-milestone": ["form", "목표를 새로 만드는 생성 폼. 이름 + 금액 + 기한", "Creating a goal — name, amount, deadline"],
  "shipping-address": ["form", "주소 입력. 여러 줄 + 우편번호 조합", "Address entry — multiple lines plus a postal code"],
  "github-profile": ["form", "프로필 편집. 아바타 + 이름 + 소개", "Profile editing — avatar, name, bio"],
  "contributions-activity": ["form", "공개 범위 설정. 무엇을 남에게 보일지 정한다", "Visibility settings — deciding what others can see"],
  "social-links": ["form", "링크 여러 개를 붙였다 뗐다 하는 반복 입력", "Repeatable input — links added and removed freely"],
  "environment-variables": ["form", "키·값 쌍 관리. 값은 가려두고 필요할 때만 연다", "Key-value management with values masked until asked for"],
  "invite-team": ["form", "이메일로 사람을 부르고 권한을 함께 정한다", "Invite by email and assign the role in the same step"],
  "assign-issue": ["form", "여러 명 중에서 고르는 배정. 검색 + 다중 선택", "Assignment from many people — search plus multi-select"],
  "report-bug": ["form", "오류 신고. 재현 방법을 받아내는 구조", "Bug report, structured to extract reproduction steps"],
  "feedback-form": ["form", "가벼운 의견 수집. 짧게 끝나야 응답이 온다", "Light feedback — it only gets answered if it stays short"],
  "book-appointment": ["form", "날짜와 시간대를 함께 고르는 예약", "Booking — date and time slot chosen together"],
  "transfer-funds": ["form", "계좌를 고르고 금액을 넣는 이체. 수수료와 도착 시각을 미리 보여준다", "Transfer — pick accounts, enter amount, see fee and arrival before confirming"],

  // ── 지표 · 차트
  "card-overview": ["metric", "핵심 숫자 하나를 크게. 보조 정보는 아래로 내린다", "One number, made large. Supporting detail drops below"],
  "claimable-balance": ["metric", "받을 수 있는 금액 + 받기 액션이 한 자리에", "An available amount with its claim action in the same place"],
  "usage-card": ["metric", "남은 한도와 주기. 초과하기 전에 알린다", "Remaining quota and cycle — warns before the limit, not after"],
  "analytics-card": ["metric", "총량 + 추세선. 값과 방향을 함께 읽힌다", "A total with a trend line — value and direction read together"],
  visitors: ["metric", "기간별 추이. 막대 하나가 한 구간", "Change over periods — one bar per bucket"],
  "contribution-history": ["metric", "활동을 달력 격자로. 밀도 자체가 정보다", "Activity as a calendar grid, where density is the information"],
  "dividend-income": ["metric", "분기별 수입 비교", "Income compared quarter by quarter"],
  "stock-performance": ["metric", "가격 추이 선형 차트", "Price movement as a line"],
  "power-usage": ["metric", "시간대별 사용량과 현재값", "Usage by hour alongside the current reading"],
  "savings-progress": ["metric", "목표 대비 진행률. 값보다 남은 거리가 중요할 때", "Progress toward a goal, when the gap matters more than the value"],
  "savings-targets": ["metric", "여러 목표의 진행 상황을 한 목록에", "Several goals and their progress in one list"],
  "index-investing": ["metric", "개념을 설명하는 교육형 카드. 숫자보다 이해가 목적", "An explanatory card — understanding, not numbers, is the point"],
  "bar-chart-card": ["metric", "두 계열 비교 막대", "Bars comparing two series"],
  "pie-chart-card": ["metric", "구성비. 항목이 다섯을 넘으면 쓰지 않는다", "Composition — not past five slices"],
  "sleep-report": ["metric", "구간별 상태를 띠로. 수면·집중 같은 연속 데이터", "Banded states over time — sleep, focus, other continuous data"],
  "weekly-fitness-summary": ["metric", "요일별 누적. 주 단위 리듬을 본다", "Daily totals across a week, to read the weekly rhythm"],

  // ── 목록 · 표
  "recent-transactions": ["list", "최근 활동. 금액 + 시각 + 상태", "Recent activity — amount, time, status"],
  "upcoming-payments": ["list", "예정된 것. 날짜를 골라 좁힌다", "What's coming, narrowed by date"],
  payments: ["list", "결제 수단 목록. 기본값 표시와 추가", "Payment methods — which is default, and how to add"],
  "release-catalog": ["list", "발매·릴리스 목록. 썸네일 + 메타", "Releases — thumbnail plus metadata"],
  contributors: ["list", "사람 목록. 아바타 + 기여량", "People — avatar plus contribution volume"],
  "catalog-toolbar": ["list", "목록 위의 도구 줄 — 검색 · 필터 · 보기 전환", "The bar above a list — search, filter, view switch"],
  "sidebar-nav": ["list", "카드 안에 들어가는 좁은 탐색 목록", "A narrow navigation list that lives inside a card"],

  // ── 미디어
  "album-card": ["media", "표지 + 제목 + 발매일. 음악·영상 항목", "Cover, title, release date — a music or video item"],
  "cover-art": ["media", "이미지 업로드 자리. 규격을 미리 알린다", "Image upload that states the spec before the file is picked"],
  "file-upload": ["media", "드래그 앤 드롭 업로드. 형식과 용량 제한을 함께 적는다", "Drag-and-drop upload with format and size limits stated"],
  "bar-visualizer": ["media", "오디오 주파수 실시간 표시", "Live audio frequency display"],
  "live-waveform": ["media", "마이크 입력 파형. 녹음 중임을 몸으로 보인다", "Microphone waveform — recording made physically visible"],
  "icon-preview-grid": ["media", "아이콘 세트를 한눈에 훑는 격자", "A grid for scanning an icon set at once"],

  // ── 기기 제어
  "front-door": ["device", "잠금처럼 두 상태인 기기. 현재 상태가 조작보다 먼저 읽혀야 한다", "A two-state device like a lock — current state must read before the control"],
  "kitchen-island": ["device", "밝기와 색을 가진 조명 제어", "Lighting control with brightness and color"],
  "roller-shades": ["device", "위치를 백분율로 조절하는 기기", "A device positioned by percentage"],

  // ── 개발 · 운영
  invoice: ["dev", "청구서. 항목 + 합계 + 기한", "An invoice — line items, total, due date"],
  "codespaces-card": ["dev", "개발 환경 상태와 접속", "Dev environment status and how to connect"],
  "style-overview": ["dev", "지금 적용된 스타일과 폰트를 보여주는 진단 카드", "A diagnostic card showing the style and fonts currently applied"],
  "typography-specimen": ["dev", "타입 스케일 견본", "A type scale specimen"],
  "ui-elements": ["dev", "여러 컨트롤을 한 카드에 모은 확인용", "Assorted controls gathered for checking"],

  // ── AI 대화
  "simple-chat": ["ai", "가장 기본 형태. 질문 하나에 답 하나", "The base case — one question, one answer"],
  "group-chat": ["ai", "사람이 여럿인 대화. 보낸 사람이 구분돼야 한다", "Multi-person conversation, where the sender must be distinguishable"],
  "reasoning-chat": ["ai", "모델의 사고 과정을 접었다 펴는 형태", "The model's reasoning, foldable"],
  "tool-chat": ["ai", "도구 호출과 그 결과를 대화 안에서 보여준다", "Tool calls and their results shown inside the conversation"],
  "sources-chat": ["ai", "답의 근거가 되는 출처를 함께 단다", "Answers carrying the sources they relied on"],
  "files-chat": ["ai", "이미지·문서를 주고받는 대화", "Conversation that passes images and documents"],
}

/* 두 칸을 쓰는 카드. 좁은 칸에서 뜻을 잃는 것들이다 —
 * 차트는 축이 겹치고, 표는 열이 접히고, 대화는 말풍선이 한 단어씩 끊긴다. */
const WIDE = new Set([
  "visitors",
  "analytics-card",
  "contribution-history",
  "dividend-income",
  "stock-performance",
  "power-usage",
  "sleep-report",
  "weekly-fitness-summary",
  "bar-chart-card",
  "savings-targets",
  "recent-transactions",
  "upcoming-payments",
  "payments",
  "release-catalog",
  "contributors",
  "catalog-toolbar",
  "environment-variables",
  "invoice",
  "typography-specimen",
  "ui-elements",
  "style-overview",
  "icon-preview-grid",
  "simple-chat",
  "group-chat",
  "reasoning-chat",
  "tool-chat",
  "sources-chat",
  "files-chat",
  "transfer-funds",
  "book-appointment",
  "assign-issue",
  "invite-team",
  "shipping-address",
])

const all = []
for (const [block, arr] of Object.entries(CARDS)) {
  for (const c of arr) {
    if (!c.exp) continue
    const meta = META[c.file]
    if (!meta) continue
    all.push({ ...c, block, group: meta[0], ko: meta[1], en: meta[2], wide: WIDE.has(c.file) })
  }
}

const imports = all
  .map(
    (c, i) =>
      `import { ${c.exp} as P${i} } from "@/components/blocks/${c.block}/cards/${c.file}"`
  )
  .join("\n")

const items = all
  .map(
    (c, i) =>
      `  { id: ${JSON.stringify(c.file)}, group: ${JSON.stringify(c.group)}, title: ${JSON.stringify(
        c.title || c.file
      )}, note: { ko: ${JSON.stringify(c.ko)}, en: ${JSON.stringify(
        c.en
      )} }, src: ${JSON.stringify(c.block)}, wide: ${c.wide}, Comp: P${i} },`
  )
  .join("\n")

const page = `/* 패턴 카탈로그 — scripts/gen-patterns.mjs 가 생성한다. 직접 고치지 말 것.
 * preview 블록에 뭉쳐 있던 카드 ${all.length}개를 쓰임별로 떼어 놓았다.
 * 군의 이름과 정의는 lib/catalog-nav.ts 의 PATTERN_SECTIONS 에서 온다 —
 * 사이드바와 이 페이지가 같은 문장을 본다.
 */
"use client"

import { CatalogHeader, CatalogShell, GroupHeader } from "@/components/catalog-shell"
import { useLang } from "@/components/lang"
import { PATTERN_SECTIONS } from "@/lib/catalog-nav"

${imports}

const ITEMS = [
${items}
]

export default function PatternsPage() {
  const { t, lang } = useLang()

  return (
    <CatalogShell toc={PATTERN_SECTIONS.map((s) => ({ id: s.id, label: s.label }))}>
      <main className="mx-auto w-full max-w-[1200px] px-6 py-14 lg:px-10">
        <CatalogHeader
          title={{ ko: "패턴", en: "Patterns" }}
          count={lang === "ko" ? "${all.length}개" : "${all.length}"}
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

                <div className="grid gap-8 [grid-template-columns:repeat(auto-fill,minmax(min(100%,21rem),1fr))]">
                  {items.map(({ id, title, note, src, wide, Comp }) => (
                    <article
                      key={id}
                      className={
                        wide
                          ? "flex min-w-0 flex-col gap-3 [@media(min-width:44rem)]:col-span-2"
                          : "flex min-w-0 flex-col gap-3"
                      }
                    >
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
`

fs.mkdirSync("app/patterns", { recursive: true })
fs.writeFileSync("app/patterns/page.tsx", page)
console.log(`패턴 ${all.length}개 → app/patterns/page.tsx`)
