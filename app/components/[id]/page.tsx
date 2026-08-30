/* 컴포넌트 상세 — 왼쪽 미리보기, 오른쪽 토큰 편집.
 *
 * 파일럿(button · input · card)만 연다. 나머지 58개는 레시피가 없어
 * 편집할 것이 없고, 빈 패널만 있는 페이지를 60장 만들면 «편집 가능» 이
 * 무슨 뜻인지 알 수 없게 된다.
 *
 * 정적 내보내기라 목록을 미리 대야 한다 — data/components.json 이 곧 목록이다. */
import { notFound } from "next/navigation"

import { CatalogShell } from "@/components/catalog-shell"
import { ComponentDetail } from "@/components/component-detail"
import COMPONENTS from "@/data/components.json"
import { DOCS } from "@/lib/component-docs"

const IDS = Object.keys(COMPONENTS).filter((k) => !k.startsWith("$"))

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
      <ComponentDetail id={id} what={doc?.what ?? ""} when={doc?.when ?? ""} />
    </CatalogShell>
  )
}
