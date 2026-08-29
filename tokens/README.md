# tokens

디자인 토큰의 **단일 진실 공급원(source of truth)**.

| 카테고리 | 토큰 | CSS | 개수 |
|---|---|---|---|
| Typography | `typography.tokens.json` | `typography.css` | 48 |
| Spacing | `spacing.tokens.json` | `spacing.css` | 27 |
| Breakpoint | `breakpoint.tokens.json` | `breakpoint.css` | 3 |
| Radius | `radius.tokens.json` | `radius.css` | 8 |
| Icon | `icon.tokens.json` | `icon.css` | 7 |
| Z-index | `z-index.tokens.json` | `z-index.css` | 8 |
| Motion | `motion.tokens.json` | `motion.css` | 27 |
| Color (Primitive+Semantic) | `color.tokens.json` | `color.css` | 255 |
| Layout | `layout.tokens.json` | `layout.css` | 6 |
| Component height | `component-height.tokens.json` | `component-height.css` | 3 |
| Elevation (Effect Style, Variable 아님) | — | `elevation.css` | 5 |
| — | — | `component.css` (컴포넌트 전용, Figma 컬렉션 아님) | — |
| — | — | `index.css` (전체 import) | — |

**`*.tokens.json` 만 수정한다.** `*.css` · `dist/` · `../platforms/` 는 `npm run build` 가 만드는
생성물이고, CI 가 커밋된 생성물과 빌드 결과가 같은지 확인한다 ([5장](#5-빌드)).
단 `color.css` · `elevation.css` · `component.css` 는 예외로, 빌드가 만들지 않고 손으로 고친다.

Web 이 아닌 플랫폼(iOS·Android)이 쓰는 산출물은 [`../platforms/`](../platforms/README.md) 에 있다.
같은 토큰에서 생성되며, 무엇이 빠지는지와 왜 저장소를 나누지 않았는지도 거기 적혀 있다.

원본: Figma **🎬 SLATE** 파일의 변수 컬렉션. 이름이 양쪽에서 일치하도록 동기화되어 있다 ([4장](#4-figma-연동)).
Icon 만은 변수 컬렉션이 아니라 `Icon` 페이지의 가이드 프레임이 원본이다 ([3.6](#36-icon)).

---

## 1. 포맷

[W3C Design Tokens Community Group(DTCG)](https://tr.designtokens.org/format/) 표준을 따른다.
Style Dictionary v5, Tokens Studio, Figma Variables 가 공통으로 읽는 포맷이다.

```jsonc
"font-size": {
  "$type": "dimension",
  "base": { "$value": { "value": 16, "unit": "px" } }
},
"typography": {
  "$type": "typography",
  "body-base": {
    "$value": {
      "fontFamily":  "{font-family.sans}",   // 별칭 참조
      "fontSize":    "{font-size.base}",
      "lineHeight":  "{line-height.md}",
      "fontWeight":  "{font-weight.medium}",
      "letterSpacing": { "value": 0, "unit": "px" }
    }
  }
}
```

- `$type` 은 그룹 레벨에 선언해 하위 토큰이 상속한다.
- **Semantic 토큰은 값을 직접 갖지 않고 항상 Primitive 를 별칭으로 참조**한다
  (`typography/*` → `font-size/*`, `motion/*` → `duration/*`·`ease/*`).
- Figma 역동기화를 위해 원본 변수 ID(`com.figma.variableId`)와 변수 경로
  (`com.nation-a.figmaVariable`)를 `$extensions` 에 보존했다.
  변수가 아니라 디자인 프레임이 원본인 토큰(Icon)은 노드 ID(`com.nation-a.figmaNode`)를 대신 건다.

### 단위 정책

| 대상 | JSON | CSS | 이유 |
|---|---|---|---|
| font-size, line-height | px | **rem** | 브라우저 글자 크기 설정을 따라야 한다. 단 `line-height/relaxed` 는 무단위 배수(`1.65`)라 변환 없이 그대로 나간다 |
| radius | px | **px** | 글자 크기와 무관한 물리적 모서리 크기 |
| icon | px | **px** | 글리프가 그려진 픽셀 그리드에 맞춘 물리적 크기 |
| gap, padding | px | **px** | 디자인이 px 로 확정한 레이아웃 치수 |
| breakpoint | px | **px** | 뷰포트 폭 경계선. 글자 크기와 무관해야 한다 |
| duration | ms | ms | — |
| z-index | 무단위 | 무단위 | — |

## 2. 사용

### 설치

```bash
npm i github:Nation-A/slate-design-system      # 레지스트리 배포 전까지는 git 설치
```

| 진입점 | 내용 | 용도 |
|---|---|---|
| `@nation-a/design-tokens/css` | `tokens/index.css` (전체) | 웹. 카테고리별 진입점도 전부 있다 — `/css/typography` `/css/spacing` `/css/breakpoint` `/css/radius` `/css/icon` `/css/z-index` `/css/motion` `/css/layout` `/css/color` `/css/elevation` `/css/component` |
| `@nation-a/design-tokens` | `dist/tokens.js` + `.d.ts` | CSS 를 못 쓰는 곳 — React Native, 스크립트, Figma 플러그인 |
| `@nation-a/design-tokens/json` | `dist/tokens.json` | 빌드 도구·플러그인 |
| `@nation-a/design-tokens/dtcg/radius` | `tokens/radius.tokens.json` | DTCG 원본. Style Dictionary·Tokens Studio 가 그대로 읽는다 |

`dist/` 는 CSS 와 달리 **rem 변환 없이 원본 단위(px/ms)를 유지**한다. Figma 원본 값과 1:1 로 맞추기 위해서다.

```js
import tokens from '@nation-a/design-tokens';
tokens['font-size'].base;      // "16px"   (CSS 는 1rem)
tokens.motion.enter.duration;  // "200ms"
tokens.ease.out;               // [0, 0, 0.2, 1]
```

### CSS

```html
<link rel="stylesheet" href="tokens/index.css">
```

```css
.card {
  border-radius: var(--radius-lg);
  transition: opacity var(--motion-enter-duration) var(--motion-enter-easing);
}
.card__menu { z-index: var(--z-dropdown); }
```

```html
<h1 class="text-display-3xl">페이지 제목</h1>
<p  class="text-body-base">본문</p>
```

- **컴포넌트는 Semantic 층만 참조한다.** `--motion-enter-duration` (○) / `--duration-base` (✗).
- 텍스트는 `.text-*` 클래스를 쓴다. 크기·행간을 낱개로 조합하면 디자인에 없는 페어가 생긴다.
- **임의의 숫자를 쓰지 않는다.** `z-index: 999`, `border-radius: 10px`, `transition: 0.2s` 전부 금지.

## 3. 카테고리별

### 3.1 Typography

| 클래스 | px | 기본 weight | 대체 weight/style | 용도 |
|---|---|---|---|---|
| `.text-display-6xl` | 72/72 | ExtraBold | Bold | 히어로 헤드라인. 페이지당 1회 |
| `.text-display-4xl` | 48/56 | ExtraBold | Bold | 대시보드 KPI 수치, 리포트 커버 |
| `.text-display-3xl` | 40/48 | ExtraBold | Bold | ★ 페이지 제목 기본값 |
| `.text-title-2xl` | 32/40 | ExtraBold | Bold | 섹션 제목(EB) / 카드 블록 제목(B) |
| `.text-title-xl` | 28/32 | ExtraBold | Bold | 그룹 서브 제목 |
| `.text-title-lg` | 24/32 | Bold | ExtraBold | ★ 블록 제목 기본값 |
| `.text-heading-md` | 20/28 | Bold | SemiBold | 모달·시트 제목(B) / 중첩 서브 타이틀(SB) |
| `.text-body-base` | 16/24 | Medium | SemiBold, Bold | ★ 본문 기본값. 컨트롤 라벨은 SB |
| `.text-body-sm` | 14/20 | Medium | SemiBold, Bold | 표 데이터, 툴팁, 폼 도움말 |
| `.text-body-sm-relaxed` | 14/165% | Medium | SemiBold, Bold | 3줄 이상 이어지는 문서 본문 |
| `.text-caption-xs` | 12/16 | Medium | SemiBold, Bold | ★ 보조 텍스트 기본값 |
| `.text-caption-xs-relaxed` | 12/165% | Medium | SemiBold, Bold | 3줄 이상 이어지는 보조 텍스트 |
| `.text-caption-2xs` | 11/14 | Medium | SemiBold, Bold | 유효성 메시지, 차트 축 라벨 |
| `.text-caption-3xs` | 10/14 | Medium | — | 시스템 최소 크기. 푸터 법적 표기 |
| `.text-title-2xl-latin` | 32/40 | Bold | — | 영문 전용 (Instrument Sans) |
| `.text-heading-md-latin` | 20/28 | Bold | *italic* (weight 아님) | 영문 전용 (Instrument Sans) |
| `.text-caption-xs-latin` | 12/16 | Bold | — | 영문 전용 (Instrument Sans) |

대체 웨이트는 `font-weight` 만 덮어쓴다:

```html
<h2 class="text-title-2xl" style="font-weight: var(--font-weight-bold)">카드 블록 제목</h2>
```

`-latin` 스타일은 **Instrument Sans 에 한글 글리프가 없으므로 라틴 텍스트에만** 쓴다.

`.text-heading-md-latin` 의 *italic* 만은 weight 가 아니라 style 이다. `font-style/normal` · `italic`
2개는 JSON 에만 있고 CSS 로도(`cssExclude`) 네이티브로도(`nativeExclude`) 내보내지 않으므로
`--font-style-italic` 같은 변수는 없다 — `font-style: italic` 을 그대로 쓴다.
맨 위 표의 Typography 48개에는 포함된다. 배경은 [4.3](#43-figma-에-반영하지-않은-차이-의도된-것).

> **`$description` 은 전부 Figma 변수 설명에서 가져온다.** Figma 에 설명이 없는 토큰은
> 설명 없이 둔다 — 저장소에서 지어내지 않는다. 설명을 추가·수정하려면 Figma 에서 하고 다시 내보낸다.
> 현재 설명이 있는 토큰: Typography 48개, Z-index 8개, Motion semantic 18개, Icon 7개, Spacing 27개, Color 11개,
> Breakpoint 3개, Layout 6개.
> 설명이 없는 토큰: Radius 8개, `duration/*` 5개, `ease/*` 4개, Color 244개(→ [3.2](#32-color)).

### 3.2 Color

**Primitive** (192) — Wanted Montage Design System 팔레트를 값 그대로 이식.
0~100 스케일(작을수록 어두움), 10 단위 기본 + 보정 스텝(예: `blue-65`, `orange-39`, `red-orange-48`) 혼재. 14개 색상군:

| 그룹 | 스텝 수 | 비고 |
|---|---|---|
| `common` (white/black) | 2 | 스케일 밖 고정값 |
| `neutral` | 16 | — |
| `cool-neutral` | 23 | Label/Background/Line 등 대부분의 중립 Semantic이 참조하는 기본 회색 |
| `blue` | 16 | 브랜드 Primary |
| `red` 13 · `green` 13 · `orange` 14 | 40 | Status(Negative/Positive/Cautionary) |
| `red-orange` 14 · `lime` 14 · `cyan` 13 · `light-blue` 13 · `violet` 14 · `purple` 13 · `pink` 14 | 95 | Accent(데이터 시각화·태그 확장 컬러) |

컴포넌트는 Primitive를 직접 참조하지 않는다 — 항상 Semantic을 거친다.

**Semantic** (54) — Montage "Semantic Color" 컬렉션의 **Dark 모드 값만** 이식했다. Figma는 Light 모드도 갖고 있지만
제품이 다크 전용이라 코드에는 반영하지 않는다(`.dark` 분기 없음, `:root`가 곧 다크 값).

| 역할군 | 개수 | 예 |
|---|---|---|
| Label(텍스트) | 6 | `--color-foreground`, `--color-foreground-strong`, `--color-muted-foreground` |
| Primary | 3 | `--color-primary`, `--color-primary-hover`, `--color-primary-active` |
| Background / Elevated | 6 | `--color-background`, `--color-card`, `--color-card-alt` |
| Interaction | 2 | `--color-interaction-inactive`, `--color-interaction-disabled` |
| Line / Border | 7 | `--color-border`, `--color-border-strong`, `--color-line` |
| Status | 3 | `--color-success`, `--color-warning`, `--color-destructive` |
| Accent(11색 확장) | 18 | `--color-accent-{hue}`, `--color-accent-{hue}-bg` |
| Inverse / Static / Fill / Material | 9 | `--color-inverse-*`(3), `--color-static-*`(2), `--color-fill*`(3), `--color-scrim`(1) |

전체 목록과 정확한 alias 는 `color.tokens.json`과 Figma "Primitive Color"/"Semantic Color" 컬렉션 참고.
`$description`(Purpose / Usage / Do not use)은 **primitive 색상군 13개에 그룹 단위로만** 붙어 있다
(leaf 는 `primitive.white`/`black` 2개뿐). Semantic 54개에는 Figma 쪽에 설명이 없어 저장소에도 없다.

> **컴포넌트가 필요로 하지만 Montage Semantic Color에 없는 역할**(on-primary, secondary, focus ring 등)은
> 새 색을 만들지 않고 기존 Semantic 토큰을 재해석해 `component.css`에서만 재사용한다 — 각 줄 주석 참고.
> Color Foundation(`color.tokens.json`)에는 추가하지 않는다 — Figma에서 리뷰되지 않은 값을 코드에만
> 몰래 넣지 않기 위함.

### 3.3 Radius

| 토큰 | 값 | 비고 |
|---|---|---|
| `--radius-none` | 0 | |
| `--radius-xs` | 4px | |
| `--radius-sm` | 8px | |
| `--radius-md` | 10px | ★ Button · Input · Callout · Toast |
| `--radius-lg` | 12px | ★ Card |
| `--radius-xl` | 16px | |
| `--radius-2xl` | 20px | 네이티브에서는 `xxl` ([5장](#5-빌드)) |
| `--radius-full` | 1000px | pill |

> **2026-08-28 스케일이 재배치됐다.** `xs` 와 `2xl` 이 새 이름이고 `md`(10) · `xl`(16) 이 신설됐다.
> 그 결과 **`sm` · `md` · `xl` 세 이름의 값이 바뀌었다** — 이전 세대를 참조하던 코드는 확인이 필요하다.
>
> | 이름 | 이전 | 현재 |
> |---|---|---|
> | `sm` | 4px | **8px** |
> | `md` | 8px | **10px** |
> | `xl` | 20px | **16px** |
>
> Figma `Radius 🟢` 페이지는 표만 갱신됐고 상단 설명 문단과 시각 예시(`img_area`)는
> 아직 6단계 옛 값을 보여준다. 표가 맞다 — 컴포넌트에 바인딩된 `radius/md` 가 10 인 것으로 확인했다.

### 3.4 Z-index

100 단위 스케일 — 사이에 끼워 넣을 여지를 남긴 것.

| 토큰 | 값 | 레이어 |
|---|---|---|
| `--z-base` | 0 | 일반 콘텐츠 흐름. z-index 지정이 필요 없는 기본 레이어 |
| `--z-dropdown` | 100 | Select·Input 드롭다운, 컨텍스트 메뉴 등 열리는 플로팅 목록 |
| `--z-sticky` | 200 | 고정 헤더, Left Panel, 사이드바 |
| `--z-overlay` | 300 | 딤(bg/tint/overlay) 배경 레이어 |
| `--z-modal` | 400 | Dialog, 확인창 등 모달 컨테이너 |
| `--z-popover` | 500 | Popover, Tooltip trigger — 모달 위에도 표시될 수 있는 부가 정보 |
| `--z-toast` | 600 | Toast 알림 메시지 |
| `--z-tooltip` | 700 | Tooltip 등 최상위 정보 레이어 |

`sticky`(200)가 `dropdown`(100)보다 위인 건 의도된 것이다 — 고정 요소가 항상 접근 가능한 상태를 유지해야 하기 때문.

### 3.5 Motion

**Primitive** — 컴포넌트가 직접 참조하지 않는다.

| duration | | ease | |
|---|---|---|---|
| `--duration-instant` | 0ms | `--ease-linear` | `cubic-bezier(0, 0, 1, 1)` |
| `--duration-fast` | 100ms | `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` |
| `--duration-base` | 200ms | `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` |
| `--duration-slow` | 300ms | `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--duration-slower` | 500ms | | |

**Semantic** — 컴포넌트는 여기만 참조한다. 각각 `-duration` / `-easing` 짝.

| 토큰 | duration | ease | 용도 |
|---|---|---|---|
| `--motion-feedback-*` | 100ms | out | 버튼 press, 토글 전환, 체크박스 체크 — 입력에 대한 즉각적 시각 피드백 |
| `--motion-enter-*` | 200ms | out | Tooltip, Dropdown, Popover, Snackbar 등 소형 UI 등장 |
| `--motion-exit-*` | 100ms | in | 소형 UI 퇴장. 빠르게 사라져 사용자 흐름을 방해하지 않는다 |
| `--motion-enter-lg-*` | 300ms | out | Modal, Dialog, Bottom Sheet, Full-screen Overlay 등장 |
| `--motion-exit-lg-*` | 200ms | in | 대형 UI 퇴장. enter-lg 보다 빠르게 |
| `--motion-move-*` | 200ms | in-out | 리스트 재정렬, 드래그 앤 드롭 등 위치 이동 |
| `--motion-resize-*` | 300ms | in-out | Accordion 펼침/접힘, 패널 크기 조절, 확장/축소 |
| `--motion-view-*` | 500ms | out | 페이지 전환, 탭 전환, 라우팅 등 전체 뷰 교체 |
| `--motion-continuous-easing` | — | linear | Spinner, Progress bar, 무한 스크롤 로딩. duration 은 사용처마다 |
| `--motion-none-duration` | 0ms | — | 애니메이션 의도적 비활성. `prefers-reduced-motion` 대응 |

`continuous` 는 duration 이, `none` 은 easing 이 없다 — 의도된 것이라 짝이 맞지 않는다.

**접근성**: `motion/none` 이 그 용도로 정의돼 있지만, 전역 `prefers-reduced-motion` 처리는 아직 토큰에 넣지 않았다. 필요하면 앱 레이어에서:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms; --duration-base: 0ms;
    --duration-slow: 0ms; --duration-slower: 0ms;
  }
}
```

### 3.6 Icon

원본은 변수 컬렉션이 아니라 Figma `Icon` 페이지의 **`guide` 프레임**(`355:6381`)이다.
토큰마다 근거가 된 노드 ID 를 `$extensions."com.nation-a.figmaNode"` 에 남겼다.

**크기** — `font-size` 와 같은 단계 어휘(`xs`·`base`·`md`·`lg`)를 쓴다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--icon-size-xs` | 12px | 최소 권장 크기. 이보다 작으면 가독성이 떨어진다 |
| `--icon-size-base` | 16px | ★ 기본값 |
| `--icon-size-md` | 20px | 주요 액션·강조 아이콘 |
| `--icon-size-lg` | 24px | 주요 액션·강조 아이콘 중 가장 큰 단계 |

**여백**

| 토큰 | 값 | 규칙 |
|---|---|---|
| `--icon-gap-text` | 8px | 아이콘 ↔ 텍스트 |
| `--icon-gap-icon` | 16px | 아이콘 ↔ 아이콘 (최소 권장) |
| `--icon-touch-target` | 32px | 터치 가능한 아이콘의 최소 터치 영역 |

```css
.icon-button {
  inline-size: var(--icon-touch-target);
  block-size: var(--icon-touch-target);
}
.icon-button svg {
  inline-size: var(--icon-size-base);
  block-size: var(--icon-size-base);
}
.menu-item { display: flex; align-items: center; gap: var(--icon-gap-text); }
.toolbar   { display: flex; gap: var(--icon-gap-icon); }
```

radius 와 같은 이유로 **px 를 유지한다** — 아이콘은 글리프가 그려진 픽셀 그리드에 맞춘 물리적
크기라, 브라우저 글자 크기 설정을 따라 커지면 선 두께가 그리드에서 어긋난다.

**컬러 — 아이콘 전용 토큰은 만들지 않는다.** Semantic Color([3.2](#32-color))를 그대로 쓰고,
아이콘 색은 상속(`currentColor`)에 맡기는 것을 기본으로 한다. 가이드의 스와치는 변수에 바인딩되지
않은 hex 라 값이 아니라 **역할**만 아래 매핑으로 옮겼다.

| 용도 | Semantic Color 토큰 | 가이드 표기(참고용 hex) |
|---|---|---|
| 주요 액션·강조 아이콘 | `--color-foreground-strong` | `#FFFFFF` |
| 기본 아이콘 | `--color-foreground` | `#E0E0E0` |
| 보조 아이콘 | `--color-foreground-subtle` | `#888888` |
| 비활성 아이콘 | `--color-foreground-disabled` | `#404040` |
| 어두운 배경 위 | `--color-inverse-foreground` | `#111111` |
| 브랜드 강조 | `--color-primary` | `#04B49F` ⚠️ |

> ⚠️ **브랜드 강조색이 두 원본에서 다르다.** Icon 가이드의 스와치는 `#04B49F`(청록)인데
> Color Foundation 의 `--color-primary` 는 `blue-60`(`hsl(216 100% 60%)`, 파랑)이다.
> 가이드 스와치가 변수에 바인딩돼 있지 않아 생긴 잔재로 보인다 — Figma 에서 어느 쪽이 맞는지
> 확정한 뒤 한쪽을 고쳐야 한다. 그때까지 코드에서는 `--color-primary` 를 쓴다.

**Do / Don't** — 토큰으로 표현되지 않는 규칙이라 여기 옮겨 둔다.

- ○ 한 화면에서는 Solid / Line 중 하나의 스타일로 통일한다.
- ○ 레이블을 병기할 때는 아이콘 아래에 두고 상하 구조로 배치한다.
- ✗ 축소·확대할 때 원본 비율을 바꾸지 않는다.
- ✗ 같은 화면에서 아이콘 스타일을 섞지 않는다.

> `--icon-gap-text`(8px)는 Spacing 표의 `gap/4`(4px, "아이콘-텍스트 간격")와 값이 어긋난다.
> 확정되면 `{gap.*}` 참조로 바꿔 중복을 없앤다 — [3.7](#37-spacing) 참고.
>
> 가이드의 여백 예시는 아이콘과 레이블을 가로로 두고 `--icon-gap-text` 를 적용하는데,
> Do 항목은 상하 배치를 말한다. 둘 다 가이드에 있는 그대로 옮겼다 — 어느 쪽이든 간격은 8px 이다.

### 3.7 Spacing

Figma 오토레이아웃에 바인딩되는 **두 개의 독립 스케일**이다. `gap` 은 요소 간 간격
(`itemSpacing`, `counterAxisSpacing`), `padding` 은 컨테이너 내부 여백
(`paddingTop`/`Bottom`/`Left`/`Right`) 에 쓴다.

**이름의 숫자가 곧 px 값이다.** `--gap-40` 은 40px 이지 40번째 단계가 아니다.
Level 열(2XS~6XL)은 Figma 표의 라벨을 옮긴 것으로, 토큰 이름에는 들어가지 않고
`$extensions."com.nation-a.level"` 에만 남아 있다.

**gap** — 요소 간 간격

| Level | 토큰 | 값 | 용도 |
|---|---|---|---|
| 2XS | `--gap-2` | 2px | 미세 요소 간격 |
| XS | `--gap-4` | 4px | 아이콘-텍스트 간격 |
| SM | `--gap-6` | 6px | 기본 요소 간격 |
| MD | `--gap-8` | 8px | 인라인 요소 간격 |
| Base | `--gap-10` | 10px | 리스트 아이템 간격 |
| LG | `--gap-12` | 12px | 카드 내부 간격 |
| XL | `--gap-16` | 16px | 섹션 내부 그룹 간격 |
| 2XL | `--gap-20` | 20px | 블록 요소 간격 |
| 3XL | `--gap-24` | 24px | 컨트롤 그룹 간격 |
| 4XL | `--gap-40` | 40px | 섹션 간 대형 간격 |
| 5XL | `--gap-44` | 44px | 컨텐츠 블록 분리 |

**padding** — 컨테이너 내부 여백

| Level | 토큰 | 값 | 용도 |
|---|---|---|---|
| 3XS | `--padding-1` | 1px | 미세 내부 여백 |
| 2XS | `--padding-2` | 2px | 초소 여백, 아이콘 여백 |
| XS | `--padding-3` | 3px | 소형 요소 내부 여백 |
| SM | `--padding-4` | 4px | Tag, Badge, 아이콘 컨테이너 |
| MD | `--padding-6` | 6px | 기본 컴포넌트 여백 |
| MD-L | `--padding-7` | 7px | 미디엄 변형 여백 |
| Base | `--padding-8` | 8px | Button, Input 내부 여백 |
| Base-L | `--padding-9` | 9px | 베이스 변형 여백 |
| LG | `--padding-10` | 10px | 카드, 리스트 아이템 여백 |
| XL | `--padding-12` | 12px | 카드, 패널 내부 여백 |
| XL-L | `--padding-14` | 14px | 대형 변형 여백 |
| 2XL | `--padding-15` | 15px | 컨테이너 여백 |
| 3XL | `--padding-16` | 16px | 섹션 헤더, 대형 컨테이너 |
| 4XL | `--padding-20` | 20px | Dialog, Modal 여백 |
| 5XL | `--padding-24` | 24px | 페이지 레벨 여백 |
| 6XL | `--padding-48` | 48px | 히어로, 풀 섹션 여백 |

```css
.card {
  padding: var(--padding-12);
  display: flex;
  flex-direction: column;
  gap: var(--gap-12);
}
.card__actions { display: flex; gap: var(--gap-8); }
.page { padding: var(--padding-24); }
```

**gap 과 padding 은 같은 값이어도 서로 바꿔 쓰지 않는다.** `--gap-8` 과 `--padding-8` 은
둘 다 8px 이지만 Figma 에서 바인딩되는 속성이 다르고, Level 라벨도 다르다(MD / Base).
값이 같다고 한쪽으로 합치면 디자인을 고칠 때 어느 쪽이 움직여야 하는지 알 수 없게 된다.

> **아직 정리가 필요한 것들** — Figma 원본 그대로 옮겼고, 저장소에서 임의로 고치지 않았다.
>
> - ~~`gap/24` 가 코드에만 있다~~ — 해소됐다. Figma `Spacing` 에 `gap/24`(scope `GAP`)가
>   등록됐고 가이드 표도 3XL / `gap/40` 4XL / `gap/44` 5XL 로 맞춰졌다.
>   코드는 `com.figma.variableId` 로 연결돼 있다.
>   라벨은 gap 스케일 안에서만 움직였다 — padding 은 그대로다(3XL=16px, 5XL=24px).
> - **아이콘-텍스트 간격이 두 페이지에서 다르다.** Spacing 표는 `gap/4`(4px), Icon 가이드는
>   8px 이라고 한다 ([3.6](#36-icon)의 `--icon-gap-text`). 어느 쪽이 맞는지 확정되면
>   `--icon-gap-text` 를 `{gap.*}` 참조로 바꿔 중복을 없앤다.
> - **`--icon-gap-icon`(16px) 과 `--gap-16`(16px)** 은 값이 같다. 위와 같은 이유로 아직 잇지 않았다.
> - **4px 그리드가 아니다.** 1·3·7·9·14·15·44px 처럼 그리드를 벗어난 값이 섞여 있다.
>   `padding/7`·`/9`·`/14` 는 "미디엄/베이스/대형 변형 여백"이라 특정 컴포넌트 높이를 맞추려고
>   만든 값으로 보인다. 컴포넌트 스펙을 잡을 때 함께 검토할 대상이다.
> - **Tailwind 연동 시 주의.** Tailwind v4 는 `--spacing-*` 하나로 padding·margin·gap 유틸리티를
>   전부 만든다. 여기서는 두 스케일이 분리돼 있으므로, Tailwind 레이어를 얹을 때 `--spacing-*`
>   공통 스케일을 따로 정의할지 결정해야 한다.

### 3.8 Breakpoint

뷰포트 폭의 **경계선(조건)** 이다. "언제 구조를 바꾸는가"에 답하며, 컨테이너 폭 같은
"얼마나 넓은가"는 `Layout`([3.9](#39-layout))이 답한다.

```
360        768              1280                ∞
├── Mobile ─┼──── Tablet ────┼───── Desktop ─────┤
```

| 토큰 | 값 | 설명 |
|---|---|---|
| `--breakpoint-mobile-min` | 360px | 최소 지원 폭, **미디어 쿼리 사용 금지** — QA 기준선 |
| `--breakpoint-tablet` | 768px | tablet 레이아웃 시작 |
| `--breakpoint-desktop` | 1280px | desktop 레이아웃 시작 |

`mobile-min` 은 경계선이 아니라 **하한선**이다. 360px 미만은 지원하지 않는다는 QA 기준일 뿐이라
미디어 쿼리 조건으로 쓰지 않는다. 실제 분기점은 768 / 1280 두 개다.

> ⚠️ **CSS 변수는 `@media` 조건에 쓸 수 없다.** 이건 브라우저 사양이라 토큰으로 못 우회한다.
>
> ```css
> @media (min-width: var(--breakpoint-tablet)) { }  /* ✗ 동작하지 않는다 */
> @media (min-width: 768px) { }                     /* ○ 값을 직접 쓴다 */
> ```
>
> `--breakpoint-*` 변수를 내보내는 이유는 두 가지다 — Tailwind v4 가 `@theme` 의
> `--breakpoint-*` 를 읽어 `tablet:` `desktop:` 변형을 만들고, JS 가
> `getComputedStyle` 로 읽을 수 있기 때문이다. 미디어 쿼리를 직접 쓴다면 값을 박되,
> 그 값이 토큰과 어긋나지 않게 빌드 타임(Sass·PostCSS·Tailwind)에서 주입하는 편이 낫다.

JS 분기는 CSS 를 거치지 않고 데이터 레이어를 쓴다:

```js
import tokens from '@nation-a/design-tokens';

const isTablet = window.matchMedia(`(min-width: ${tokens.breakpoint.tablet})`).matches;
```

### 3.9 Layout

앱쉘(사이드 패널+툴바) 전용 고정값. Primitive/Semantic 구분 없는 flat 토큰 6개 — 반응형 컴포넌트 규격이
아니라 데스크톱 전용 레이아웃 상수라 스케일화하지 않았다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--layout-container-max` | 1200px | 메인 콘텐츠 최대 너비 |
| `--layout-panel-width` | 320px | 사이드 패널 펼침 너비 |
| `--layout-panel-width-collapsed` | 64px | 사이드 패널 접힘 너비 |
| `--layout-toolbar-height` | 56px | 상단/하단 툴바 고정 높이 |
| `--layout-viewport-min-height` | 600px | 뷰포트 최소 높이(이보다 작으면 스크롤 허용) |
| `--layout-card-min-width` | 240px | 카드 그리드 최소 카드 너비 |

### 3.10 Component height

폼 컨트롤의 고정 높이 3단계. Figma 의 **Size 축**(`32` · `40` · `48`)이 이 변수에 바인딩된다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--component-height-sm` | 32px | 조밀한 자리 — Input Size=32 |
| `--component-height-md` | 40px | 기본 — Input Size=40 |
| `--component-height-lg` | 48px | 터치 대상이 큰 자리 — Input Size=48 (Figma 기본값) |

- **높이만 여기서 온다.** 안쪽 여백·radius·글자는 각각 spacing · radius · typography 스케일을 본다.
  같은 Size 라도 세 스케일이 함께 움직일 뿐 하나의 토큰으로 묶이지 않는다.
- **세로 여백은 토큰이 아니다.** Figma 오토레이아웃이 세로 여백 없이 높이만 고정해 두었다.
  구현은 높이를 고정하고 내용을 세로 가운데 정렬한다 ([TOKEN_NAMING 3.5](../docs/TOKEN_NAMING.md)).
- **컴포넌트는 이 스케일을 한 번 더 감싼다** — `--input-48-height: var(--component-height-lg)`.
  컴포넌트 토큰 이름은 Figma variant 이름을 따라 숫자(`48`)를 쓰고, 파운데이션은 변수 이름을 따라
  `lg` 를 쓴다. 두 이름이 다른 건 각자 Figma 원본을 따른 결과다.
- ⚠️ 이 컬렉션은 **라이브러리에 게시돼 있지 않다.** `search_design_system` 에 잡히지 않아
  `com.figma.variableId` 를 읽지 못하고, 바인딩이 확인된 노드 ID(`com.nation-a.figmaNode`)로
  대신 걸어 두었다. 게시되면 바꾼다 ([DECISIONS 28](../docs/DECISIONS.md)).
- `Dropdown / Text` 의 `--dropdown-text-{32,40,48}-height` 는 이 카테고리가 없던 때 리터럴로 들어간
  값이고 32·40·48 로 여기와 정확히 같다. 그쪽 Figma 바인딩을 확인한 뒤 참조로 바꿀 수 있다.

### 3.11 Elevation (Shadow)

Figma `elevation/*` **Effect Style**에서 이식 — Variable이 아니므로 `elevation.tokens.json`은 없다
(Effect Style에는 codeSyntax·변수 ID 같은 Variable 전용 필드가 없어 DTCG `$extensions.com.figma.variableId`를
채울 수 없다). `elevation.css`에 손으로 관리한다.

5단계, 크기(`sm/md/lg`)가 아니라 의도(intent) 기반 네이밍: `--shadow-subtle` → `--shadow-raised` →
`--shadow-floating` → `--shadow-overlay` → `--shadow-supreme`. 각 단계의 Purpose/Usage/Do not use는
Figma Effect Style description 참고.

## 4. Figma 연동

### 4.1 컬렉션 대응

| Figma 컬렉션 | 토큰 파일 | 상태 |
|---|---|---|
| `Typography` (49) | `typography.tokens.json` (48) | ✅ 동기화 — 개수 차이는 표현 차이 때문이다([4.3](#43-figma-에-반영하지-않은-차이-의도된-것)) |
| `Radius` (8) | `radius.tokens.json` | ✅ 동기화 (2026-08-28 스케일 재배치 — [3.3](#33-radius)) |
| `Z-index` (8) | `z-index.tokens.json` | ✅ 동기화 (이름 변경 없었음) |
| `Motion` (27) | `motion.tokens.json` | ✅ 동기화 |
| `Primitive Color` (192) + `Semantic Color` (63) | `color.tokens.json` | ✅ 동기화 (Primitive+Semantic 통합 — `motion.tokens.json` 과 동일 패턴). Light 모드 값은 Figma 에만 있다 |
| — (`Icon` 페이지 `guide` 프레임) | `icon.tokens.json` | ✅ 반영 (변수 컬렉션 없음) |
| `Spacing` (27) | `spacing.tokens.json` (27) | ✅ 동기화 (`gap/24` 신설 및 Level 재배치 반영 완료) |
| `Breakpoint` (3) | `breakpoint.tokens.json` | ✅ 동기화 (표 셀이 변수에 바인딩 안 돼 있어 변수 ID 는 못 가져왔다) |
| `Layout` (6) | `layout.tokens.json` | ✅ 동기화 |
| `component-height` (3) | `component-height.tokens.json` | ⚠️ 값은 동기화. 라이브러리에 게시돼 있지 않아 `variableId` 대신 노드 ID 로 추적한다 ([3.10](#310-component-height)) |
| `elevation/*` (Effect Style, 5) | — (Variable 아님, `elevation.css` 에 직접 이식) | ✅ 동기화 |
| `responsive` | — | ⬜ 아직 미반영 |

Figma 는 rename 해도 변수 ID 가 유지되므로, 아래 이름 변경으로 **기존 레이어 바인딩이 끊긴 것은 없다.**

### 4.2 Figma 에 반영한 이름 변경

**Typography** (2026-08-26, 22개)

| Figma (변경 전) | Figma (현재) = 코드 토큰 | 이유 |
|---|---|---|
| `text-style/*` | `typography/*` | DTCG 조합 토큰의 표준 타입명이 `typography` |
| `text-style/body-sm-reading` | `typography/body-sm-relaxed` | 변형 접미사를 참조하는 행간 토큰 이름(`relaxed`)과 일치 |
| `text-style/caption-xs-reading` | `typography/caption-xs-relaxed` | 〃 |
| `text-style/instrument-title-2xl` | `typography/title-2xl-latin` | 토큰 이름에 폰트 제품명을 박으면 폰트 교체 시 이름이 거짓이 된다. 실제 제약인 "라틴 전용"으로 |
| `text-style/instrument-heading-md` | `typography/heading-md-latin` | 〃 |
| `text-style/instrument-caption-xs` | `typography/caption-xs-latin` | 〃 |
| `line-height/reading-sm` / `reading-xs` | `line-height/relaxed-sm` / `relaxed-xs` | `-relaxed` 어휘로 통일 (값 23.1 / 19.8px 은 그대로) |
| `font/kr` / `font/en` / `font/en-display` | `font-family/korean` / `latin` / `display` | 그룹명을 `font-family` 로, 폰트 이름이 아닌 역할·스크립트로 명명 |

`typography/*` 변수의 값 문자열도 새 이름을 가리키도록 갱신하고 기본 웨이트를 명시했다:
`"font-size/sm · line-height/relaxed-sm · medium(기본), semibold, bold"`

**Motion** (2026-08-26, 4개)

| Figma (변경 전) | Figma (현재) | 이유 |
|---|---|---|
| `easing/out`, `easing/in`, `easing/in-out`, `easing/linear` | `ease/out`, `ease/in`, `ease/in-out`, `ease/linear` | 네이밍 규칙이 `--ease-{name}`. Tailwind v4 의 `--ease-*` 네임스페이스와도 일치 |

`motion/*/easing` 별칭 10개는 ID 로 참조하므로 그대로 해석된다.

**Radius** (2026-08-28, 스케일 재배치) — Figma 쪽 변경을 저장소가 따라간 경우다.
`xs`·`2xl` 이 신설되고 `md`(10)·`xl`(16) 이 새 값을 가지면서 `sm`·`md`·`xl` 의 의미가 바뀌었다.
값과 대응은 [3.3](#33-radius) 참고. `md`(10)·`xl`(16) 은 변수 ID 를 확인하지 못해
표의 행 노드를 `com.nation-a.figmaNode` 로 걸어 뒀다.

**Z-index** — 변경 없음. `z/base…tooltip` 이 이미 규칙에 맞았다.

### 4.3 Figma 에 반영하지 **않은** 차이 (의도된 것)

아래는 **Figma 변수 모델이 표현할 수 없어서** 코드 쪽에만 적용했다.
억지로 맞추려면 변수를 삭제 후 재생성해야 하고(Figma 는 변수 타입 변경 불가),
그러면 해당 변수를 쓰는 모든 레이어의 바인딩이 끊긴다.

| 코드 | Figma | 왜 다른가 |
|---|---|---|
| `font-weight/*` = `500`~`800` (숫자) | `"Medium"`~`"ExtraBold"` (문자열) | Figma 는 웨이트를 **폰트 스타일 이름 문자열**로 바인딩한다. 숫자로는 텍스트 레이어에 안 붙는다 |
| `font-family/sans` · `display` = 폴백 스택 2개 | `font-family/korean` · `latin` · `display` 3개 | Figma FONT_FAMILY 변수는 **패밀리 1개**만 담는다. 폴백 스택은 CSS 개념이라 korean·latin 이 `sans` 한 스택으로 합쳐진다 |
| `line-height/relaxed` = `1.65` (무단위 배수) | `relaxed-sm` = 23.1px, `relaxed-xs` = 19.8px | Figma 행간 변수는 **px 고정값만** 가능. 원본이 크기별로 미리 계산해 둔 이유 |
| `ease/*` = `[0, 0, 0.2, 1]` (DTCG `cubicBezier` 배열) | `"cubic-bezier(0, 0, 0.2, 1)"` (문자열) | Figma 변수에 배열 타입이 없다. 값은 동일 |
| `ease/linear` = `[0, 0, 1, 1]` | `"linear"` | 〃. 수학적으로 동일 |

추가로 코드에만 있는 것:
- `font-style/normal` / `italic` — Figma 는 `font-weight/bold-italic` 문자열 하나로 유지
  (italic 은 weight 가 아니라 style 이지만, Figma 바인딩 모델상 분리 불가).
  `italic` 은 원본이 된 `font-weight/bold-italic` 의 변수 ID 를 물려받았고, `normal` 은
  물려받을 원본이 아예 없어 `$extensions."com.nation-a.codeOnly"` 에 사유를 적어 뒀다 —
  검사기는 사유가 있는 것만 추적성 경고에서 뺀다.
- `$type: "typography"` 조합 토큰 — Figma 변수에는 조합 타입이 없어 문자열 문서 변수로 남아 있다
- `{ "value": 72, "unit": "px" }` — DTCG `dimension`·`duration` 은 단위 명시가 필수

`$description` 은 반대 방향이다 — **Figma 가 원본이고 저장소가 따라간다.** Figma 에 설명이 없는
토큰(Radius 6, `duration/*` 5, `ease/*` 4, Semantic Color 54)은 저장소에도 설명이 없다.

### 4.4 유지한 것

- 스케일 단계 이름(`3xs`~`6xl`, `sm`~`xl`)과 역할 이름(`display`/`title`/`heading`/`body`/`caption`,
  `enter`/`exit`/`move`/`resize`) — Tailwind·shadcn 생태계, 표준 모션 어휘와 그대로 호환된다.
- 모든 값 — Figma 원본과 전부 일치한다.

## 5. 빌드

[Style Dictionary](https://styledictionary.com) v5 로 `*.tokens.json` → `*.css` + `dist/` + `../platforms/` 를 생성한다.

```bash
npm ci
npm run build      # tokens/*.css, dist/tokens.{js,d.ts,json}, platforms/{ios,android}/* 생성
npm run validate   # 네이밍·계층·참조 규칙 검사
npm run check      # validate + 커밋된 생성물이 토큰과 일치하는지
```

`package.json` 에 `prepare` 가 걸려 있어 **`npm ci` 나 git 설치만으로도 빌드가 한 번 돌고
생성물이 갱신된다.** 그래서 CI(`.github/workflows/tokens.yml`)는 일부러 설치 단계에서 그걸 막는다.
로컬에서 CI 와 같은 검사를 재현하려면 똑같이 해야 한다:

```bash
npm ci --ignore-scripts && npm run check
```

| 파일 | 역할 |
|---|---|
| `scripts/tokens.config.mjs` | 파일별 레이아웃·주석 정책, semantic 컬러 이름표(`colorAlias`), 네이티브 대상 선언 |
| `scripts/build-tokens.mjs` | 변환·생성 (Web) |
| `scripts/build-platforms.mjs` | 변환·생성 (iOS·Android) |
| `scripts/validate-tokens.mjs` | 검증 |

`dist/` 는 커밋하지 않지만 **`platforms/` 는 커밋한다** — SPM 도 Gradle source module 도
빌드 단계 없이 소스를 그대로 읽기 때문이다. 그래서 최신성 검사 대상이다.

**생성물이 아닌 CSS 세 개**는 `tokens.config.mjs` 의 `handWritten` 에 선언돼 있다. `index.css` 에는
함께 들어가지만 빌드 최신성 검사 대상이 아니고, 직접 고쳐도 된다.

| 파일 | 손으로 관리하는 이유 |
|---|---|
| `color.css` | DTCG 소스(`color.tokens.json`)는 Figma 원본 경로(`primitive.*`/`semantic.*`)를 그대로 쓰는데 CSS 변수명은 팀이 다시 붙인 이름(`--color-foreground` 등)이라 기계적으로 유도되지 않는다. **이름 체계를 확정하면 `files` 로 옮겨야 한다** |
| `elevation.css` | Figma Effect Style 원본 — Variable 이 아니라 DTCG 소스 자체가 없다 |
| `component.css` | Figma 컬렉션이 아니다. Semantic 만 참조하는 컴포넌트 전용 층 |

`color.css` 는 빌드 생성물이 아니지만 방치하지는 않는다 — `npm run validate` 가 각 줄 위의
Figma 경로 주석을 조인 키로 `color.tokens.json` 과 대조해서, 한쪽만 고치면 실패한다
(alias 대상·색상값·투명도 전부). `elevation.css` 와 `component.css` 는 대조할 DTCG 원본이
없어 이 검사가 없고, 대신 정의되지 않은 `var()` 참조와 primitive 직접 참조를 검사한다.
`component.css` 는 리터럴 hex 도 경고로 잡는다 — `var()` 만 보면 색을 hex 로 적어 검사를
빠져나갈 수 있어서다.

> `color.css` 는 여전히 손으로 관리하지만, **`dist/tokens.{js,json}`(RN·스크립트용 데이터 레이어)에는
> `color.tokens.json` 에서 만든 `color.*` 그룹이 들어간다.** 이름은 CSS 변수와 같다 —
> primitive 는 경로 그대로(`color.neutral["99"]` ↔ `--color-neutral-99`), semantic 은
> `colorAlias` 를 거친 팀 이름(`color.foreground` ↔ `--color-foreground`). 값은 DTCG 원본
> 그대로 불투명은 `"#RRGGBB"` 문자열, 반투명은 `{ value, alpha }` 객체다.

`npm run validate` 가 자동으로 잡는 것:

- kebab-case 네이밍, `$type` 누락, 없는 토큰을 가리키는 참조
- `tokens/*.css` 안의 정의되지 않은 `var()` 참조 (손으로 관리하는 CSS 도 포함)
- `component.css` 가 primitive 팔레트(`--color-{hue}-{step}`)를 직접 참조하는 경우
- `color.css` 와 `color.tokens.json` 의 드리프트 (색상값·투명도·alias 대상)
- `color.css` 의 변수명이 `colorAlias`(플랫폼 공통 semantic 이름표)와 어긋나는 경우
- 계층 위반 — primitive(`duration.*`, `ease.*`)를 `motion.*` 밖에서 참조하거나 primitive 가 다른 토큰을 참조하는 경우
- 생성된 CSS 의 `.text-*` 클래스에 `var()` 아닌 하드코딩 값이 섞인 경우
- z-index 가 100 단위가 아니거나 값이 겹치는 경우, 폰트 스택이 generic family 로 안 끝나는 경우
- (경고) rem 으로 딱 떨어지지 않는 px, `com.figma.variableId` 가 없어 Figma 와 연결 안 된 토큰
- (경고) `component.css` 의 주석 밖 리터럴 hex — 팔레트 밖 색이라 토큰이 없는 경우가 있어 실패가 아니다

주석 규칙은 CSS 를 짧게 유지하기 위해 **`$description` 의 첫 문장만** 내보낸다. 전문은 JSON 에 남는다.

## 6. 앞으로

- 남은 컬렉션(`responsive`)도 같은 포맷으로 `tokens/{category}.tokens.json` 에 추가한다.
- `Semantic Color` 의 Dark/Light 2모드 중 **Dark 만 코드에 반영했다** — 제품이 다크 테마만 지원하기 때문.
  Light 모드 값은 Figma 에는 남아 있으나 DTCG 로 내보내지 않는다. Light 를 추가할 때 DTCG 모드
  처리 방식을 먼저 정해야 한다.
- `elevation.css` 는 Figma Effect Style 원본이라 DTCG 소스가 없다. Figma 가 Effect 를 Variable 로
  지원하면 `elevation.tokens.json` 으로 이관한다.
- Icon 가이드와 Color Foundation 의 브랜드 강조색 불일치 확정([3.6](#36-icon) 참고).
- `motion.css` 에 `prefers-reduced-motion` 대응 블록 추가 (`--motion-none-duration` 을 실제로 쓰는 곳이 아직 없다).
- ~~GitHub Packages 배포 워크플로~~ — 완료: `scripts/release.mjs`(체인지로그·버전 PR) + `.github/workflows/release.yml`(머지 시 발행·태그). ⚠ 조직 Packages 과금 한도(403) 해제 대기.
- iOS SPM 미러 저장소와 릴리스 워크플로 ([`../platforms/README.md`](../platforms/README.md) 2장).
- Android 산출물은 아직 Gradle 로 빌드해 본 적이 없다 — 쓰는 앱이 생길 때 검증한다.
- 네이밍 규칙 전문은 [`../docs/TOKEN_NAMING.md`](../docs/TOKEN_NAMING.md).
