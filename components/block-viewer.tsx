/* 블록 상세 — 카탈로그 안에서 본다.
 *
 * 블록을 새 창으로 띄우면 왼쪽 내비가 사라져 "카탈로그의 어디를 보고 있는지" 를
 * 잃는다. 목록으로 돌아가려면 뒤로가기밖에 없고, 다음 블록으로 넘어가려면
 * 목록까지 되돌아가야 한다. 그래서 셸을 두른 채로 띄운다.
 *
 * 브라우저 창을 꽉 채우지 않고 기기 틀 안에 넣는다. 블록은 "화면 한 벌" 이라
 * 어떤 크기의 화면을 전제로 만들어졌는지가 보여야 하는데, 꽉 채우면
 * 창 크기에 따라 매번 다르게 보여 비교가 안 된다. */
"use client"

import { ArrowLeft, ArrowUpRight, Monitor, Smartphone, Tablet } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { CatalogShell } from "@/components/catalog-shell"
import { type Copy, useLang } from "@/components/lang"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

/* 기기마다 실제 비율로 보여준다.
 *
 * 처음에는 셋 다 16:9 로 잡았는데 그건 태블릿과 모바일에 대해 거짓말이다.
 * 세로로 긴 기기를 가로 틀에 넣으면 "이 블록이 그 기기에서 어떻게 보이는가" 를
 * 볼 수 없다 — 확인하려던 것을 못 보게 된다.
 *
 * 데스크톱만 16:9 이고, 나머지는 실제 기기 해상도를 쓴다. */
const DEVICES = {
  desktop: { w: 1440, h: 810, ratio: "16:9" },
  /* iPad Pro 11" 세로 */
  tablet: { w: 834, h: 1194, ratio: "10:14" },
  /* iPhone 15 세로 */
  mobile: { w: 390, h: 844, ratio: "9:19.5" },
} as const

type Size = keyof typeof DEVICES

/* 무대의 최대 높이. 세로 기기는 원래 크기로 두면 화면 밖으로 나가
 * 스크롤하며 봐야 한다. 여기에 맞춰 줄여 한눈에 들어오게 한다. */
const STAGE_MAX_H = 760

const SIZE_META: { key: Size; Icon: typeof Monitor; ko: string; en: string }[] = [
  { key: "desktop", Icon: Monitor, ko: "데스크톱", en: "Desktop" },
  { key: "tablet", Icon: Tablet, ko: "태블릿", en: "Tablet" },
  { key: "mobile", Icon: Smartphone, ko: "모바일", en: "Mobile" },
]

export function BlockViewer({
  src,
  title,
  code,
  what,
  when,
  tags,
  backHref,
  backLabel,
  source,
}: {
  /** iframe 으로 띄울 실제 라우트 */
  src: string
  title: Copy | string
  /** 파일 경로나 id 같은 기계용 이름 */
  code: string
  what: Copy | string
  when: Copy | string
  tags?: string[]
  backHref: string
  backLabel: Copy
  /** 서드파티일 때만 — 출처와 라이선스 */
  source?: { label: string; url: string; license: string }
}) {
  const { t, lang } = useLang()
  const [size, setSize] = useState<Size>("desktop")
  const { w, h, ratio } = DEVICES[size]

  /* 기기 해상도 그대로 그린 뒤 무대에 맞춰 줄인다. 무대 폭을 재야 배율이 나오므로
   * 창 크기가 바뀔 때마다 다시 잰다 — 사이드바를 접거나 편집기를 열어도 맞는다. */
  const box = useRef<HTMLDivElement>(null)
  const [boxW, setBoxW] = useState(0)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setBoxW(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* 가로로도 세로로도 넘치지 않게 줄인다. 원래 크기보다 키우지는 않는다 —
   * 확대하면 없는 해상도를 지어내는 셈이다. */
  const scale = boxW ? Math.min(1, boxW / w, STAGE_MAX_H / h) : 1
  const stageH = Math.round(h * scale)

  return (
    <CatalogShell>
      <main className="mx-auto w-full max-w-[1200px] px-6 py-10 lg:px-10">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href={backHref}>
              <ArrowLeft className="size-4" />
              {t(backLabel)}
            </Link>
          </Button>
        </div>

        <header className="mb-8">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">{t(title)}</h1>
            <code className="text-muted-foreground text-xs">{code}</code>
          </div>
          <p className="mt-3 max-w-[68ch] leading-relaxed">{t(what)}</p>
          <p className="text-muted-foreground mt-1.5 max-w-[68ch] text-sm leading-relaxed">
            <span className="text-foreground/80 font-medium">
              {lang === "ko" ? "언제 " : "When "}
            </span>
            {t(when)}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
            {source ? (
              <Badge variant="outline" asChild className="font-normal">
                <a href={source.url} target="_blank" rel="noreferrer noopener">
                  {source.label} · {source.license}
                </a>
              </Badge>
            ) : null}
          </div>
        </header>

        <Separator className="mb-6" />

        {/* 폭 전환. 블록이 어느 크기에서 무너지는지가 고르는 기준이 된다. */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <ToggleGroup
            type="single"
            value={size}
            onValueChange={(v) => v && setSize(v as Size)}
            variant="outline"
          >
            {SIZE_META.map(({ key, Icon, ko, en }) => (
              <ToggleGroupItem key={key} value={key} aria-label={lang === "ko" ? ko : en}>
                <Icon className="size-4" />
                <span className="hidden sm:inline">{lang === "ko" ? ko : en}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <span className="text-muted-foreground text-xs tabular-nums">
            {w} × {h} · {ratio}
            {scale < 1 ? ` · ${Math.round(scale * 100)}%` : null}
          </span>

          <Button asChild variant="ghost" size="sm" className="ml-auto">
            <a href={src} target="_blank" rel="noreferrer noopener">
              {lang === "ko" ? "새 탭에서 열기" : "Open in a new tab"}
              <ArrowUpRight className="size-3.5" />
            </a>
          </Button>
        </div>

        {/* 무대는 폭을 다 쓰고, 기기 틀은 그 안에 실제 비율로 가운데 놓인다.
          * 세로 기기가 무대를 다 채우지 않는 건 정상이다 —
          * 그 기기가 실제로 그만큼 좁다는 사실을 그대로 보여 주는 것이다. */}
        <div
          ref={box}
          className="bg-muted/30 flex items-center justify-center overflow-hidden rounded-xl border p-4 transition-[height] duration-200"
          style={{ height: stageH + 32 }}
        >
          <div
            className="bg-background ring-border shrink-0 overflow-hidden rounded-md shadow-sm ring-1"
            style={{ width: Math.round(w * scale), height: stageH }}
          >
            <iframe
              key={`${src}-${size}`}
              src={src}
              title={t(title)}
              className="origin-top-left border-0"
              style={{
                width: w,
                height: h,
                transform: `scale(${scale})`,
              }}
            />
          </div>
        </div>

        <p className="text-muted-foreground mt-3 text-xs">
          {lang === "ko"
            ? "실제 라우트를 그대로 띄운 것입니다. 안에서 눌러 볼 수 있고, 블록 코드를 고치면 여기도 바로 바뀝니다."
            : "This is the real route. It's interactive, and editing the block updates this immediately."}
        </p>
      </main>
    </CatalogShell>
  )
}
