/* 원본(shadcn create)은 아이콘 라이브러리 5종을 URL 파라미터로 바꿔가며 지연 로딩한다.
 * 이 레포는 lucide 하나만 쓰므로 같은 자리에 사각 자리표시자를 그린다. props 는 그대로 통과. */
import { SquareIcon } from "lucide-react"

export function IconPlaceholder(props: React.ComponentProps<"svg">) {
  return <SquareIcon {...props} />
}
