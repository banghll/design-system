/* 왜: 기다리는 수십 초가 비어 있으면 그대로 나간다. 그 시간을 가입에 쓴다 —
 *     생성은 왼쪽에서 계속 돌고, 오른쪽에서 세 가지만 묻는다.
 *     가입이 끝나도 생성은 안 끝났을 수 있어서, 완료 화면이 그 사실을 말한다.
 * 어디서: /retake 의 세 번째 단계. 2026-09-01 */
"use client"

import { useReducedMotion } from "motion/react"
import { Check } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import { STAGES, suggestName } from "./data"

export type Progressing = { pct: number; label: string }

/* 실제 생성 시간에 맞춰 도는 자리. API 를 붙일 곳은 여기 하나다 */
export function useGenerationProgress(running: boolean): Progressing {
  const [state, setState] = useState<Progressing>({ pct: 0, label: STAGES[0].label })

  useEffect(() => {
    if (!running) return
    let pct = 0
    let si = 0
    const id = setInterval(() => {
      if (pct >= 100) return clearInterval(id)
      pct = Math.min(100, pct + 1 + Math.floor(Math.random() * 2))
      while (si < STAGES.length - 1 && pct > STAGES[si].to) si += 1
      setState({ pct, label: STAGES[si].label })
    }, 420)
    return () => clearInterval(id)
  }, [running])

  return state
}

const STEPS = [
  { title: "어떻게 불러드릴까요?", why: "자동으로 이름을 만들어 뒀습니다. 그대로 쓰거나 바꿔주세요.", type: "text" as const, placeholder: "" },
  { title: "이메일을 알려주세요", why: "만든 영상을 이 주소로 찾을 수 있게 합니다.", type: "email" as const, placeholder: "you@example.com" },
  { title: "비밀번호를 정해주세요", why: "8자 이상이면 됩니다.", type: "password" as const, placeholder: "8자 이상" },
]

