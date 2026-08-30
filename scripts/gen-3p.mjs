/* 서드파티 블록의 레지스트리 · 라우트 · 카탈로그를 만든다.
 *
 * 블록 하나에 라우트 파일 하나를 두면 185개가 되어 손으로 감당이 안 된다.
 * 그래서 동적 라우트 하나 + 생성된 지도 하나로 처리한다.
 * 미리보기는 공식 블록과 똑같이 실제 라우트를 iframe 으로 띄운다. */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"

/* 지우기로 한 블록은 다시 가져오지 않는다.
 * 이 목록이 없으면 스크립트를 한 번 더 돌리는 순간 전부 되살아난다 —
 * "안 쓰기로 했다" 는 결정이 파일 삭제보다 오래 살아야 한다. */
const REMOVED = new Set(
  existsSync("data/removed-blocks.json")
    ? JSON.parse(readFileSync("data/removed-blocks.json", "utf8")).removed
    : []
)

const ROOT = "components/3p"
const entries = []

/* ── Tailark ──────────────────────────────────────────── */
const tIndex = join(ROOT, "tailark/_index.json")
if (existsSync(tIndex)) {
  for (const b of JSON.parse(readFileSync(tIndex, "utf8"))) {
    entries.push({
      id: `tailark-${b.id}`,
      source: "tailark",
      kind: b.block,
      variant: `${b.variant} · ${b.name}`,
      import: `@/components/3p/tailark/${b.id}`,
    })
  }
}

/* ── 레지스트리에서 받은 것들 (launch · space) ──────────── */
for (const source of ["launch", "space"]) {
  const dir = join(ROOT, source)
  if (!existsSync(dir)) continue
  for (const name of readdirSync(dir)) {
    const d = join(dir, name)
    if (!statSync(d).isDirectory() || name.startsWith("_")) continue
    /* 진입 파일 — default.tsx 가 있으면 그것, 없으면 이름이 같은 것 */
    const files = readdirSync(d).filter((f) => f.endsWith(".tsx"))
    const entry =
      files.find((f) => f === "default.tsx") ??
      files.find((f) => f === `${name}.tsx`) ??
      files.find((f) => f === "index.tsx") ??
      files[0]
    if (!entry) continue

    /* 그 파일이 default export 를 갖는지 확인한다 — 없으면 라우트를 못 만든다. */
    const src = readFileSync(join(d, entry), "utf8")
    if (!/export\s+default/.test(src)) continue

    entries.push({
      id: `${source}-${name}`,
      source,
      kind: name.replace(/-\d+$/, ""),
      variant: name,
      import: `@/components/3p/${source}/${name}/${entry.replace(/\.tsx$/, "")}`,
    })
  }
}

/* ── 검증 ─────────────────────────────────────────────
 * 부품이 하나라도 빠진 블록은 라우트를 만들어 봐야 500 만 난다.
 * 목록에 못 그리는 것을 올려 두는 게 아무것도 없는 것보다 나쁘다 — 빼고 알린다. */
