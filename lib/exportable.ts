/* 측정 하네스가 있는 컴포넌트.
 *
 * export-harness.tsx 는 "use client" 라 서버 쪽(generateStaticParams)에서
 * 그 파일의 값을 읽을 수 없다 — 클라이언트 경계를 넘으면 export 가 값이 아니라
 * 참조가 된다. 그래서 목록만 여기 둔다. */
export const EXPORTABLE = ["button", "input", "badge", "card", "tabs"] as const
export type Exportable = (typeof EXPORTABLE)[number]
