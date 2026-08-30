/* Reel — 말로 만드는 짧은 영상.
 *
 * 기획은 docs/prd-reel.md 에 있다. 요지는 «라이트 유저» 하나다:
 * 영상을 만들어 본 적 없는 사람이 처음 열고 3분 안에 클립 하나를 얻는 것.
 *
 * 그래서 이 화면에는 사이드바가 없고, 설정이 셋뿐이고, 글자가 크다.
 * 대시보드의 밀도를 그대로 가져오면 «내가 다룰 수 있는 도구» 로 안 읽힌다.
 *
 * 새 컴포넌트는 만들지 않았다. 전부 components/ui 의 것이고,
 * 색과 간격은 저장된 테마 Test padding 2 를 그대로 입는다. */
"use client"

import {
  ArrowUp,
  Check,
  Download,
  ImagePlus,
  Pencil,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { TEST_PADDING_2 } from "@/lib/theme-test-padding-2"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Message, MessageContent, MessageGroup } from "@/components/ui/message"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/* 기다림에는 이름을 붙인다. 63% 는 아무것도 말해 주지 않지만
 * «장면을 그리는 중» 은 지금 무엇이 일어나는지 말해 준다. */
const STAGES = [
  "문장을 읽는 중",
  "장면을 잡는 중",
  "장면을 그리는 중",
  "움직임을 다듬는 중",
]

const EXAMPLES = [
  "비 오는 밤 도쿄 골목, 젖은 바닥에 네온이 번진다",
  "커피잔에서 김이 천천히 올라오는 아침 창가",
  "노란 들판을 가로질러 달리는 골든 리트리버",
]

const LENGTHS = ["4초", "8초", "12초"]

const RATIOS = [
  { v: "9:16", label: "세로 9:16", hint: "릴스 · 쇼츠" },
  { v: "1:1", label: "정사각 1:1", hint: "피드" },
  { v: "16:9", label: "가로 16:9", hint: "유튜브" },
]

const MOODS = ["시네마틱", "다큐", "애니메이션", "빈티지 필름", "수채화", "3D"]

const RATIO_BOX: Record<string, string> = {
  "9:16": "aspect-[9/16] max-w-56",
  "1:1": "aspect-square max-w-72",
  "16:9": "aspect-video max-w-full",
}

type Clip = {
  id: number
  prompt: string
  length: string
  ratio: string
  mood: string
  /** 만드는 중이면 0~3, 끝났으면 null */
  stage: number | null
}

