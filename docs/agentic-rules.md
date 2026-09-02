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

### 2. 토큰만 쓴다 — 두 층이다

- `data/foundation.json` — 전역. **값이 리터럴로 적히는 유일한 자리**
- `data/components.json` — 컴포넌트 레시피. 파운데이션을 **참조만** 한다

컴포넌트 값에 px 를 적지 않는다. `"height": "spacing.9"` 처럼 이름을 가리켜야
밀도 기준을 바꿨을 때 함께 움직인다. 고친 뒤에는 `npm run gen`.

편집 화면은 `/components/<id>` 다 — 62개 전부. 여는 속성은
height · paddingX · radius · fontSize · gap 과 면 색 넷(surface ·
surfaceForeground · activeSurface · activeSurfaceForeground)이다.

레시피에 슬롯을 더했으면 그 이름을 컴포넌트 코드가 읽게 잇는다
(`node scripts/wire-tokens.mjs`). `npm run audit` 이 «편집 패널의 어느 줄이
화면을 안 바꾸는가» 를 세므로, 이 값이 0 이 아니면 편집기가 거짓을 말하는 중이다.
바꾼 결과는 `/preview` 세 화면(목록 · 폼 · 대시보드)에서 판정한다.


- 색: `bg-primary`, `text-muted-foreground` — `#hex` 금지
- 간격: `--spacing` 배수 — `p-4`, `gap-2`, `p-(--pad-card)`
- 컨트롤 크기: `--h-button` · `--pad-button` · `--h-input` · `--pad-input` ·
  `--h-tab` · `--pad-tab` · `--gap-text`.
  xs·sm·lg 는 각 기준에서 자동으로 파생된다. 손으로 `h-9` 를 적지 않는다.
- **한 화면에만 다른 값을 쓰고 싶으면** 전역을 고치지 말고,
  그 화면의 루트에 인라인 스타일로 얹는다. 전역 `:root` 는 건드리지 않는다.

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

먼저 **보고한다.** 만들기로 했다면 `components/ui/` 가 아니라
`components/_draft/` 에 만든다 — 규칙은 그 폴더의 README 에 있다.
검사기가 `components/ui` 의 색인 밖 파일을 잡는다.
 "이건 시스템에 없어서 새로 만들어야 하는데, 이런 이유입니다."
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
| `node scripts/gen-tokens.mjs` | `data/*.json` → `globals.css` 의 생성 구획 |
| `node scripts/gen-registry.mjs` | `design-system.json` — 에이전트가 읽는 색인 |
| `node scripts/gen-components.mjs` | `/components` 페이지 |
| `node scripts/gen-patterns.mjs` | `/patterns` 페이지 |
| `node scripts/gen-3p.mjs` | 서드파티 블록 페이지 |
| `node scripts/check-screen.mjs` | 화면 검사 |
| `node scripts/shoot-blocks.mjs` | 블록 썸네일 |

## Figma 로 내보내기

컴포넌트를 Figma 로 옮길 때 **눈으로 옮기지 않는다.** 1px 어긋난 것은
스크린샷으로 안 보이는데, 그 1px 부터 Figma 와 코드가 갈라진다.

```bash
npm run share          # 정적 빌드
node scripts/serve...  # out/ 을 띄운다
npm run figma:spec     # 헤드리스 크롬이 실제 렌더를 재서 data/figma-spec.json
```

측정 대상은 `components/export-harness.tsx` 가 정한다 — 진짜 컴포넌트를 렌더해
두고 브라우저가 계산한 값을 읽는다. 그래서 카탈로그가 바뀌면 스펙도 바뀐다.

`data/figma-spec.json` 이 담는 것:

- `colors.light` / `colors.dark` — 파운데이션 색 32개의 **실제 sRGB 픽셀**
  (oklch 를 손으로 변환하면 반올림 한 번에 어긋난다)
- `modes.light` / `modes.dark` — 변형마다 크기·여백·모서리·간격·글자·색

Figma 쪽은 이 값으로 짓고, 지은 뒤 되읽어 대조한다.

```bash
npm run figma:verify -- scripts/.cache/_figma-readback.json button
```

«만들었다» 와 «맞게 만들었다» 는 다른 말이다. 대조를 안 하면 어긋난 채로
쌓이고, 나중에 어느 쪽이 맞는지 아무도 모르게 된다.
