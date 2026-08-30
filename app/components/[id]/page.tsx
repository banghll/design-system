/* 컴포넌트 상세 — 왼쪽 미리보기, 오른쪽 토큰 편집.
 *
 * 62개 전부 연다. 레시피가 코드에 아직 안 이어진 것도 페이지는 있고, 그 사실을
 * 배지와 문장으로 밝힌다 — «편집 가능» 이라고 해 놓고 안 움직이는 것보다,
 * «토큰만 있다» 고 적어 두는 편이 도구를 믿을 수 있게 한다.
 *
 * 정적 내보내기라 목록을 미리 대야 한다 — data/components.json 이 곧 목록이다. */
import { notFound } from "next/navigation"

import { CatalogShell } from "@/components/catalog-shell"
import { ComponentDetail } from "@/components/component-detail"
import { ComponentExampleFor } from "@/components/component-example-for"
import COMPONENTS from "@/data/components.json"
import { DOCS } from "@/lib/component-docs"

const RECIPES = COMPONENTS as Record<string, { $wired?: boolean }>
const IDS = Object.keys(RECIPES).filter((k) => !k.startsWith("$"))

export function generateStaticParams() {
  return IDS.map((id) => ({ id }))
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!IDS.includes(id)) notFound()
  const doc = DOCS[id]

  return (
    <CatalogShell>
      <ComponentDetail
        id={id}
        what={doc?.what ?? ""}
        when={doc?.when ?? ""}
        wired={RECIPES[id].$wired !== false}
        example={<ComponentExampleFor id={id} />}
      />
    </CatalogShell>
  )
}
