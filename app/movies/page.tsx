/* slate-ui · surface: 영화 평점 사이트 · focus: 영화 카드 그리드(포스터 자리 + 내 별점) · states: 8/8
 * tokens: --color-card · --color-fill · --color-accent-* · --radius-lg · --gap-*
 * spec: none · gates: 0 fail · self: C5 H4 S5 R4 D5 P4
 *
 * 평점·후기는 만들어내지 않는다(게이트 58). 화면에 뜨는 별점은 전부 사용자가
 * 이 화면에서 매긴 값이고, 매기기 전에는 "아직 평가 없음" 자리표시자다.
 * 제목·연도·감독·장르는 지어낸 수치가 아니라 작품 사실이라 그대로 쓴다.
 */
"use client"

import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { Search, Star, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

type Movie = {
  id: string
  title: string
  year: number
  director: string
  genre: string
}
type Review = { score: number; note: string }

const GENRE_ACCENT: Record<string, string> = {
  드라마: "--color-accent-blue",
  SF: "--color-accent-cyan",
  스릴러: "--color-accent-violet",
  애니메이션: "--color-accent-lime",
  코미디: "--color-accent-orange",
}

/* 작품 사실(제목·연도·감독·장르)만 담는다. 평가 수치는 여기에 없다. */
const MOVIES: Movie[] = [
  { id: "m1", title: "기생충", year: 2019, director: "봉준호", genre: "드라마" },
  { id: "m2", title: "인터스텔라", year: 2014, director: "크리스토퍼 놀란", genre: "SF" },
  { id: "m3", title: "올드보이", year: 2003, director: "박찬욱", genre: "스릴러" },
  { id: "m4", title: "센과 치히로의 행방불명", year: 2001, director: "미야자키 하야오", genre: "애니메이션" },
  { id: "m5", title: "매드 맥스: 분노의 도로", year: 2015, director: "조지 밀러", genre: "SF" },
  { id: "m6", title: "그랜드 부다페스트 호텔", year: 2014, director: "웨스 앤더슨", genre: "코미디" },
  { id: "m7", title: "버닝", year: 2018, director: "이창동", genre: "드라마" },
  { id: "m8", title: "블레이드 러너 2049", year: 2017, director: "드니 빌뇌브", genre: "SF" },
  { id: "m9", title: "추격자", year: 2008, director: "나홍진", genre: "스릴러" },
  { id: "m10", title: "너의 이름은.", year: 2016, director: "신카이 마코토", genre: "애니메이션" },
  { id: "m11", title: "헤어질 결심", year: 2022, director: "박찬욱", genre: "드라마" },
  { id: "m12", title: "듄", year: 2021, director: "드니 빌뇌브", genre: "SF" },
  { id: "m13", title: "극한직업", year: 2019, director: "이병헌", genre: "코미디" },
  { id: "m14", title: "곡성", year: 2016, director: "나홍진", genre: "스릴러" },
  { id: "m15", title: "미나리", year: 2020, director: "정이삭", genre: "드라마" },
  { id: "m16", title: "스파이더맨: 뉴 유니버스", year: 2018, director: "밥 퍼시케티", genre: "애니메이션" },
]

const GENRES = ["전체", ...Object.keys(GENRE_ACCENT)]
const SORTS = [
  { id: "title", label: "제목순" },
  { id: "year", label: "최신순" },
  { id: "score", label: "내 별점순" },
]

function Stars({
  value,
  onChange,
  name,
}: {
  value: number
  onChange: (v: number) => void
  name: string
}) {
  /* 접근성 프리미티브를 먼저 쓴다 — 별 다섯 개를 div 로 짜지 않는다.
     Radix RadioGroup 이 좌우 방향키·포커스 관리·role 을 이미 준다. */
  return (
    <RadioGroupPrimitive.Root
      value={String(value)}
      onValueChange={(v) => onChange(Number(v))}
      aria-label="별점"
      name={name}
      className="flex"
      style={{ gap: "2px" }}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <RadioGroupPrimitive.Item
          key={n}
          value={String(n)}
          aria-label={`${n}점`}
          className="grid place-items-center outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "4px",
            color:
              n <= value
                ? "var(--color-accent-orange)"
                : "var(--color-foreground-disabled)",
          }}
        >
          <Star
            aria-hidden="true"
            fill={n <= value ? "currentColor" : "none"}
            style={{
              width: "20px",
              height: "20px",
            }}
          />
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  )
}

