/* 측정 전용 화면. 사람이 볼 자리가 아니다 —
 * scripts/gen-figma-spec.mjs 가 헤드리스 크롬으로 열어 계산된 값을 읽어 간다.
 *
 * 카탈로그 셸을 두르지 않는다. 셸의 폰트·색이 섞이면 그것까지 측정되고,
 * Figma 로 그 값이 따라간다. */
import { notFound } from "next/navigation"

import { ExportHarness } from "@/components/export-harness"
import { EXPORTABLE } from "@/lib/exportable"

export function generateStaticParams() {
  return EXPORTABLE.map((id) => ({ id }))
}

export default async function ExportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!(EXPORTABLE as readonly string[]).includes(id)) notFound()
  return <ExportHarness id={id} />
}
