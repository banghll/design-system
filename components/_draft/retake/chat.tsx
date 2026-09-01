/* 왜: 랜딩에서 무엇을 들고 왔느냐에 따라 물어보는 것이 달라진다.
 *     텍스트만 → 템플릿 추천 / 템플릿만 → 캐릭터 이미지 / 이미지만 → 주제 먼저.
 *     세 갈래가 모두 «옵션 카드 → 이대로 생성» 한 곳으로 모인다.
 * 어디서: /retake 의 두 번째 단계. 2026-09-01 */
"use client"

import { useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { OPTIONS, recommend, VIDEOS, TEMPLATES, type Template } from "./data"
import { Clip } from "./media"
import type { StartInput } from "./hero"

type Choice = { label: string; say: string }

type Msg =
  | { kind: "me"; text: string }
  | { kind: "bot"; text: string }
  | { kind: "typing" }
  | { kind: "choices"; text: string; items: Choice[]; picked?: string }
  | { kind: "recs"; text: string; list: Template[]; picked?: string }
  | { kind: "options"; text: string }

export function Chat({
  input,
  onGenerate,
}: {
  input: StartInput
  onGenerate: (picked: string[]) => void
}) {
  const reduced = useReducedMotion()
  const [msgs, setMsgs] = useState<Msg[]>([])
  const boxRef = useRef<HTMLDivElement>(null)
  const answer = useRef<((v: string) => void) | null>(null)
  const ran = useRef(false)

  /* 넘치지 않을 때는 아예 건드리지 않는다 — 대화가 짧은데 화면이 흔들릴 이유가 없다.
     scrollIntoView 는 조상 스크롤 컨테이너를 전부 밀어서 뒤쪽 화면까지 내려간다. */
  useEffect(() => {
    const el = boxRef.current
    if (!el || el.scrollHeight <= el.clientHeight + 8) return
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" })
  }, [msgs, reduced])

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, reduced ? 0 : ms))
    const push = (m: Msg) => setMsgs((v) => [...v, m])
    const ask = (m: Msg) =>
      new Promise<string>((resolve) => {
        answer.current = resolve
        push(m)
      })

    /* 사람이 말하는 속도로 띄운다 — 한 번에 다 떠오르면 «읽어야 할 것» 이 된다 */
    const bot = async (m: Msg, think = 650) => {
      push({ kind: "typing" })
      await sleep(think)
      setMsgs((v) => v.filter((x) => x.kind !== "typing"))
      return m.kind === "choices" || m.kind === "recs" ? ask(m) : (push(m), "")
    }

    ;(async () => {
      let text = input.text
      let chosen = input.template

      if (text) push({ kind: "me", text })
      else if (chosen) push({ kind: "me", text: chosen.desc })
      if (input.image) push({ kind: "me", text: "이미지를 첨부했어요" })

      /* 그림만으로는 무엇을 만들지 모른다 — 주제부터 묻는다 */
      if (input.image && !text && !chosen) {
        text = await bot(
          {
            kind: "choices",
            text: "이 이미지로 어떤 영상을 만들까요?",
            items: [
              { label: "제품 소개", say: "제품 소개로 만들어주세요" },
              { label: "브이로그", say: "브이로그로 만들어주세요" },
              { label: "인물 클로즈업", say: "인물 클로즈업으로 만들어주세요" },
            ],
          },
          700
        )
      }

      if (!chosen) {
        const name = await bot(
          { kind: "recs", text: "이런 템플릿은 어때요? 하나 고르면 그걸로 찍을게요.", list: recommend(text) },
          750
        )
        chosen = TEMPLATES.find((t) => t.name === name) ?? null
      }

      if (!input.image) {
        const pick = await bot({
          kind: "choices",
          text: "원하는 캐릭터 이미지가 있다면 첨부해주세요.",
          items: [
            { label: "이미지 첨부", say: "이미지를 첨부할게요" },
            { label: "없이 진행", say: "이미지 없이 진행해주세요" },
          ],
        })
        if (pick === "이미지 첨부") {
          await bot({ kind: "bot", text: "좋아요. 첨부한 이미지의 인물을 그대로 살려서 만들게요." }, 550)
        }
      }

      await bot({ kind: "options", text: "이렇게 만들게요. 바꾸고 싶은 것만 눌러주세요." }, 800)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const settle = (index: number, picked: string, say: string) => {
    setMsgs((v) => {
      const next = v.map((m, i) => (i === index ? { ...m, picked } : m))
      return [...next, { kind: "me", text: say } as Msg]
    })
    answer.current?.(picked)
    answer.current = null
  }

  return (
    <div ref={boxRef} className="h-svh overflow-y-auto overscroll-contain">
      <div className="mx-auto flex w-[min(30rem,92vw)] flex-col gap-8 px-0 pt-8 pb-40">
        {msgs.map((m, i) => (
          <Bubble key={i} msg={m} index={i} settle={settle} onGenerate={onGenerate} />
        ))}
      </div>
    </div>
  )
}

function Bubble({
  msg,
  index,
  settle,
  onGenerate,
}: {
  msg: Msg
  index: number
  settle: (i: number, picked: string, say: string) => void
  onGenerate: (picked: string[]) => void
}) {
  const rise = "motion-safe:animate-[retake-msg_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"

  if (msg.kind === "me")
    return (
      <div className={cn("max-w-[86%] self-end rounded-2xl bg-primary px-4.5 py-3 text-sm leading-relaxed text-primary-foreground", rise)}>
        {msg.text}
      </div>
    )

  if (msg.kind === "typing")
    return (
      <div className={cn("flex max-w-[86%] gap-1.5 self-start rounded-2xl bg-card px-5 py-4 shadow-sm", rise)}>
        {[0, 1, 2].map((i) => (
          <i
            key={i}
            className="size-1.5 rounded-full bg-muted-foreground/60 motion-safe:animate-[retake-blink_1.1s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    )

  const wide = msg.kind === "recs" || msg.kind === "options"
  return (
    <div
      className={cn(
        "self-start rounded-2xl bg-card px-5 py-4 text-sm leading-relaxed shadow-sm",
        /* 안에 카드가 들어가는 말풍선은 내용에 맞춰 줄지 말고 폭을 다 쓴다 */
        wide ? "w-full" : "max-w-[86%]",
        rise
      )}
    >
      {msg.text}

      {msg.kind === "choices" ? (
        <div className={cn("mt-3.5 flex flex-wrap gap-2", msg.picked && "pointer-events-none")}>
          {msg.items.map((it) => (
            <Button
              key={it.label}
              type="button"
              size="lg"
              variant={msg.picked === it.label ? "default" : "secondary"}
              className={cn("rounded-full", msg.picked && msg.picked !== it.label && "opacity-40")}
              onClick={() => settle(index, it.label, it.say)}
            >
              {it.label}
            </Button>
          ))}
        </div>
      ) : null}

      {msg.kind === "recs" ? (
        <div className={cn("mt-3.5 grid grid-cols-3 gap-2.5", msg.picked && "pointer-events-none")}>
          {msg.list.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => settle(index, t.name, `${t.name} 템플릿으로 만들어주세요`)}
              className={cn(
                "relative aspect-9/12 overflow-hidden rounded-md border-2 border-transparent transition-transform duration-200 hover:-translate-y-0.5",
                msg.picked === t.name && "border-primary",
                msg.picked && msg.picked !== t.name && "opacity-40"
              )}
            >
              <Clip
                src={VIDEOS[TEMPLATES.indexOf(t) % VIDEOS.length]}
                view="chat"
                tone={TEMPLATES.indexOf(t)}
              />
              <span className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/70 to-transparent px-2.5 pt-7 pb-2.5 text-left text-xs leading-tight font-semibold text-white">
                {t.name}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {msg.kind === "options" ? <OptionCard onGenerate={onGenerate} /> : null}
    </div>
  )
}

function OptionCard({ onGenerate }: { onGenerate: (picked: string[]) => void }) {
  const [picked, setPicked] = useState(OPTIONS.map((o) => o.def))
  const [sent, setSent] = useState(false)

  return (
    <>
      <div className="mt-3.5 flex flex-col gap-2.5 rounded-lg bg-muted p-4">
        {OPTIONS.map((row, ri) => (
          <div key={row.key} className="flex items-center gap-3">
            <b className="w-9 shrink-0 text-xs font-medium text-muted-foreground">{row.key}</b>
            <div className="flex flex-wrap gap-1.5">
              {row.items.map((v) => (
                <Button
                  key={v}
                  type="button"
                  size="sm"
                  variant={picked[ri] === v ? "default" : "outline"}
                  className={cn("rounded-full border-0", picked[ri] !== v && "bg-card")}
                  onClick={() => setPicked((p) => p.map((x, i) => (i === ri ? v : x)))}
                >
                  {v}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button
        type="button"
        size="lg"
        disabled={sent}
        className="mt-4 font-bold"
        onClick={() => {
          setSent(true)
          onGenerate(picked)
        }}
      >
        이대로 생성
      </Button>
    </>
  )
}
