/* 리테이크 화면의 서체와 화면 전용 토큰.
 *
 * Anton 은 이 화면의 디스플레이 서체다. 전역 레이아웃을 건드리지 않으려고
 * 라우트 레이아웃에서만 받는다 — 다른 화면의 글꼴은 그대로다. */
import { Anton } from "next/font/google"

import { ForceLight } from "./force-light"
import "./retake.css"

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" })

export default function RetakeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`retake-scope ${anton.variable}`}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <ForceLight />
      {children}
    </div>
  )
}
