/* slate-ui · surface: 디자인 시스템 인덱스 · focus: 토큰→컴포넌트 연결 고리 · states: n/a (정적 문서)
 * tokens: --color-background · --color-card · --color-border · --gap-* · --radius-*
 * spec: none · gates: 0 fail · self: C5 H4 S3 R4 D5 P3
 */
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

/* slate Semantic 색 토큰. Primitive(--color-blue-60 등)는 여기 올리지 않는다 —
   화면이 참조해도 되는 층만 보여주는 것이 이 페이지의 목적이다. */
const surfaceTokens = [
  "background",
  "background-alt",
  "card",
  "card-alt",
  "overlay",
]
const contentTokens = [
  "foreground-strong",
  "foreground",
  "muted-foreground",
  "foreground-disabled",
]
const lineTokens = ["border-strong", "border", "border-subtle", "border-faint"]
const actionTokens = ["primary", "primary-hover", "primary-active", "destructive"]
const statusTokens = ["success", "warning", "info", "destructive"]
const accentTokens = [
  "accent-blue",
  "accent-violet",
  "accent-cyan",
  "accent-lime",
  "accent-orange",
  "accent-pink",
]

const typeScale = [
  { cls: "text-display-3xl", label: "display-3xl" },
  { cls: "text-title-xl", label: "title-xl" },
  { cls: "text-title-lg", label: "title-lg" },
  { cls: "text-heading-md", label: "heading-md" },
  { cls: "text-body-base", label: "body-base" },
  { cls: "text-body-sm", label: "body-sm" },
  { cls: "text-caption-xs", label: "caption-xs" },
]

const gaps = [4, 8, 12, 16, 24, 40]
const radii = ["xs", "sm", "md", "lg", "xl", "2xl"]
const shadows = ["subtle", "raised", "floating", "overlay", "supreme"]

/* 왼쪽이 shadcn/ai-elements 가 참조하는 이름, 오른쪽이 실제 slate 토큰. */
const bridge: [string, string][] = [
  ["--background", "--color-background"],
  ["--card", "--color-card"],
  ["--popover", "--color-card-alt"],
  ["--primary", "--color-primary"],
  ["--secondary", "--color-fill"],
  ["--muted", "--color-fill-subtle"],
  ["--accent", "--color-fill"],
  ["--border / --input", "--color-border"],
  ["--ring", "--color-primary"],
  ["--radius", "--radius-md"],
]

function Swatch({ token }: { token: string }) {
  return (
    <div className="flex flex-col" style={{ gap: "var(--gap-6)" }}>
      <div
        className="w-full border"
        style={{
          background: `var(--color-${token})`,
          borderColor: "var(--color-border-subtle)",
          borderRadius: "var(--radius-sm)",
          aspectRatio: "16 / 5",
        }}
      />
      <code className="text-caption-2xs text-subtle">{token}</code>
    </div>
  )
}

function Section({
  n,
  title,
  note,
  children,
}: {
  n: string
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <section style={{ marginBottom: "var(--gap-44)" }}>
      <div
        className="flex items-baseline"
        style={{ gap: "var(--gap-8)", marginBottom: "var(--gap-4)" }}
      >
        <span className="text-caption-2xs text-subtle tabular-nums">
          {n}
        </span>
        <h2 className="text-heading-md">{title}</h2>
      </div>
      {note ? (
        <p
          className="text-body-sm text-subtle"
          style={{ marginBottom: "var(--gap-16)", maxWidth: "58ch" }}
        >
          {note}
        </p>
      ) : null}
      {children}
    </section>
  )
}

