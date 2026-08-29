"use client"

/* slate-ui · surface: 디자인 시스템 인덱스 · focus: 토큰→컴포넌트 연결 고리 · states: n/a (정적 문서)
 * tokens: --color-* · .text-* (파운데이션은 색·타이포만 준다)
 * spec: none · gates: 0 fail · self: C5 H4 S3 R4 D5 P3
 */
import Link from "next/link"

import { CatalogShell } from "@/components/catalog-shell"

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
  ["--radius", "10px (slate 밖)"],
]

function Swatch({ token }: { token: string }) {
  return (
    <div className="flex flex-col" style={{ gap: "6px" }}>
      <div
        className="w-full border"
        style={{
          background: `var(--color-${token})`,
          borderColor: "var(--color-border-subtle)",
          borderRadius: "8px",
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
    <section style={{ marginBottom: "44px" }}>
      <div
        className="flex items-baseline"
        style={{ gap: "8px", marginBottom: "4px" }}
      >
        <span className="text-caption-2xs text-subtle tabular-nums">
          {n}
        </span>
        <h2 className="text-heading-md">{title}</h2>
      </div>
      {note ? (
        <p
          className="text-body-sm text-subtle"
          style={{ marginBottom: "16px", maxWidth: "58ch" }}
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
    <CatalogShell>
    <main
      className="mx-auto w-full"
      style={{
        maxWidth: "1200px",
        padding: "24px",
        paddingTop: "48px",
        paddingBottom: "48px",
      }}
    >
      <header style={{ marginBottom: "44px" }}>
        <div
          className="flex flex-wrap items-center"
          style={{ gap: "8px", marginBottom: "16px" }}
        >
          <Badge variant="secondary">slate foundation</Badge>
          <Badge variant="outline">shadcn/ui</Badge>
          <Badge variant="outline">AI Elements</Badge>
        </div>
        <h1 className="text-display-3xl" style={{ marginBottom: "12px" }}>
          색과 타이포만 물려받는다
        </h1>
        <p className="text-body-base text-subtle" style={{ maxWidth: "62ch" }}>
          slate 파운데이션은 색과 타이포만 준다. 간격·모서리·모션은 shadcn 이
          원래 쓰던 스케일이 그대로 맡는다. 브랜드는 slate 가, 시스템은
          shadcn 이 — 두 층이 겹치지 않게 갈랐다.
        </p>
        <div
          className="flex flex-wrap"
          style={{ gap: "8px", marginTop: "24px" }}
        >
          <Button asChild>
            <Link href="/chat">AI 채팅 앱</Link>
          </Button>
          <Button asChild>
            <Link href="/movies">영화 평점</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/kit">컴포넌트 갤러리</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/blocks">블록</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/patterns">패턴</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/examples">공식 예제</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/ai">AI Elements 데모</Link>
          </Button>
        </div>
      </header>

      <Separator style={{ marginBottom: "44px" }} />

      <Section
        n="01"
        title="색 — Semantic 층만 쓴다"
        note="Primitive(--color-blue-60 같은 것)는 화면이 직접 참조하지 않는다. 아래 이름들만 쓴다."
      >
        <div className="flex flex-col" style={{ gap: "24px" }}>
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
                style={{ marginBottom: "8px" }}
              >
                {label as string}
              </div>
              <div
                className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6"
                style={{ gap: "12px" }}
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
            style={{ gap: "16px", paddingTop: "20px" }}
          >
            {typeScale.map((t) => (
              <div
                key={t.cls}
                className="flex flex-wrap items-baseline"
                style={{ gap: "16px" }}
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
        title="브리지 — 두 시스템이 만나는 단 하나의 지점"
        note="shadcn 과 AI Elements 는 왼쪽 이름만 안다. 오른쪽이 실제 값의 출처다. app/globals.css 에 이 표가 그대로 들어 있다."
      >
        <Card>
          <CardContent style={{ paddingTop: "20px" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-caption-2xs text-subtle">
                    <th style={{ paddingBottom: "8px" }}>
                      컴포넌트가 부르는 이름
                    </th>
                    <th style={{ paddingBottom: "8px" }}>
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
                      <td style={{ padding: "8px 0" }}>
                        <code className="text-caption-xs">{left}</code>
                      </td>
                      <td style={{ padding: "8px 0" }}>
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
        n="04"
        title="확인 — 컴포넌트는 정말 토큰만 보고 있나"
        note="아래 요소들은 slate 토큰을 한 줄도 직접 쓰지 않는다. shadcn 기본 코드 그대로인데 slate 처럼 보인다면 브리지가 작동하는 것이다."
      >
        <Card>
          <CardContent
            className="flex flex-wrap items-center"
            style={{ gap: "12px", paddingTop: "20px" }}
          >
            <Button>기본</Button>
            <Button variant="secondary">보조</Button>
            <Button variant="outline">외곽선</Button>
            <Button variant="ghost">고스트</Button>
            <Button variant="destructive">삭제</Button>
            <Button disabled>비활성</Button>
            <Separator orientation="vertical" style={{ height: "32px" }} />
            <Input placeholder="입력" className="flex-1" style={{ minWidth: "16ch" }} />
            <Switch />
          </CardContent>
        </Card>
      </Section>
    </main>
    </CatalogShell>
  )
}