const broken = []
function resolves(dir) {
  const files = readdirSync(dir).filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"))
  const have = new Set(files.map((f) => f.replace(/\.tsx?$/, "")))
  for (const f of files) {
    const code = readFileSync(join(dir, f), "utf8")
    for (const m of code.matchAll(/from\s+["']\.\/([^"']+)["']/g)) {
      if (!have.has(m[1])) return m[1]
    }
    /* 우리 것을 가리키는데 그런 컴포넌트가 없거나, 있어도 필요한 export 가
     * 없는 경우를 잡는다. 이름은 같은데 API 가 다른 컴포넌트가 실제로 있다 —
     * Launch UI 의 item 은 ItemIcon 을 내보내지만 우리 item 은 아니다.
     * 이런 블록은 목록에 올리지 않는다. 반쯤 그려진 것을 보여 주는 게 더 나쁘다. */
    for (const m of code.matchAll(
      /import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*["']@\/components\/ui\/([^"']+)["']/g
    )) {
      const file = `components/ui/${m[2]}.tsx`
      if (!existsSync(file)) return `@/components/ui/${m[2]}`
      const ours = readFileSync(file, "utf8")
      for (const raw of m[1].split(",")) {
        const n = raw.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0].trim()
        if (!n) continue
        if (!new RegExp(`\\b${n}\\b`).test(ours)) return `@/components/ui/${m[2]} → ${n}`
      }
    }
    /* 3p 안의 공용 부품도 같은 기준으로 본다. 파일이 있어도
     * 필요한 export 가 없으면(useMedia) 라우트가 죽는다. */
    for (const m of code.matchAll(
      /import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*["']@\/components\/3p\/([^"']+)["']/g
    )) {
      /* 훅은 .ts, 컴포넌트는 .tsx 다. */
      const file = [`components/3p/${m[2]}.tsx`, `components/3p/${m[2]}.ts`].find(existsSync)
      if (!file) return `@/components/3p/${m[2]}`
      const target = readFileSync(file, "utf8")
      for (const raw of m[1].split(",")) {
        const n = raw.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0].trim()
        if (!n) continue
        if (!new RegExp(`\\b${n}\\b`).test(target)) return `@/components/3p/${m[2]} → ${n}`
      }
    }
    for (const m of code.matchAll(/from\s+["']@\/components\/3p\/([^"']+)["']/g)) {
      const p = `components/3p/${m[1]}`
      if (!existsSync(`${p}.tsx`) && !existsSync(`${p}.ts`) && !existsSync(p))
        return `@/components/3p/${m[1]}`
    }
  }
  return null
}

const ok = []
for (const e of entries) {
  if (REMOVED.has(e.id)) continue
  const path = e.import.replace("@/", "")
  /* tailark 은 폴더를 그대로 가리키고(index.tsx), 나머지는 파일까지 가리킨다. */
  const folder = existsSync(path) && statSync(path).isDirectory()
    ? path
    : path.split("/").slice(0, -1).join("/")
  if (!existsSync(folder)) {
    broken.push(`${e.id} — 폴더 없음`)
    continue
  }
  const miss = resolves(folder)
  if (miss) broken.push(`${e.id} — ./${miss} 없음`)
  else ok.push(e)
}
entries.length = 0
entries.push(...ok)

entries.sort((a, b) => a.id.localeCompare(b.id))

/* ── 지도 ─────────────────────────────────────────────── */
const registry = `/* scripts/gen-3p.mjs 가 생성한다. 직접 고치지 말 것.
 * 서드파티 블록 ${entries.length}개를 id 로 찾을 수 있게 모아 둔 지도.
 * next/dynamic 으로 나눠 담아, 목록 라우트가 185개를 한 번에 끌고 오지 않게 한다. */
import dynamic from "next/dynamic"
import type { ComponentType } from "react"

export const THIRD_PARTY: Record<string, ComponentType> = {
${entries.map((e) => `  ${JSON.stringify(e.id)}: dynamic(() => import(${JSON.stringify(e.import)})),`).join("\n")}
}

export const THIRD_PARTY_IDS = Object.keys(THIRD_PARTY)
`
writeFileSync(join(ROOT, "_registry.ts"), registry, "utf8")

/* ── 동적 라우트 ──────────────────────────────────────── */
const routeDir = "app/blocks/3p/[id]"
mkdirSync(routeDir, { recursive: true })
writeFileSync(
  join(routeDir, "page.tsx"),
  `/* 서드파티 블록 한 장. 블록 목록이 이 라우트를 iframe 으로 축소해 띄운다.
 * 라우트를 185개 만들지 않고 지도에서 찾아 그린다. */
import { notFound } from "next/navigation"

import { THIRD_PARTY, THIRD_PARTY_IDS } from "@/components/3p/_registry"

export function generateStaticParams() {
  return THIRD_PARTY_IDS.map((id) => ({ id }))
}

export default async function ThirdPartyBlockPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const Block = THIRD_PARTY[id]
  if (!Block) notFound()
  return <Block />
}
`,
  "utf8"
)
writeFileSync(
  join(routeDir, "loading.tsx"),
  `import { FullScreenSkeleton } from "@/components/page-skeleton"

export default function Loading() {
  return <FullScreenSkeleton />
}
`,
  "utf8"
)

