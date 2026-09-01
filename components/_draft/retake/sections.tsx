/* 왜: 템플릿 목록을 랜딩과 홈이 같이 쓴다. 두 벌로 갈라 두면 한쪽만 낡는다.
 *     프라이싱은 랜딩에서만 쓰지만 같은 섹션 틀을 따른다.
 * 어디서: /retake. 2026-09-01 */
"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { CATEGORIES, TEMPLATES, VIDEOS, type Template } from "./data"
import { Clip, type VideoView } from "./media"

export function SectionHead({
  title,
  lead,
  action,
}: {
  title: string
  lead?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-8">
      <div>
        <h2 className="font-anton text-3xl leading-none tracking-tight uppercase sm:text-4xl">
          {title}
        </h2>
        {lead ? <p className="mt-3 text-muted-foreground">{lead}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function TemplateCatalog({
  view,
  onPick,
  className,
}: {
  view: VideoView
  onPick: (t: Template) => void
  className?: string
}) {
  const [cat, setCat] = useState("All")

  return (
    <div className={className}>
      <div className="mb-9 flex flex-wrap gap-2" role="group" aria-label="템플릿 분류">
        {CATEGORIES.map((c) => (
          <Button
            key={c}
            type="button"
            variant={c === cat ? "default" : "secondary"}
            size="lg"
            aria-pressed={c === cat}
            className="rounded-full"
            onClick={() => setCat(c)}
          >
            {c}
          </Button>
        ))}
      </div>

      <div className="grid gap-x-6 gap-y-8 [grid-template-columns:repeat(auto-fill,minmax(15rem,1fr))]">
        {TEMPLATES.map((t, i) =>
          cat !== "All" && t.cat !== cat ? null : (
            <article
              key={t.name}
              onClick={() => onPick(t)}
              className="group flex cursor-pointer flex-col gap-4 text-left"
            >
              <div className="relative aspect-3/4 overflow-hidden rounded-xl shadow-sm transition-transform duration-300 ease-out group-hover:-translate-y-1">
                <Clip src={VIDEOS[i % VIDEOS.length]} view={view} tone={i} />
                <Badge
                  variant="secondary"
                  className="absolute top-3 left-3 z-10 bg-card font-anton tracking-[0.1em] uppercase"
                >
                  {t.cat}
                </Badge>
                <Badge className="absolute right-3 bottom-3 z-10 font-mono tabular-nums">
                  {t.dur}
                </Badge>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg leading-tight font-bold">{t.name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
              </div>
            </article>
          )
        )}
      </div>
    </div>
  )
}

/* 플랜 세 개 중 가운데만 면을 뒤집는다 — 화면당 강조는 하나다 */
const PLANS = [
  {
    name: "Free",
    price: "₩0",
    lead: "처음 감을 잡는 단계에 맞는 플랜입니다.",
    features: ["하루 10회 생성", "720p · 5초 클립", "기본 템플릿 12종", "워터마크 포함"],
  },
  {
    name: "Creator",
    price: "₩19,000",
    lead: "매일 만드는 사람을 위한 기본 플랜입니다.",
    pick: "추천",
    features: ["무제한 리테이크", "1080p · 15초 클립", "템플릿 전체 128종", "워터마크 없음", "이미지 첨부 생성"],
  },
  {
    name: "Studio",
    price: "₩59,000",
    lead: "팀 단위로 물량을 돌릴 때 씁니다.",
    features: ["4K · 30초 클립", "동시 생성 4개", "팀 시트 3석", "API 액세스", "우선 처리 큐"],
  },
]

export function Pricing() {
  return (
    <div className="grid items-start gap-6 [grid-template-columns:repeat(auto-fit,minmax(19rem,1fr))]">
      {PLANS.map((p) => (
        <div
          key={p.name}
          className={cn(
            "flex flex-col gap-5 rounded-2xl p-10 shadow-sm",
            p.pick ? "bg-primary py-12 text-primary-foreground" : "bg-card"
          )}
        >
          <div className="flex items-center gap-3 font-anton text-sm tracking-[0.12em] uppercase">
            {p.name}
            {p.pick ? (
              <Badge variant="secondary" className="font-sans tracking-normal">
                {p.pick}
              </Badge>
            ) : null}
          </div>
          <div className="flex items-baseline gap-2 font-anton text-4xl leading-none">
            {p.price}
            <small className="font-sans text-sm font-normal opacity-60">/ 월</small>
          </div>
          <p className="text-sm opacity-75">{p.lead}</p>
          <ul className="flex flex-1 flex-col gap-3">
            {p.features.map((f) => (
              <li key={f} className="relative pl-5 text-sm before:absolute before:top-2 before:left-0 before:size-1.5 before:rounded-full before:bg-current before:opacity-40">
                {f}
              </li>
            ))}
          </ul>
          <Button
            type="button"
            size="lg"
            className={cn("h-14 w-full text-base font-bold", p.pick && "bg-card text-foreground hover:bg-card/90")}
          >
            시작하기
          </Button>
        </div>
      ))}
    </div>
  )
}
