<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:design-system-rules -->

# 이 레포에서 화면을 만드는 규칙

**새 화면은 만들지 않는다. 이미 있는 것으로 조립한다.**

1. `design-system.json` 을 먼저 읽는다. 컴포넌트 62 · 패턴 74 · 블록 88 · 토큰 58 이
   전부 여기 색인돼 있다 (id · import 경로 · export 이름 · variant/size · 정의).
   최신이 아니면 `node scripts/gen-registry.mjs`.
2. 블록 → 패턴 → 컴포넌트 순으로 찾는다. 컴포넌트부터 시작하면 패턴을 다시 짜게 된다.
3. 색·간격·크기는 토큰으로만 부른다. `#hex`, 임의 `px`, 손으로 적은 `h-9` 금지.
4. 다 만들면 `node scripts/check-screen.mjs app/<이름>/page.tsx` 를 돌리고,
   걸리는 것을 0건으로 만든다.
5. 시스템에 없는 것을 새로 만들어야 하면 **먼저 보고한다.** 만들기로 했다면
   `components/ui/` 가 아니라 `components/_draft/` 에 만든다.

토큰은 두 층이다 — `data/foundation.json`(전역)과 `data/components.json`(레시피).
컴포넌트 값은 파운데이션을 **참조만** 한다(`spacing.9`, `radius.md`). 리터럴 금지.
둘 중 하나를 고치면 `npm run gen` 이 globals.css · 색인 · 생성 페이지를 전부 따라오게 한다.
지금 편집 가능한 것은 button · input · card 셋이고, 여는 속성은
height · paddingX · radius · fontSize · gap 다섯뿐이다.

자세한 것은 [docs/agentic-rules.md](docs/agentic-rules.md).

생성물은 직접 고치지 않는다 — `app/components/page.tsx`, `app/patterns/page.tsx`,
`components/3p`, `components/blocks`, `components/examples`.

<!-- END:design-system-rules -->
