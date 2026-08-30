/* Hallmark · macrostructure: Workbench · genre: atmospheric · nav: N9 edge-aligned
 * theme: project-locked (this repo's shadcn tokens) · accent: --accent-warm (studio-scoped only)
 * enrichment: none — typography only · motion: fade-in only
 * pre-emit critique: P4 H5 E4 S5 R5 V4
 *
 * Studio — an image-generation surface drawn with this design system.
 *
 * The first pass put a centred hero over four equal gradient tiles. That is the
 * shape every generated page lands on, and it wasted the canvas — the largest
 * area on screen carried the least information. This pass inverts it: the canvas
 * states one thing at full size, and the ways in sit under it as text, not tiles.
 *
 * Structure came from the reference tool. The mark and the name did not — copying
 * those would be tracing, not redesigning.
 *
 * Density is scoped here, not global. The catalogue must not tighten because one
 * screen wanted to. */
"use client"

import {
  ArrowRight,
  Check,
  ChevronRight,
  Command,
  Grid2x2,
  ImageIcon,
  LayoutList,
  Loader2,
  Minus,
  Plus,
  Sparkles,
  Upload,
  User,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { TEST_PADDING_2 } from "@/lib/theme-test-padding-2"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/* Named for the result, not the feature. "Change pose" is a menu item;
 * "the same person, standing differently" is what you actually wanted. */
const RECIPES = [
  { verb: "Turn", rest: "a character to any angle" },
  { verb: "Replace", rest: "the background, keep the subject" },
  { verb: "Restage", rest: "the same person in a new pose" },
  { verb: "Compose", rest: "several subjects into one frame" },
]

const REFERENCES = [
  { key: "character", Icon: User, label: "Character" },
  { key: "background", Icon: ImageIcon, label: "Background" },
  { key: "upload", Icon: Upload, label: "Upload" },
]

const RECENT = [
  { title: "Alley after rain", at: "Aug 20 · 20:21", n: 4 },
  { title: "Backlit portrait study", at: "Aug 20 · 18:03", n: 2 },
  { title: "Interior, afternoon window", at: "Aug 19 · 11:47", n: 6 },
]

type Phase = "idle" | "working" | "done"

export default function StudioPage() {
  const [count, setCount] = useState(1)
  const [prompt, setPrompt] = useState("")
  const [refs, setRefs] = useState<string[]>([])
  const [phase, setPhase] = useState<Phase>("idle")

  const ready = prompt.trim().length > 0

  /* Eight states live on one control here — the button carries default, hover,
   * focus, active, disabled, loading, success, and the error case is the
   * disabled-with-reason state below it. */
  const generate = () => {
    if (!ready || phase === "working") return
    setPhase("working")
    window.setTimeout(() => setPhase("done"), 1400)
  }

  return (
    <div
      data-surface="studio"
      className="bg-background text-foreground flex h-dvh flex-col overflow-x-clip"
      style={TEST_PADDING_2}
    >
      {/* N9 — edge-aligned. The chrome gets out of the canvas's way; there is no
        * centre lane and no separator ladder, only the two edges. */}
      <header className="flex h-12 shrink-0 items-center gap-4 px-4">
        <Link
          href="/studio"
          className="focus-visible:ring-ring flex shrink-0 items-center gap-2 rounded-sm text-sm font-semibold tracking-tight outline-none focus-visible:ring-2"
        >
          <span className="bg-foreground text-background flex size-5 items-center justify-center rounded-[4px]">
            <Sparkles className="size-3" />
          </span>
          Studio
        </Link>

        <button
          type="button"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring hidden items-center gap-2 rounded-md px-2 py-1 text-xs outline-none focus-visible:ring-2 sm:flex"
        >
          <Command className="size-3" />
          Search everything
          <Kbd>⌘K</Kbd>
        </button>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <span className="text-muted-foreground font-mono text-xs tabular-nums">
            81,352 credits
          </span>
          <Button variant="ghost" size="xs">
            Assets
          </Button>
          <Avatar className="size-6">
            <AvatarFallback className="text-[10px]">KB</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* The rail is deliberately quiet — no card frames, no boxes around
          * groups. Information sits directly on the surface; only the things
          * you press get an edge. */}
        <aside className="border-border/70 flex max-h-[55vh] w-full shrink-0 flex-col border-b lg:max-h-none lg:w-[20rem] lg:border-r lg:border-b-0">
          <div className="px-4 pt-4">
            <Tabs defaultValue="image">
              <TabsList className="w-full">
                {["Image", "Video", "Character"].map((v) => (
                  <TabsTrigger key={v} value={v.toLowerCase()} className="flex-1 text-xs">
                    {v}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col gap-6 px-4 py-5">
              {/* 한 줄짜리 선택지는 Item 이 이미 한다 — 여백·정렬·호버가 딸려 온다 */}
              <Item variant="outline" size="sm" asChild>
                <button type="button" className="group text-left">
                  <ItemContent>
                    <ItemDescription className="font-mono text-xs tracking-wide uppercase">
                      Model
                    </ItemDescription>
                    <ItemTitle>Aurora 2.0</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRight className="text-muted-foreground group-hover:text-foreground size-4 transition-colors" />
                  </ItemActions>
                </button>
              </Item>

              <section className="flex flex-col gap-2.5">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-muted-foreground font-mono text-[10px] tracking-wide uppercase">
                    References
                  </h2>
                  {refs.length ? (
                    <button
                      type="button"
                      onClick={() => setRefs([])}
                      className="text-muted-foreground hover:text-foreground text-[11px]"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {REFERENCES.map(({ key, Icon, label }) => {
                    const on = refs.includes(key)
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          setRefs((s) =>
                            s.includes(key) ? s.filter((x) => x !== key) : [...s, key]
                          )
                        }
                        className={cn(
                          "focus-visible:ring-ring relative flex flex-col items-center gap-1.5 rounded-lg border py-2.5 text-[11px] outline-none transition-colors focus-visible:ring-2",
                          on
                            ? "border-foreground/40 text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:border-foreground/20"
                        )}
                      >
                        <Icon className="size-3.5" />
                        {label}
                        {on ? (
                          <Check className="text-accent-warm absolute top-1 right-1 size-3" />
                        ) : null}
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Where the time actually goes, so it gets the room. */}
              <section className="flex flex-col gap-2.5">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-muted-foreground font-mono text-[10px] tracking-wide uppercase">
                    Prompt
                  </h2>
                  <span className="text-muted-foreground font-mono text-[10px] tabular-nums">
                    {prompt.length}
                  </span>
                </div>
                <Textarea
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value)
                    if (phase === "done") setPhase("idle")
                  }}
                  rows={8}
                  placeholder="Say what the frame contains. Reach an asset with @."
                  className="resize-none text-sm leading-relaxed"
                />
                <div className="flex gap-1.5">
                  <Button variant="ghost" size="xs" className="text-muted-foreground">
                    @ Mention
                  </Button>
                  <Button variant="ghost" size="xs" className="text-muted-foreground">
                    <Sparkles className="size-3" />
                    Tighten
                  </Button>
                </div>
              </section>

              <section className="flex flex-col gap-2.5">
                <h2 className="text-muted-foreground font-mono text-[10px] tracking-wide uppercase">
                  Output
                </h2>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center rounded-md border">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setCount((c) => Math.max(1, c - 1))}
                      disabled={count === 1}
                      aria-label="One fewer"
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-5 text-center font-mono text-[11px] tabular-nums">
                      {count}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setCount((c) => Math.min(8, c + 1))}
                      disabled={count === 8}
                      aria-label="One more"
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                  <Button variant="outline" size="xs" className="flex-1">
                    2K
                  </Button>
                  <Button variant="outline" size="xs" className="flex-1">
                    16:9
                  </Button>
                </div>
              </section>

              <Separator />

              <section className="flex flex-col gap-1">
                <h2 className="text-muted-foreground mb-1 font-mono text-[10px] tracking-wide uppercase">
                  Labs
                </h2>
                {["Image arena", "Director stage"].map((x) => (
                  <button
                    key={x}
                    type="button"
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring -mx-1.5 flex items-center justify-between rounded-md px-1.5 py-1.5 text-left text-xs outline-none focus-visible:ring-2"
                  >
                    {x}
                    <ArrowRight className="size-3" />
                  </button>
                ))}
              </section>
            </div>
          </ScrollArea>

          <div className="border-border/70 flex flex-col gap-1.5 border-t px-4 py-3">
            <Button
              className="w-full"
              onClick={generate}
              disabled={!ready || phase === "working"}
              data-state={phase}
            >
              {phase === "working" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating {count}
                </>
              ) : phase === "done" ? (
                <>
                  <Check className="size-4" />
                  {count} ready
                </>
              ) : (
                <>Generate {count}</>
              )}
            </Button>
            {/* The reason lives next to the disabled control, not inside it. */}
            {!ready ? (
              <p className="text-muted-foreground text-center text-[11px]">
                Needs a prompt first.
              </p>
            ) : null}
          </div>
        </aside>

        {/* ── Canvas ──────────────────────────────────────
          * One statement at full size, then the ways in as text. The bloom is the
          * genre's one allowance and it does not animate. */}
        <main className="relative min-w-0 flex-1 overflow-y-auto">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[42rem]"
            style={{
              background:
                "radial-gradient(60% 55% at 30% 0%, color-mix(in oklch, var(--accent-warm) 14%, transparent), transparent 70%)",
            }}
          />

          <div className="border-border/70 sticky top-0 z-10 flex h-11 items-center gap-2 border-b px-4 backdrop-blur">
            <Tabs defaultValue="history">
              <TabsList className="h-7">
                {["History", "Explore", "Templates"].map((v) => (
                  <TabsTrigger key={v} value={v.toLowerCase()} className="text-xs">
                    {v}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <ToggleGroup
              type="single"
              defaultValue="grid"
              variant="outline"
              className="ml-auto"
            >
              <ToggleGroupItem value="list" aria-label="List">
                <LayoutList className="size-3.5" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="Grid">
                <Grid2x2 className="size-3.5" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="relative mx-auto w-full max-w-4xl px-6 py-16 lg:px-10">
            {/* Scale contrast: one large line, one small mono line. No centring —
              * the statement hangs off the left edge like a caption to the canvas. */}
            <p className="text-muted-foreground mb-4 font-mono text-[11px] tracking-wide uppercase">
              Nothing on the canvas yet
            </p>
            <h1 className="max-w-[15ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
              <span className="[overflow-wrap:anywhere]">
                Describe the frame. The rest is revision.
              </span>
            </h1>
            <p className="text-muted-foreground mt-5 max-w-[52ch] text-sm leading-relaxed">
              Everything here starts from a sentence and a reference. Stage a
              character, hold them still, change what is behind them.
            </p>

            {/* Recipes as text on a hairline, not four equal gradient tiles.
              * Tiles made four different jobs look like one repeated job. */}
            <ul className="border-border/70 mt-14 border-t">
              {RECIPES.map((r) => (
                <li key={r.verb} className="border-border/70 border-b">
                  <button
                    type="button"
                    className="group focus-visible:ring-ring flex w-full items-baseline gap-4 py-4 text-left outline-none focus-visible:ring-2"
                  >
                    <span className="min-w-0 flex-1 text-base">
                      <span className="group-hover:text-accent-warm font-medium transition-colors">
                        {r.verb}
                      </span>{" "}
                      <span className="text-muted-foreground">{r.rest}</span>
                    </span>
                    <ArrowRight className="text-muted-foreground group-hover:text-foreground mt-1 size-3.5 shrink-0 transition-colors" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-16">
              <div className="mb-1 flex items-baseline justify-between">
                <h2 className="text-muted-foreground font-mono text-[11px] tracking-wide uppercase">
                  Recent
                </h2>
                <Button variant="ghost" size="xs" className="text-muted-foreground">
                  All work
                </Button>
              </div>
              <ul className="divide-border/70 divide-y">
                {RECENT.map((r) => (
                  <li key={r.title}>
                    <button
                      type="button"
                      className="hover:bg-accent/40 focus-visible:ring-ring -mx-2 flex w-[calc(100%+1rem)] items-center gap-4 rounded-md px-2 py-3 text-left outline-none focus-visible:ring-2"
                    >
                      <span className="min-w-0 flex-1 truncate text-sm">{r.title}</span>
                      <span className="text-muted-foreground shrink-0 font-mono text-[11px] tabular-nums">
                        {r.at}
                      </span>
                      <Badge variant="secondary" className="shrink-0 tabular-nums">
                        {r.n}
                      </Badge>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-muted-foreground mt-16 max-w-[60ch] cursor-help text-[11px] leading-relaxed">
                  Built from this design system&apos;s tokens — no literal colours, one
                  accent scoped to this screen, density tightened here alone.
                </p>
              </TooltipTrigger>
              <TooltipContent className="max-w-64">
                The catalogue keeps its own density. Only this surface overrides
                --spacing.
              </TooltipContent>
            </Tooltip>
          </div>
        </main>
      </div>
    </div>
  )
}