/* ── 카탈로그 ─────────────────────────────────────────── */
/* 185개를 하나씩 설명할 수는 없다. 종류마다 정의와 선택 조건을 쓰고,
 * 각 항목은 그 종류의 설명을 물려받되 어느 변형인지를 함께 적는다.
 * 없는 종류는 목록에 안 나오므로 빈 설명이 남지 않는다. */
const KIND = {
  "hero-section": ["첫 화면 최상단. 무엇을 하는 제품인지 한 문장과 다음 행동 하나.", "랜딩 페이지를 만들 때 가장 먼저 정하는 자리. 문장이 없으면 어떤 히어로를 골라도 안 읽힌다.", "The top of a landing page — one sentence on what this is, and one next action.", "The first thing to settle on a landing page. Without the sentence, no hero design saves it."],
  hero: ["첫 화면 최상단. 무엇을 하는 제품인지 한 문장과 다음 행동 하나.", "랜딩 페이지를 만들 때 가장 먼저 정하는 자리.", "The top of a landing page — one sentence and one next action.", "The first thing to settle on a landing page."],
  pricing: ["요금제를 나란히 놓고 고르게 하는 표.", "안이 3개를 넘으면 비교가 안 된다. 그 이상이면 비교표(comparator)로 바꾼다.", "Plans side by side.", "Past three tiers, comparison stops working — switch to a comparator."],
  comparator: ["기능별로 있고 없음을 표로 대조한다.", "요금제가 넷 이상이거나 항목이 많아 카드로는 안 될 때.", "A feature-by-feature table.", "When there are four or more plans, or too many rows for cards."],
  faqs: ["반복되는 질문을 접어 둔 목록.", "지원 문의가 같은 내용으로 계속 올 때. 답이 세 개 미만이면 굳이 접지 않는다.", "Recurring questions, folded away.", "When support keeps getting the same question. Under three answers, don't fold them."],
  faq: ["반복되는 질문을 접어 둔 목록.", "지원 문의가 같은 내용으로 계속 올 때.", "Recurring questions, folded away.", "When support keeps getting the same question."],
  features: ["제품이 무엇을 하는지 항목으로 나눠 보인다.", "히어로 바로 아래. 항목마다 '그래서 뭐가 좋은지' 가 없으면 나열에 그친다.", "What the product does, broken into items.", "Right under the hero. Without a 'so what' per item, it's just a list."],
  feature: ["제품이 무엇을 하는지 항목으로 나눠 보인다.", "히어로 바로 아래에 놓는다.", "What the product does, broken into items.", "Sits right under the hero."],
  "call-to-action": ["페이지 끝에서 다음 행동 하나로 몰아준다.", "스크롤을 끝까지 내린 사람에게 마지막으로 묻는 자리. 선택지를 둘 이상 두지 않는다.", "The closing push toward one action.", "The last ask for someone who scrolled all the way. Never more than one option."],
  cta: ["페이지 끝에서 다음 행동 하나로 몰아준다.", "선택지를 둘 이상 두지 않는다.", "The closing push toward one action.", "Never more than one option."],
  testimonials: ["쓴 사람의 말을 인용한다.", "제품 설명만으로 못 넘는 신뢰의 벽이 있을 때. 실명과 소속이 없으면 효과가 없다.", "Quotes from people who used it.", "For the trust gap your own copy can't cross. Without a real name and org, it does nothing."],
  testimonial: ["쓴 사람의 말을 인용한다.", "실명과 소속이 없으면 효과가 없다.", "Quotes from people who used it.", "Without a real name and org, it does nothing."],
  footer: ["페이지 맨 아래의 링크 묶음.", "법적 고지 · 연락처 · 부차 링크가 갈 곳. 여기 있는 것은 아무도 안 찾는다고 가정한다.", "The link block at the bottom.", "Legal, contact, secondary links. Assume nobody goes looking here."],
  navbar: ["최상단 전역 탐색.", "링크가 두세 개면 그냥 나열한다. 하위 메뉴가 필요할 만큼 커졌을 때 쓴다.", "Global navigation at the top.", "Two or three links? Just list them. This is for when submenus become necessary."],
  topbar: ["앱 상단 바.", "제품 안쪽 화면. 마케팅 페이지의 navbar 와 다르다.", "The bar at the top of an app.", "Inside the product — not the marketing navbar."],
  stats: ["숫자 서너 개로 규모를 보인다.", "실제 숫자가 있을 때만. 없는 숫자를 지어내면 그 페이지 전체의 신뢰가 무너진다.", "Three or four numbers showing scale.", "Only with real numbers. Invented ones cost you the whole page's credibility."],
  statistics: ["숫자 서너 개로 규모를 보인다.", "실제 숫자가 있을 때만 쓴다.", "Three or four numbers showing scale.", "Only with real numbers."],
  integrations: ["연동되는 서비스의 로고를 늘어놓는다.", "'이미 쓰는 도구와 붙는다' 가 구매 이유인 제품.", "Logos of what it connects to.", "For products where 'it fits your existing stack' is the reason to buy."],
  integration: ["연동되는 서비스의 로고를 늘어놓는다.", "'이미 쓰는 도구와 붙는다' 가 구매 이유일 때.", "Logos of what it connects to.", "When fitting the existing stack is the selling point."],
  "logo-cloud": ["고객사 로고를 한 줄로.", "쓸 수 있는 로고가 여섯 개 이상일 때. 세 개면 오히려 규모가 작아 보인다.", "Customer logos in a row.", "Six or more. With three, it makes you look smaller."],
  logos: ["고객사 · 기술 스택 로고 묶음.", "쓸 수 있는 로고가 충분할 때.", "A set of customer or stack logos.", "When you have enough of them."],
  content: ["글과 이미지가 섞인 설명 구획.", "히어로에서 다 못한 이야기를 이어갈 때.", "A prose-and-image section.", "For continuing what the hero couldn't finish."],
  team: ["만드는 사람들을 보인다.", "사람이 곧 신뢰인 업종 — 에이전시, 컨설팅, 의료.", "The people behind it.", "Where people are the trust — agencies, consulting, care."],
  contact: ["연락 폼 또는 연락처.", "제품이 아직 셀프서비스가 아닐 때. 응답 시간을 함께 적는다.", "A contact form or details.", "When the product isn't self-serve yet. State the response time."],
  login: ["로그인 화면.", "공식 블록에도 5종이 있다. 이쪽은 마케팅 페이지와 톤을 맞추고 싶을 때.", "A sign-in screen.", "The official set has five. Use these when the tone must match the marketing site."],
  "sign-up": ["가입 화면.", "위와 같다 — 톤을 맞출 때.", "A sign-up screen.", "Same as above — when tone matters."],
  "forgot-password": ["비밀번호 재설정 진입.", "로그인 화면과 짝을 이룬다. 메일이 늦게 올 때의 안내가 필요하다.", "Password reset entry.", "Pairs with sign-in. Needs copy for when the mail is slow."],
  blog: ["글 목록.", "썸네일 · 제목 · 날짜 · 요약. 요약이 없으면 제목만으로 고르게 된다.", "A list of posts.", "Thumbnail, title, date, excerpt. Without the excerpt, only the title does the work."],
  "bento-grid": ["크기가 다른 칸을 격자로 엮어 한눈에 훑게 한다.", "항목의 중요도가 다를 때. 전부 같은 크기면 그냥 격자를 쓴다.", "A grid of unequal cells scanned at once.", "When items differ in weight. If they're equal, use a plain grid."],
  timeline: ["시간 순서를 세로로 늘어놓는다.", "연혁 · 진행 단계 · 변경 이력.", "Events laid out in time order.", "History, stages, changelogs."],
  gallery: ["이미지 모음.", "작업물이 곧 설득 재료인 경우 — 포트폴리오, 제품 사진.", "A set of images.", "When the work itself is the argument — portfolios, product shots."],
  "about-us-section": ["회사나 팀을 설명하는 구획.", "제품이 아니라 만드는 쪽을 물어보는 방문자가 있을 때.", "A section about the company.", "For visitors asking who's behind it, not what it does."],
  services: ["제공하는 일을 항목으로 나눈다.", "제품이 아니라 용역을 파는 경우.", "What you do, itemized.", "When you sell service rather than product."],
  "empty-state": ["보여줄 것이 없을 때의 화면.", "우리 패턴 탭에도 5종이 있다. 마케팅 톤이 필요할 때만 이쪽.", "The screen with nothing to show.", "Our patterns tab has five. Use these only when a marketing tone is needed."],
  newsletter: ["메일 구독 받기.", "지금 살 준비는 안 됐지만 관심 있는 사람을 잡을 때.", "Email capture.", "For people interested but not ready to buy."],
  "product-listing": ["상품 목록.", "커머스. 가격 · 이미지 · 담기까지가 한 카드다.", "A product list.", "Commerce. Image, price and add-to-cart are one card."],
  "kanban-application": ["칸반 보드.", "상태가 단계로 흐르는 일 — 이슈, 채용, 주문.", "A kanban board.", "Work that flows through stages — issues, hiring, orders."],
  items: ["아이콘과 설명이 붙은 항목 나열.", "기능 요약, 원칙 나열 같은 짧은 목록.", "Items with an icon and a line.", "Short lists — feature summaries, principles."],
}

