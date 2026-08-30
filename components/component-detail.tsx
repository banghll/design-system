"use client"

/* 컴포넌트 한 개의 상세 — 왼쪽은 모든 variant × 상태, 오른쪽은 그 컴포넌트의 토큰.
 *
 * 왜 상태까지 다 깔아 두는가 — 토큰 하나를 바꿨을 때 깨지는 자리는 대개
 * 기본 상태가 아니다. 비활성일 때 여백이 어색해지거나, 아이콘만 있는 버튼이
 * 정사각형이 아니게 되는 식이다. 편집 화면에서 그게 같이 보여야 판정이 된다. */

import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, Loader2, Search, TriangleAlert } from "lucide-react"

import { CatalogMain } from "@/components/catalog-shell"
import { ComponentEditor } from "@/components/component-editor"
import { useLang } from "@/components/lang"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const SIZES = ["xs", "sm", "default", "lg"] as const
const VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const

/* 실제 화면에서 컨트롤이 서는 두 가지 폭.
 *
 *   hug     내용만큼. 도구 줄·표 안처럼 옆에 다른 것이 있는 자리
 *   filled  칸을 꽉 채움. 폼의 주 버튼, 모바일 하단처럼 혼자 한 줄을 쓰는 자리
 *
 * 갤러리에 hug 만 깔아 두면 «폭이 정해진 자리에서 어떻게 보이는가» 를 못 본다.
 * 360 은 모바일 한 칸의 실제 폭이라 그 기준으로 둔다. */
