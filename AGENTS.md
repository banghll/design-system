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
편집은 62개 전부 열려 있다. 다만 «열려 있다» 는 말이 «화면이 바뀐다» 는 뜻이어야
하므로, 레시피에 슬롯을 더했으면 그 이름을 컴포넌트 코드가 실제로 읽게 잇는다
(`node scripts/wire-tokens.mjs` 의 표). 이었는지는 `npm run audit` 이 센다 —
읽지 않는 이름이 하나라도 있으면 그 줄은 편집기에서 아무 일도 하지 않는 손잡이다.

여는 속성은 height · paddingX · radius · fontSize · gap 과 면 색 넷
(surface · surfaceForeground · activeSurface · activeSurfaceForeground)이다.
자기 면도 모서리도 없는 컴포넌트(collapsible · aspect-ratio · spinner · direction)는
슬롯을 두지 않는다 — 없는 손잡이를 그려 두는 것은 안 되는 손잡이보다 나쁘다.

파운데이션은 화면에서 더하고 지울 수 있다(색 · 글자 크기). 고치면
`data/foundation.json` 이 바뀌고 globals.css 가 다시 생성되며, 그 이름을 가리키던
자리들은 «정리안» 으로 올라온다.

자세한 것은 [docs/agentic-rules.md](docs/agentic-rules.md).

생성물은 직접 고치지 않는다 — `app/components/page.tsx`, `app/patterns/page.tsx`,
`components/3p`, `components/blocks`, `components/examples`.

<!-- END:design-system-rules -->
