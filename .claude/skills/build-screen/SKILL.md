---
name: build-screen
description: 이 디자인 시스템으로 새 화면을 만들거나 기존 화면을 고칠 때 쓴다. 이미 있는 컴포넌트·패턴·블록·토큰만으로 조립하도록 강제하고, 다 만든 뒤 검사까지 돌린다. 사용자가 "화면 만들어줘", "페이지 하나 짜줘", "이 서비스 UI 만들어봐" 같은 요청을 하면 반드시 이걸 먼저 부른다.
---

# 화면 만들기

이 레포에서 화면을 만드는 유일한 방법. **새로 짜지 않고 조립한다.**

## 왜 이게 필요한가

이 규칙 없이 만든 첫 화면(`/reel` 초판)은 겉으로는 컴포넌트를 쓴다고 하면서
입력 상자·예시 카드·말풍선·결과 카드를 전부 `div` 로 다시 짰다. 이미
`InputGroup`, `Item`, `Bubble`, `Card` 가 있는데도.

이유는 게으름이 아니라 **목록이 없었기 때문**이다. 62개 컴포넌트가 렌더된
웹사이트로만 존재하면, 에이전트에게는 "없는 것"과 같다. 그래서 언제나
새로 짜는 쪽이 싸다. 이 스킬은 그 경로를 막는다.

## 순서

### 1 · 색인 읽기 — 건너뛰지 않는다

```bash
node scripts/gen-registry.mjs
```

그다음 `design-system.json` 에서 필요한 것을 찾는다. 파일을 열지 말고 여기서 찾는다.

```bash
# 무슨 컴포넌트가 있나
node -e 'const r=require("./design-system.json");console.log(r.components.map(c=>c.id).join(" "))'

# 특정 컴포넌트의 API
node -e 'const r=require("./design-system.json");const c=r.components.find(x=>x.id=="input-group");console.log(c.exports.join(", "), JSON.stringify(c.variants))'

# 어떤 패턴이 있나 (군별)
node -e 'const r=require("./design-system.json");const g={};r.patterns.forEach(p=>(g[p.group]??=[]).push(p.id));console.log(g)'

# 쓸 수 있는 토큰
node -e 'const r=require("./design-system.json");console.log(Object.keys(r.tokens.control).join(" "))'
```

### 2 · PRD 를 먼저 쓴다

사용자가 "PRD 먼저" 라고 하지 않아도 쓴다. `docs/prd-<이름>.md`.
최소 항목: 무엇을 푸는가 · 누구를 위해(대상 아닌 사람 포함) · 원칙 3~5개 ·
범위(들어가는 것/나가는 것) · 화면 구조 · 상태 표 · 성공 기준.

숫자를 지어내지 않는다. 사용자가 준 적 없는 지표는 쓰지 않는다.

### 3 · 위층부터 고른다

블록(화면 한 벌) → 패턴(구획) → 컴포넌트(단위). 이 순서를 뒤집으면
반드시 패턴을 다시 짜게 된다.

화면의 각 구획마다 "이건 어느 층에서 오나" 를 먼저 정하고 시작한다.
정하기 전에 JSX 를 쓰지 않는다.

### 4 · 토큰만 쓴다

- 색 `bg-primary` `text-muted-foreground` — `#hex` 금지
- 간격 `p-4` `gap-2` `p-(--pad-card)`
- 컨트롤 `--h-button` `--pad-button` `--h-input` `--pad-input` `--h-tab` `--pad-tab` `--gap-text`
  (xs·sm·lg 는 기준에서 자동 파생 — 손으로 `h-9` 적지 않는다)
- 화면 하나에만 다른 값을 입히려면 전역을 고치지 말고 루트에 인라인으로 얹는다.
  `lib/theme-test-padding-2.ts` 참고.

⚠️ `--spacing-base` 말고 `--spacing` 을 덮는다. 기준값은 `:root` 에서 한 번 계산돼
자식에게 계산된 값으로 내려온다 — 하위에서 `-base` 를 바꾸면 아무 일도 안 난다.

### 5 · 검사한다

```bash
node scripts/check-screen.mjs app/<이름>/page.tsx
npx tsc --noEmit
```

검사기가 걸면 고친다. 못 고칠 이유가 있으면 **그 이유를 코드 옆 주석에 적는다.**
목표: 걸리는 것 0건, 조립 비율 70% 이상.

### 6 · 브라우저로 확인한다

`preview_start` → 화면을 실제로 눌러 보고 스크린샷을 남긴다.
"될 겁니다" 로 끝내지 않는다.

## 없는 것을 만들어야 할 때

**먼저 보고한다.** "시스템에 X 가 없어서 새로 만들어야 합니다 — 이유는 …"
승인 없이 `components/ui` 에 새 파일을 만들지 않는다.

만들기로 했다면: `components/ui` 에 넣고, 8상태(기본·호버·포커스·누름·비활성·
로딩·오류·성공)를 갖추고, `scripts/gen-components.mjs` 의 `DOC` 에 정의를 적고,
`gen-registry.mjs` 를 다시 돌린다.

## 손대지 않는 것

생성물과 벤더 코드 — `app/components/page.tsx`, `app/patterns/page.tsx`,
`components/3p`, `components/blocks`, `components/examples`.
고쳐야 하면 그것을 만드는 스크립트를 고친다.
