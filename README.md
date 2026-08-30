# shadcn 디자인 시스템

shadcn/ui 위에 올린 에이전틱 디자인 시스템 레퍼런스와, 그것으로 만든 예제 제품 하나.

값이 적히는 자리를 한 곳(파운데이션)으로 몰고, 그 위에 컴포넌트 → 패턴 → 블록을
쌓았다. 각 항목에 **무엇이고 언제 쓰는지**를 값으로 적어 두어, 사람과 에이전트가
같은 문장을 보고 고르게 했다.

## 화면

| 경로 | 무엇 |
| --- | --- |
| `/` | 파운데이션 — 색 · 모서리 · 간격 · 타이포 · 그림자. 값이 적히는 유일한 자리 |
| `/components` | 컴포넌트 109개 (shadcn/ui 61 + AI Elements 48) |
| `/patterns` | 패턴 74개 — 컴포넌트를 조립해 한 상황을 푼 것 |
| `/blocks` | 블록 32개 — 화면 한 벌. 목록에서 실물 미리보기로 바로 보인다 |
| `/movies` | 씨네덱 · 영화 평점 — 이 시스템으로 만든 예제 제품 ([PRD](docs/prd-movies.md)) |
| `/studio` | 스튜디오 · 이미지 생성 |
| `/reel` | 릴 · 영상 생성 ([PRD](docs/prd-reel.md)) |

## 다른 컴퓨터에서 시작하기

```bash
git clone <이 저장소 주소>
cd design-system
npm install
npm run dev
```

http://localhost:3000 — Node 20 이상이면 된다. 다른 준비물은 없다.
데이터베이스도 API 키도 쓰지 않는다. 씨네덱의 기록은 브라우저 localStorage 에만 남는다.

## 에이전트로 화면 만들기

이 레포는 «있는 것으로 조립한다» 를 규칙이 아니라 **환경**으로 만들어 뒀다.

| 파일 | 하는 일 |
| --- | --- |
| [`design-system.json`](design-system.json) | 기계가 읽는 색인. 컴포넌트 62 · 패턴 74 · 블록 88 · 토큰 58 — id, import 경로, export 이름, variant/size, 정의가 전부 여기 |
| [`docs/agentic-rules.md`](docs/agentic-rules.md) | 순서와 금지 사항 |
| [`.claude/skills/build-screen`](.claude/skills/build-screen/SKILL.md) | 화면 요청이 오면 자동으로 걸리는 작업 절차 |
| [`scripts/check-screen.mjs`](scripts/check-screen.mjs) | 다 만든 뒤 «이미 있는 걸 다시 짰나» 를 검사 |

```bash
npm run registry     # design-system.json 갱신
npm run check        # app 아래 화면 전부 검사
npm run check app/reel/page.tsx
npm run gen          # 컴포넌트 · 패턴 · 서드파티 · 색인 전부 다시 생성
```

## 다른 사람에게 공유하기

서버 없이 도는 한 벌을 만든다.

```bash
npm run share        # out/ 에 정적 사이트가 나온다 (파일 약 2,000개)
```

`out/` 을 그대로 올리면 된다 — Netlify · Cloudflare Pages · S3 · 사내 정적 호스트 어디든.
하위 경로에 올릴 때는 `BASE_PATH=/design-system npm run share`.

GitHub Pages 를 쓴다면 [`.github/workflows/pages.yml`](.github/workflows/pages.yml) 이
이미 들어 있다. 저장소 Settings → Pages → Source 를 **GitHub Actions** 로 바꾸고 main 에
밀면, 밀 때마다 공개 주소가 갱신된다.

공유본에서 달라지는 것은 하나뿐이다 — 파운데이션 편집기의 «저장» 이
`data/themes.json` 대신 **보는 사람의 브라우저**에 남는다. 서버가 없어서다.
레포에 테마를 남기려면 로컬에서 `npm run dev` 로 저장해야 한다.

## 구조

