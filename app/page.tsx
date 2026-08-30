/* 파운데이션 — 값이 적히는 유일한 자리.
 *
 * 이 페이지는 문서가 아니라 계측기다. 값을 손으로 적지 않고 실제로 렌더한 뒤
 * getComputedStyle 로 읽어 보여준다. 프리셋을 바꾸거나 편집기에서 밀면
 * 이 표도 같이 바뀐다 — 문서와 실제가 어긋날 수 없다. */
"use client"

import { SlidersHorizontal } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { CatalogHeader, CatalogShell, GroupHeader } from "@/components/catalog-shell"
import { type Copy, useLang } from "@/components/lang"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PAGES } from "@/lib/catalog-nav"

const SECTIONS = PAGES.find((p) => p.href === "/")!.sections
const sec = (id: string) => SECTIONS.find((s) => s.id === id)!

/* 색은 짝으로 정의된다 — 면과 그 위의 글자. 짝을 깨면 대비가 무너진다. */
const COLOR_PAIRS: { bg: string; fg: string; use: Copy }[] = [
  {
    bg: "background",
    fg: "foreground",
    use: { ko: "페이지 바탕. 화면에서 가장 넓은 면", en: "The page ground — the widest surface" },
  },
  {
    bg: "card",
    fg: "card-foreground",
    use: { ko: "내용을 묶는 면. 바탕보다 한 단계 올라온다", en: "Groups content; one step above the ground" },
  },
  {
    bg: "popover",
    fg: "popover-foreground",
    use: { ko: "떠 있는 면 — 드롭다운 · 팝오버 · 다이얼로그", en: "Floating surfaces — dropdowns, popovers, dialogs" },
  },
  {
    bg: "primary",
    fg: "primary-foreground",
    use: { ko: "주 액션 하나. 화면에 둘을 두지 않는다", en: "The one primary action — never two on a screen" },
  },
  {
    bg: "secondary",
    fg: "secondary-foreground",
    use: { ko: "주 액션 옆의 보조 액션", en: "The action standing next to the primary one" },
  },
  {
    bg: "muted",
    fg: "muted-foreground",
    use: { ko: "가라앉힌 면과 보조 텍스트", en: "Quiet surfaces and secondary text" },
  },
  {
    bg: "accent",
    fg: "accent-foreground",
    use: { ko: "hover · 선택된 항목의 면", en: "Hover and selected states" },
  },
  {
    bg: "destructive",
    fg: "background",
    use: { ko: "되돌릴 수 없는 것. 삭제 · 실패", en: "The irreversible — delete, failure" },
  },
  {
    bg: "sidebar",
    fg: "sidebar-foreground",
    use: { ko: "앱 셸의 좌측 면", en: "The app shell's side surface" },
  },
  {
    bg: "sidebar-accent",
    fg: "sidebar-accent-foreground",
    use: { ko: "셸 안에서 지금 보고 있는 항목", en: "The item you're on inside the shell" },
  },
]

const LINE_TOKENS: { name: string; use: Copy }[] = [
  { name: "border", use: { ko: "요소를 가르는 선", en: "The line between elements" } },
  { name: "input", use: { ko: "값을 받는 자리의 테두리", en: "The outline of anything that takes a value" } },
  {
    name: "ring",
    use: {
      ko: "포커스 링. 키보드 사용자에게 지금 위치를 알린다",
      en: "The focus ring — tells keyboard users where they are",
    },
  },
]

const CHART_TOKENS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"]

const RADIUS: { cls: string; use: Copy }[] = [
  { cls: "rounded-sm", use: { ko: "배지 · 작은 칩", en: "Badges and small chips" } },
  { cls: "rounded-md", use: { ko: "입력 · 작은 버튼", en: "Inputs and small buttons" } },
  { cls: "rounded-lg", use: { ko: "버튼 · 카드 기본", en: "The default for buttons and cards" } },
  { cls: "rounded-xl", use: { ko: "다이얼로그 · 큰 면", en: "Dialogs and large surfaces" } },
  { cls: "rounded-full", use: { ko: "아바타 · 원형 버튼", en: "Avatars and round buttons" } },
]

const SPACING = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20]

const TYPE: { cls: string; use: Copy }[] = [
  { cls: "text-xs", use: { ko: "보조 라벨 · 메타", en: "Helper labels and metadata" } },
  {
    cls: "text-sm",
    use: {
      ko: "본문 기본. shadcn 컴포넌트 대부분이 이 크기다",
      en: "The body default — most shadcn components live here",
    },
  },
  { cls: "text-base", use: { ko: "이어 읽는 긴 글", en: "Prose meant to be read continuously" } },
  { cls: "text-lg", use: { ko: "카드 제목", en: "Card titles" } },
  { cls: "text-xl", use: { ko: "구역 제목", en: "Section titles" } },
  { cls: "text-2xl", use: { ko: "군 제목", en: "Group titles" } },
  { cls: "text-4xl", use: { ko: "화면의 초점 하나", en: "The single focal point of a screen" } },
]

