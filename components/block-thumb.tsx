/* 블록 미리보기의 그림.
 *
 * 목록에서는 미리 찍어 둔 이미지를 쓴다. iframe 을 카드마다 두면 카드 하나가
 * Next 앱 하나라, 210장을 훑으면 앱 210개가 살아 있게 된다. 미리보기는 어차피
 * 축소돼 있어 눌러 볼 수 없었으니 이미지로 바꿔도 잃는 것이 없고,
 * 진짜가 필요한 상세 화면에서는 그대로 iframe 을 띄운다.
 *
 * 언제 불러올지는 브라우저에 맡긴다(loading="lazy"). 처음에는
 * IntersectionObserver 로 직접 재려 했는데, 그건 스크롤을 우리가 다시 구현하는
 * 일이고 관찰자가 안 도는 상황(백그라운드 탭 등)에서는 아무것도 안 나온다.
 * 브라우저가 이미 하는 일을 다시 만들 이유가 없다.
 *
 * 이미지가 아직 없는 블록은 예전처럼 iframe 으로 떨어진다 — 새로 넣은 블록이
 * 빈 칸으로 보이는 것보다는 느린 편이 낫다.
 * 이미지를 만들려면:  node scripts/shoot-blocks.mjs */
"use client"

import Image from "next/image"
import { useState } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import thumbs from "@/data/thumbs.json"
import { cn } from "@/lib/utils"

const HAVE = new Set<string>(thumbs.ids)

/* iframe 으로 떨어질 때 렌더할 폭. 이미지와 같은 화면을 보여야 한다. */
const FRAME_W = 1440
const FRAME_H = 900

export function BlockThumb({
  id,
  src,
  title,
  scale = 0.34,
}: {
  /** 썸네일 파일 이름이자 블록 id */
  id: string
  /** 이미지가 없을 때 띄울 실제 라우트 */
  src: string
  title: string
  scale?: number
}) {
  const [ready, setReady] = useState(false)
  const hasThumb = HAVE.has(id)

  return (
    <div
      className="bg-muted/40 relative w-full overflow-hidden border-b"
      style={{ height: FRAME_H * scale }}
    >
      {hasThumb ? (
        <Image
          src={`/thumbs/${id}.webp`}
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 520px"
          onLoad={() => setReady(true)}
          className={cn(
            "object-cover object-top transition-opacity duration-300",
            ready ? "opacity-100" : "opacity-0"
          )}
        />
      ) : (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          onLoad={() => setReady(true)}
          tabIndex={-1}
          className={cn(
            "pointer-events-none origin-top-left border-0 transition-opacity duration-300",
            ready ? "opacity-100" : "opacity-0"
          )}
          style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})` }}
        />
      )}

      {!ready ? (
        <div className="absolute inset-0 flex flex-col gap-2 p-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="mt-2 w-full flex-1" />
        </div>
      ) : null}
    </div>
  )
}

/** 이미지가 준비된 블록 수. 목록이 안내 문구를 띄울 때 쓴다. */
export const THUMB_COUNT = HAVE.size
