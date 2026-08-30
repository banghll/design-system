/* 서드파티 블록 미리보기.
 *
 * 공식 블록과 같은 방식이다 — 실제 라우트를 iframe 으로 축소해 띄운다.
 * 다른 점은 출처를 반드시 함께 보인다는 것. 남의 코드를 우리 시스템 안에
 * 들여놓을 때, 어디서 왔고 무슨 라이선스인지가 코드에서 떨어지면 안 된다. */
"use client"

import { ArrowUpRight, Maximize2 } from "lucide-react"
import Link from "next/link"

import { SelectBox } from "@/components/block-curator"
import { BlockThumb } from "@/components/block-thumb"
import { useLang } from "@/components/lang"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SOURCES, type ThirdPartyBlock } from "@/lib/third-party-catalog"
import { cn } from "@/lib/utils"

export function ThirdPartyPreview({
  block,
  scale = 0.34,
}: {
  block: ThirdPartyBlock
  scale?: number
}) {
  const { t, lang } = useLang()

  const href = `/blocks/view3p/${block.id}`
  /* iframe 은 실제 라우트를 띄운다. 뷰어를 뷰어 안에 넣을 수는 없다. */
  const raw = `/blocks/3p/${block.id}`
  const src = SOURCES[block.source]

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border">
      <SelectBox id={block.id} />
      <div className="relative">
        <BlockThumb id={block.id} src={raw} title={block.variant} scale={scale} />

        <Link
          href={href}
          className="focus-visible:ring-ring absolute inset-0 flex items-end justify-end p-3 opacity-0 transition-opacity outline-none group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2"
        >
          <span className="bg-background/90 flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs backdrop-blur">
            <Maximize2 className="size-3" />
            {lang === "ko" ? "원래 크기로" : "Full size"}
          </span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="text-sm font-semibold">{block.kind}</h3>
          <code className="text-muted-foreground text-[11px]">{block.variant}</code>
        </div>
        <p className="text-sm leading-relaxed">{t(block.what)}</p>
        <p className="text-muted-foreground text-[13px] leading-relaxed">
          <span className="text-foreground/80 font-medium">
            {lang === "ko" ? "언제 " : "When "}
          </span>
          {t(block.when)}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
          <Badge variant="outline" asChild className="font-normal">
            <a href={src.url} target="_blank" rel="noreferrer noopener">
              {src.label} · {src.license}
            </a>
          </Badge>
          <Button asChild size="sm" variant="ghost" className="ml-auto h-7 px-2">
            <Link href={href}>
              {lang === "ko" ? "열기" : "Open"}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
