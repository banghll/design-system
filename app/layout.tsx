import type { Metadata } from "next"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import "./globals.css"

export const metadata: Metadata = {
  title: "slate × shadcn",
  description:
    "slate 파운데이션 위에 올린 shadcn/ui + AI Elements 컴포넌트 레포",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={cn("dark h-full antialiased", "font-sans")}>
      <head>
        {/* 폰트는 next/font 를 쓰지 않는다.
         * next/font 는 해시된 패밀리명(__DM_Sans_xxx)을 만들고 --font-sans 를 그 값으로
         * 덮어쓴다. 그러면 tokens/typography.css 가 이름으로 참조하는 "DM Sans" 와
         * 어긋나 파운데이션의 타이포 계약이 끊긴다.
         * 실제 패밀리명이 유지되는 이 방식이라야 typography.css 의 --font-sans 가 그대로 산다. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  )
}
