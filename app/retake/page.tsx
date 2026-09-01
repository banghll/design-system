/* 리테이크 — 랜딩부터 홈까지의 첫 사용 흐름.
 *
 * 연출과 흐름은 색인에 없어서 components/_draft/retake 에 있다.
 * 방향은 화면 → _draft 다(그 폴더 README). 두 화면에서 더 필요해지면
 * components/ui 로 올린다. */
import { RetakeFlow } from "@/components/_draft/retake/flow"

export default function RetakePage() {
  return <RetakeFlow />
}
