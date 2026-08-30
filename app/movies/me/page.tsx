/* 내 기록 — "내 취향이 뭐지" 를 푸는 화면.
 *
 * 다른 세 화면은 카탈로그를 보여주지만 여기는 사용자 자신을 보여준다.
 * 그래서 숫자가 아니라 문장으로 먼저 요약한다 — "당신은 드라마를 많이 보고,
 * 평균보다 후하게 줍니다" 같은 것. 숫자는 그 뒤에 근거로 붙는다.
 *
 * 기록이 0건일 때가 이 화면의 기본 상태다. 빈 화면이 아니라 시작점이 되어야 한다. */
"use client"

import { Bookmark, Star, Trash2, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

import { useLang } from "@/components/lang"
import { PosterCard, Stars } from "@/components/movies/bits"
import { RateDialog } from "@/components/movies/rate-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { average, byId, MOVIES, runtimeLabel } from "@/lib/movies/data"
import { useLibrary } from "@/lib/movies/store"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartConfig = {
  count: { label: "편", color: "var(--chart-1)" },
} satisfies ChartConfig

export default function MyLogPage() {
  const { lang } = useLang()
  const records = useLibrary((s) => s.records)
  const wish = useLibrary((s) => s.wish)
  const clear = useLibrary((s) => s.clear)

  /* 로컬 저장소는 마운트 뒤에야 읽힌다. 그 전에는 뼈대를 보여준다 —
   * 0건 화면을 잠깐 보였다가 채우면 '기록이 사라졌나' 로 읽힌다. */
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])

  const rated = useMemo(
    () =>
      Object.entries(records)
        .map(([id, r]) => ({ movie: byId(id)!, ...r }))
        .filter((x) => x.movie)
        .sort((a, b) => b.at.localeCompare(a.at)),
    [records]
  )

  const stats = useMemo(() => {
    if (!rated.length) return null
    const mine = rated.reduce((s, r) => s + r.score, 0) / rated.length
    const crowd =
      rated.reduce((s, r) => s + average(r.movie), 0) / rated.length
    const minutes = rated.reduce((s, r) => s + r.movie.runtime, 0)

    const genreCount: Record<string, number> = {}
    for (const r of rated)
      for (const g of r.movie.genres) genreCount[g] = (genreCount[g] ?? 0) + 1
    const genres = Object.entries(genreCount)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)

    return { mine, crowd, minutes, genres, top: genres[0] }
  }, [rated])

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-5xl px-6 py-12 lg:px-10">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-3 h-5 w-96" />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="mt-8 h-64 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12 lg:px-10">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          {lang === "ko" ? "내 기록" : "My log"}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-[60ch] text-sm leading-relaxed">
          {lang === "ko"
            ? "평가한 것과 볼 것. 여기 쌓인 것이 많아질수록 취향의 윤곽이 보입니다. 기록은 이 브라우저에만 저장됩니다."
            : "What you've rated and what's next. The more that piles up here, the clearer the shape of your taste. Everything is stored in this browser only."}
        </p>
      </header>

      {rated.length === 0 && wish.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Star />
            </EmptyMedia>
            <EmptyTitle>
              {lang === "ko" ? "아직 기록이 없습니다" : "Nothing logged yet"}
            </EmptyTitle>
            <EmptyDescription>
              {lang === "ko"
                ? "본 영화를 서너 편만 평가해도 장르 분포와 점수 습관이 보이기 시작합니다. 포스터 위 별 버튼으로 바로 남길 수 있어요."
                : "Rate three or four and the genre spread and your scoring habits start to show. The star on any poster is enough."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild>
                <Link href="/movies">
                  {lang === "ko" ? "추천 보러 가기" : "Go to Discover"}
                </Link>
              </Button>
              <RateDialog movie={MOVIES[0]}>
                <Button variant="outline">
                  <Star className="size-4" />
                  {lang === "ko" ? "바로 하나 평가해보기" : "Try rating one"}
                </Button>
              </RateDialog>
            </div>
          </EmptyContent>
        </Empty>
      ) : (
        <Tabs defaultValue="rated">
          <TabsList>
            <TabsTrigger value="rated">
              {lang === "ko" ? "평가함" : "Rated"}
              {rated.length ? (
                <Badge variant="secondary" className="ml-1.5 tabular-nums">
                  {rated.length}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="wish">
              {lang === "ko" ? "볼 목록" : "Watchlist"}
              {wish.length ? (
                <Badge variant="secondary" className="ml-1.5 tabular-nums">
                  {wish.length}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>

          {/* ── 평가함 ─────────────────────────────────── */}
          <TabsContent value="rated" className="mt-8 flex flex-col gap-8">
            {stats ? (
              <>
                {/* 숫자보다 문장이 먼저 — 사람은 자기 얘기를 문장으로 읽는다 */}
                <Card>
                  <CardContent className="flex items-start gap-4">
                    <TrendingUp className="text-muted-foreground mt-0.5 size-5 shrink-0" />
                    <p className="text-base leading-relaxed">
                      {lang === "ko" ? (
                        <>
                          지금까지 <b>{rated.length}편</b>을 기록했고, 가장 많이 본
                          장르는 <b>{stats.top.genre}</b>입니다. 평균{" "}
                          <b>{stats.mine.toFixed(1)}점</b>을 주었는데 같은 작품들의
                          전체 평균은 {stats.crowd.toFixed(1)}점이니,{" "}
                          <b>
                            {stats.mine > stats.crowd + 0.15
                              ? "남들보다 후한 편"
                              : stats.mine < stats.crowd - 0.15
                                ? "남들보다 짠 편"
                                : "대체로 평균과 비슷한 편"}
                          </b>
                          입니다.
                        </>
                      ) : (
                        <>
                          You&apos;ve logged <b>{rated.length}</b> titles, most of them{" "}
                          <b>{stats.top.genre}</b>. Your average is{" "}
                          <b>{stats.mine.toFixed(1)}</b> against a crowd average of{" "}
                          {stats.crowd.toFixed(1)} on the same films — so you rate{" "}
                          <b>
                            {stats.mine > stats.crowd + 0.15
                              ? "more generously than most"
                              : stats.mine < stats.crowd - 0.15
                                ? "more harshly than most"
                                : "about the same as most"}
                          </b>
                          .
                        </>
                      )}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      label: lang === "ko" ? "기록한 편수" : "Titles logged",
                      value: String(rated.length),
                      sub: lang === "ko" ? `볼 목록 ${wish.length}편` : `${wish.length} on watchlist`,
                    },
                    {
                      label: lang === "ko" ? "내 평균" : "Your average",
                      value: stats.mine.toFixed(1),
                      sub:
                        lang === "ko"
                          ? `전체 평균 ${stats.crowd.toFixed(1)}`
                          : `crowd ${stats.crowd.toFixed(1)}`,
                    },
                    {
                      label: lang === "ko" ? "본 시간" : "Time watched",
                      value: runtimeLabel(stats.minutes, lang),
                      sub:
                        lang === "ko"
                          ? `${Math.round(stats.minutes / 60)}시간`
                          : `${Math.round(stats.minutes / 60)} hours`,
                    },
                  ].map((s) => (
                    <Card key={s.label}>
                      <CardHeader>
                        <CardTitle className="text-muted-foreground text-sm font-normal">
                          {s.label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-semibold tabular-nums">
                          {s.value}
                        </div>
                        <p className="text-muted-foreground mt-1 text-xs tabular-nums">
                          {s.sub}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {lang === "ko" ? "장르 분포" : "Genre spread"}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {lang === "ko"
                        ? "한쪽으로 몰려 있다면 취향이 뚜렷한 것이고, 고르게 퍼져 있다면 아직 탐색 중인 것입니다. 어느 쪽이든 문제는 아닙니다."
                        : "Concentrated means your taste is settled; spread out means you're still exploring. Neither is a problem."}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-56 w-full">
                      <BarChart data={stats.genres} layout="vertical" margin={{ left: 8 }}>
                        <CartesianGrid horizontal={false} />
                        <YAxis
                          dataKey="genre"
                          type="category"
                          tickLine={false}
                          axisLine={false}
                          width={70}
                          tick={{ fontSize: 12 }}
                        />
                        <XAxis type="number" hide />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      {lang === "ko" ? "최근 평가" : "Recent ratings"}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clear}
                      className="text-muted-foreground"
                    >
                      <Trash2 className="size-3.5" />
                      {lang === "ko" ? "기록 전부 지우기" : "Clear everything"}
                    </Button>
                  </div>
                  <div className="overflow-x-auto rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{lang === "ko" ? "작품" : "Title"}</TableHead>
                          <TableHead>{lang === "ko" ? "내 점수" : "Yours"}</TableHead>
                          <TableHead className="text-right">
                            {lang === "ko" ? "전체" : "Crowd"}
                          </TableHead>
                          <TableHead>{lang === "ko" ? "한 줄평" : "Note"}</TableHead>
                          <TableHead className="w-10" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rated.map((r) => (
                          <TableRow key={r.movie.id}>
                            <TableCell>
                              <Link
                                href={`/movies/title/${r.movie.id}`}
                                className="font-medium underline-offset-4 hover:underline"
                              >
                                {lang === "ko" ? r.movie.title : r.movie.titleEn}
                              </Link>
                              <div className="text-muted-foreground mt-0.5 text-xs tabular-nums">
                                {r.movie.year} · {r.movie.genres.join(" / ")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Stars value={r.score} size={12} />
                                <span className="text-sm font-medium tabular-nums">
                                  {r.score.toFixed(1)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-right text-sm tabular-nums">
                              {average(r.movie).toFixed(1)}
                            </TableCell>
                            <TableCell className="text-muted-foreground max-w-56 truncate text-sm">
                              {r.note ?? "—"}
                            </TableCell>
                            <TableCell>
                              <RateDialog movie={r.movie}>
                                <Button variant="ghost" size="icon-sm">
                                  <Star className="size-4" />
                                </Button>
                              </RateDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            ) : (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Star />
                  </EmptyMedia>
                  <EmptyTitle>
                    {lang === "ko" ? "평가한 작품이 없습니다" : "No ratings yet"}
                  </EmptyTitle>
                  <EmptyDescription>
                    {lang === "ko"
                      ? "볼 목록은 있으니, 그 중 하나를 보고 나서 여기로 돌아오세요."
                      : "You have a watchlist — come back after you've seen one."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>

          {/* ── 볼 목록 ────────────────────────────────── */}
          <TabsContent value="wish" id="wish" className="mt-8">
            {wish.length ? (
              <>
                <p className="text-muted-foreground mb-6 max-w-[60ch] text-sm leading-relaxed">
                  {lang === "ko"
                    ? "담아 둔 순서대로입니다. 시간이 얼마나 비었는지에 맞춰 고르세요 — 러닝타임을 함께 적어 두었습니다."
                    : "In the order you saved them. Pick by how much time you actually have — runtimes are listed."}
                </p>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                  {wish
                    .map((id) => byId(id))
                    .filter(Boolean)
                    .map((m) => (
                      <PosterCard key={m!.id} movie={m!} />
                    ))}
                </div>
              </>
            ) : (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Bookmark />
                  </EmptyMedia>
                  <EmptyTitle>
                    {lang === "ko" ? "볼 목록이 비어 있습니다" : "Your watchlist is empty"}
                  </EmptyTitle>
                  <EmptyDescription>
                    {lang === "ko"
                      ? "포스터에 마우스를 올리면 나오는 책갈피 버튼으로 담을 수 있습니다."
                      : "Hover any poster and use the bookmark button to save it."}
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button asChild>
                    <Link href="/movies/browse">
                      {lang === "ko" ? "탐색하러 가기" : "Browse titles"}
                    </Link>
                  </Button>
                </EmptyContent>
              </Empty>
            )}
          </TabsContent>
        </Tabs>
      )}

      <Separator className="my-12" />

      <p className="text-muted-foreground text-xs leading-relaxed">
        {lang === "ko"
          ? "씨네덱은 이 디자인 시스템으로 만든 예제 제품입니다. 작품 24편은 전부 가상이며, 새로 만든 컴포넌트 없이 카탈로그의 컴포넌트만 조립해 만들었습니다."
          : "CineDeck is a sample product built on this design system. All 24 titles are fictional, and no new components were created — everything is assembled from the catalog."}
      </p>
    </div>
  )
}
