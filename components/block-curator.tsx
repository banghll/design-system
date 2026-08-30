/* 블록 정리 모드.
 *
 * 카탈로그는 모아 두는 것으로 끝나지 않는다. 안 쓸 것을 빼야 남은 것이 추천이 된다.
 * 서드파티 180개를 그대로 두면 "다 있다" 는 말이지 "이걸 써라" 는 말이 아니다.
 *
 * 정리 모드를 켜면 카드가 링크가 아니라 선택 대상이 된다 — 같은 화면에서
 * 보고 고르고 뺄 수 있게. 결과는 data/hidden-blocks.json 에 기록되므로
 * 새로고침해도, 다른 컴퓨터에서도, 커밋한 뒤에도 그대로다.
 *
 * 지우는 게 아니라 숨기는 것이다. 파일은 그대로 있고 언제든 되돌릴 수 있다 —
 * 되돌릴 수 없는 동작을 체크박스 하나에 걸지 않는다. */
"use client"

import { Check, Eye, ListFilter, Loader2, RotateCcw, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { createContext, useCallback, useContext, useState } from "react"
import { toast } from "sonner"

import { useLang } from "@/components/lang"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

type Ctx = {
  /** 정리 모드가 켜져 있는가 */
  mode: boolean
  setMode: (v: boolean) => void
  selected: Set<string>
  toggle: (id: string) => void
  toggleMany: (ids: string[]) => void
  clear: () => void
  hidden: Set<string>
  hide: (ids: string[]) => Promise<void>
  restore: (ids: string[]) => Promise<void>
  busy: boolean
}

const CuratorCtx = createContext<Ctx | null>(null)

export function useCurator() {
  const c = useContext(CuratorCtx)
  if (!c) throw new Error("CuratorProvider 안에서만 쓸 수 있다")
  return c
}

export function CuratorProvider({
  initialHidden,
  children,
}: {
  initialHidden: string[]
  children: React.ReactNode
}) {
  const { lang } = useLang()
  const router = useRouter()
  const [mode, setMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [hidden, setHidden] = useState<Set<string>>(new Set(initialHidden))
  const [busy, setBusy] = useState(false)

  const toggle = useCallback((id: string) => {
    setSelected((s) => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }, [])

  /* 묶음 전체를 한 번에. 이미 다 골라져 있으면 해제로 동작한다 —
   * 같은 버튼이 켜기와 끄기를 겸해야 누를 때마다 결과를 예상할 수 있다. */
  const toggleMany = useCallback((ids: string[]) => {
    setSelected((s) => {
      const n = new Set(s)
      const all = ids.every((i) => n.has(i))
      for (const i of ids) {
        if (all) n.delete(i)
        else n.add(i)
      }
      return n
    })
  }, [])

  const clear = useCallback(() => setSelected(new Set()), [])

  const send = useCallback(
    async (body: { hide?: string[]; restore?: string[] }) => {
      setBusy(true)
      try {
        const res = await fetch("/api/hidden-blocks", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? "저장하지 못했습니다")
        setHidden(new Set(json.hidden))
        setSelected(new Set())
        /* 서버 쪽 목록도 다시 읽게 한다 — 파일이 정본이므로. */
        router.refresh()
        return json.hidden as string[]
      } finally {
        setBusy(false)
      }
    },
    [router]
  )

  const hide = useCallback(
    async (ids: string[]) => {
      if (!ids.length) return
      try {
        await send({ hide: ids })
        toast.success(
          lang === "ko" ? `${ids.length}개를 목록에서 뺐습니다` : `Hid ${ids.length}`,
          {
            description:
              lang === "ko"
                ? "파일은 그대로입니다. 아래 «숨긴 블록» 에서 되돌릴 수 있어요."
                : "The files are untouched — restore them from “Hidden” below.",
            action: {
              label: lang === "ko" ? "되돌리기" : "Undo",
              onClick: () => void send({ restore: ids }),
            },
          }
        )
      } catch (e) {
        toast.error(e instanceof Error ? e.message : String(e))
      }
    },
    [send, lang]
  )

  const restore = useCallback(
    async (ids: string[]) => {
      if (!ids.length) return
      try {
        await send({ restore: ids })
        toast.success(
          lang === "ko" ? `${ids.length}개를 다시 꺼냈습니다` : `Restored ${ids.length}`
        )
      } catch (e) {
        toast.error(e instanceof Error ? e.message : String(e))
      }
    },
    [send, lang]
  )

  return (
    <CuratorCtx.Provider
      value={{ mode, setMode, selected, toggle, toggleMany, clear, hidden, hide, restore, busy }}
    >
      {children}
    </CuratorCtx.Provider>
  )
}

/* ── 모드 스위치 ─────────────────────────────────────── */
export function CuratorToggle() {
  const { lang } = useLang()
  const { mode, setMode, clear, hidden } = useCurator()
  return (
    <Button
      variant={mode ? "default" : "outline"}
      size="sm"
      onClick={() => {
        setMode(!mode)
        clear()
      }}
      aria-pressed={mode}
    >
      <ListFilter className="size-4" />
      {mode
        ? lang === "ko"
          ? "정리 끝내기"
          : "Done curating"
        : lang === "ko"
          ? "목록 정리"
          : "Curate list"}
      {!mode && hidden.size ? (
        <Badge variant="secondary" className="tabular-nums">
          {hidden.size}
        </Badge>
      ) : null}
    </Button>
  )
}

/* ── 카드 위의 선택 상자 ──────────────────────────────
 * 정리 모드가 아닐 때는 아무것도 그리지 않는다. */
export function SelectBox({ id }: { id: string }) {
  const { mode, selected, toggle } = useCurator()
  if (!mode) return null
  const on = selected.has(id)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(id)
      }}
      aria-pressed={on}
      aria-label={id}
      className={cn(
        "absolute inset-0 z-10 flex items-start justify-start p-3 transition-colors",
        on ? "bg-primary/15" : "bg-background/40 hover:bg-background/20"
      )}
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-md border-2 shadow-sm transition-colors",
          on
            ? "border-primary bg-primary text-primary-foreground"
            : "border-foreground/30 bg-background"
        )}
      >
        {on ? <Check className="size-4" /> : null}
      </span>
    </button>
  )
}

