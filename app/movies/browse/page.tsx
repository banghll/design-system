/* 탐색 — "조건이 있다" 를 푸는 화면.
 *
 * 필터는 왼쪽에 상주한다(패턴 탭의 '목록 툴바' + sidebar-14 인스펙터 발상).
 * 결과가 0건일 때가 이 화면의 진짜 설계 지점이다 — 무엇 때문에 0건인지 말해 주고,
 * 되돌릴 수 있는 버튼을 결과 자리에 둔다. */
"use client"

import { Filter, LayoutGrid, RotateCcw, Rows3, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { useLang } from "@/components/lang"
import { PosterCard, ScoreLine } from "@/components/movies/bits"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  average,
  GENRES,
  MOVIES,
  runtimeLabel,
  spread,
  votes,
  YEARS,
} from "@/lib/movies/data"

type Sort = "score" | "votes" | "year" | "runtime" | "divisive"

const SORTS: { key: Sort; ko: string; en: string }[] = [
  { key: "score", ko: "평점 높은 순", en: "Highest rated" },
  { key: "votes", ko: "평가 많은 순", en: "Most rated" },
  { key: "year", ko: "최신 순", en: "Newest" },
  { key: "runtime", ko: "짧은 순", en: "Shortest" },
  { key: "divisive", ko: "많이 갈리는 순", en: "Most divisive" },
]

