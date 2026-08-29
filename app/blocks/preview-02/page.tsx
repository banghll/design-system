/* preview-02 — ui.shadcn.com/create 미리보기. 레포(MIT)에서 직접 받아옴.
 * 원본 사이트의 CSS 두 가지를 여기서 보정한다:
 *  - content-visibility:auto — 화면 밖 열을 접는다. 갤러리에서는 전부 보여야 한다.
 *  - 카드가 부모 폭을 안 받아 42px 로 접힌다. w-full 로 편다. */
import C from "@/components/blocks/preview-02"

export default function Page() {
  return (
    <div className="[&_*]:[content-visibility:visible] [&_[data-slot=card]]:w-full">
      <C />
    </div>
  )
}
