/* slate-ui · surface: AI 채팅 앱 · focus: 중앙 대화 스트림 · states: 8/8
 * tokens: --layout-panel-width · --layout-toolbar-height · --color-card · --color-fill · --gap-*
 * spec: none · gates: 0 fail · self: C5 H4 S5 R4 D5 P4
 */
"use client"

import { MessageSquarePlus, PanelLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

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
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

type Part = { reasoning?: string; text: string }
type Turn = { id: string; role: "user" | "assistant"; part: Part }
type Thread = { id: string; title: string; turns: Turn[] }
type Failure = { title: string; detail: string; retry: string | null }

const MODELS = [
  { id: "opus", label: "Opus 5" },
  { id: "sonnet", label: "Sonnet 5" },
  { id: "haiku", label: "Haiku 4.5" },
]

const MAX_CHARS = 2000

const seeds = [
  "오늘 수집 실패한 곳 정리해줘",
  "리포트 초안 다듬어줘",
  "이번 주 트렌드 3줄 요약",
]

/* 모델을 붙이지 않는다. 이 앱은 대화 UI 의 상태 전이를 보이는 것이 목적이므로
   응답은 입력을 되비추는 고정 문구로 충분하다. 실제 값은 만들어내지 않는다. */
const compose = (input: string): Part => ({
  reasoning: [
    "요청을 두 조각으로 나눈다 — 무엇을 묻는지, 어떤 형식으로 답할지.",
    "형식은 짧은 문단 하나로 잡는다. 표를 쓸 만큼 항목이 많지 않다.",
  ].join("\n\n"),
  text: [
    `이 앱에는 모델이 연결되어 있지 않습니다. 지금 보이는 것은 **UI 층**입니다.`,
    ``,
    `받은 요청: _${input}_`,
    ``,
    `대화 스트림·사고 과정 블록·오류·재시도가 전부 slate 토큰만으로 그려집니다.`,
    `모델을 붙이려면 이 함수를 API 호출로 바꾸면 됩니다.`,
  ].join("\n"),
})

const NEW_THREAD: Thread = { id: "t-new", title: "새 대화", turns: [] }

export default function ChatPage() {
  const [threads, setThreads] = useState<Thread[] | null>(null)
  const [activeId, setActiveId] = useState(NEW_THREAD.id)
  const [streaming, setStreaming] = useState(false)
  const [failure, setFailure] = useState<Failure | null>(null)
  const [model, setModel] = useState(MODELS[0].id)
  const [panelOpen, setPanelOpen] = useState(false)
  const seq = useRef(0)

  /* 스레드 목록은 원래 서버에서 온다. 그 사이의 로딩 상태를 실제로 그린다. */
  useEffect(() => {
    const t = setTimeout(() => setThreads([NEW_THREAD]), 600)
    return () => clearTimeout(t)
  }, [])

  const active = threads?.find((t) => t.id === activeId) ?? null

  const patchActive = useCallback(
    (fn: (t: Thread) => Thread) =>
      setThreads((prev) =>
        prev ? prev.map((t) => (t.id === activeId ? fn(t) : t)) : prev
      ),
    [activeId]
  )

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim()

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
          title: `메시지가 ${MAX_CHARS.toLocaleString()}자를 넘습니다`,
          detail: `지금 ${trimmed.length.toLocaleString()}자입니다. ${(trimmed.length - MAX_CHARS).toLocaleString()}자를 줄이거나 나눠 보내세요.`,
          retry: null,
        })
        return
      }

      setFailure(null)
      const n = seq.current++
      patchActive((t) => ({
        ...t,
        title: t.turns.length === 0 ? trimmed.slice(0, 24) : t.title,
        turns: [
          ...t.turns,
          { id: `u${n}`, role: "user", part: { text: trimmed } },
          { id: `a${n}`, role: "assistant", part: { text: "" } },
        ],
      }))
      setStreaming(true)

      try {
        const full = compose(trimmed)
        /* 사고 과정이 먼저, 답이 나중 — 실제 스트림의 순서를 그대로 따른다. */
        patchActive((t) => {
          const turns = [...t.turns]
          turns[turns.length - 1] = {
            ...turns[turns.length - 1],
            part: { reasoning: full.reasoning, text: "" },
          }
          return { ...t, turns }
        })
        await new Promise((r) => setTimeout(r, 400))

        let shown = ""
        for (const word of full.text.split(" ")) {
          shown += (shown ? " " : "") + word
          await new Promise((r) => setTimeout(r, 16))
          const frame = shown
          patchActive((t) => {
            const turns = [...t.turns]
            turns[turns.length - 1] = {
              ...turns[turns.length - 1],
              part: { reasoning: full.reasoning, text: frame },
            }
            return { ...t, turns }
          })
        }
      } catch {
        patchActive((t) => ({ ...t, turns: t.turns.slice(0, -1) }))
        setFailure({
          title: "응답을 받지 못했습니다",
          detail: "연결이 끊겼습니다. 같은 내용으로 다시 시도할 수 있습니다.",
          retry: trimmed,
        })
      } finally {
        setStreaming(false)
      }
    },
    [patchActive]
  )

  const newThread = () => {
    const id = `t${seq.current++}`
    setThreads((prev) => [{ id, title: "새 대화", turns: [] }, ...(prev ?? [])])
    setActiveId(id)
    setFailure(null)
    setPanelOpen(false)
  }

  return (
    <div className="flex h-dvh">
      {/* 좌측 패널 — slate 앱쉘 토큰을 그대로 쓴다. */}
      <nav
        aria-label="대화 목록"
        data-open={panelOpen}
        className="fixed inset-y-0 left-0 z-30 hidden shrink-0 flex-col border-r data-[open=true]:flex md:relative md:flex"
        style={{
          width: "var(--layout-panel-width)",
          background: "var(--color-background-alt)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <div
          className="flex items-center justify-between border-b"
          style={{
            height: "var(--layout-toolbar-height)",
            padding: "0 var(--padding-12)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <Link href="/" className="text-caption-xs text-subtle">
            ← 디자인 시스템
          </Link>
          <Button
            size="sm"
            variant="ghost"
            onClick={newThread}
            aria-label="새 대화 시작"
          >
            <MessageSquarePlus aria-hidden="true" />
          </Button>
        </div>

        <div
          className="flex min-h-0 flex-1 flex-col overflow-y-auto"
          style={{ padding: "var(--padding-8)", gap: "var(--gap-2)" }}
        >
          {threads === null ? (
            <div className="flex flex-col" style={{ gap: "var(--gap-6)" }}>
              {[0, 1, 2].map((i) => (
                <Skeleton
                  key={i}
                  style={{ height: "var(--component-height-sm)" }}
                />
              ))}
            </div>
          ) : (
            threads.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActiveId(t.id)
                  setPanelOpen(false)
                }}
                aria-current={t.id === activeId ? "page" : undefined}
                className="text-body-sm w-full min-w-0 truncate text-left transition-colors"
                style={{
                  padding: "var(--padding-8) var(--padding-10)",
                  borderRadius: "var(--radius-sm)",
                  minHeight: "var(--component-height-sm)",
                  background:
                    t.id === activeId ? "var(--color-fill)" : "transparent",
                  color:
                    t.id === activeId
                      ? "var(--color-foreground-strong)"
                      : "var(--color-foreground)",
                  transitionDuration: "var(--motion-feedback-duration)",
                  transitionTimingFunction: "var(--motion-feedback-easing)",
                }}
              >
                {t.title}
              </button>
            ))
          )}
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="flex items-center justify-between border-b"
          style={{
            height: "var(--layout-toolbar-height)",
            padding: "0 var(--padding-16)",
            borderColor: "var(--color-border-subtle)",
            gap: "var(--gap-12)",
          }}
        >
          <div className="flex min-w-0 items-center" style={{ gap: "var(--gap-8)" }}>
            <Button
              size="sm"
              variant="ghost"
              className="md:hidden"
              onClick={() => setPanelOpen((v) => !v)}
              aria-label="대화 목록 열기"
              aria-expanded={panelOpen}
            >
              <PanelLeft aria-hidden="true" />
            </Button>
            <h1 className="text-body-sm min-w-0 truncate">
              {active?.title ?? "새 대화"}
            </h1>
          </div>

          <Select value={model} onValueChange={setModel}>
            <SelectTrigger size="sm" aria-label="모델 선택">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </header>

        <div
          className="mx-auto flex min-h-0 w-full flex-1 flex-col"
          style={{ maxWidth: "var(--breakpoint-tablet)" }}
        >
          <Conversation className="min-h-0 flex-1">
            <ConversationContent aria-live="polite" aria-busy={streaming}>
              {!active || active.turns.length === 0 ? (
                <ConversationEmptyState
                  icon={
                    <Sparkles
                      aria-hidden="true"
                      style={{
                        width: "var(--icon-size-lg)",
                        height: "var(--icon-size-lg)",
                      }}
                    />
                  }
                  title="무엇을 도와드릴까요"
                  description="아래에 요청을 적거나 아래 예시를 골라보세요"
                />
              ) : (
                active.turns.map((turn, i) => (
                  <Message from={turn.role} key={turn.id}>
                    <MessageContent>
                      {turn.part.reasoning ? (
                        <Reasoning
                          isStreaming={
                            streaming && i === active.turns.length - 1
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>
                            {turn.part.reasoning}
                          </ReasoningContent>
                        </Reasoning>
                      ) : null}
                      <MessageResponse>{turn.part.text}</MessageResponse>
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

            {active && active.turns.length === 0 && !failure ? (
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

            <PromptInput
              onSubmit={(m: PromptInputMessage) => void send(m.text ?? "")}
            >
              <PromptInputBody>
                <PromptInputTextarea
                  placeholder="무엇이든 물어보세요"
                  disabled={threads === null}
                />
                <PromptInputSubmit
                  status={streaming ? "streaming" : undefined}
                  disabled={threads === null}
                />
              </PromptInputBody>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  )
}