function StarsRead({ score }: { score: number }) {
  return (
    <div
      className="flex items-center"
      style={{ gap: "2px", color: "var(--color-accent-orange)" }}
      aria-label={`내 별점 ${score}점`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          fill={n <= score ? "currentColor" : "none"}
          style={{
            width: "12px",
            height: "12px",
            color:
              n <= score
                ? "var(--color-accent-orange)"
                : "var(--color-foreground-disabled)",
          }}
        />
      ))}
    </div>
  )
}

function Poster({ movie }: { movie: Movie }) {
  /* 포스터 이미지는 없다. 지어낸 이미지를 넣는 대신 자리표시자를 둔다. */
  return (
    <div
      className="grid w-full place-items-center border"
      style={{
        aspectRatio: "2 / 3",
        background: "var(--color-fill-subtle)",
        borderColor: "var(--color-border-subtle)",
        borderRadius: "10px",
        color: `var(${GENRE_ACCENT[movie.genre]})`,
      }}
    >
      <span className="text-display-3xl" aria-hidden="true">
        {movie.title.slice(0, 1)}
      </span>
    </div>
  )
}

export default function MoviesPage() {
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [genre, setGenre] = useState("전체")
  const [sort, setSort] = useState("title")
  const [reviews, setReviews] = useState<Record<string, Review>>({})
  const [openId, setOpenId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Review>({ score: 0, note: "" })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = MOVIES.filter((m) => {
      const hitQ =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q)
      const hitG = genre === "전체" || m.genre === genre
      return hitQ && hitG
    })
    return [...list].sort((a, b) => {
      if (sort === "year") return b.year - a.year
      if (sort === "score")
        return (reviews[b.id]?.score ?? 0) - (reviews[a.id]?.score ?? 0)
      return a.title.localeCompare(b.title, "ko")
    })
  }, [query, genre, sort, reviews])

  const rated = Object.keys(reviews).length
  const open = openId ? MOVIES.find((m) => m.id === openId) ?? null : null

  const openDetail = (m: Movie) => {
    setOpenId(m.id)
    setDraft(reviews[m.id] ?? { score: 0, note: "" })
    setSaveError(null)
  }

  const save = async () => {
    if (!open) return
    if (draft.score === 0) {
      setSaveError("별점을 먼저 골라주세요. 1점부터 5점까지 고를 수 있습니다.")
      return
    }
    setSaveError(null)
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    setReviews((prev) => ({ ...prev, [open.id]: draft }))
    setSaving(false)
    setOpenId(null)
  }

  const clearFilters = () => {
    setQuery("")
    setGenre("전체")
  }

  return (
    <main
      className="mx-auto w-full"
      style={{
        maxWidth: "1200px",
        padding: "24px",
        paddingBottom: "48px",
      }}
    >
      <header style={{ marginBottom: "24px" }}>
        <Button
          variant="ghost"
          size="sm"
          asChild
          style={{ marginBottom: "12px" }}
        >
          <Link href="/">← 디자인 시스템</Link>
        </Button>
        <h1 className="text-title-xl" style={{ marginBottom: "6px" }}>
          내가 본 영화
        </h1>
        <p className="text-body-sm text-subtle" style={{ maxWidth: "60ch" }}>
          {rated === 0
            ? `${MOVIES.length}편이 담겨 있습니다. 아직 매긴 별점이 없습니다.`
            : `${MOVIES.length}편 중 ${rated}편에 별점을 매겼습니다.`}
        </p>
      </header>

      {/* 필터 — 초점은 그리드다. 필터는 한 줄로 눕히고 강등한다. */}
      <div
        className="flex flex-wrap items-center"
        style={{ gap: "8px", marginBottom: "16px" }}
      >
        <div className="relative min-w-0 flex-1" style={{ minWidth: "18ch" }}>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 -translate-y-1/2"
            style={{
              left: "8px",
              width: "16px",
              height: "16px",
              color: "var(--color-foreground-subtle)",
            }}
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목이나 감독으로 찾기"
            aria-label="영화 검색"
            style={{ paddingLeft: "24px" }}
          />
        </div>

        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger aria-label="장르 고르기">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GENRES.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger aria-label="정렬 기준">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator style={{ marginBottom: "24px" }} />

      {loading ? (
        <ul
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          style={{ gap: "16px" }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="flex flex-col" style={{ gap: "8px" }}>
              <Skeleton style={{ aspectRatio: "2 / 3", width: "100%" }} />
              <Skeleton style={{ height: "var(--line-height-base)", width: "80%" }} />
              <Skeleton style={{ height: "var(--line-height-sm)", width: "50%" }} />
            </li>
          ))}
        </ul>
      ) : visible.length === 0 ? (
        <div
          className="flex flex-col items-center text-center"
          style={{ gap: "12px", padding: "48px 0" }}
        >
          <X
            aria-hidden="true"
            style={{
              width: "24px",
              height: "24px",
              color: "var(--color-foreground-subtle)",
            }}
          />
          <div>
            <p className="text-body-base">찾는 영화가 없습니다</p>
            <p className="text-body-sm text-subtle">
              {query ? `"${query}"` : "지금 조건"}에 맞는 작품이 목록에
              없습니다.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            조건 지우기
          </Button>
        </div>
      ) : (
        <ul
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          style={{ gap: "16px" }}
        >
          {visible.map((m) => {
            const mine = reviews[m.id]
            return (
              <li key={m.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => openDetail(m)}
                  className="flex w-full min-w-0 flex-col text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  style={{
                    gap: "8px",
                    borderRadius: "10px",
                  }}
                >
                  <Poster movie={m} />
                  <div className="flex min-w-0 flex-col" style={{ gap: "2px" }}>
                    <span className="text-body-sm min-w-0 truncate">
                      {m.title}
                    </span>
                    <span className="text-caption-2xs text-subtle">
                      {m.year} · {m.director}
                    </span>
                    {mine ? (
                      <StarsRead score={mine.score} />
                    ) : (
                      <span className="text-caption-2xs text-subtle">
                        아직 평가 없음
                      </span>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <Dialog
        open={open !== null}
        onOpenChange={(v) => {
          if (!v) setOpenId(null)
        }}
      >
        <DialogContent>
          {open ? (
            <>
              <DialogHeader>
                <DialogTitle>{open.title}</DialogTitle>
                <DialogDescription>
                  {open.year} · {open.director}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col" style={{ gap: "16px" }}>
                <Badge
                  variant="outline"
                  className="w-fit"
                  style={{ color: `var(${GENRE_ACCENT[open.genre]})` }}
                >
                  {open.genre}
                </Badge>

                <div className="flex flex-col" style={{ gap: "6px" }}>
                  <Label>내 별점</Label>
                  <Stars
                    name={`score-${open.id}`}
                    value={draft.score}
                    onChange={(score) => {
                      setDraft((d) => ({ ...d, score }))
                      setSaveError(null)
                    }}
                  />
                </div>

                <div className="flex flex-col" style={{ gap: "6px" }}>
                  <Label htmlFor="note">메모</Label>
                  <Textarea
                    id="note"
                    rows={3}
                    value={draft.note}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, note: e.target.value }))
                    }
                    placeholder="기억하고 싶은 장면이나 생각"
                  />
                </div>

                {saveError ? (
                  <p
                    role="alert"
                    className="text-body-sm"
                    style={{ color: "var(--color-destructive)" }}
                  >
                    {saveError}
                  </p>
                ) : null}
              </div>

              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setOpenId(null)}
                  disabled={saving}
                >
                  취소
                </Button>
                <Button onClick={() => void save()} disabled={saving}>
                  {saving ? "저장 중" : reviews[open.id] ? "수정" : "저장"}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  )
}
