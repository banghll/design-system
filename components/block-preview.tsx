/* 블록 인라인 미리보기.
 *
 * 블록은 화면 하나가 통째로 한 벌이라 카드 안에 그냥 넣으면 셸이 겹친다
 * (사이드바 블록은 자기 SidebarProvider 를 들고 온다). 그래서 실제 라우트를
 * 통째로 보여주되, 그림은 BlockThumb 이 맡는다 — 미리 찍어 둔 이미지가 있으면
 * 그것을, 없으면 iframe 을.
 *
 * 덕분에 목록에서 들어가지 않고도 무엇인지 바로 보인다. */
"use client"

import { ArrowUpRight, Maximize2 } from "lucide-react"
import Link from "next/link"

import { SelectBox } from "@/components/block-curator"
import { BlockThumb } from "@/components/block-thumb"
import { useLang } from "@/components/lang"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* 축소 배율 — 1440×900 짜리 화면을 카드 폭에 맞춰 접는다. */
import type { BlockMeta } from "@/lib/block-catalog"

export function BlockPreview({
  block,
  scale = 0.34,
}: {
  block: BlockMeta
  scale?: number
}) {
  const { t, lang } = useLang()

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border">
      <SelectBox id={block.id} />
      <div className="relative">
        <BlockThumb
          id={block.id}
          src={`/blocks/${block.id}`}
          title={t(block.title)}
          scale={scale}
        />

        {/* 그림은 눌러 볼 수 없으므로 전체를 링크로 덮는다. */}
        <Link
          href={`/blocks/view/${block.id}`}
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
            <Link href={`/blocks/view/${block.id}`}>
              {lang === "ko" ? "열기" : "Open"}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