```
app/                 라우트. 파운데이션 · 컴포넌트 · 패턴 · 블록 · 씨네덱
components/
  ui/                shadcn/ui 컴포넌트 61개 — 시스템의 바닥
  ai-elements/       Vercel AI Elements 48개
  examples/          공식 예제 (컴포넌트 화면이 그대로 렌더한다)
  blocks/            공식 블록 (블록 화면이 iframe 으로 그대로 띄운다)
  movies/            씨네덱 전용 조립 — 새 UI 컴포넌트는 만들지 않았다
  catalog-shell.tsx  카탈로그 셸. 이 사이트 자신의 사이드바
  token-editor.tsx   파운데이션 편집기 (상주 패널)
  theme-switcher.tsx tweakcn 프리셋 43종
  lang.tsx           한국어 · English
lib/
  catalog-nav.ts     내비 매니페스트 — 사이드바와 각 페이지가 같은 데이터를 본다
  block-catalog.ts   블록 32개의 정의와 선택 조건
  theme-presets.ts   프리셋 값 (tweakcn, Apache-2.0)
  movies/            씨네덱 데이터와 저장소
scripts/             페이지 생성기. app/components · app/patterns 는 여기서 나온다
docs/movies-prd.md   예제 제품의 요구사항
```

## 고칠 때 주의할 것

- **`app/components/page.tsx` 와 `app/patterns/page.tsx` 는 직접 고치지 않는다.**
  `scripts/gen-components.mjs` · `scripts/gen-patterns.mjs` 가 생성한다.
  설명 문구를 바꾸려면 스크립트의 `DOC` / `META` 를 고치고 다시 돌린다.

  ```bash
  node scripts/gen-components.mjs
  node scripts/gen-patterns.mjs
  ```

- **리터럴 색을 쓰지 않는다.** `bg-primary` · `text-muted-foreground` 만 쓴다.
  hex 를 한 번 쓰면 그 자리만 프리셋 전환에서 빠진다.
- **간격은 스케일에서만 꺼낸다.** `gap-4` · `p-6`. 임의의 px 는 밀도 토큰을 따라오지 않는다.
- 사이드바 목록과 페이지 구획은 `lib/catalog-nav.ts` 한 곳에서 온다. 두 벌로 갈라지지 않게.

## 도구

왼쪽 아래에 세 가지가 있다.

- **프리셋 43종** — tweakcn 테마. 고르면 색 · 모서리 · 글꼴이 한 번에 바뀐다.
- **파운데이션 편집** — 상주 패널. 색 19종 · 모서리 · 밀도 · 글꼴을 직접 밀면
  화면이 그 자리에서 따라온다. 마음에 들면 CSS 를 복사해 `app/globals.css` 에 붙인다.
- **모드 · 언어** — 라이트 / 다크 / 시스템, 한국어 / English.

## 미리보기 이미지

블록 목록의 그림은 미리 찍어 둔 이미지다. 카드마다 iframe 을 두면 카드 하나가
Next 앱 하나가 되어, 210장을 훑으면 앱 210개가 살아 있게 된다.

블록을 새로 넣거나 디자인이 바뀌면 다시 찍는다. dev 서버가 떠 있어야 한다.

```bash
node scripts/shoot-blocks.mjs        # 없는 것만
node scripts/shoot-blocks.mjs --all  # 전부 다시
```

시스템에 깔린 크롬을 쓴다(`puppeteer-core`). 다른 경로에 있으면 `CHROME_PATH` 로
알려주면 된다. 이미지가 없는 블록은 예전처럼 iframe 으로 떨어지므로,
안 찍어도 화면이 비지는 않는다 — 느릴 뿐이다.

## 라이선스

- shadcn/ui 컴포넌트와 블록 — MIT (shadcn-ui/ui)
- AI Elements — Vercel
- tweakcn 프리셋 — Apache-2.0 (jnsahaj/tweakcn)
- lucide 아이콘 — ISC
- Pretendard — SIL OFL 1.1
- 씨네덱의 작품 24편은 전부 가상이다. 포스터 자리에는 Unsplash 사진을 쓴다.
