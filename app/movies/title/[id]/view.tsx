/* 작품 — "이거 나한테 맞나" 를 푸는 화면.
 *
 * 이 제품의 주장이 통째로 여기에 있다. 평균 숫자 하나로는 답할 수 없으므로
 * 평균 · 분포 · 참여 수를 한 벌로 놓고, 그 옆에 관객이 붙인 태그를 둔다.
 * 태그는 평점이 말하지 못하는 것("느리다", "잠온다")을 말한다. */
"use client"

import { Clock, Star, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"

import { useLang } from "@/components/lang"
import { DivisiveBadge, PosterCard, Stars, WishButton } from "@/components/movies/bits"
import { RateDialog } from "@/components/movies/rate-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  average,
  byId,
  runtimeLabel,
  similar,
  spread,
  STEPS,
  votes,
} from "@/lib/movies/data"
import { useLibrary } from "@/lib/movies/store"

export default function TitlePage() {
  const { lang } = useLang()
  const params = useParams<{ id: string }>()
  const movie = byId(params.id)
  const rec = useLibrary((s) => s.records[params.id])

  if (!movie) notFound()

  const avg = average(movie)
  const n = votes(movie)
  const peak = Math.max(...movie.dist)
  const title = lang === "ko" ? movie.title : movie.titleEn

  return (
    <div className="flex flex-col">
      {/* ── 히어로 ────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image
            src={movie.poster}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20"
          />
          <div className="from-background via-background/90 to-background/60 absolute inset-0 bg-gradient-to-t" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-6 py-10 lg:px-10">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/movies">{lang === "ko" ? "발견" : "Discover"}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/movies/browse`}>{movie.genres[0]}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col gap-8 md:flex-row">
            <div className="w-44 shrink-0 md:w-56">
              <div className="bg-muted overflow-hidden rounded-xl border shadow-lg">
                <AspectRatio ratio={2 / 3}>
                  <Image
                    src={movie.poster}
                    alt=""
                    fill
                    sizes="224px"
                    className="object-cover"
                  />
                </AspectRatio>
              </div>
              <p className="text-muted-foreground mt-2 text-[11px] leading-snug">
                {lang === "ko"
                  ? "가상의 작품입니다. 포스터 자리에는 대체 이미지를 씁니다."
                  : "A fictional title. The poster slot uses a stand-in image."}
              </p>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-balance lg:text-4xl">
                  {title}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  {lang === "ko" ? movie.titleEn : movie.title}
                </p>
              </div>

              <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <User className="size-3.5" />
                  {movie.director}
                </span>
                <span aria-hidden>·</span>
                <span className="tabular-nums">{movie.year}</span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {runtimeLabel(movie.runtime, lang)}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {movie.genres.map((g) => (
                  <Badge key={g} variant="outline">
                    {g}
                  </Badge>
                ))}
              </div>

              <p className="max-w-[58ch] leading-relaxed">
                {lang === "ko" ? movie.synopsis : movie.synopsisEn}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <RateDialog movie={movie}>
                  <Button size="lg">
                    <Star className="size-4" />
                    {rec
                      ? lang === "ko"
                        ? `내 점수 ${rec.score.toFixed(1)} · 고치기`
                        : `Your ${rec.score.toFixed(1)} — edit`
                      : lang === "ko"
                        ? "평가하기"
                        : "Rate this"}
                  </Button>
                </RateDialog>
                <WishButton id={movie.id} variant="outline" />
                {rec?.note ? (
                  <p className="text-muted-foreground max-w-[40ch] text-sm italic">
                    “{rec.note}”
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 본문 ─────────────────────────────────────── */}
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1fr_20rem] lg:px-10">
        <div className="min-w-0">
          <Tabs defaultValue="scores">
            <TabsList>
              <TabsTrigger value="scores">
                {lang === "ko" ? "평점" : "Scores"}
              </TabsTrigger>
              <TabsTrigger value="tags">
                {lang === "ko" ? "관객 태그" : "Audience tags"}
              </TabsTrigger>
              <TabsTrigger value="similar">
                {lang === "ko" ? "비슷한 작품" : "Similar"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scores" className="mt-6 flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {lang === "ko" ? "점수가 어디에 모였나" : "Where the scores sit"}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {lang === "ko"
                      ? "평균이 같아도 분포가 다르면 다른 영화입니다. 한 봉우리로 모여 있으면 취향을 덜 타고, 양 끝으로 갈라져 있으면 사람에 따라 크게 다릅니다."
                      : "Two films with the same average are not the same film. One peak means it doesn't depend much on taste; two ends means it depends entirely on it."}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="flex flex-wrap items-end gap-6">
                    <div>
                      <div className="text-4xl font-semibold tabular-nums">
                        {avg.toFixed(1)}
                      </div>
                      <Stars value={avg} size={16} className="mt-1" />
                    </div>
                    <div className="text-muted-foreground text-sm">
                      <div className="tabular-nums">
                        {lang === "ko"
                          ? `${n.toLocaleString()}명이 평가`
                          : `${n.toLocaleString()} ratings`}
                      </div>
                      <div className="tabular-nums">
                        {lang === "ko" ? "갈림 정도" : "Spread"} {spread(movie).toFixed(2)}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <DivisiveBadge movie={movie} />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-1.5">
                    {[...STEPS].reverse().map((step) => {
                      const i = STEPS.indexOf(step)
                      const c = movie.dist[i]
                      return (
                        <div key={step} className="flex items-center gap-3">
                          <span className="text-muted-foreground w-8 shrink-0 text-right text-xs tabular-nums">
                            {step.toFixed(1)}
                          </span>
                          <Progress
                            value={(c / peak) * 100}
                            className="h-2.5 flex-1"
                          />
                          <span className="text-muted-foreground w-14 shrink-0 text-right text-xs tabular-nums">
                            {((c / n) * 100).toFixed(1)}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {n === 0 ? (
                <Empty className="border">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Star />
                    </EmptyMedia>
                    <EmptyTitle>
                      {lang === "ko" ? "아직 평가가 없습니다" : "No ratings yet"}
                    </EmptyTitle>
                    <EmptyDescription>
                      {lang === "ko"
                        ? "첫 평가가 되어 보세요. 점수만 남기고 닫아도 됩니다."
                        : "Be the first. A score alone is enough — the note is optional."}
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <RateDialog movie={movie}>
                      <Button>{lang === "ko" ? "평가하기" : "Rate this"}</Button>
                    </RateDialog>
                  </EmptyContent>
                </Empty>
              ) : null}
            </TabsContent>

            <TabsContent value="tags" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {lang === "ko" ? "관객이 붙인 말" : "What the audience said"}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {lang === "ko"
                      ? "점수는 좋고 나쁨만 말합니다. 태그는 그것이 어떤 종류의 영화인지를 말합니다 — 「느리다」는 낮은 점수가 아니라 성격입니다."
                      : "A score tells you good or bad. Tags tell you what kind — “slow” is a character, not a low score."}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {movie.tags.map((t, i) => (
                    <Badge
                      key={t}
                      variant={i === 0 ? "default" : "secondary"}
                      className="px-3 py-1 text-sm font-normal"
                    >
                      {t}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="similar" className="mt-6">
              <p className="text-muted-foreground mb-5 max-w-[60ch] text-sm leading-relaxed">
                {lang === "ko"
                  ? "장르와 관객 태그가 겹치는 순서입니다. 「비슷하다」의 기준을 숨기지 않습니다 — 감독이 같으면 가중치를 더 줍니다."
                  : "Ranked by overlapping genres and audience tags. We don't hide the criteria — a shared director weighs more."}
              </p>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {similar(movie, 8).map((m) => (
                  <PosterCard key={m.id} movie={m} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* 옆 패널 — 판단에 필요한 사실만 */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {lang === "ko" ? "한눈에" : "At a glance"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              {[
                [lang === "ko" ? "감독" : "Director", movie.director],
                [lang === "ko" ? "개봉" : "Released", String(movie.year)],
                [lang === "ko" ? "러닝타임" : "Runtime", runtimeLabel(movie.runtime, lang)],
                [lang === "ko" ? "장르" : "Genre", movie.genres.join(" / ")],
                [
                  lang === "ko" ? "평가 수" : "Ratings",
                  n.toLocaleString(),
                ],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <span className="text-muted-foreground shrink-0">{k}</span>
                  <span className="text-right">{v}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {lang === "ko" ? "같은 감독" : "Same director"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {similar(movie, 12)
                .filter((m) => m.director === movie.director)
                .slice(0, 3)
                .map((m) => (
                  <Link
                    key={m.id}
                    href={`/movies/title/${m.id}`}
                    className="hover:bg-muted/60 -mx-2 flex items-center gap-3 rounded-md px-2 py-1.5"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm">
                      {lang === "ko" ? m.title : m.titleEn}
                    </span>
                    <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                      ★{average(m).toFixed(1)}
                    </span>
                  </Link>
                ))}
              {similar(movie, 12).filter((m) => m.director === movie.director)
                .length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  {lang === "ko"
                    ? "이 감독의 다른 작품은 아직 없습니다."
                    : "No other titles from this director yet."}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