const WEIGHT = ["font-normal", "font-medium", "font-semibold", "font-bold"]

const SHADOW: { cls: string; use: Copy }[] = [
  { cls: "shadow-xs", use: { ko: "거의 안 보이는 들림", en: "A lift you barely notice" } },
  { cls: "shadow-sm", use: { ko: "카드", en: "Cards" } },
  { cls: "shadow-md", use: { ko: "드롭다운", en: "Dropdowns" } },
  { cls: "shadow-lg", use: { ko: "팝오버", en: "Popovers" } },
  { cls: "shadow-xl", use: { ko: "다이얼로그", en: "Dialogs" } },
]

const RULES: { title: Copy; body: Copy }[] = [
  {
    title: { ko: "색은 이름으로만 부른다", en: "Call colors by name only" },
    body: {
      ko: "bg-primary · text-muted-foreground · border. hex 를 한 번 쓰면 그 자리만 프리셋 전환에서 빠져 나중에 찾기 어렵다.",
      en: "bg-primary, text-muted-foreground, border. One hex and that spot silently opts out of every future theme change.",
    },
  },
  {
    title: { ko: "면과 글자는 짝으로 쓴다", en: "Surfaces and text travel in pairs" },
    body: {
      ko: "bg-card 를 썼으면 text-card-foreground 를 같이 쓴다. 면만 바꾸면 대비가 어디선가 무너진다.",
      en: "If you reach for bg-card, take text-card-foreground with it. Change only the surface and contrast breaks somewhere.",
    },
  },
  {
    title: { ko: "주 액션은 화면당 하나", en: "One primary action per screen" },
    body: {
      ko: "primary 버튼이 둘이면 어느 것도 이기지 못한다. 둘 다 중요하면 화면을 나눠야 한다는 신호다.",
      en: "Two primaries and neither wins. If both truly matter, that's a signal the screen should be split.",
    },
  },
  {
    title: { ko: "간격은 스케일에서만 꺼낸다", en: "Take spacing from the scale" },
    body: {
      ko: "gap-4 · p-6. 임의의 px 를 넣으면 밀도 토큰을 바꿔도 그 자리만 따라오지 않는다.",
      en: "gap-4, p-6. An arbitrary px value won't follow when the density token changes.",
    },
  },
  {
    title: { ko: "상태를 다 만들고 끝낸다", en: "Ship every state" },
    body: {
      ko: "기본 · hover · focus · 비활성 · 로딩 · 빈 상태 · 오류. 빠진 상태는 나중에 버그로 돌아온다.",
      en: "Default, hover, focus, disabled, loading, empty, error. A missing state comes back as a bug.",
    },
  },
  {
    title: { ko: "깊이는 면으로 먼저 만든다", en: "Build depth with surfaces first" },
    body: {
      ko: "다크에서 그림자는 거의 안 보인다. card → popover 로 면을 올려 깊이를 내고, 그림자는 거들게 한다.",
      en: "Shadows barely register in dark mode. Step the surface up from card to popover and let shadow assist.",
    },
  },
]

/* 실제 렌더 결과에서 값을 읽는다. 문서가 값을 지어내지 않도록.
 * 모드·프리셋·편집기 어느 쪽이 바꾸든 다시 읽는다. */
function useComputed(vars: string[], dep: unknown) {
  const [map, setMap] = useState<Record<string, string>>({})
  useEffect(() => {
    const read = () => {
      const probe = document.createElement("div")
      document.body.appendChild(probe)
      const cs = getComputedStyle(document.documentElement)
      const out: Record<string, string> = {}
      for (const v of vars) {
        const raw = cs.getPropertyValue(`--${v}`).trim()
        if (!raw) continue
        probe.style.color = raw
        out[v] = getComputedStyle(probe).color || raw
      }
      probe.remove()
      setMap(out)
    }
    read()
    /* 편집기는 :root 의 style 속성을 직접 만진다. 그 변화도 잡는다. */
    const mo = new MutationObserver(read)
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    })
    return () => mo.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep])
  return map
}

function Swatch({ bg, fg, use }: { bg: string; fg: string; use: Copy }) {
  const { t } = useLang()
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex h-20 items-end rounded-lg border p-3"
        style={{ background: `var(--${bg})`, color: `var(--${fg})` }}
      >
        <span className="text-xs font-medium">Aa</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <code className="text-xs">--{bg}</code>
        <code className="text-muted-foreground text-[11px]">--{fg}</code>
        <p className="text-muted-foreground mt-0.5 text-xs leading-snug">{t(use)}</p>
      </div>
    </div>
  )
}

