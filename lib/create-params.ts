/* shadcn 테마 빌더(ui.shadcn.com/create)의 URL 상태 훅 스텁.
 * 원본은 nuqs 로 20여 개 파라미터를 URL 에 물리는데, 여기서는 미리보기를 고정값으로
 * 렌더하기만 하면 되므로 카드들이 실제로 읽는 두 개만 돌려준다. */
export function useDesignSystemSearchParams() {
  return [
    { style: "nova", iconLibrary: "lucide" } as {
      style: string
      iconLibrary: string
    },
    () => {},
  ] as const
}
