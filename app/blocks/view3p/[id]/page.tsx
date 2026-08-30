/* 서드파티 블록 상세. 공식 블록과 같은 뷰어를 쓰되 출처를 함께 보인다. */
"use client"

import { notFound, useParams } from "next/navigation"

import { BlockViewer } from "@/components/block-viewer"
import { SOURCES, THIRD_PARTY_BLOCKS } from "@/lib/third-party-catalog"

export default function ViewThirdPartyPage() {
  const { id } = useParams<{ id: string }>()
  const block = THIRD_PARTY_BLOCKS.find((b) => b.id === id)
  if (!block) notFound()

  return (
    <BlockViewer
      src={`/blocks/3p/${block.id}`}
      title={`${block.kind} · ${block.variant}`}
      code={`components/3p/${block.source}`}
      what={block.what}
      when={block.when}
      backHref="/blocks#third-party"
      backLabel={{ ko: "블록 목록", en: "All blocks" }}
      source={SOURCES[block.source]}
    />
  )
}
