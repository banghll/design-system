"use client"

/* 파운데이션을 실제로 고치는 칸.
 *
 * 이 패널의 위쪽(테마 슬라이더)과 여기는 하는 일이 다르다. 위는 «지금 화면에서
 * 굴려 보는» 값이라 :root 에 인라인으로 얹히고 새로고침하면 사라진다.
 * 여기는 «시스템이 이렇게 생겼다» 를 정하는 자리라 data/foundation.json 에 쓰고
 * globals.css 를 다시 만든다. 둘을 한 칸에 섞으면 무엇이 남고 무엇이 사라지는지
 * 아무도 모르게 된다.
 *
 * 지우기가 더하기보다 어렵다. 이름 하나를 지우면 그 이름을 가리키던 레시피가
 * 전부 «없는 곳» 을 가리키게 되고, 그 자리들은 조용히 기본값으로 떨어진다.
 * 그래서 고칠 때마다 «이 변경 때문에 어긋난 것» 을 받아서 보여 주고,
 * 무엇을 어디로 옮길지 고르게 한다. */

import { AlertTriangle, Check, Loader2, Plus, Sparkles, Trash2, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { useLang } from "@/components/lang"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import type { Change, Fix, FoundationData } from "@/lib/reconcile"

/** 어떤 CSS 색이든 <input type="color"> 이 받는 hex 로. 브라우저에게 그리게 해서 읽는다. */
function toHex(css: string): string {
  try {
    const c = document.createElement("canvas")
    c.width = c.height = 1
    const x = c.getContext("2d")
    if (!x) return "#000000"
    x.fillStyle = "#000000"
    x.fillStyle = css
    x.fillRect(0, 0, 1, 1)
    const [r, g, b] = x.getImageData(0, 0, 1, 1).data
    return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`
  } catch {
    return "#000000"
  }
}

type CleanupState = {
  fixes: (Fix & { chosen: boolean })[]
  summary: string
  source: "rules" | "claude"
} | null

export function FoundationTokens({ mode }: { mode: "light" | "dark" }) {
  const { lang } = useLang()
  const ko = lang === "ko"
  const [foundation, setFoundation] = useState<FoundationData | null>(null)
  const [offline, setOffline] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [cleanup, setCleanup] = useState<CleanupState>(null)
  const [newColor, setNewColor] = useState("")
  const [newTextName, setNewTextName] = useState("")
  const [newTextValue, setNewTextValue] = useState("1rem")

  useEffect(() => {
    /* 떠난 뒤에 도착한 응답으로 상태를 건드리지 않는다. */
    let alive = true
    fetch("/api/foundation")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("no api"))))
      .then((j) => {
        if (alive) setFoundation(j.foundation)
      })
      .catch(() => {
        /* 정적 빌드에는 이 API 가 없다. 그때는 «여기서는 못 고친다» 고 말한다 —
         * 고칠 수 있는 것처럼 보여 놓고 아무 일도 안 일어나는 것보다 낫다. */
        if (alive) setOffline(true)
      })
    return () => {
      alive = false
    }
  }, [])

  /* 정리안을 규칙 → Claude 순으로 받는다. Claude 가 없으면 규칙의 답이 그대로 답이다. */
  const refine = useCallback(
    async (change: Change, fixes: Fix[], next: FoundationData) => {
      if (!fixes.length) {
        setCleanup(null)
        return
      }
      try {
        const res = await fetch("/api/token-cleanup", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ change, fixes, foundation: next }),
        })
        const j = await res.json()
        setCleanup({
          fixes: (j.fixes as Fix[]).map((f) => ({ ...f, chosen: f.safe })),
          summary: j.summary ?? "",
          source: j.source ?? "rules",
        })
      } catch {
        setCleanup({
          fixes: fixes.map((f) => ({ ...f, chosen: f.safe })),
          summary: ko ? `정리할 것 ${fixes.length}건` : `${fixes.length} to clean up`,
          source: "rules",
        })
      }
    },
    [ko]
  )

  const send = useCallback(
    async (change: Change, label: string) => {
      setBusy(label)
      try {
        const res = await fetch("/api/foundation", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ change }),
        })
        const j = await res.json()
        if (!res.ok) throw new Error(j.error ?? "고치지 못했습니다")
        setFoundation(j.foundation)
        await refine(change, j.fixes ?? [], j.foundation)
        return true
      } catch (e) {
        toast.error(e instanceof Error ? e.message : String(e))
        return false
      } finally {
        setBusy(null)
      }
    },
    [refine]
  )

  const applyChosen = useCallback(async () => {
    if (!cleanup) return
    const chosen = cleanup.fixes.filter((f) => f.chosen)
    if (!chosen.length) {
      setCleanup(null)
      return
    }
    setBusy("cleanup")
    try {
      const res = await fetch("/api/foundation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fixes: chosen }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error ?? "정리하지 못했습니다")
      setFoundation(j.foundation)
      setCleanup(null)
      toast.success(ko ? `${chosen.length}건을 정리했습니다` : `Cleaned up ${chosen.length}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(null)
    }
  }, [cleanup, ko])

  if (offline) {
    return (
      <p className="text-muted-foreground text-xs leading-relaxed">
        {ko
          ? "이 화면에서는 파운데이션을 고칠 수 없습니다. 값을 파일에 쓰는 API 는 개발 중에만 있습니다 — 로컬에서 npm run dev 로 여세요."
          : "The foundation can't be edited here. The API that writes the file only exists in development."}
      </p>
    )
  }
  if (!foundation) {
    return (
      <p className="text-muted-foreground flex items-center gap-2 text-xs">
        <Loader2 className="size-3.5 animate-spin" />
        {ko ? "파운데이션을 읽는 중" : "Loading the foundation"}
      </p>
    )
  }

  const colors = Object.entries(foundation.color ?? {}).filter(([k]) => !k.startsWith("$"))
  const texts = Object.entries(foundation.text ?? {}).filter(([k]) => !k.startsWith("$"))

  const addColor = () => {
    const name = newColor.trim()
    if (!name) return
    void send(
      {
        kind: "add",
        layer: "color",
        name,
        /* 시작값은 중간 회색. 흰 면에 흰 색을 만들어 두면 «더했는데 아무것도
         * 안 보인다» 가 되고, 그건 더해진 것인지 아닌지도 알 수 없다. */
        value: { light: "#888888", dark: "#888888" },
      },
      `add:${name}`
    ).then((ok) => ok && setNewColor(""))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold">{ko ? "시스템의 값" : "System values"}</span>
        <Badge variant="outline" className="shrink-0">
          {ko ? "레포에 씀" : "Writes to the repo"}
        </Badge>
      </div>
      <p className="text-muted-foreground text-[11px] leading-relaxed">
        {ko
          ? "여기서 고친 것은 data/foundation.json 에 쓰이고 globals.css 가 다시 만들어집니다. 위의 슬라이더와 달리 새로고침해도 남고, 커밋하면 팀 전체가 같은 값을 봅니다."
          : "Changes here are written to data/foundation.json and globals.css is regenerated — they survive a refresh, unlike the sliders above."}
      </p>

      {/* ── 정리안 ─────────────────────────────────────────── */}
      {cleanup ? (
        <div className="bg-muted/50 flex flex-col gap-2 rounded-lg border p-3">
          <div className="flex items-center gap-2">
            {cleanup.source === "claude" ? (
              <Sparkles className="size-3.5 shrink-0" />
            ) : (
              <AlertTriangle className="size-3.5 shrink-0" />
            )}
            <span className="text-xs font-semibold">
              {ko ? `정리할 것 ${cleanup.fixes.length}건` : `${cleanup.fixes.length} to clean up`}
            </span>
            <button
              type="button"
              onClick={() => setCleanup(null)}
              aria-label={ko ? "정리안 닫기" : "Dismiss"}
              className="text-muted-foreground hover:text-foreground ml-auto shrink-0"
            >
              <X className="size-3.5" />
            </button>
          </div>
          {cleanup.summary ? (
            <p className="text-muted-foreground text-[11px] leading-relaxed">{cleanup.summary}</p>
          ) : null}
          <div className="flex max-h-56 flex-col gap-1.5 overflow-y-auto">
            {cleanup.fixes.map((fix, i) => (
              <label key={`${fix.where}-${i}`} className="flex items-start gap-2 text-[11px]">
                <input
                  type="checkbox"
                  checked={fix.chosen}
                  onChange={(e) =>
                    setCleanup((c) =>
                      c
                        ? {
                            ...c,
                            fixes: c.fixes.map((f, j) =>
                              j === i ? { ...f, chosen: e.target.checked } : f
                            ),
                          }
                        : c
                    )
                  }
                  className="mt-0.5 shrink-0"
                />
                <span className="min-w-0 flex-1">
                  <code className="text-foreground">{fix.where}</code>
                  {fix.to ? (
                    <>
                      {" → "}
                      <code className="text-foreground">{fix.to}</code>
                    </>
                  ) : null}
                  <span className="text-muted-foreground block leading-snug">{fix.why}</span>
                </span>
              </label>
            ))}
          </div>
          <Button size="sm" onClick={() => void applyChosen()} disabled={busy === "cleanup"}>
            {busy === "cleanup" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Check className="size-3.5" />
            )}
            {ko ? "고른 것 적용" : "Apply selected"}
          </Button>
        </div>
      ) : null}

      {/* ── 색 ─────────────────────────────────────────────── */}
      <div className="flex gap-2">
        <Input
          size="sm"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addColor()}
          placeholder={ko ? "새 색 이름 (예: brand)" : "New color name"}
          className="flex-1"
        />
        <Button size="sm" variant="outline" onClick={addColor} disabled={!newColor.trim() || !!busy}>
          {busy?.startsWith("add:") ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          {ko ? "더하기" : "Add"}
        </Button>
      </div>

      <div className="flex flex-col gap-0.5">
        {colors.map(([name, def]) => {
          const value = (mode === "dark" ? def.dark : def.light) ?? def.light
          return (
            <div
              key={name}
              className="hover:bg-muted/50 -mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5"
            >
              <label className="relative size-7 shrink-0 cursor-pointer overflow-hidden rounded-md border">
                <span className="block size-full" style={{ background: value }} />
                <input
                  type="color"
                  value={toHex(value)}
                  aria-label={name}
                  onChange={(e) =>
                    void send(
                      {
                        kind: "update",
                        layer: "color",
                        name,
                        value: {
                          ...def,
                          [mode]: e.target.value,
                          /* 다크 값이 없던 색은 라이트를 그대로 물려 준다 —
                           * 한쪽만 적힌 색은 모드를 바꾸는 순간 사라진다. */
                          ...(mode === "light" && !def.dark ? { dark: def.light } : {}),
                        },
                      },
                      `color:${name}`
                    )
                  }
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
              <div className="min-w-0 flex-1">
                <code className="text-[11px]">--{name}</code>
                {def.$doc ? (
                  <p className="text-muted-foreground text-[11px] leading-snug">{def.$doc}</p>
                ) : null}
              </div>
              {busy === `color:${name}` || busy === `remove:${name}` ? (
                <Loader2 className="text-muted-foreground size-3.5 shrink-0 animate-spin" />
              ) : (
                <button
                  type="button"
                  onClick={() => void send({ kind: "remove", layer: "color", name }, `remove:${name}`)}
                  aria-label={ko ? `${name} 지우기` : `Delete ${name}`}
                  title={ko ? "지우기 — 가리키던 자리는 정리안으로 알려 준다" : "Delete"}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          )
        })}
      </div>

      <Separator />

      {/* ── 글자 크기 ───────────────────────────────────────
        * 색과 같은 층이다. 여기 없는 크기를 컴포넌트가 쓰려면 리터럴을 적는
        * 수밖에 없어서, 스케일에 단이 하나 모자라면 그 자리가 새기 시작한다. */}
      <div className="text-xs font-semibold">{ko ? "글자 크기" : "Type scale"}</div>
      <div className="flex flex-col gap-0.5">
        {texts.map(([name, value]) => (
          <div
            key={name}
            className="hover:bg-muted/50 -mx-2 flex items-center gap-2 rounded-md px-2 py-1"
          >
            <code className="w-12 shrink-0 text-[11px]">{name}</code>
            <Input
              size="sm"
              defaultValue={value}
              onBlur={(e) => {
                if (e.target.value.trim() === value) return
                void send(
                  { kind: "update", layer: "text", name, value: e.target.value.trim() },
                  `text:${name}`
                )
              }}
              className="h-6 flex-1 font-mono text-[11px]"
            />
            <span className="text-muted-foreground w-10 shrink-0 text-right text-[11px] tabular-nums">
              {Math.round(parseFloat(value) * 16)}px
            </span>
            <button
              type="button"
              onClick={() => void send({ kind: "remove", layer: "text", name }, `remove:${name}`)}
              aria-label={ko ? `${name} 지우기` : `Delete ${name}`}
              className="text-muted-foreground hover:text-destructive shrink-0"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          size="sm"
          value={newTextName}
          onChange={(e) => setNewTextName(e.target.value)}
          placeholder={ko ? "이름 (예: xl)" : "Name"}
          className="w-20"
        />
        <Input
          size="sm"
          value={newTextValue}
          onChange={(e) => setNewTextValue(e.target.value)}
          placeholder="1.25rem"
          className="flex-1 font-mono"
        />
        <Button
          size="sm"
          variant="outline"
          disabled={!newTextName.trim() || !!busy}
          onClick={() =>
            void send(
              {
                kind: "add",
                layer: "text",
                name: newTextName.trim(),
                value: newTextValue.trim(),
              },
              `add:${newTextName}`
            ).then((ok) => ok && setNewTextName(""))
          }
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  )
}
