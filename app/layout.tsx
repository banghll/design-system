import type { Metadata } from "next"
import { DM_Sans, JetBrains_Mono } from "next/font/google"

import { LangProvider } from "@/components/lang"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import "./globals.css"

/* 라틴 — 본문과 제목 */
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })

/* 코드와 토큰 값 — 숫자가 자리를 지켜야 표가 흔들리지 않는다 */
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" })

export const metadata: Metadata = {
  title: "shadcn 디자인 시스템",
  description: "shadcn/ui 로 만든 에이전틱 디자인 시스템 레퍼런스",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /* suppressHydrationWarning — 테마 클래스를 스크립트가 먼저 붙이므로
     * 서버가 그린 html 과 한 프레임 어긋난다. 이 한 요소에만 해당한다. */
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn("h-full antialiased font-sans", dmSans.variable, mono.variable)}
    >
      <body className="flex min-h-full flex-col">
        {/* 한글 — Pretendard. Google Fonts 에 없어 CDN 에서 동적 서브셋으로 받는다.
          *
          * 이걸 <head> 안에 직접 두었더니 모든 페이지가 두 번 그려졌다. 브라우저가
          * head 를 자기 방식으로 정리하면서 React 가 기대한 DOM 과 어긋났고,
          * 하이드레이션에 실패한 React 가 옆에 트리를 새로 만들어 서버 HTML 이
          * 그대로 남았다. React 19 는 본문 안의 stylesheet 를 head 로 알아서
          * 올려 주므로 여기 두는 것이 맞다.
          *
          * 자체 호스팅으로 옮기려면 dist/web/variable 을 public/ 에 두면 된다. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <ThemeProvider>
          <LangProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </LangProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
