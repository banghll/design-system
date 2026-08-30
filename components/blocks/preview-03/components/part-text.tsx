// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import * as React from "react"
import { type TextUIPart } from "ai"

import { Markdown } from "@/components/markdown"
import { Bubble, BubbleContent } from "@/components/ui/bubble"

type PartTextVariant = "default" | "bubble"

export function PartText({
  part,
  role,
  variant,
  tinted = false,
  className,
  ...props
}: {
  part: TextUIPart
  role?: "user" | "system" | "assistant"
  tinted?: boolean
  variant?: PartTextVariant
} & Omit<
  React.ComponentProps<typeof Bubble>,
  "children" | "part" | "variant"
>) {
  if (part.type !== "text") {
    return null
  }

  const content =
    role === "user" || variant === "bubble" ? (
      part.text
    ) : (
      <Markdown animated>{part.text}</Markdown>
    )
  const bubbleVariant =
    variant === "bubble"
      ? tinted
        ? "tinted"
        : "default"
      : role === "user"
        ? "default"
        : "ghost"

  return (
    <Bubble variant={bubbleVariant} className={className} {...props}>
      <BubbleContent>{content}</BubbleContent>
    </Bubble>
  )
}
