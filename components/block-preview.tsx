/* 블록 인라인 미리보기.
 *
 * 블록은 화면 하나가 통째로 한 벌이라 카드 안에 그냥 넣으면 셸이 겹친다
 * (사이드바 블록은 자기 SidebarProvider 를 들고 온다). 그래서 실제 라우트를
 * iframe 으로 띄우고 축소해 보여준다 — ui.shadcn.com 의 블록 미리보기와 같은 방식이다.
 *
 * 덕분에 목록에서 들어가지 않고도 무엇인지 바로 보이고,
 * 미리보기가 곧 실물이라 블록을 고치면 목록도 같이 바뀐다. */
"use client"

import { ArrowUpRight, Maximize2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { useLang } from "@/components/lang"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/* 축소 배율 — 1440×900 짜리 화면을 카드 폭에 맞춰 접는다. */
const FRAME_W = 1440
const FRAME_H = 900

import type { BlockMeta } from "@/lib/block-catalog"

export function BlockPreview({
  block,
  scale = 0.34,
}: {
  block: BlockMeta
  scale?: number
}) {
  const { t, lang } = useLang()
  const holder = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  const [ready, setReady] = useState(false)

  /* 31개를 한 번에 띄우면 브라우저가 버티지 못한다.
   * 화면에 들어올 때가 되어서야 iframe 을 만든다. */
  useEffect(() => {
    const el = holder.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin: "600px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border">
      <div
        ref={holder}
        className="bg-muted/40 relative w-full overflow-hidden border-b"
        style={{ height: FRAME_H * scale }}
      >
        {show ? (
          <iframe
            src={`/blocks/${block.id}`}
            title={t(block.title)}
            loading="lazy"
            onLoad={() => setReady(true)}
            tabIndex={-1}
            className={cn(
              "pointer-events-none origin-top-left border-0 transition-opacity duration-300",
              ready ? "opacity-100" : "opacity-0"
            )}
            style={{
              width: FRAME_W,
              height: FRAME_H,
              transform: `scale(${scale})`,
            }}
          />
        ) : null}

        {!ready ? (
          <div className="absolute inset-0 flex flex-col gap-2 p-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="mt-2 flex-1 w-full" />
          </div>
        ) : null}

        {/* 축소된 화면은 글씨가 작아 눌러 볼 수 있게 한다. iframe 자체는 클릭을 먹지 않는다. */}
        <Link
          href={`/blocks/${block.id}`}
          className="focus-visible:ring-ring absolute inset-0 flex items-end justify-end p-3 opacity-0 transition-opacity outline-none group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2"
        >
          <span className="bg-background/90 flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs backdrop-blur">
            <Maximize2 className="size-3" />
            {lang === "ko" ? "원래 크기로" : "Full size"}
          </span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sm font-semibold">{t(block.title)}</h3>
          <code className="text-muted-foreground text-[11px]">{block.id}</code>
        </div>
        <p className="text-sm leading-relaxed">{t(block.what)}</p>
        <p className="text-muted-foreground text-[13px] leading-relaxed">
          <span className="text-foreground/80 font-medium">{lang === "ko" ? "언제 " : "When "}</span>
          {t(block.when)}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
          {block.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
          <Button asChild size="sm" variant="ghost" className="ml-auto h-7 px-2">
            <Link href={`/blocks/${block.id}`}>
              {lang === "ko" ? "열기" : "Open"}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
