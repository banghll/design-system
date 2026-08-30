/* 생성물 — node scripts/gen-component-docs.mjs. 직접 고치지 말 것.
 * 정본은 scripts/gen-components.mjs 의 DOC 이다. */
export const DOCS: Record<string, { what: string; when: string }> = {
  "button": {
    "what": "누르면 무언가가 실행되는 가장 작은 단위. 상태를 바꾸거나 화면을 옮긴다.",
    "when": "화면당 default 는 하나. 나머지는 secondary · outline · ghost 로 내리고, 되돌릴 수 없는 것만 destructive 로 올린다."
  },
  "input": {
    "what": "한 줄짜리 값을 받는 자리.",
    "when": "기본 · 값 있음 · 비활성 · 오류 네 상태를 모두 갖춰야 한다. 오류는 색만이 아니라 문구로 무엇을 고쳐야 하는지 말한다."
  },
  "card": {
    "what": "관련된 내용을 한 덩어리로 묶는 면.",
    "when": "모든 것을 카드에 넣지 않는다. 카드 안에 카드를 넣으면 위계가 무너진다."
  }
}