export default function Home() {
  return (
    <main
      className="mx-auto w-full"
      style={{
        maxWidth: "var(--layout-container-max)",
        padding: "var(--padding-24)",
        paddingTop: "var(--padding-48)",
        paddingBottom: "var(--padding-48)",
      }}
    >
      <header style={{ marginBottom: "var(--gap-44)" }}>
        <div
          className="flex flex-wrap items-center"
          style={{ gap: "var(--gap-8)", marginBottom: "var(--gap-16)" }}
        >
          <Badge variant="secondary">slate foundation</Badge>
          <Badge variant="outline">shadcn/ui</Badge>
          <Badge variant="outline">AI Elements</Badge>
        </div>
        <h1 className="text-display-3xl" style={{ marginBottom: "var(--gap-12)" }}>
          하나의 토큰, 두 개의 컴포넌트 라이브러리
        </h1>
        <p className="text-body-base text-subtle" style={{ maxWidth: "62ch" }}>
          이 레포에는 값이 하나도 없다. 색·간격·모서리·모션은 전부 slate
          파운데이션에서 오고, shadcn/ui 와 AI Elements 는 그 값을 참조하는
          껍데기다. 아래 화면의 모든 픽셀이 그 연결을 통과한 결과다.
        </p>
        <div
          className="flex flex-wrap"
          style={{ gap: "var(--gap-8)", marginTop: "var(--gap-24)" }}
        >
          <Button asChild>
            <Link href="/ai">AI Elements 데모</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/components">컴포넌트 전체 보기</Link>
          </Button>
        </div>
      </header>

      <Separator style={{ marginBottom: "var(--gap-44)" }} />

      <Section
        n="01"
        title="색 — Semantic 층만 쓴다"
        note="Primitive(--color-blue-60 같은 것)는 화면이 직접 참조하지 않는다. 아래 이름들만 쓴다."
      >
        <div className="flex flex-col" style={{ gap: "var(--gap-24)" }}>
          {[
            ["표면", surfaceTokens],
            ["글자", contentTokens],
            ["선", lineTokens],
            ["액션", actionTokens],
            ["상태", statusTokens],
            ["강조", accentTokens],
          ].map(([label, tokens]) => (
            <div key={label as string}>
              <div
                className="text-caption-xs text-subtle"
                style={{ marginBottom: "var(--gap-8)" }}
              >
                {label as string}
              </div>
              <div
                className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6"
                style={{ gap: "var(--gap-12)" }}
              >
                {(tokens as string[]).map((t) => (
                  <Swatch key={t} token={t} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        n="02"
        title="타이포 — 낱개 조합 금지"
        note="font-size 와 line-height 를 따로 고르지 않는다. 역할·단계로 된 클래스 하나를 쓴다."
      >
        <Card>
          <CardContent
            className="flex flex-col"
            style={{ gap: "var(--gap-16)", paddingTop: "var(--padding-20)" }}
          >
            {typeScale.map((t) => (
              <div
                key={t.cls}
                className="flex flex-wrap items-baseline"
                style={{ gap: "var(--gap-16)" }}
              >
                <code
                  className="text-caption-2xs text-subtle shrink-0"
                  style={{ width: "11ch" }}
                >
                  .{t.label}
                </code>
                <span className={t.cls}>다크 위에서 읽히는 위계</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </Section>

      <Section
        n="03"
        title="간격 · 모서리 · 그림자"
        note="이름의 숫자가 곧 px 다. --gap-40 은 40px 이고, 인덱스가 아니다."
      >
        <div className="grid lg:grid-cols-3" style={{ gap: "var(--gap-16)" }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-body-sm">gap</CardTitle>
            </CardHeader>
            <CardContent
              className="flex flex-col"
              style={{ gap: "var(--gap-8)" }}
            >
              {gaps.map((g) => (
                <div
                  key={g}
                  className="flex items-center"
                  style={{ gap: "var(--gap-12)" }}
                >
                  <code
                    className="text-caption-2xs text-subtle shrink-0"
                    style={{ width: "8ch" }}
                  >
                    gap-{g}
                  </code>
                  <div
                    style={{
                      width: `var(--gap-${g})`,
                      height: "var(--gap-4)",
                      background: "var(--color-primary)",
                      borderRadius: "var(--radius-xs)",
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-body-sm">radius</CardTitle>
            </CardHeader>
            <CardContent
              className="flex flex-wrap"
              style={{ gap: "var(--gap-12)" }}
            >
              {radii.map((r) => (
                <div key={r} className="text-center">
                  <div
                    className="aspect-square border"
                    style={{
                      width: "var(--component-height-md)",
                      borderRadius: `var(--radius-${r})`,
                      background: "var(--color-fill)",
                      borderColor: "var(--color-border)",
                    }}
                  />
                  <code
                    className="text-caption-3xs text-subtle"
                    style={{ display: "block", marginTop: "var(--gap-4)" }}
                  >
                    {r}
                  </code>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-body-sm">elevation</CardTitle>
            </CardHeader>
            <CardContent
              className="flex flex-col"
              style={{ gap: "var(--gap-12)" }}
            >
              {shadows.map((s) => (
                <div
                  key={s}
                  className="flex items-center justify-between"
                  style={{
                    padding: "var(--padding-10)",
                    background: "var(--color-card-alt)",
                    borderRadius: "var(--radius-sm)",
          aspectRatio: "16 / 5",
                    boxShadow: `var(--shadow-${s})`,
                  }}
                >
                  <code className="text-caption-2xs text-subtle">
                    {s}
                  </code>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        n="04"
        title="브리지 — 두 시스템이 만나는 단 하나의 지점"
        note="shadcn 과 AI Elements 는 왼쪽 이름만 안다. 오른쪽이 실제 값의 출처다. app/globals.css 에 이 표가 그대로 들어 있다."
      >
        <Card>
          <CardContent style={{ paddingTop: "var(--padding-20)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-caption-2xs text-subtle">
                    <th style={{ paddingBottom: "var(--padding-8)" }}>
                      컴포넌트가 부르는 이름
                    </th>
                    <th style={{ paddingBottom: "var(--padding-8)" }}>
                      slate 토큰
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bridge.map(([left, right]) => (
                    <tr
                      key={left}
                      className="border-t"
                      style={{ borderColor: "var(--color-border-faint)" }}
                    >
                      <td style={{ padding: "var(--padding-8) 0" }}>
                        <code className="text-caption-xs">{left}</code>
                      </td>
                      <td style={{ padding: "var(--padding-8) 0" }}>
                        <code
                          className="text-caption-xs"
                          style={{ color: "var(--color-accent-blue)" }}
                        >
                          {right}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section
        n="05"
        title="확인 — 컴포넌트는 정말 토큰만 보고 있나"
        note="아래 요소들은 slate 토큰을 한 줄도 직접 쓰지 않는다. shadcn 기본 코드 그대로인데 slate 처럼 보인다면 브리지가 작동하는 것이다."
      >
        <Card>
          <CardContent
            className="flex flex-wrap items-center"
            style={{ gap: "var(--gap-12)", paddingTop: "var(--padding-20)" }}
          >
            <Button>기본</Button>
            <Button variant="secondary">보조</Button>
            <Button variant="outline">외곽선</Button>
            <Button variant="ghost">고스트</Button>
            <Button variant="destructive">삭제</Button>
            <Button disabled>비활성</Button>
            <Separator orientation="vertical" style={{ height: "var(--component-height-sm)" }} />
            <Input placeholder="입력" className="flex-1" style={{ minWidth: "16ch" }} />
            <Switch />
          </CardContent>
        </Card>
      </Section>
    </main>
  )
}
