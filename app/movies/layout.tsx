import type { Metadata } from "next"

import { MoviesShell } from "@/components/movies/shell"

export const metadata: Metadata = {
  title: "씨네덱 — 평균 말고 분포",
  description:
    "평균 하나로는 그 영화가 나에게 맞는지 알 수 없다. 씨네덱은 분포를 먼저 보여준다.",
}

export default function MoviesLayout({ children }: LayoutProps<"/movies">) {
  return <MoviesShell>{children}</MoviesShell>
}
