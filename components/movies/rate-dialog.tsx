/* 평가 남기기.
 *
 * 다 본 직후의 사람은 참을성이 없다. 그래서 세 가지를 지킨다.
 *  1) 화면을 옮기지 않는다 — 어디서 눌러도 다이얼로그로 뜬다
 *  2) 점수만 남기고 닫아도 된다 — 한 줄평은 선택이다
 *  3) 이미 평가한 것은 지울 수 있다 — 되돌릴 수 없는 동작을 만들지 않는다 */
"use client"

import { Star, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { useLang } from "@/components/lang"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { type Movie } from "@/lib/movies/data"
import { useLibrary } from "@/lib/movies/store"
import { cn } from "@/lib/utils"

const NOTE_MAX = 140

/* 0.5 단위 별점 입력. 별 하나를 좌우 반으로 나눠 받는다. */
function StarInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? value

  return (
    <div
      className="flex w-fit gap-1"
      onMouseLeave={() => setHover(null)}
      role="radiogroup"
      aria-label="점수"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="relative">
          <Star
            className={cn(
              "size-9 transition-colors",
              shown >= i
                ? "fill-primary text-primary"
                : shown >= i - 0.5
                  ? "text-primary"
                  : "text-muted-foreground/30 fill-current"
            )}
          />
          {shown >= i - 0.5 && shown < i ? (
            <Star
              className="fill-primary text-primary absolute inset-0 size-9"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          ) : null}
          {[i - 0.5, i].map((v, half) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={value === v}
              aria-label={`${v}점`}
              onMouseEnter={() => setHover(v)}
              onClick={() => onChange(v)}
              className={cn(
                "focus-visible:ring-ring absolute inset-y-0 w-1/2 rounded-sm outline-none focus-visible:ring-2",
                half === 0 ? "left-0" : "right-0"
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function RateDialog({
  movie,
  children,
}: {
  movie: Movie
  children: React.ReactNode
}) {
  const { lang } = useLang()
  const existing = useLibrary((s) => s.records[movie.id])
  const rate = useLibrary((s) => s.rate)
  const unrate = useLibrary((s) => s.unrate)

  const [open, setOpen] = useState(false)
  const [score, setScore] = useState(existing?.score ?? 0)
  const [note, setNote] = useState(existing?.note ?? "")

  /* 열 때마다 저장된 값에서 다시 시작한다 — 열어 두고 취소한 흔적이 남지 않게. */
  useEffect(() => {
    if (open) {
      setScore(existing?.score ?? 0)
      setNote(existing?.note ?? "")
    }
  }, [open, existing])

  const title = lang === "ko" ? movie.title : movie.titleEn
  const over = note.length > NOTE_MAX

  const save = () => {
    rate(movie.id, score, note)
    setOpen(false)
    toast.success(
      lang === "ko" ? `«${title}» ${score.toFixed(1)}점으로 기록했습니다` : `Saved ${title} at ${score.toFixed(1)}`
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existing
              ? lang === "ko"
                ? "평가 고치기"
                : "Edit your rating"
              : lang === "ko"
                ? "이 작품 어땠나요"
                : "How was it?"}
          </DialogTitle>
          <DialogDescription>
            {title} · {movie.year} · {movie.director}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <Label>{lang === "ko" ? "점수" : "Score"}</Label>
              <span className="text-muted-foreground text-sm tabular-nums">
                {score ? `${score.toFixed(1)} / 5.0` : lang === "ko" ? "미선택" : "None"}
              </span>
            </div>
            <StarInput value={score} onChange={setScore} />
            <p className="text-muted-foreground text-xs">
              {lang === "ko"
                ? "별 왼쪽 절반을 누르면 0.5점입니다."
                : "Click the left half of a star for a half point."}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="note">
                {lang === "ko" ? "한 줄평" : "One line"}
                <span className="text-muted-foreground ml-1.5 font-normal">
                  {lang === "ko" ? "선택" : "optional"}
                </span>
              </Label>
              <span
                className={cn(
                  "text-xs tabular-nums",
                  over ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {note.length} / {NOTE_MAX}
              </span>
            </div>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder={
                lang === "ko"
                  ? "누구에게 권하고 싶은지 한 줄이면 충분합니다"
                  : "One line on who you'd recommend it to is plenty"
              }
              aria-invalid={over}
            />
            {over ? (
              <p className="text-destructive text-xs">
                {lang === "ko"
                  ? `${note.length - NOTE_MAX}자를 줄여주세요.`
                  : `Trim ${note.length - NOTE_MAX} characters.`}
              </p>
            ) : null}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          {existing ? (
            <Button
              variant="ghost"
              onClick={() => {
                unrate(movie.id)
                setOpen(false)
                toast(lang === "ko" ? "평가를 지웠습니다" : "Rating removed", {
                  action: {
                    label: lang === "ko" ? "되돌리기" : "Undo",
                    onClick: () => rate(movie.id, existing.score, existing.note),
                  },
                })
              }}
            >
              <Trash2 className="size-4" />
              {lang === "ko" ? "평가 지우기" : "Remove"}
            </Button>
          ) : (
            <span />
          )}
          <Button onClick={save} disabled={!score || over}>
            {lang === "ko" ? "기록하기" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