const catalog = `/* 서드파티 블록 카탈로그 — scripts/gen-3p.mjs 가 생성한다. 직접 고치지 말 것.
 *
 * 공식 shadcn 이 다루지 않는 자리를 채운다 — 랜딩 · 마케팅 · 커머스 구획.
 * 종류마다 정의와 선택 조건을 쓰고, 각 항목이 그것을 물려받는다.
 * 전부 MIT 이며 출처는 항목마다 적혀 있다. */
import type { Copy } from "@/components/lang"

export type ThirdPartyBlock = {
  id: string
  source: "tailark" | "launch" | "space"
  kind: string
  variant: string
  what: Copy
  when: Copy
}

export const SOURCES: Record<string, { label: string; url: string; license: string }> = {
  tailark: { label: "Tailark", url: "https://github.com/tailark/blocks", license: "MIT" },
  launch: { label: "Launch UI", url: "https://github.com/launch-ui/launch-ui", license: "MIT" },
  space: { label: "Shadcn Space", url: "https://github.com/shadcnspace/shadcnspace", license: "MIT" },
}

export const THIRD_PARTY_BLOCKS: ThirdPartyBlock[] = [
${entries
  .map((e) => {
    const k = KIND[e.kind]
    if (!k) return null
    return `  {
    id: ${JSON.stringify(e.id)},
    source: ${JSON.stringify(e.source)},
    kind: ${JSON.stringify(e.kind)},
    variant: ${JSON.stringify(e.variant)},
    what: { ko: ${JSON.stringify(k[0])}, en: ${JSON.stringify(k[2])} },
    when: { ko: ${JSON.stringify(k[1])}, en: ${JSON.stringify(k[3])} },
  },`
  })
  .filter(Boolean)
  .join("\n")}
]

export const THIRD_PARTY_KINDS = [...new Set(THIRD_PARTY_BLOCKS.map((b) => b.kind))].sort()
`
writeFileSync("lib/third-party-catalog.ts", catalog, "utf8")

const kept = entries.filter((e) => KIND[e.kind])
const dropped = entries.filter((e) => !KIND[e.kind])
if (broken.length) {
  console.log(`부품이 빠져 목록에서 뺀 블록 ${broken.length}개:`)
  for (const b of broken) console.log(`  - ${b}`)
}
console.log(`서드파티 블록 ${entries.length}개 → 라우트 생성`)
console.log(`카탈로그 등재 ${kept.length}개 (설명 있는 종류만)`)
if (dropped.length)
  console.log(
    `설명 없어 목록에서 뺀 종류: ${[...new Set(dropped.map((d) => d.kind))].join(", ")}`
  )
