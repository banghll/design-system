/* 왜: 랜딩 → 대화 → 생성 대기 + 가입 → 완료 → 홈 을 한 화면 안에서 갈아 끼운다.
 *     라우트를 나누면 진행 중인 생성 상태가 화면마다 끊긴다.
 * 어디서: /retake. 2026-09-01 */
"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Chat } from "./chat"
import { Generating, SignedUp, useGenerationProgress } from "./generating"
import { Hero, type StartInput } from "./hero"
import { Home } from "./home"
import { VideoScope, type VideoView } from "./media"
import { Pricing, SectionHead, TemplateCatalog } from "./sections"

type Stage = "landing" | "chat" | "gen" | "done" | "home"

const SCOPES: Record<Stage, VideoView[]> = {
  landing: ["hero", "catalog"],
  chat: ["chat"],
  gen: [],
  done: [],
  home: ["home"],
}

export function RetakeFlow() {
  const [stage, setStage] = useState<Stage>("landing")
  const [input, setInput] = useState<StartInput>({ text: "", template: null, image: false })
  const [name, setName] = useState("")
  const progress = useGenerationProgress(stage === "gen" || stage === "done" || stage === "home")

  const start = (v: StartInput) => {
    setInput(v)
    setStage("chat")
  }

  const restart = () => {
    setInput({ text: "", template: null, image: false })
    setStage("landing")
  }

  return (
    <VideoScope views={SCOPES[stage]}>
      <div className="min-h-svh bg-linear-to-b from-background to-[var(--retake-surface)] text-foreground">
        {stage === "home" ? null : (
          <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between px-8 py-6">
            <button
              type="button"
              onClick={restart}
              className="pointer-events-auto font-anton text-2xl leading-none tracking-[0.06em] uppercase"
            >
              Retake
            </button>
            {stage === "landing" ? (
              <Button type="button" variant="outline" size="lg" className="pointer-events-auto rounded-full">
                Log in
              </Button>
            ) : (
              <button
                type="button"
                onClick={restart}
                className="pointer-events-auto text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                처음으로
              </button>
            )}
          </header>
        )}

        <main className={cn(stage === "landing" ? "" : "fixed inset-0 z-20 overflow-hidden")}>
          {stage === "landing" ? (
            <>
              <Hero onStart={start} />

              <section
                id="templates"
                className="bg-linear-to-b from-[var(--retake-surface)] from-0% to-background to-26% px-10 py-28"
              >
                <div className="mx-auto w-[min(97.5rem,100%)]">
                  <SectionHead
                    title="Start from a template"
                    lead="모든 템플릿은 수정 가능한 프롬프트입니다. 하나 골라서 원하는 만큼 다시 찍으세요."
                    action={
                      <a
                        href="#templates"
                        className="border-b-2 pb-1 font-anton text-sm tracking-[0.1em] uppercase hover:opacity-60"
                      >
                        See all 128
                      </a>
                    }
                  />
                  <TemplateCatalog
                    view="catalog"
                    onPick={(t) => start({ text: "", template: t, image: false })}
                  />
                </div>
              </section>

              <section className="bg-[var(--retake-surface-2)] px-10 py-28">
                <div className="mx-auto w-[min(97.5rem,100%)]">
                  <SectionHead
                    title="Pricing"
                    lead="리테이크는 어느 플랜에서든 무료로 시작합니다. 해상도와 동시 생성 수만 달라집니다."
                  />
                  <Pricing />
                </div>
              </section>

              <footer className="bg-[var(--retake-surface-2)] px-10 py-10 text-center text-xs text-muted-foreground">
                © 2026 Retake · 데모 화면입니다. 영상은 공개 테스트 클립입니다.
              </footer>
            </>
          ) : null}

          {stage === "chat" ? <Chat input={input} onGenerate={() => setStage("gen")} /> : null}

          {stage === "gen" ? (
            <Generating
              progress={progress}
              onSignedUp={(n) => {
                setName(n)
                setStage("done")
                setTimeout(() => setStage("home"), 2400)
              }}
            />
          ) : null}

          {stage === "done" ? <SignedUp name={name} /> : null}

          {stage === "home" ? (
            <Home name={name} progress={progress} onPick={() => undefined} />
          ) : null}
        </main>
      </div>
    </VideoScope>
  )
}