export default function ReelPage() {
  const [draft, setDraft] = useState("")
  const [length, setLength] = useState("8초")
  const [ratio, setRatio] = useState("9:16")
  const [mood, setMood] = useState("시네마틱")
  const [clips, setClips] = useState<Clip[]>([])
  const [left, setLeft] = useState(12)
  const boxRef = useRef<HTMLTextAreaElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  /* 만드는 중인 클립을 단계별로 넘긴다. 진짜 백엔드가 붙을 자리 —
   * 시안이라 시간으로 흉내 낸다. */
  useEffect(() => {
    const running = clips.find((c) => c.stage !== null)
    if (!running) return
    const id = window.setTimeout(() => {
      setClips((cs) =>
        cs.map((c) =>
          c.id === running.id
            ? {
                ...c,
                stage:
                  running.stage! >= STAGES.length - 1 ? null : running.stage! + 1,
              }
            : c
        )
      )
    }, 1100)
    return () => window.clearTimeout(id)
  }, [clips])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [clips.length])

  const send = (text?: string) => {
    const prompt = (text ?? draft).trim()
    if (!prompt || left <= 0) return
    setClips((cs) => [
      ...cs,
      { id: cs.length + 1, prompt, length, ratio, mood, stage: 0 },
    ])
    setLeft((n) => n - 1)
    setDraft("")
  }

  const again = (c: Clip) => {
    if (left <= 0) return
    setClips((cs) => [...cs, { ...c, id: cs.length + 1, stage: 0 }])
    setLeft((n) => n - 1)
  }

  const editFrom = (c: Clip) => {
    setDraft(c.prompt)
    setLength(c.length)
    setRatio(c.ratio)
    setMood(c.mood)
    boxRef.current?.focus()
  }

  const busy = clips.some((c) => c.stage !== null)

  return (
    <div
      className="bg-background text-foreground flex h-dvh flex-col overflow-x-clip"
      style={TEST_PADDING_2}
    >
      {/* 머리는 얇게. 위쪽은 «여기가 어디인가» 만 말하고 비켜난다. */}
      <header className="flex h-14 shrink-0 items-center gap-3 px-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold"
        >
          <Sparkles className="size-5" />
          Reel
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="tabular-nums">
                오늘 {left}번 남음
              </Badge>
            </TooltipTrigger>
            <TooltipContent>매일 자정에 12번으로 다시 채워집니다</TooltipContent>
          </Tooltip>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[46rem] px-5 pb-10">
          {clips.length === 0 ? (
            <Empty className="items-start pt-16 text-left">
              <EmptyHeader className="items-start text-left">
                <EmptyTitle className="text-3xl tracking-tight">
                  무엇을 만들까요?
                </EmptyTitle>
                <EmptyDescription className="max-w-[42ch] text-base">
                  장면을 한 줄로 적으면 짧은 영상이 됩니다. 잘 모르겠으면 아래를
                  눌러 보세요 — 눌러도 횟수는 그대로입니다.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="w-full">
                <ItemGroup className="w-full">
                  {EXAMPLES.map((e) => (
                    <Item key={e} variant="outline" asChild>
                      <button type="button" onClick={() => setDraft(e)}>
                        <ItemMedia variant="icon">
                          <Pencil />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle className="text-base leading-relaxed whitespace-normal">
                            {e}
                          </ItemTitle>
                        </ItemContent>
                      </button>
                    </Item>
                  ))}
                </ItemGroup>
              </EmptyContent>
            </Empty>
          ) : (
            <MessageGroup className="gap-8 pt-6">
              {clips.map((c) => (
                <div key={c.id} className="flex flex-col gap-3">
                  {/* 내가 적은 문장 */}
                  <Bubble align="end">
                    <BubbleContent className="bg-primary text-primary-foreground max-w-[85%] px-4 py-3 text-base">
                      {c.prompt}
                    </BubbleContent>
                    <div className="text-muted-foreground self-end text-xs">
                      {c.length} · {c.ratio} · {c.mood}
                    </div>
                  </Bubble>

                  {/* 만들어진 것 */}
                  <Message align="start">
                    <MessageContent>
                      {c.stage !== null ? (
                        <Card className="w-full max-w-sm">
                          <CardContent className="flex flex-col gap-3">
                            <div className="text-base font-medium">
                              {STAGES[c.stage]}
                            </div>
                            <Progress
                              value={((c.stage + 1) / STAGES.length) * 100}
                            />
                            <p className="text-muted-foreground text-sm">
                              40초쯤 걸려요. 다른 걸 하고 있어도 됩니다.
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <div
                            className={`bg-muted relative grid w-full place-items-center overflow-hidden rounded-2xl border ${RATIO_BOX[c.ratio]}`}
                          >
                            {/* 진짜라면 <video>. 시안에서는 자리만 잡아 둔다. */}
                            <Button
                              size="icon-lg"
                              className="rounded-full"
                              aria-label="재생"
                            >
                              <Play className="size-5" />
                            </Button>
                            <span className="text-muted-foreground absolute bottom-2 left-2 text-xs tabular-nums">
                              {c.length}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              variant="outline"
                              onClick={() => again(c)}
                              disabled={left <= 0}
                            >
                              <RotateCcw />
                              다시 만들기
                            </Button>
                            <Button variant="outline" onClick={() => editFrom(c)}>
                              <Pencil />
                              고쳐서 다시
                            </Button>
                            <Button variant="ghost">
                              <Download />
                              저장
                            </Button>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            같은 문장이라도 만들 때마다 조금씩 달라집니다.
                          </p>
                        </div>
                      )}
                    </MessageContent>
                  </Message>
                </div>
              ))}
              <div ref={endRef} />
            </MessageGroup>
          )}
        </div>
      </main>

      {/* 설정 셋은 입력 위에 늘 펼쳐 둔다 — 접어 두면 «어딘가에 설정이 더 있다»
        * 는 불안만 남고 정작 아무도 열지 않는다. */}
      <div className="shrink-0">
        <Separator />
        <div className="mx-auto w-full max-w-[46rem] px-5 py-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger aria-label="길이">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LENGTHS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ratio} onValueChange={setRatio}>
              <SelectTrigger aria-label="비율">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RATIOS.map((r) => (
                  <SelectItem key={r.v} value={r.v}>
                    {r.label}
                    <span className="text-muted-foreground ml-1 text-xs">
                      {r.hint}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger aria-label="분위기">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {busy ? (
              <span className="text-muted-foreground ml-auto text-sm">
                만드는 중에도 다음 걸 적어 둘 수 있어요
              </span>
            ) : null}
          </div>

          <InputGroup className="rounded-2xl">
            <InputGroupTextarea
              ref={boxRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder={
                left > 0
                  ? "어떤 장면을 만들까요?"
                  : "오늘 몫을 다 썼어요. 내일 다시 12번 생겨요"
              }
              disabled={left <= 0}
              rows={2}
              className="max-h-40 min-h-12 text-base md:text-base"
            />
            <InputGroupAddon align="block-end">
              <Button variant="ghost" size="icon-sm" aria-label="이미지 첨부">
                <ImagePlus />
              </Button>
              <Button
                size="icon-sm"
                className="ml-auto rounded-full"
                onClick={() => send()}
                disabled={!draft.trim() || left <= 0}
                aria-label="만들기"
              >
                {left <= 0 ? <Check /> : <ArrowUp />}
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <p className="text-muted-foreground mt-2 text-xs">
            Enter 로 만들기 · Shift+Enter 로 줄바꿈
          </p>
        </div>
      </div>
    </div>
  )
}
