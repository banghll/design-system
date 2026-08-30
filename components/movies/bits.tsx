/* 씨네덱에서 반복되는 조각들.
 *
 * 새 컴포넌트를 만드는 게 아니라, 카탈로그의 컴포넌트를 이 제품의 말로 조립한 것이다.
 * 리터럴 색은 한 개도 쓰지 않는다 — 프리셋을 바꾸면 이 제품도 같이 바뀌어야 한다. */
"use client"

import { Bookmark, Check, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { useLang } from "@/components/lang"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { average, type Movie, runtimeLabel, spread, votes } from "@/lib/movies/data"
import { useLibrary } from "@/lib/movies/store"
import { cn } from "@/lib/utils"

/* ── 별점 표시 ─────────────────────────────────────────
 * 반 칸을 표현해야 해서 별 하나를 두 겹으로 겹친다. */
export function Stars({
  value,
  size = 14,
  className,
}: {
  value: number
  size?: number
  className?: string
}) {
  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      aria-label={`${value.toFixed(1)} / 5`}
    >
      <span className="text-muted-foreground/35 flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} style={{ width: size, height: size }} fill="currentColor" />
        ))}
      </span>
      <span
        className="text-primary absolute inset-0 flex overflow-hidden"
        style={{ width: `${(value / 5) * 100}%` }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            style={{ width: size, height: size, minWidth: size }}
            fill="currentColor"
          />
        ))}
      </span>
    </span>
  )
}

/* ── 평균 한 덩어리 ────────────────────────────────────
 * 이 제품의 전제상 평균은 절대 혼자 나오지 않는다.
 * 별 · 숫자 · 참여 수가 항상 붙어 다닌다. */
export function ScoreLine({ movie, big = false }: { movie: Movie; big?: boolean }) {
  const { lang } = useLang()
  const avg = average(movie)
  const n = votes(movie)
  return (
    <div className="flex items-center gap-2">
      <Stars value={avg} size={big ? 18 : 13} />
      <span className={cn("font-semibold tabular-nums", big ? "text-lg" : "text-sm")}>
        {avg.toFixed(1)}
      </span>
      <span className="text-muted-foreground text-xs tabular-nums">
        {lang === "ko" ? `${n.toLocaleString()}명` : n.toLocaleString()}
      </span>
    </div>
  )
}

/* 호불호가 심하면 알려준다 — 평균만 보고 고르면 실패하는 영화다. */
export function DivisiveBadge({ movie }: { movie: Movie }) {
  const { lang } = useLang()
  if (spread(movie) < 1.35) return null
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className="cursor-help">
          {lang === "ko" ? "호불호" : "Divisive"}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-56">
        {lang === "ko"
          ? "점수가 양 끝으로 갈렸다. 평균만 보고 고르면 실패할 수 있으니 분포를 확인하세요."
          : "Scores split toward both ends. Check the distribution before trusting the average."}
      </TooltipContent>
    </Tooltip>
  )
}

/* ── 위시리스트 토글 ───────────────────────────────────── */
export function WishButton({
  id,
  variant = "ghost",
}: {
  id: string
  variant?: "ghost" | "outline" | "secondary"
}) {
  const { lang } = useLang()
  const wish = useLibrary((s) => s.wish)
  const toggle = useLibrary((s) => s.toggleWish)
  const on = wish.includes(id)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={on ? "secondary" : variant}
          size="icon-sm"
          onClick={(e) => {
            e.preventDefault()
            toggle(id)
          }}
          aria-pressed={on}
          aria-label={
            on
              ? lang === "ko"
                ? "볼 목록에서 빼기"
                : "Remove from watchlist"
              : lang === "ko"
                ? "볼 목록에 담기"
                : "Add to watchlist"
          }
        >
          <Bookmark className={cn("size-4", on && "fill-current")} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {on
          ? lang === "ko"
            ? "볼 목록에 있음"
            : "On your watchlist"
          : lang === "ko"
            ? "볼 목록에 담기"
            : "Add to watchlist"}
      </TooltipContent>
    </Tooltip>
  )
}

/* ── 포스터 카드 ──────────────────────────────────────
 * AspectRatio 로 자리를 먼저 잡아, 이미지가 늦게 와도 격자가 안 튄다. */
export function PosterCard({
  movie,
  className,
}: {
  movie: Movie
  className?: string
}) {
  const { lang } = useLang()
  const rec = useLibrary((s) => s.records[movie.id])

  return (
    <HoverCard openDelay={280}>
      <HoverCardTrigger asChild>
        <Link
          href={`/movies/title/${movie.id}`}
          className={cn(
            "group focus-visible:ring-ring block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            className
          )}
        >
          <div className="bg-muted relative overflow-hidden rounded-lg border">
            <AspectRatio ratio={2 / 3}>
              <Image
                src={movie.poster}
                alt=""
                fill
                sizes="(max-width: 768px) 45vw, 200px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </AspectRatio>

            {rec ? (
              <div className="bg-primary text-primary-foreground absolute top-2 left-2 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums">
                <Check className="size-3" />
                {rec.score.toFixed(1)}
              </div>
            ) : null}

            <div className="absolute right-1.5 bottom-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <WishButton id={movie.id} variant="secondary" />
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-1">
            <span className="line-clamp-1 text-sm font-medium">
              {lang === "ko" ? movie.title : movie.titleEn}
            </span>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <span className="tabular-nums">{movie.year}</span>
              <span aria-hidden>·</span>
              <span className="line-clamp-1">{movie.genres[0]}</span>
            </div>
            <ScoreLine movie={movie} />
          </div>
        </Link>
      </HoverCardTrigger>

      <HoverCardContent className="w-80" side="right">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium">
                {lang === "ko" ? movie.title : movie.titleEn}
              </p>
              <p className="text-muted-foreground text-xs">
                {movie.director} · {movie.year} ·{" "}
                {runtimeLabel(movie.runtime, lang)}
              </p>
            </div>
            <DivisiveBadge movie={movie} />
          </div>
          <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
            {lang === "ko" ? movie.synopsis : movie.synopsisEn}
          </p>
          <div className="flex flex-wrap gap-1">
            {movie.tags.slice(0, 4).map((t) => (
              <Badge key={t} variant="secondary" className="font-normal">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

/* ── 가로 줄 ───────────────────────────────────────────
 * 큐레이션 한 줄. 제목 옆에 '왜 이 줄인지' 를 반드시 적는다 —
 * 이유 없는 캐러셀은 스크롤로 지나쳐진다. */
export function Row({
  title,
  why,
  movies,
  more,
}: {
  title: string
  why: string
  movies: Movie[]
  more?: string
}) {
  const { lang } = useLang()
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-0.5 text-sm">{why}</p>
        </div>
        {more ? (
          <Button asChild variant="ghost" size="sm">
            <Link href={more}>{lang === "ko" ? "더 보기" : "See all"}</Link>
          </Button>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {movies.map((m) => (
          <PosterCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  )
}
