# 이 레포에서 화면을 만드는 법

이 문서는 사람보다 **에이전트**를 위해 쓰였다. AGENTS.md 가 여기를 가리킨다.

## 한 줄 규칙

> **새 화면은 만들지 않는다. 이미 있는 것으로 조립한다.**

이 레포에는 컴포넌트 62개, 패턴 74개, 블록 88개, 토큰 58개가 이미 있다.
새로 짠 `<div className="border rounded-xl p-4">` 는 거의 전부 이미 있는 것의
열등한 사본이다.

## 순서

### 0. 색인을 먼저 읽는다

```bash
node scripts/gen-registry.mjs   # design-system.json 을 최신으로
```

`design-system.json` 하나에 전부 들어 있다 — 컴포넌트 id, import 경로,
export 이름, 쓸 수 있는 `variant`/`size`, 정의(무엇/언제), 예제 파일 경로.
**파일을 열어 보기 전에 이걸 먼저 읽는다.** 없는 걸 만드는 실수는 대부분
"뭐가 있는지 몰라서" 생긴다.

```bash
node -e 'const r=require("./design-system.json");
  console.log(r.components.find(c=>c.id==="input-group").exports.join(", "))'
```

### 1. 패턴 → 블록 → 컴포넌트 순으로 찾는다

| 층 | 무엇 | 언제 |
| --- | --- | --- |
| 블록 (88) | 화면 한 벌 | 만들려는 게 로그인·가격표·대시보드처럼 흔한 화면일 때. 통째로 가져와 고친다 |
| 패턴 (74) | 한 가지 쓰임을 푼 조립품 | 빈 상태, 로딩, 지표 카드, 목록 도구줄… 화면의 한 구획이 필요할 때 |
| 컴포넌트 (62) | 가장 작은 단위 | 위 둘로 안 될 때만 |

위에서부터 내려온다. 컴포넌트부터 시작하면 언제나 패턴을 다시 짜게 된다.

### 2. 토큰만 쓴다

- 색: `bg-primary`, `text-muted-foreground` — `#hex` 금지
- 간격: `--spacing` 배수 — `p-4`, `gap-2`, `p-(--pad-card)`
- 컨트롤 크기: `--h-button` · `--pad-button` · `--h-input` · `--pad-input` ·
  `--h-tab` · `--pad-tab` · `--gap-text`.
  xs·sm·lg 는 각 기준에서 자동으로 파생된다. 손으로 `h-9` 를 적지 않는다.
- **한 화면에만 다른 값을 쓰고 싶으면** 전역을 고치지 말고,
  그 화면의 루트에 인라인 스타일로 얹는다. `lib/theme-test-padding-2.ts` 가 예다.

⚠️ `--spacing-base` 가 아니라 `--spacing` 을 덮는다. 기준값은 `:root` 에서 한 번
계산돼 자식에게 *계산된 값* 으로 내려오므로, 하위에서 `-base` 를 바꾸면 아무 일도
안 일어난다. (두 번 밟았다.)

### 3. 다 만들면 검사한다

```bash
node scripts/check-screen.mjs app/<이름>/page.tsx
```

세 가지를 본다 — 토큰을 건너뛴 리터럴, 이미 있는 걸 손으로 다시 짠 흔적,
조립 비율. **걸리는 게 있으면 고친다.** 못 고칠 이유가 있으면 그 이유를 코드
옆 주석에 적는다. 이유 없이 남겨 두지 않는다.

목표는 조립 비율 70% 이상, 걸리는 것 0건.

### 4. 없는 걸 만들어야 한다면

먼저 **보고한다.** "이건 시스템에 없어서 새로 만들어야 하는데, 이런 이유입니다."
승인 없이 `components/ui` 에 새 파일을 만들지 않는다. 시스템에 없는 것이
화면마다 하나씩 생기면 그게 곧 시스템이 없는 상태다.

새로 만들기로 했다면 `components/ui` 에 넣고, 8가지 상태(기본·호버·포커스·
누름·비활성·로딩·오류·성공)를 다 갖추고, `scripts/gen-components.mjs` 의 `DOC`
에 정의를 적는다. 그래야 다음 사람이 찾을 수 있다.

## 하지 말 것

- `components/3p`, `components/blocks`, `components/examples` 를 직접 고치기
  — 벤더 코드다. `scripts/seal-3p.mjs` 가 `@ts-nocheck` 을 붙여 둔 이유가 그것.
- `app/components/page.tsx`, `app/patterns/page.tsx` 직접 고치기
  — 생성물이다. `scripts/gen-components.mjs` / `gen-patterns.mjs` 를 고친다.
- 화면 하나 때문에 `app/globals.css` 의 `:root` 값 바꾸기
- 새 폰트·새 색·새 그림자 도입

## 생성 스크립트

| 명령 | 하는 일 |
| --- | --- |
| `node scripts/gen-registry.mjs` | `design-system.json` — 에이전트가 읽는 색인 |
| `node scripts/gen-components.mjs` | `/components` 페이지 |
| `node scripts/gen-patterns.mjs` | `/patterns` 페이지 |
| `node scripts/gen-3p.mjs` | 서드파티 블록 페이지 |
| `node scripts/check-screen.mjs` | 화면 검사 |
| `node scripts/shoot-blocks.mjs` | 블록 썸네일 |