/* ── 묶음 전체 고르기 ─────────────────────────────────── */
export function SelectGroup({ ids }: { ids: string[] }) {
  const { lang } = useLang()
  const { mode, selected, toggleMany } = useCurator()
  if (!mode || !ids.length) return null
  const all = ids.every((i) => selected.has(i))
  const some = !all && ids.some((i) => selected.has(i))
  return (
    <label className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2 text-xs">
      <Checkbox
        checked={all ? true : some ? "indeterminate" : false}
        onCheckedChange={() => toggleMany(ids)}
      />
      {all
        ? lang === "ko"
          ? "이 묶음 해제"
          : "Deselect group"
        : lang === "ko"
          ? "이 묶음 전체"
          : "Select group"}
    </label>
  )
}

/* ── 아래에 붙는 처리 막대 ────────────────────────────
 * 고른 것이 있을 때만 나타난다. 없을 때 자리를 차지하면
 * 정리 모드가 아닌 사람에게도 방해가 된다. */
export function CuratorBar() {
  const { lang } = useLang()
  const { mode, selected, clear, hide, busy } = useCurator()
  if (!mode || !selected.size) return null
  const ids = [...selected]

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center p-6">
      <div className="bg-popover text-popover-foreground pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg">
        <span className="text-sm tabular-nums">
          {lang === "ko" ? `${ids.length}개 선택됨` : `${ids.length} selected`}
        </span>
        <Button variant="ghost" size="sm" onClick={clear} disabled={busy}>
          <X className="size-4" />
          {lang === "ko" ? "해제" : "Clear"}
        </Button>
        <Button size="sm" onClick={() => void hide(ids)} disabled={busy}>
          {busy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ListFilter className="size-4" />
          )}
          {lang === "ko" ? "목록에서 빼기" : "Remove from list"}
        </Button>
      </div>
    </div>
  )
}

/* ── 숨긴 것들 ───────────────────────────────────────
 * 숨긴 항목이 어디로 갔는지 보이지 않으면, 되돌릴 수 있다는 말이 거짓이 된다. */
export function HiddenShelf({
  label,
}: {
  /** id → 사람이 읽는 이름 */
  label: (id: string) => string
}) {
  const { lang } = useLang()
  const { hidden, restore, busy } = useCurator()
  const ids = [...hidden].sort()
  if (!ids.length) return null

  return (
    <section className="scroll-mt-8" id="hidden">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Eye className="text-muted-foreground size-4" />
        <h3 className="text-lg font-semibold">
          {lang === "ko" ? "숨긴 블록" : "Hidden"}
        </h3>
        <Badge variant="outline" className="tabular-nums">
          {ids.length}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => void restore(ids)}
          disabled={busy}
        >
          <RotateCcw className="size-3.5" />
          {lang === "ko" ? "전부 되돌리기" : "Restore all"}
        </Button>
      </div>
      <p className="text-muted-foreground mb-4 max-w-[68ch] text-sm leading-relaxed">
        {lang === "ko"
          ? "지운 것이 아니라 목록에서 뺀 것입니다. 파일은 그대로 있고, 결과는 data/hidden-blocks.json 에 기록되어 커밋하면 다른 컴퓨터에서도 같은 목록이 보입니다."
          : "Removed from the list, not deleted. The files are untouched and the decision is recorded in data/hidden-blocks.json — commit it and every machine sees the same list."}
      </p>
      <div className="flex flex-wrap gap-2">
        {ids.map((id) => (
          <Badge key={id} variant="secondary" className="gap-1.5 py-1 font-normal">
            {label(id)}
            <button
              type="button"
              onClick={() => void restore([id])}
              disabled={busy}
              aria-label={lang === "ko" ? `${id} 되돌리기` : `Restore ${id}`}
              className="hover:text-foreground text-muted-foreground"
            >
              <RotateCcw className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
    </section>
  )
}
