/* 서드파티 블록 한 장. 블록 목록이 이 라우트를 iframe 으로 축소해 띄운다.
 * 라우트를 185개 만들지 않고 지도에서 찾아 그린다. */
import { notFound } from "next/navigation"

import { THIRD_PARTY, THIRD_PARTY_IDS } from "@/components/3p/_registry"

export function generateStaticParams() {
  return THIRD_PARTY_IDS.map((id) => ({ id }))
}

export default async function ThirdPartyBlockPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const Block = THIRD_PARTY[id]
  if (!Block) notFound()
  return <Block />
}
