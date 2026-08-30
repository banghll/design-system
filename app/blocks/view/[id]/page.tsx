/* 공식 블록 상세.
 *
 * 정적 내보내기(공유용 빌드)에서는 모든 경로를 미리 알아야 한다.
 * 그래서 이 파일은 목록만 대고, 화면은 view.tsx 가 그린다. */
import { BLOCKS } from "@/lib/block-catalog"
import View from "./view"

export function generateStaticParams() {
  return BLOCKS.map((b) => ({ id: b.id }))
}

export default function Page() {
  return <View />
}