export function Generating({
  progress,
  onSignedUp,
}: {
  progress: Progressing
  onSignedUp: (name: string) => void
}) {
  const reduced = useReducedMotion()
  const [raw, setPhase] = useState<"solo" | "hook" | "form">("solo")
  /* 모션을 줄인 환경에서는 연출 없이 바로 폼이다.
     효과 안에서 상태를 바꾸는 대신 읽는 자리에서 갈음한다 — 렌더가 한 번 덜 돈다. */
  const phase = reduced ? "form" : raw
  const [step, setStep] = useState(0)
  const [name, setName] = useState(() => suggestName())
  const inputRef = useRef<HTMLInputElement>(null)

  /* 1) 카드만 가운데 — 무엇이 벌어지는지 먼저 보여준다
     2) 오른쪽이 열리며 카드가 왼쪽으로 밀린다
     3) 붙잡아 두는 한 문장을 읽을 틈을 준 뒤 첫 질문 */
  useEffect(() => {
    if (reduced) return
    const a = setTimeout(() => setPhase("hook"), 1600)
    const b = setTimeout(() => setPhase("form"), 3800)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [reduced])

  useEffect(() => {
    if (phase === "form") setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 120)
  }, [phase, step])

  const split = phase !== "solo"
  const st = STEPS[step]

  const next = () => {
    if (step === 0) setName((v) => v.trim() || suggestName())
    if (step < STEPS.length - 1) setStep(step + 1)
    else onSignedUp(name)
  }

  return (
    <div className="grid h-svh place-items-center">
      <div
        /* 오른쪽 칸은 처음부터 자리를 차지한 채 숨어 있고, 전체를 오른쪽으로 밀어
           카드가 가운데 있는 것처럼 보이게 한다. 열릴 때 그 값을 0 으로 되돌린다 —
           폭이나 margin 을 애니메이션하면 매 프레임 레이아웃이 다시 잡힌다. */
        className="flex items-center gap-20 px-10 transition-[translate] duration-[850ms] ease-out max-lg:flex-col max-lg:gap-10"
        style={{ translate: split ? "0 0" : "calc((min(26rem, 38vw) + 5rem) / 2) 0" }}
      >
        <div className="flex flex-col items-center gap-8">
          <h2
            className={cn(
              "max-w-[14ch] text-center font-anton text-2xl leading-tight uppercase transition-[opacity,translate,height] duration-500",
              split && "h-0 -translate-y-2.5 opacity-0"
            )}
          >
            영상을 만들고 있어요
          </h2>

          <div className="grid aspect-9/16 w-[clamp(13rem,20vw,17rem)] place-items-center overflow-hidden rounded-2xl bg-linear-160 from-neutral-300 to-neutral-400 shadow-2xl motion-safe:animate-[retake-card_0.7s_cubic-bezier(0.16,1,0.3,1)_both]">
            <div className="flex w-[78%] flex-col items-center gap-3">
              <Spinner className="size-12 text-neutral-800" />
              <span className="text-sm font-bold text-neutral-900">생성 중</span>
              <span className="text-xs text-neutral-700 tabular-nums">
                {progress.label} · {progress.pct}%
              </span>
              <Progress value={progress.pct} className="h-1 bg-white/50" />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "w-[min(26rem,38vw)] shrink-0 transition-opacity delay-250 duration-500 max-lg:w-[min(26rem,90vw)]",
            split ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          {phase === "hook" ? (
            <h2 className="font-anton text-2xl leading-tight uppercase motion-safe:animate-[retake-msg_0.5s_cubic-bezier(0.16,1,0.3,1)_both]">
              영상 생성 때까지 기다릴 동안 알아가는 시간을 가질까요?
            </h2>
          ) : null}

          {phase === "form" ? (
            <div
              key={step}
              className="flex flex-col gap-3 motion-safe:animate-[retake-msg_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"
            >
              <span className="font-anton text-xs tracking-[0.14em] text-muted-foreground uppercase">
                Step {step + 1} / {STEPS.length}
              </span>
              <h3 className="font-anton text-3xl leading-tight uppercase">{st.title}</h3>
              <Field>
                <FieldLabel className="sr-only">{st.title}</FieldLabel>
                <FieldDescription>{st.why}</FieldDescription>
                <div className="mt-2 flex gap-3">
                  <Input
                    ref={inputRef}
                    size="lg"
                    type={st.type}
                    placeholder={st.placeholder}
                    defaultValue={step === 0 ? name : ""}
                    onChange={(e) => step === 0 && setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && next()}
                    className="h-14 flex-1"
                  />
                  <Button type="button" size="lg" className="h-14 px-7 text-base font-bold" onClick={next}>
                    {step === STEPS.length - 1 ? "가입" : "다음"}
                  </Button>
                </div>
                {/* 가입하느라 생성이 멈춘 것이 아니라는 사실을 계속 알린다 */}
                <FieldDescription>생성은 계속 진행되고 있습니다.</FieldDescription>
              </Field>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function SignedUp({ name }: { name: string }) {
  return (
    <div className="grid h-svh place-items-center px-8 text-center">
      <div className="flex flex-col items-center gap-5">
        <span className="grid size-18 place-items-center rounded-full bg-primary text-primary-foreground motion-safe:animate-[retake-pop_0.55s_cubic-bezier(0.34,1.4,0.5,1)_both]">
          <Check className="size-8" strokeWidth={2.6} />
        </span>
        <h2 className="font-anton text-3xl leading-tight uppercase motion-safe:animate-[retake-msg_0.5s_cubic-bezier(0.16,1,0.3,1)_0.12s_both] sm:text-4xl">
          {name}님, 가입 완료!
        </h2>
        <p className="max-w-[34ch] text-sm leading-relaxed text-muted-foreground motion-safe:animate-[retake-msg_0.5s_cubic-bezier(0.16,1,0.3,1)_0.2s_both]">
          첫 영상은 지금도 만들어지고 있습니다. 홈에서 진행 상황을 볼 수 있어요.
        </p>
      </div>
    </div>
  )
}