export default function BrowsePage() {
  const { lang } = useLang()

  const [genres, setGenres] = useState<string[]>([])
  const [year, setYear] = useState<string>("all")
  const [minScore, setMinScore] = useState(0)
  const [maxRuntime, setMaxRuntime] = useState(180)
  const [sort, setSort] = useState<Sort>("score")
  const [view, setView] = useState<"grid" | "table">("grid")

  const dirty =
    genres.length > 0 || year !== "all" || minScore > 0 || maxRuntime < 180
  const reset = () => {
    setGenres([])
    setYear("all")
    setMinScore(0)
    setMaxRuntime(180)
  }

  const results = useMemo(() => {
    const out = MOVIES.filter(
      (m) =>
        (!genres.length || genres.some((g) => m.genres.includes(g))) &&
        (year === "all" || String(m.year) === year) &&
        average(m) >= minScore &&
        m.runtime <= maxRuntime
    )
    const by: Record<Sort, (a: typeof out[0], b: typeof out[0]) => number> = {
      score: (a, b) => average(b) - average(a),
      votes: (a, b) => votes(b) - votes(a),
      year: (a, b) => b.year - a.year,
      runtime: (a, b) => a.runtime - b.runtime,
      divisive: (a, b) => spread(b) - spread(a),
    }
    return [...out].sort(by[sort])
  }, [genres, year, minScore, maxRuntime, sort])

  /* 0건일 때 무엇이 범인인지 짚어 준다 — 가장 좁힌 조건 하나를 지목한다. */
  const culprit = useMemo(() => {
    if (results.length) return null
    const counts: [string, number][] = [
      [lang === "ko" ? "장르" : "genre", genres.length ? 1 : 0],
      [lang === "ko" ? "연도" : "year", year !== "all" ? 1 : 0],
      [lang === "ko" ? "최소 평점" : "minimum score", minScore > 3.5 ? 2 : minScore > 0 ? 1 : 0],
      [lang === "ko" ? "러닝타임" : "runtime", maxRuntime < 100 ? 2 : maxRuntime < 180 ? 1 : 0],
    ]
    const worst = counts.sort((a, b) => b[1] - a[1])[0]
    return worst[1] ? worst[0] : null
  }, [results.length, genres, year, minScore, maxRuntime, lang])

  const filters = (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Label>{lang === "ko" ? "장르" : "Genre"}</Label>
        <div className="flex flex-col gap-2">
          {GENRES.map((g) => (
            <label key={g} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox
                checked={genres.includes(g)}
                onCheckedChange={(v) =>
                  setGenres((s) => (v ? [...s, g] : s.filter((x) => x !== g)))
                }
              />
              <span className="flex-1">{g}</span>
              <span className="text-muted-foreground text-xs tabular-nums">
                {MOVIES.filter((m) => m.genres.includes(g)).length}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <Label htmlFor="year">{lang === "ko" ? "개봉 연도" : "Release year"}</Label>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger id="year" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang === "ko" ? "전체" : "All years"}</SelectItem>
            {YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <Label>{lang === "ko" ? "최소 평점" : "Minimum score"}</Label>
          <span className="text-muted-foreground text-sm tabular-nums">
            {minScore ? `★ ${minScore.toFixed(1)}` : lang === "ko" ? "제한 없음" : "Any"}
          </span>
        </div>
        <Slider
          value={[minScore]}
          min={0}
          max={4.5}
          step={0.5}
          onValueChange={([v]) => setMinScore(v)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <Label>{lang === "ko" ? "러닝타임" : "Runtime"}</Label>
          <span className="text-muted-foreground text-sm tabular-nums">
            {maxRuntime >= 180
              ? lang === "ko"
                ? "제한 없음"
                : "Any"
              : lang === "ko"
                ? `${maxRuntime}분 이하`
                : `under ${maxRuntime}m`}
          </span>
        </div>
        <Slider
          value={[maxRuntime]}
          min={80}
          max={180}
          step={5}
          onValueChange={([v]) => setMaxRuntime(v)}
        />
      </div>

      {dirty ? (
        <Button variant="outline" onClick={reset} className="w-full">
          <RotateCcw className="size-4" />
          {lang === "ko" ? "조건 모두 지우기" : "Clear all filters"}
        </Button>
      ) : null}
    </div>
  )

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-10 px-6 py-10 lg:px-10">
      {/* 필터는 데스크톱에서 상주, 모바일에서는 시트로 내린다 */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24">
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal className="text-muted-foreground size-4" />
            <h2 className="text-sm font-semibold">
              {lang === "ko" ? "조건" : "Filters"}
            </h2>
          </div>
          {filters}
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            {lang === "ko" ? "탐색" : "Browse"}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-[60ch] text-sm leading-relaxed">
            {lang === "ko"
              ? "찾는 조건이 이미 있을 때 쓰는 화면입니다. 무엇을 볼지 아직 모르겠다면 발견 쪽이 빠릅니다."
              : "For when you already know your constraints. If you don't know what you want yet, Discover is faster."}
          </p>
        </header>

        {/* 목록 툴바 — 건수 · 정렬 · 보기 전환 */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <Filter className="size-4" />
                {lang === "ko" ? "조건" : "Filters"}
                {dirty ? <Badge variant="secondary">ON</Badge> : null}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{lang === "ko" ? "조건" : "Filters"}</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-8">{filters}</div>
            </SheetContent>
          </Sheet>

          <span className="text-muted-foreground text-sm tabular-nums">
            {lang === "ko" ? `${results.length}편` : `${results.length} titles`}
          </span>

          {dirty ? (
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw className="size-3.5" />
              {lang === "ko" ? "조건 지우기" : "Clear"}
            </Button>
          ) : null}

          <div className="ml-auto flex items-center gap-2">
            <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
              <SelectTrigger size="sm" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((s) => (
                  <SelectItem key={s.key} value={s.key}>
                    {lang === "ko" ? s.ko : s.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(v) => v && setView(v as "grid" | "table")}
              variant="outline"
            >
              <ToggleGroupItem value="grid" aria-label={lang === "ko" ? "격자" : "Grid"}>
                <LayoutGrid className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="table" aria-label={lang === "ko" ? "표" : "Table"}>
                <Rows3 className="size-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {results.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Filter />
              </EmptyMedia>
              <EmptyTitle>
                {lang === "ko" ? "조건에 맞는 작품이 없습니다" : "Nothing matches"}
              </EmptyTitle>
              <EmptyDescription>
                {culprit
                  ? lang === "ko"
                    ? `${culprit} 조건이 가장 크게 좁히고 있습니다. 그것부터 풀어 보세요.`
                    : `The ${culprit} filter is narrowing this the most — start by loosening it.`
                  : lang === "ko"
                    ? "조건을 조금 풀어 보세요."
                    : "Try loosening a filter."}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={reset}>
                  <RotateCcw className="size-4" />
                  {lang === "ko" ? "조건 모두 지우기" : "Clear all filters"}
                </Button>
                <Button asChild variant="outline">
                  <Link href="/movies">
                    {lang === "ko" ? "추천 보러 가기" : "Go to Discover"}
                  </Link>
                </Button>
              </div>
            </EmptyContent>
          </Empty>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
            {results.map((m) => (
              <PosterCard key={m.id} movie={m} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{lang === "ko" ? "작품" : "Title"}</TableHead>
                  <TableHead>{lang === "ko" ? "감독" : "Director"}</TableHead>
                  <TableHead className="text-right">
                    {lang === "ko" ? "연도" : "Year"}
                  </TableHead>
                  <TableHead className="text-right">
                    {lang === "ko" ? "길이" : "Runtime"}
                  </TableHead>
                  <TableHead>{lang === "ko" ? "평점" : "Score"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <Link
                        href={`/movies/title/${m.id}`}
                        className="font-medium underline-offset-4 hover:underline"
                      >
                        {lang === "ko" ? m.title : m.titleEn}
                      </Link>
                      <div className="text-muted-foreground mt-0.5 text-xs">
                        {m.genres.join(" / ")}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {m.director}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{m.year}</TableCell>
                    <TableCell className="text-muted-foreground text-right text-sm tabular-nums">
                      {runtimeLabel(m.runtime, lang)}
                    </TableCell>
                    <TableCell>
                      <ScoreLine movie={m} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  )
}
