import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reel — 말로 만드는 짧은 영상",
  description:
    "한 줄 적으면 하나 나오고, 마음에 안 들면 말로 고친다. 이 디자인 시스템으로 만든 영상 생성 화면.",
}

export default function ReelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
