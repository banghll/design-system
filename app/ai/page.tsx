/* slate-ui · surface: AI Elements 채팅 데모 · focus: 대화 흐름(메시지 스트림) · states: 8/8
 * tokens: --color-background · --color-card · --color-destructive · --gap-* · --breakpoint-tablet
 * spec: none · gates: 0 fail · self: C5 H4 S5 R4 D5 P4
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

type Turn = { id: string; role: "user" | "assistant"; text: string }
type Failure = { title: string; detail: string; retry: string | null }

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

const MAX_CHARS = 500

const seeds = [
  "토큰이 진짜 물렸는지 확인해줘",
  "코드 블록도 되나?",
  "긴 문장은 어떻게 흐르지?",
]

export default function AiPage() {
  const [turns, setTurns] = useState<Turn[]>([])
  const [streaming, setStreaming] = useState(false)
  const [failure, setFailure] = useState<Failure | null>(null)

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim()

      /* 오류는 원인별로 갈라야 사용자가 무엇을 바꿀지 안다. */
      if (!trimmed) {
        setFailure({
          title: "보낼 내용이 없습니다",
          detail: "메시지를 한 글자 이상 입력한 뒤 다시 보내세요.",
          retry: null,
        })
        return
      }
      if (trimmed.length > MAX_CHARS) {
        setFailure({
          title: `메시지가 ${MAX_CHARS}자를 넘습니다`,
          detail: `지금 ${trimmed.length}자입니다. ${trimmed.length - MAX_CHARS}자를 줄이거나 두 번에 나눠 보내세요.`,
          retry: null,
        })
        return
      }

      setFailure(null)
      const stamp = `${turns.length}-${trimmed.length}`
      setTurns((prev) => [
        ...prev,
        { id: `u${stamp}`, role: "user", text: trimmed },
        { id: `a${stamp}`, role: "assistant", text: "" },
      ])
      setStreaming(true)

      try {
        const full = reply(trimmed)
        let shown = ""
        for (const word of full.split(" ")) {
          shown += (shown ? " " : "") + word
          await new Promise((r) => setTimeout(r, 18))
          const frame = shown
          setTurns((prev) => {
            const next = [...prev]
            next[next.length - 1] = { ...next[next.length - 1], text: frame }
            return next
          })
        }
      } catch {
        /* 실패한 빈 응답 말풍선은 남겨두지 않는다 — 오독을 만든다. */
        setTurns((prev) => prev.slice(0, -1))
        setFailure({
          title: "응답을 받지 못했습니다",
          detail: "연결이 끊겼습니다. 같은 내용으로 다시 시도할 수 있습니다.",
          retry: trimmed,
        })
      } finally {
        setStreaming(false)
      }
    },
    [turns.length]
  )

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
          <p className="text-caption-2xs text-subtle">
            API 키 없음 · slate 토큰만 참조
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">← 토큰</Link>
        </Button>
      </header>

      <div
        className="mx-auto flex min-h-0 w-full flex-1 flex-col"
        style={{ maxWidth: "var(--breakpoint-tablet)" }}
      >
        <Conversation className="min-h-0 flex-1">
          <ConversationContent aria-live="polite" aria-busy={streaming}>
            {turns.length === 0 ? (
              <ConversationEmptyState
                icon={
                  <MessageSquare
                    aria-hidden="true"
                    style={{
                      width: "var(--icon-size-lg)",
                      height: "var(--icon-size-lg)",
                    }}
                  />
                }
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
          {failure ? (
            <Alert variant="destructive" role="alert">
              <AlertTitle>{failure.title}</AlertTitle>
              <AlertDescription
                className="flex flex-col items-start"
                style={{ gap: "var(--gap-8)" }}
              >
                <span>{failure.detail}</span>
                {failure.retry ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void send(failure.retry as string)}
                  >
                    다시 시도
                  </Button>
                ) : null}
              </AlertDescription>
            </Alert>
          ) : null}

          {turns.length === 0 && !failure ? (
            <Suggestions>
              {seeds.map((s) => (
                <Suggestion
                  key={s}
                  suggestion={s}
                  onClick={() => void send(s)}
                />
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