function WidthCase({
  children,
  note,
}: {
  children: React.ReactNode
  note: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="w-[360px] max-w-full rounded-lg border border-dashed p-3">
        {children}
      </div>
      <span className="text-muted-foreground text-[11px]">{note}</span>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-muted-foreground text-[11px] font-medium">{label}</div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

function ButtonPreview() {
  return (
    <div className="flex flex-col gap-6">
      {VARIANTS.map((v) => (
        <Row key={v} label={v}>
          {SIZES.map((s) => (
            <Button key={s} variant={v} size={s}>
              {s}
            </Button>
          ))}
        </Row>
      ))}
      <Separator />
      <Row label="상태 · states">
        <Button>기본</Button>
        <Button disabled>비활성</Button>
        <Button aria-invalid>오류</Button>
        <Button>
          <Loader2 className="animate-spin" />
          진행 중
        </Button>
        <Button size="icon" aria-label="검색">
          <Search />
        </Button>
      </Row>

      <Separator />

      {/* 아이콘이 붙은 버튼. 글자와 아이콘 사이는 크기마다 다른 숫자가 아니라
        * --button-gap 하나에서 온다 — 크기를 바꿨다고 간격이 제멋대로 달라질
        * 이유가 없다. 앞·뒤·양쪽을 함께 깔아 두면 어긋난 자리가 바로 보인다. */}
      <Row label="아이콘 + 글 · 간격은 --button-gap 하나">
        {SIZES.map((s) => (
          <Button key={s} size={s} variant="outline">
            <Check />
            {s}
          </Button>
        ))}
      </Row>
      <Row label="아이콘 자리 · leading · trailing · both">
        <Button variant="outline">
          <Check />
          앞에
        </Button>
        <Button variant="outline">
          뒤에
          <ArrowRight />
        </Button>
        <Button variant="outline">
          <Check />
          양쪽
          <ArrowRight />
        </Button>
        <Button variant="outline" size="icon" aria-label="검색">
          <Search />
        </Button>
      </Row>

      <Separator />

      {/* 폭이 정해진 자리 — 실제로는 이렇게 쓰는 일이 더 많다 */}
      <div className="text-muted-foreground text-[11px] font-medium">
        폭 · hug 와 filled
      </div>
      <div className="flex flex-wrap gap-5">
        <WidthCase note="hug — 도구 줄·표 안. 옆에 다른 것이 있는 자리">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline">취소</Button>
            <Button>저장</Button>
          </div>
        </WidthCase>

        <WidthCase note="filled 360 — 폼의 주 버튼. 혼자 한 줄을 쓰는 자리">
          <Button className="w-full">
            <Check />
            결제하기
          </Button>
        </WidthCase>

        <WidthCase note="filled 360 — 둘이 한 줄을 나눠 쓸 때">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              나중에
            </Button>
            <Button className="flex-1">계속</Button>
          </div>
        </WidthCase>

        <WidthCase note="filled 360 — 세로로 쌓을 때. 모바일 하단">
          <div className="flex flex-col gap-2">
            <Button size="lg" className="w-full">
              시작하기
            </Button>
            <Button size="lg" variant="ghost" className="w-full">
              건너뛰기
            </Button>
          </div>
        </WidthCase>
      </div>
    </div>
  )
}

function InputPreview() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="크기 · sizes">
        {(["xs", "sm", "default", "lg"] as const).map((s) => (
          <Input key={s} size={s} placeholder={s} className="w-40" />
        ))}
      </Row>
      <Separator />
      <Row label="상태 · states">
        <Input placeholder="비어 있음" className="w-44" />
        <Input defaultValue="값이 있음" className="w-44" />
        <Input placeholder="비활성" disabled className="w-44" />
        <Input defaultValue="틀린 값" aria-invalid className="w-44" />
      </Row>
      <Separator />

      <div className="text-muted-foreground text-[11px] font-medium">
        폭 · hug 와 filled
      </div>
      <div className="flex flex-wrap gap-5">
        <WidthCase note="hug — 도구 줄. 옆의 버튼과 높이가 맞아야 한다">
          <div className="flex items-center gap-2">
            <Input placeholder="검색어" className="w-40" />
            <Button>찾기</Button>
          </div>
        </WidthCase>

        <WidthCase note="filled 360 — 폼 한 줄. 입력이 칸을 다 쓴다">
          <Field>
            <FieldLabel htmlFor="cd-email">이메일</FieldLabel>
            <Input id="cd-email" placeholder="you@nation-a.com" />
            <FieldDescription>라벨·설명과 함께 놓였을 때</FieldDescription>
          </Field>
        </WidthCase>

        <WidthCase note="filled 360 — 입력 + 버튼이 한 줄을 나눠 쓸 때">
          <div className="flex gap-2">
            <Input placeholder="이메일" className="min-w-0 flex-1" />
            <Button>구독</Button>
          </div>
        </WidthCase>
      </div>
    </div>
  )
}

function CardPreview() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="기본 · default">
        <Card className="w-72">
          <CardHeader>
            <CardTitle>월간 리포트</CardTitle>
            <CardDescription>8월 · 지난달 대비 +12%</CardDescription>
            <CardAction>
              <Button size="sm" variant="ghost">
                열기
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              카드 안쪽 여백과 요소 사이 간격은 같은 토큰에서 온다. 하나를 바꾸면
              둘이 함께 움직인다.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">내려받기</Button>
          </CardFooter>
        </Card>
      </Row>
      <Separator />
      <Row label="작게 · sm">
        <Card size="sm" className="w-64">
          <CardHeader>
            <CardTitle>작은 카드</CardTitle>
            <CardDescription>목록 안에 여러 장 놓일 때</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">여백만 한 단 줄어든다.</p>
          </CardContent>
        </Card>
      </Row>
      <Separator />

      <div className="text-muted-foreground text-[11px] font-medium">
        폭 · hug 와 filled
      </div>
      <div className="flex flex-wrap gap-5">
        <WidthCase note="filled 360 — 카드가 칸을 다 쓸 때. 목록·모바일의 기본">
          <Card>
            <CardHeader>
              <CardTitle>알림 받기</CardTitle>
              <CardDescription>새 청구서가 오면 알려 드립니다</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input placeholder="이메일" className="min-w-0 flex-1" />
              <Button>구독</Button>
            </CardContent>
          </Card>
        </WidthCase>

        <WidthCase note="filled 360 — 카드 안의 주 버튼도 칸을 다 쓴다">
          <Card size="sm">
            <CardHeader>
              <CardTitle>월간 요금제</CardTitle>
              <CardDescription>언제든 해지할 수 있습니다</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full">시작하기</Button>
            </CardFooter>
          </Card>
        </WidthCase>
      </div>
    </div>
  )
}

