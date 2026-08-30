/* 발견 — "뭘 볼지 모르겠다" 를 푸는 화면.
 *
 * 목록을 많이 보여주는 것으로는 안 풀린다. 후보가 많은 게 문제였기 때문이다.
 * 그래서 위에서 아래로 좁혀 간다: 오늘 한 편 → 지금 사람들이 보는 것 →
 * 조건이 붙은 줄들. 각 줄에는 '왜 이 줄인지' 를 반드시 적는다. */
"use client"

import { ArrowRight, Clock, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { useLang } from "@/components/lang"
import { DivisiveBadge, PosterCard, Row, ScoreLine, Stars } from "@/components/movies/bits"
import { RateDialog } from "@/components/movies/rate-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  average,
  divisive,
  MOVIES,
  newest,
  popular,
  runtimeLabel,
  top,
} from "@/lib/movies/data"

/* 편집자가 고른 한 편. pick 문구가 있는 것 중 평점이 가장 높은 것. */
const HERO = [...MOVIES.filter((m) => m.pick)].sort(
  (a, b) => average(b) - average(a)
)[0]

export default function DiscoverPage() {
  const { lang } = useLang()

  return (
    <div className="flex flex-col">
      {/* ── 오늘 한 편 ─────────────────────────────────
        * 추천은 하나여야 한다. 셋을 주면 다시 고르는 일이 된다. */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image
            src={HERO.poster}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="from-background via-background/85 to-background/40 absolute inset-0 bg-gradient-to-r" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-16 lg:px-10 lg:py-20">
          <Badge variant="secondary" className="w-fit">
            {lang === "ko" ? "오늘의 한 편" : "Today's pick"}
          </Badge>

          <div className="flex flex-col gap-4">
            <h1 className="max-w-[16ch] text-4xl leading-tight font-semibold tracking-tight text-balance lg:text-5xl">
              {lang === "ko" ? HERO.title : HERO.titleEn}
            </h1>
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span>{HERO.director}</span>
              <span aria-hidden>·</span>
              <span className="tabular-nums">{HERO.year}</span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {runtimeLabel(HERO.runtime, lang)}
              </span>
              <span aria-hidden>·</span>
              <span>{HERO.genres.join(" / ")}</span>
            </div>
          </div>

          <p className="max-w-[52ch] text-base leading-relaxed">
            {lang === "ko" ? HERO.synopsis : HERO.synopsisEn}
          </p>

          {HERO.pick ? (
            <blockquote className="border-primary max-w-[52ch] border-l-2 pl-4 text-sm italic">
              {HERO.pick}
            </blockquote>
          ) : null}

          <div className="flex flex-wrap items-center gap-4">
            <ScoreLine movie={HERO} big />
            <DivisiveBadge movie={HERO} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild size="lg">
              <Link href={`/movies/title/${HERO.id}`}>
                {lang === "ko" ? "자세히 보기" : "See details"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <RateDialog movie={HERO}>
              <Button size="lg" variant="outline">
                <Star className="size-4" />
                {lang === "ko" ? "봤어요, 평가하기" : "I've seen it — rate"}
              </Button>
            </RateDialog>
          </div>
        </div>
      </section>

      {/* ── 줄들 ─────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-14 lg:px-10">
        <Row
          title={lang === "ko" ? "지금 사람들이 보는 것" : "What people are watching"}
          why={
            lang === "ko"
              ? "최근 평가 참여가 가장 많은 순서. 화제성이지 완성도가 아니다."
              : "Most rated recently. This is buzz, not quality."
          }
          movies={popular(6)}
          more="/movies/browse?sort=votes"
        />

        <Separator />

        <Row
          title={lang === "ko" ? "실패 확률이 낮은 것" : "Safe bets"}
          why={
            lang === "ko"
              ? "평균이 높고 점수가 한쪽에 모여 있다 — 취향을 크게 타지 않는다는 뜻."
              : "High average with tightly clustered scores — these don't depend much on taste."
          }
          movies={top(6)}
          more="/movies/browse?sort=score"
        />

        <Separator />

        <Row
          title={lang === "ko" ? "갈리는 것" : "The divisive ones"}
          why={
            lang === "ko"
              ? "점수가 양 끝으로 벌어진 작품들. 평균만 보고 고르면 실패하지만, 맞으면 인생작이 된다."
              : "Scores split toward both ends. The average will mislead you — but when it lands, it lands hard."
          }
          movies={divisive(6)}
        />

        <Separator />

        <Row
          title={lang === "ko" ? "새로 들어온 것" : "Just added"}
          why={
            lang === "ko"
              ? "표본이 적어 평점이 아직 흔들린다. 숫자보다 태그를 보고 고르는 편이 낫다."
              : "Small samples, so the scores still move. Read the tags rather than the number."
          }
          movies={newest(6)}
          more="/movies/browse?sort=year"
        />
      </div>
    </div>
  )
}
