/* 공식 블록 상세. 셸을 두른 채 16:9 로 띄운다. */
"use client"

import { notFound, useParams } from "next/navigation"

import { BlockViewer } from "@/components/block-viewer"
import { BLOCKS } from "@/lib/block-catalog"

export default function ViewBlockPage() {
  const { id } = useParams<{ id: string }>()
  const block = BLOCKS.find((b) => b.id === id)
  if (!block) notFound()

  return (
    <BlockViewer
      src={`/blocks/${block.id}`}
      title={block.title}
      code={`app/blocks/${block.id}`}
      what={block.what}
      when={block.when}
      tags={block.tags}
      backHref="/blocks"
      backLabel={{ ko: "블록 목록", en: "All blocks" }}
    />
  )
}