const PREVIEW: Record<string, () => React.ReactElement> = {
  button: ButtonPreview,
  input: InputPreview,
  card: CardPreview,
}

export function ComponentDetail({
  id,
  what,
  when,
  wired = true,
  example,
}: {
  id: string
  what: string
  when: string
  /** 레시피가 실제 컴포넌트 코드에 연결돼 있는가 */
  wired?: boolean
  /** 공식 예제 — 파일럿 밖 컴포넌트는 이걸 미리보기로 쓴다 */
  example?: React.ReactNode
}) {
  const { lang } = useLang()
  const Preview = PREVIEW[id]

  return (
    <CatalogMain>
      <Link
        href="/components"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-4" />
        {lang === "ko" ? "컴포넌트 목록" : "All components"}
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-5xl leading-tight font-semibold tracking-tight">
          {id}
        </h1>
        {wired ? (
          <Badge variant="secondary">{lang === "ko" ? "편집 가능" : "Editable"}</Badge>
        ) : (
          <Badge variant="outline">
            {lang === "ko" ? "토큰만 · 코드 미연결" : "Tokens only"}
          </Badge>
        )}
        <code className="text-muted-foreground text-xs">
          components/ui/{id}.tsx
        </code>
      </div>
      <div className="text-muted-foreground max-w-[72ch] text-base leading-relaxed">
        <p className="text-foreground">{what}</p>
        <p className="mt-2">{when}</p>
      </div>

      <Separator className="mt-10 mb-14" />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* data-token-scope — 편집 중인 값은 여기에만 얹힌다. 저장하면 :root 로 올라가
          * 전 화면에 반영된다. 이게 없으면 색 한 칸 밀 때마다 문서 전체가 다시 그려진다. */}
        <section data-token-scope>
          <h2 className="mb-5 text-sm font-semibold">
            {lang === "ko" ? "모든 변형과 상태" : "Every variant and state"}
          </h2>
          {Preview ? (
            <Preview />
          ) : example ? (
            example
          ) : (
            <p className="text-muted-foreground text-sm">
              {lang === "ko" ? "미리보기가 아직 없습니다." : "No preview yet."}
            </p>
          )}
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="bg-card rounded-xl border p-5">
            <ComponentEditor component={id} />
          </div>

          {/* 이어져 있지 않다는 사실을 숨기지 않는다. 값을 바꿔도 화면이 안 바뀌면
            * 사람은 도구를 의심하는 게 아니라 자기가 잘못한 줄 안다. */}
          {!wired ? (
            <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
              {lang === "ko"
                ? "이 컴포넌트는 토큰 이름만 있고 아직 코드가 그 이름을 쓰지 않습니다. 값을 바꿔도 미리보기는 그대로입니다 — scripts/wire-tokens.mjs 에 연결을 한 줄 적으면 살아납니다."
                : "This component has token names but its code does not use them yet. Changing a value will not move the preview — add one line to scripts/wire-tokens.mjs."}
            </p>
          ) : null}

          <div className="text-muted-foreground mt-4 flex items-start gap-2 text-xs leading-relaxed">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
            <span>
              {lang === "ko" ? (
                <>
                  전역 밀도 · 색은 여기서 못 바꿉니다. 그건{" "}
                  <Link href="/" className="underline">
                    파운데이션
                  </Link>{" "}
                  층입니다.
                </>
              ) : (
                <>
                  Global density and color live one layer down, in{" "}
                  <Link href="/" className="underline">
                    Foundation
                  </Link>
                  .
                </>
              )}
            </span>
          </div>
        </aside>
      </div>
    </CatalogMain>
  )
}
