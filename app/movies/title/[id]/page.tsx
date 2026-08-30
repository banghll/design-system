/* 작품 상세.
 *
 * 정적 내보내기(공유용 빌드)에서는 모든 경로를 미리 알아야 한다.
 * 그래서 이 파일은 목록만 대고, 화면은 view.tsx 가 그린다. */
import { MOVIES } from "@/lib/movies/data"
import View from "./view"

export function generateStaticParams() {
  return MOVIES.map((m) => ({ id: m.id }))
}

export default function Page() {
  return <View />
}
