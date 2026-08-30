import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "스튜디오 — 이미지 생성 화면",
  description:
    "이 디자인 시스템으로 다시 그린 생성형 이미지 스튜디오. 왼쪽에서 조건을 쌓고 오른쪽에서 결과를 본다.",
}

export default function StudioLayout({ children }: LayoutProps<"/studio">) {
  return children
}
