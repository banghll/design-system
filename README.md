# slate × shadcn × AI Elements

slate 디자인 시스템의 **파운데이션(토큰)** 위에 shadcn/ui 와 Vercel AI Elements
컴포넌트를 통째로 올린 레포. 값은 slate 에서만 오고, 컴포넌트는 그 값을
참조하는 껍데기다.

```
tokens/                slate 파운데이션 (여기가 값의 출처)
app/globals.css        slate ↔ shadcn 브리지 (두 시스템이 만나는 유일한 지점)
components/ui/         shadcn/ui 61개
components/ai-elements/ AI Elements 48개
```

## 화면

| 경로 | 내용 |
| --- | --- |
| `/` | 파운데이션 — 색·타이포·간격·모서리·그림자, 그리고 브리지 표 |
| `/components` | 컴포넌트 109개 인벤토리 + 살아 있는 샘플 |
| `/ai` | AI Elements 채팅 데모 (모델 없이 UI 층만) |
| `/chat` | AI 채팅 앱 — 스레드 목록·모델 선택·사고 과정 블록 (모델 미연결) |
| `/movies` | 영화 평점 사이트 — 검색·필터·별점 매기기 (평점은 직접 매긴 것만) |

## 실행

```bash
npm run dev
```

Node 는 이 PC 에서 `C:\Users\kis85\tools\nodejs` 에 포터블로 설치돼 있다.
PATH 가 안 잡히면 `node.exe` 전체 경로를 쓴다.

## 파운데이션은 어떻게 들어왔나

`tokens/` 는 `../slate-design-system/tokens/` 에서 **CSS 파일만** 복사한 사본이다.

- 가져온 것: `color` `typography` `spacing` `radius` `motion` `elevation`
  `icon` `layout` `breakpoint` `component-height` `z-index`
- 가져오지 않은 것: `component.css` (컴포넌트 토큰 — 파운데이션이 아니다),
  `components/*.component.json` (사용 계약), `docs/`

`tokens/index.css` 에서 `component.css` import 한 줄을 지운 것 외에 slate
원본을 고치지 않았다. 원본이 갱신되면 `*.css` 를 다시 복사하면 된다.

## 브리지

shadcn 과 AI Elements 는 `--background` `--primary` 같은 **자기 이름**만 안다.
`app/globals.css` 에서 그 이름들을 slate Semantic 토큰으로 연결한다.

```css
--background: var(--color-background);
--primary:    var(--color-primary);
--border:     var(--color-border);
--radius:     var(--radius-md);
```

Tailwind 의 `rounded-*` 유틸리티도 slate radius 스케일을 보도록 `@theme inline`
에서 다시 물렸다.

**다크 전용이다.** slate 규칙에 따라 `.dark` 분기를 두지 않고 `:root` 값이 곧
다크값이다. shadcn 이 기본 생성한 `.dark` 블록은 제거했다.

## 알려진 간극

지어낸 값 없이 접은 자리들. 필요해지면 slate 에 토큰을 요청할 대상이다.

| 자리 | 지금 처리 | 왜 |
| --- | --- | --- |
| `rounded-3xl` `rounded-4xl` | `--radius-2xl` 로 접음 | slate radius 스케일에 3xl/4xl 이 없다 |
| `--chart-1..5` | slate Accent 6색 중 5개 | slate 에 차트 전용 색 역할이 없다 |
| `--popover` | `--color-card-alt` | slate 에 popover 표면 역할이 따로 없다 |
| Pretendard | 미로드 | Google Fonts 에 없다. DM Sans + 시스템 한글 폰트로 폴백 |

## 이 레포에 없는 것

- 백엔드, API 라우트, 모델 연결 — `/ai` 는 고정 문구를 흘려보내는 UI 데모다
- slate 컴포넌트 스펙(`*.component.json`) — 파운데이션만 가져왔다

## 라이선스

컴포넌트는 전부 MIT/ISC (shadcn/ui, AI Elements, Radix, Next.js).
`tokens/` 는 slate 디자인 시스템 사본이다.

## 데이터에 대해

`/movies` 의 별점·메모는 **사용자가 그 화면에서 매긴 값만** 보여준다. 평균 평점·
후기·관객 수 같은 수치는 만들어 넣지 않았다(slate 게이트 58 — 지어낸 숫자 금지).
제목·연도·감독·장르는 작품 사실이라 그대로 쓴다. 포스터 이미지는 없으므로
제목 첫 글자를 쓴 자리표시자를 둔다.

`/chat` 은 모델이 연결되어 있지 않다. 응답은 입력을 되비추는 고정 문구이며,
`compose()` 함수 하나를 API 호출로 바꾸면 실제 모델에 연결된다. 새로고침하면
대화는 사라진다 — 저장소가 없다.