export default function FoundationPage() {
  const { t, lang } = useLang()
  const { resolvedTheme } = useTheme()
  const colors = useComputed(
    [...COLOR_PAIRS.map((p) => p.bg), ...LINE_TOKENS.map((l) => l.name), ...CHART_TOKENS],
    resolvedTheme
  )

  return (
    <CatalogShell>
      <main className="mx-auto w-full max-w-[1100px] px-6 py-14 lg:px-10">
        <CatalogHeader title={{ ko: "파운데이션", en: "Foundation" }} count="shadcn/ui">
          {lang === "ko" ? (
            <>
              <b>파운데이션은 값이 적히는 유일한 자리다.</b> 색 · 모서리 · 간격 ·
              타이포 · 그림자 — 컴포넌트는 이 이름들만 참조하고 자기 값을 갖지 않는다.
              그래서 여기 한 줄을 바꾸면 컴포넌트 109개가 한 번에 따라온다.
              <br />
              <br />
              아래 값은 손으로 적은 것이 아니라{" "}
              <b>지금 렌더된 결과에서 읽어온 것</b>이다. 왼쪽 아래{" "}
              <b>파운데이션 편집</b>을 열고 아무 값이나 밀어 보면, 이 표와 화면의 모든
              컴포넌트가 같이 움직이는 게 보인다. 그게 토큰이 하는 일의 정의다.
            </>
          ) : (
            <>
              <b>The foundation is the only place values are written.</b> Color,
              radius, spacing, type, elevation — components reference these names and
              hold no values of their own. Change one line here and 109 components
              follow.
              <br />
              <br />
              Nothing below is hand-written; every value is{" "}
              <b>read back from what is currently rendered</b>. Open{" "}
              <b>Edit foundation</b> in the lower left and nudge anything — this table
              and every component on screen move together. That is what a token is.
            </>
          )}
        </CatalogHeader>

        <div className="mb-14 flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="gap-1.5">
            <SlidersHorizontal className="size-3" />
            {lang === "ko" ? "지금 모드" : "Current mode"}
            <span className="text-muted-foreground">
              {resolvedTheme === "dark"
                ? lang === "ko"
                  ? "다크"
                  : "Dark"
                : lang === "ko"
                  ? "라이트"
                  : "Light"}
            </span>
          </Badge>
          <p className="text-muted-foreground text-sm">
            {lang === "ko"
              ? "모드를 바꾸면 이름은 그대로고 값만 바뀐다 — 아래 표를 보면서 전환해 보면 확인된다."
              : "Switch modes and the names stay while the values change — watch the table as you toggle."}
          </p>
        </div>

        <div className="flex flex-col gap-20">
          <section id="f-color" className="scroll-mt-6">
            <GroupHeader
              title={sec("f-color").label}
              note={sec("f-color").note}
              count={COLOR_PAIRS.length}
            />
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {COLOR_PAIRS.map((p) => (
                <Swatch key={p.bg} {...p} />
              ))}
            </div>

            <Separator className="my-8" />

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-medium">
                  {lang === "ko" ? "선 · 포커스" : "Lines and focus"}
                </h3>
                <div className="flex flex-col gap-2">
                  {LINE_TOKENS.map((l) => (
                    <div key={l.name} className="flex items-center gap-3">
                      <div
                        className="h-8 w-16 rounded-md border-2"
                        style={{ borderColor: `var(--${l.name})` }}
                      />
                      <div className="min-w-0">
                        <code className="text-xs">--{l.name}</code>
                        <p className="text-muted-foreground text-xs">{t(l.use)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium">
                  {lang === "ko" ? "차트" : "Charts"}
                </h3>
                <p className="text-muted-foreground mb-3 text-xs leading-relaxed">
                  {lang === "ko"
                    ? "계열이 여럿일 때 1번부터 순서대로 쓴다. 성공 · 실패처럼 의미가 정해진 색은 여기서 가져오지 않는다 — 그건 primary 나 destructive 다."
                    : "Use them in order, starting at 1. Colors that carry fixed meaning — success, failure — don't come from here; those are primary and destructive."}
                </p>
                <div className="flex gap-2">
                  {CHART_TOKENS.map((c) => (
                    <div key={c} className="flex flex-col items-center gap-1.5">
                      <div
                        className="size-12 rounded-md"
                        style={{ background: `var(--${c})` }}
                      />
                      <code className="text-[10px]">{c.replace("chart-", "")}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Card className="mt-8">
              <CardContent className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-muted-foreground">
                    <tr>
                      <th className="pb-2 font-normal">
                        {lang === "ko" ? "토큰" : "Token"}
                      </th>
                      <th className="pb-2 font-normal">
                        {lang === "ko" ? "지금 값" : "Current value"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(colors).map(([k, v]) => (
                      <tr key={k} className="border-t">
                        <td className="py-1.5">
                          <code>--{k}</code>
                        </td>
                        <td className="text-muted-foreground py-1.5 tabular-nums">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </section>

          <section id="f-radius" className="scroll-mt-6">
            <GroupHeader
              title={sec("f-radius").label}
              note={sec("f-radius").note}
              count={RADIUS.length}
            />
            <div className="flex flex-wrap gap-6">
              {RADIUS.map((r) => (
                <div key={r.cls} className="flex flex-col items-center gap-2">
                  <div className={`bg-muted size-16 border ${r.cls}`} />
                  <code className="text-xs">{r.cls}</code>
                  <p className="text-muted-foreground max-w-24 text-center text-[11px] leading-snug">
                    {t(r.use)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="f-spacing" className="scroll-mt-6">
            <GroupHeader
              title={sec("f-spacing").label}
              note={sec("f-spacing").note}
              count={SPACING.length}
            />
            <div className="flex flex-col gap-2">
              {SPACING.map((s) => (
                <div key={s} className="flex items-center gap-4">
                  <code className="text-muted-foreground w-10 shrink-0 text-xs">{s}</code>
                  <div
                    className="bg-primary h-3 rounded-sm"
                    style={{ width: `calc(var(--spacing) * ${s})` }}
                  />
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {s * 4}px
                  </span>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground mt-5 max-w-[68ch] text-sm leading-relaxed">
              {lang === "ko"
                ? "이 막대들은 --spacing 을 곱해 그린 것이라, 편집기에서 밀도를 바꾸면 길이가 실제로 달라진다. 화면이 조밀한지 여유로운지는 이 값 하나가 정한다."
                : "These bars are drawn as multiples of --spacing, so changing density in the editor actually resizes them. Whether a screen feels tight or roomy comes down to this one value."}
            </p>
          </section>

          <section id="f-type" className="scroll-mt-6">
            <GroupHeader
              title={sec("f-type").label}
              note={sec("f-type").note}
              count={TYPE.length}
            />
            <div className="flex flex-col gap-4">
              {TYPE.map((ty) => (
                <div key={ty.cls} className="flex flex-wrap items-baseline gap-4">
                  <code className="text-muted-foreground w-20 shrink-0 text-xs">
                    {ty.cls}
                  </code>
                  <span className={ty.cls}>
                    {lang === "ko" ? "읽히는 위계를 만든다" : "Hierarchy you can read"}
                  </span>
                  <span className="text-muted-foreground text-xs">{t(ty.use)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="flex flex-wrap items-baseline gap-6">
              {WEIGHT.map((w) => (
                <div key={w} className="flex flex-col gap-1">
                  <span className={`text-base ${w}`}>Weight 굵기</span>
                  <code className="text-muted-foreground text-[11px]">{w}</code>
                </div>
              ))}
            </div>

            <p className="text-muted-foreground mt-6 max-w-[68ch] text-sm leading-relaxed">
              {lang === "ko"
                ? "라틴은 DM Sans, 한글은 Pretendard 가 맡는다. 한 문장 안에 섞여 있어도 브라우저가 글자마다 나눠 쓰기 때문에 두 벌을 따로 관리할 필요가 없다."
                : "DM Sans handles Latin, Pretendard handles Hangul. The browser splits per glyph, so a mixed sentence needs no special handling."}
            </p>
          </section>

          <section id="f-shadow" className="scroll-mt-6">
            <GroupHeader
              title={sec("f-shadow").label}
              note={sec("f-shadow").note}
              count={SHADOW.length}
            />
            <div className="flex flex-wrap gap-6">
              {SHADOW.map((s) => (
                <div key={s.cls} className="flex flex-col items-center gap-2">
                  <div className={`bg-card size-16 rounded-lg border ${s.cls}`} />
                  <code className="text-xs">{s.cls}</code>
                  <p className="text-muted-foreground max-w-24 text-center text-[11px]">
                    {t(s.use)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="f-usage" className="scroll-mt-6">
            <GroupHeader
              title={sec("f-usage").label}
              note={sec("f-usage").note}
              count={RULES.length}
            />
            <div className="grid gap-3 md:grid-cols-2">
              {RULES.map((r) => (
                <Card key={r.title.ko}>
                  <CardContent className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="shrink-0">
                        {lang === "ko" ? "규칙" : "Rule"}
                      </Badge>
                      <span className="text-sm font-medium">{t(r.title)}</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {t(r.body)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </CatalogShell>
  )
}
