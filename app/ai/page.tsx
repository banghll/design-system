/* slate-ui · surface: AI Elements 채팅 데모 · focus: 대화 흐름(메시지 스트림) · states: 기본·빈·전송중·완료
 * tokens: --color-background · --color-card · --color-border · --gap-* · --motion-enter-*
 * spec: none · gates: 0 fail
 */
"use client"

import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { useCallback, useState } from "react"

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"
import { Button } from "@/components/ui/button"

type Turn = { id: string; role: "user" | "assistant"; text: string }

/* 모델도 API 키도 붙이지 않는다. 이 화면의 목적은 UI 층이 slate 토큰만으로
   성립하는지 보는 것이므로, 응답은 고정 문구를 흘려보내는 것으로 충분하다. */
const reply = (input: string) =>
  [
    `백엔드 없이 **UI 층만** 돌고 있습니다.`,
    ``,
    `받은 말: _${input}_`,
    ``,
    `이 말풍선의 배경은 \`--color-card\`, 테두리는 \`--color-border\`,`,
    `보낸 버튼은 \`--color-primary\` 입니다. AI Elements 코드는`,
    `한 줄도 고치지 않았습니다.`,
  ].join("\n")

const seeds = [
  "토큰이 진짜 물렸는지 확인해줘",
  "코드 블록도 되나?",
  "긴 문장은 어떻게 흐르지?",
]

export default function AiPage() {
  const [turns, setTurns] = useState<Turn[]>([])
  const [streaming, setStreaming] = useState(false)

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const stamp = `${turns.length}-${trimmed.length}`
    setTurns((prev) => [
      ...prev,
      { id: `u${stamp}`, role: "user", text: trimmed },
      { id: `a${stamp}`, role: "assistant", text: "" },
    ])
    setStreaming(true)

    const full = reply(trimmed)
    let shown = ""
    for (const word of full.split(" ")) {
      shown += (shown ? " " : "") + word
      await new Promise((r) => setTimeout(r, 18))
      const frame = shown
      setTurns((prev) => {
        const next = [...prev]
        next[next.length - 1] = {
          ...next[next.length - 1],
          text: frame,
        }
        return next
      })
    }
    setStreaming(false)
  }, [turns.length])

  const handleSubmit = (message: PromptInputMessage) => {
    void send(message.text ?? "")
  }

  return (
    <div className="flex h-dvh flex-col">
      <header
        className="flex items-center justify-between border-b"
        style={{
          borderColor: "var(--color-border-subtle)",
          padding: "var(--padding-12) var(--padding-24)",
        }}
      >
        <div>
          <h1 className="text-body-sm">AI Elements — UI 전용</h1>
          <p className="text-caption-2xs text-muted-foreground">
            API 키 없음 · slate 토큰만 참조
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">← 토큰</Link>
        </Button>
      </header>

      <div className="mx-auto flex w-full min-h-0 flex-1 flex-col" style={{ maxWidth: "48rem" }}>
        <Conversation className="min-h-0 flex-1">
          <ConversationContent>
            {turns.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-10" />}
                title="아직 대화가 없습니다"
                description="아래에 아무 말이나 적어보세요"
              />
            ) : (
              turns.map((turn) => (
                <Message from={turn.role} key={turn.id}>
                  <MessageContent>
                    <MessageResponse>{turn.text}</MessageResponse>
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div
          className="flex flex-col"
          style={{
            gap: "var(--gap-8)",
            padding: "var(--padding-12) var(--padding-16) var(--padding-16)",
          }}
        >
          {turns.length === 0 ? (
            <Suggestions>
              {seeds.map((s) => (
                <Suggestion key={s} suggestion={s} onClick={() => void send(s)} />
              ))}
            </Suggestions>
          ) : null}

          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea placeholder="메시지를 입력하세요" />
              <PromptInputSubmit status={streaming ? "streaming" : undefined} />
            </PromptInputBody>
          </PromptInput>
        </div>
      </div>
    </div>
  )
}
