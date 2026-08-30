/* 스튜디오 — 생성형 이미지 도구를 이 디자인 시스템으로 다시 그린 화면.
 *
 * 참고한 화면의 구조와 밀도를 가져오되, 상표와 이름은 우리 것으로 둔다.
 * 남의 브랜드를 그대로 옮기면 그건 리디자인이 아니라 모사다.
 *
 * 이 화면이 시스템에 던지는 질문은 하나다 — 밀도를 크게 올렸을 때도
 * 토큰만으로 버티는가. 그래서 임의의 px 를 한 번도 쓰지 않았고,
 * 조밀함은 --spacing 과 --h-control 을 이 화면에서만 낮춰 만든다.
 *
 * 왼쪽은 조건을 쌓는 자리, 오른쪽은 결과를 보는 자리. 둘 사이에 스크롤이
 * 따로 돌아, 프롬프트를 쓰다가 결과를 훑어도 서로를 밀어내지 않는다. */
"use client"

import {
  Bell,
  ChevronRight,
  Grid2x2,
  Heart,
  ImageIcon,
  LayoutList,
  Minus,
  Plus,
  Sparkles,
  Upload,
  User,
  Wand2,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { useLang } from "@/components/lang"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const NAV = ["Explore", "Image", "Video", "Cosmo", "Character", "Scene builder"]

/* 무엇을 만들 수 있는지 — 기능 이름이 아니라 결과로 적는다.
 * "포즈 변경" 은 기능이고 "같은 인물, 다른 자세" 는 결과다. */
const RECIPES = [
  {
    key: "turn",
    title: { ko: "돌려 보기", en: "Turn around" },
    body: { ko: "같은 인물을 다른 각도에서", en: "The same person, another angle" },
    chart: "1",
  },
  {
    key: "background",
    title: { ko: "배경 만들기", en: "Create background" },
    body: { ko: "인물은 두고 뒤만 바꾼다", en: "Keep the subject, replace what's behind" },
    chart: "2",
  },
  {
    key: "pose",
    title: { ko: "자세 바꾸기", en: "Change pose" },
    body: { ko: "같은 인물, 다른 자세", en: "The same person, a different stance" },
    chart: "3",
  },
  {
    key: "scene",
    title: { ko: "장면 구성", en: "Compose scene" },
    body: { ko: "여러 인물을 한 화면에", en: "Several subjects in one frame" },
    chart: "4",
  },
]

const REFERENCES = [
  { key: "character", Icon: User, ko: "인물", en: "Character" },
  { key: "background", Icon: ImageIcon, ko: "배경", en: "Background" },
  { key: "upload", Icon: Upload, ko: "올리기", en: "Upload" },
]

const RECENT = [
  { ko: "골목, 비 온 뒤", en: "Alley after rain", at: "8월 20일 20:21", n: 4 },
  { ko: "역광 인물 습작", en: "Backlit portrait study", at: "8월 20일 18:03", n: 2 },
  { ko: "실내, 창가 오후", en: "Interior, afternoon window", at: "8월 19일 11:47", n: 6 },
]

export default function StudioPage() {
  const { lang } = useLang()
  const [tab, setTab] = useState("image")
  const [view, setView] = useState("grid")
  const [count, setCount] = useState(1)
  const [prompt, setPrompt] = useState("")
  const [refs, setRefs] = useState<string[]>([])

  return (
    /* 밀도는 이 화면에서만 조인다. 전역 토큰을 건드리면 카탈로그까지 따라 조여져,
     * 이 화면을 위해 시스템 전체를 바꾸는 꼴이 된다.
     *
     * --spacing-base 가 아니라 --spacing 을 덮는다. --spacing 은 :root 에서
     * var(--spacing-base) 로 선언되는데, 상속되는 것은 그 참조가 아니라 :root 에서
     * 이미 계산된 값이다. 그래서 하위에서 --spacing-base 를 바꿔도 --spacing 은
     * 꿈쩍하지 않는다 — 실제로 읽히는 이름을 덮어야 한다. */
    <div
      className="bg-background text-foreground flex h-dvh flex-col"
      style={
        {
          "--spacing": "0.22rem",
          "--h-control": "calc(var(--spacing) * 8)",
          "--pad-control": "calc(var(--spacing) * 2.5)",
          "--pad-card": "calc(var(--spacing) * 3.5)",
        } as React.CSSProperties
      }
    >
      {/* ── 상단 ─────────────────────────────────────────
        * 전역 탐색은 사이드바보다 위에 있어야 한다 — 왼쪽 패널을 바꿔도 남는 것들이다. */}
      <header className="flex h-14 shrink-0 items-center gap-6 border-b px-5">
        <Link href="/studio" className="flex items-center gap-2 font-semibold">
          <span className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Sparkles className="size-3.5" />
          </span>
          <span className="tracking-tight">스튜디오</span>
        </Link>

        <Separator orientation="vertical" className="data-vertical:h-5" />

        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto">
          {NAV.map((n, i) => (
            <Button
              key={n}
              variant="ghost"
              size="sm"
              className={cn(
                "shrink-0",
                i === 1 ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {n}
              {n === "Cosmo" ? (
                <Badge variant="secondary" className="ml-1 font-normal">
                  Beta
                </Badge>
              ) : null}
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            {lang === "ko" ? "요금제" : "Pricing"}
          </Button>
          {/* 잔액은 숫자만 두지 않는다 — 무엇의 숫자인지 아이콘이 말한다. */}
          <Badge variant="outline" className="gap-1.5 tabular-nums">
            <Sparkles className="size-3" />
            81,352
          </Badge>
          <Button size="sm" variant="secondary">
            {lang === "ko" ? "보관함" : "Assets"}
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={lang === "ko" ? "알림" : "Notifications"}>
                <Bell className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{lang === "ko" ? "알림" : "Notifications"}</TooltipContent>
          </Tooltip>
          <Avatar className="size-7">
            <AvatarFallback>KB</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* ── 왼쪽: 조건을 쌓는 자리 ───────────────────── */}
        <aside className="flex w-[22rem] shrink-0 flex-col border-r">
          <div className="p-3 pb-0">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="w-full">
                {[
                  ["image", "이미지", "Image"],
                  ["video", "영상", "Video"],
                  ["character", "인물", "Character"],
                ].map(([v, ko, en]) => (
                  <TabsTrigger key={v} value={v} className="flex-1">
                    {lang === "ko" ? ko : en}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col gap-5 p-3">
              {/* 모델 — 무엇으로 만드는지가 가장 위에 온다.
                * 아래 조건들이 전부 이 선택에 딸린 것이기 때문이다. */}
              <button
                type="button"
                className="hover:bg-accent flex items-center gap-3 rounded-lg border p-2.5 text-left transition-colors"
              >
                <span className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-md">
                  <Wand2 className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-muted-foreground block text-xs">
                    {lang === "ko" ? "모델" : "Model"}
                  </span>
                  <span className="block truncate text-sm font-medium">
                    Aurora Image 2.0
                  </span>
                </span>
                <ChevronRight className="text-muted-foreground size-4 shrink-0" />
              </button>

              {/* 레퍼런스 — 고른 것이 눌린 채로 남아야 몇 개를 걸었는지 보인다. */}
              <section className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-xs font-medium">
                    {lang === "ko" ? "레퍼런스" : "References"}
                  </h2>
                  {refs.length ? (
                    <button
                      type="button"
                      onClick={() => setRefs([])}
                      className="text-muted-foreground hover:text-foreground text-xs"
                    >
                      {lang === "ko" ? "비우기" : "Clear"}
                    </button>
                  ) : null}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {REFERENCES.map(({ key, Icon, ko, en }) => {
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
                          "flex flex-col items-center gap-1.5 rounded-lg border py-3 text-xs transition-colors",
                          on
                            ? "border-primary bg-accent text-foreground"
                            : "text-muted-foreground hover:bg-accent/60"
                        )}
                      >
                        <Icon className="size-4" />
                        {lang === "ko" ? ko : en}
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* 프롬프트 — 이 화면에서 가장 오래 머무는 자리라 가장 크게 둔다. */}
              <section className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-xs font-medium">
                    {lang === "ko" ? "프롬프트" : "Prompt"}
                  </h2>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {prompt.length}
                  </span>
                </div>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={7}
                  placeholder={
                    lang === "ko"
                      ? "장면을 자세히 적어주세요. @ 로 보관함의 에셋을 부를 수 있어요."
                      : "Describe the scene. Use @ to pull in an asset."
                  }
                  className="resize-none"
                />
                <div className="flex gap-1.5">
                  <Button variant="outline" size="xs">
                    @ {lang === "ko" ? "멘션" : "Mention"}
                  </Button>
                  <Button variant="outline" size="xs">
                    <Sparkles className="size-3" />
                    {lang === "ko" ? "다듬기" : "Assist"}
                  </Button>
                </div>
              </section>

              {/* 출력 조건 — 셋을 한 줄에 둔다. 따로 떼면 매번 셋을 다 확인하게 된다. */}
              <section className="flex flex-col gap-2">
                <h2 className="text-xs font-medium">
                  {lang === "ko" ? "출력" : "Output"}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-lg border p-0.5">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setCount((c) => Math.max(1, c - 1))}
                      aria-label={lang === "ko" ? "한 장 줄이기" : "One fewer"}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-5 text-center text-xs tabular-nums">{count}</span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setCount((c) => Math.min(8, c + 1))}
                      aria-label={lang === "ko" ? "한 장 늘리기" : "One more"}
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="flex-1">
                    2K · {lang === "ko" ? "중간" : "Standard"}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    16:9
                  </Button>
                </div>
              </section>

              <Separator />

              <section className="flex flex-col gap-1">
                <div className="mb-1 flex items-center gap-1.5">
                  <h2 className="text-xs font-medium">Labs</h2>
                  <Badge variant="secondary" className="font-normal">
                    Beta
                  </Badge>
                </div>
                {[
                  { ko: "이미지 대결", en: "Image arena" },
                  { ko: "3D 디렉터 스테이지", en: "3D director stage" },
                ].map((x) => (
                  <button
                    key={x.en}
                    type="button"
                    className="hover:bg-accent -mx-1.5 flex items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-xs"
                  >
                    <span className="bg-muted flex size-5 items-center justify-center rounded">
                      <Sparkles className="size-3" />
                    </span>
                    {lang === "ko" ? x.ko : x.en}
                  </button>
                ))}
              </section>
            </div>
          </ScrollArea>

          {/* 실행은 늘 같은 자리에 있어야 한다. 스크롤을 따라 움직이면 매번 찾게 된다. */}
          <div className="border-t p-3">
            <Button className="w-full" size="lg" disabled={!prompt.trim()}>
              {prompt.trim()
                ? lang === "ko"
                  ? `${count}장 만들기`
                  : `Generate ${count}`
                : lang === "ko"
                  ? "프롬프트를 먼저 적어주세요"
                  : "Write a prompt first"}
            </Button>
          </div>
        </aside>

        {/* ── 오른쪽: 결과를 보는 자리 ─────────────────── */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="bg-background/85 sticky top-0 z-10 flex h-12 items-center gap-2 border-b px-5 backdrop-blur">
            <Tabs defaultValue="history">
              <TabsList>
                {[
                  ["history", "히스토리", "History"],
                  ["explore", "탐색", "Explore"],
                  ["template", "템플릿", "Templates"],
                ].map(([v, ko, en]) => (
                  <TabsTrigger key={v} value={v}>
                    {lang === "ko" ? ko : en}
                    {v === "template" ? (
                      <Badge variant="secondary" className="ml-1 font-normal">
                        Beta
                      </Badge>
                    ) : null}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="ml-auto flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label={lang === "ko" ? "찜한 것" : "Favorites"}>
                    <Heart className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{lang === "ko" ? "찜한 것" : "Favorites"}</TooltipContent>
              </Tooltip>
              <ToggleGroup
                type="single"
                value={view}
                onValueChange={(v) => v && setView(v)}
                variant="outline"
              >
                <ToggleGroupItem value="list" aria-label={lang === "ko" ? "목록" : "List"}>
                  <LayoutList className="size-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="grid" aria-label={lang === "ko" ? "격자" : "Grid"}>
                  <Grid2x2 className="size-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 py-10">
            {/* 처음 온 사람에게는 목록이 아니라 "무엇을 만들 수 있는지" 를 먼저 보인다. */}
            <section className="flex flex-col items-center gap-2 text-center">
              <div className="flex items-center gap-2">
                <span className="bg-muted flex size-8 items-center justify-center rounded-lg">
                  <ImageIcon className="size-4" />
                </span>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {lang === "ko" ? "이미지" : "Image"}
                </h1>
              </div>
              <p className="text-muted-foreground max-w-[46ch] text-sm">
                {lang === "ko"
                  ? "인물을 세우고, 자세를 바꾸고, 배경을 갈아 끼우는 일까지 한자리에서."
                  : "Stage a character, change the pose, swap what's behind — all in one place."}
              </p>
            </section>

            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {RECIPES.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  className="group hover:border-foreground/25 flex flex-col overflow-hidden rounded-xl border text-left transition-colors"
                >
                  {/* 그림 자리. 실제 결과물 대신 계열 색으로 채운다 —
                    * 없는 작업물을 지어내 보여주지 않는다. */}
                  <span
                    className="flex h-28 items-end p-3"
                    style={{
                      background: `linear-gradient(140deg, var(--chart-${r.chart}), color-mix(in oklch, var(--chart-${r.chart}) 40%, var(--card)))`,
                    }}
                  >
                    <span className="text-background dark:text-foreground text-sm font-semibold">
                      {lang === "ko" ? r.title.ko : r.title.en}
                    </span>
                  </span>
                  <span className="text-muted-foreground p-3 text-xs leading-relaxed">
                    {lang === "ko" ? r.body.ko : r.body.en}
                  </span>
                </button>
              ))}
            </section>

            <section className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold">
                  {lang === "ko" ? "최근 작업" : "Recent"}
                </h2>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  {lang === "ko" ? "전체 보기" : "See all"}
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                {RECENT.map((r) => (
                  <div
                    key={r.en}
                    className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-2.5 transition-colors"
                  >
                    <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md">
                      <ImageIcon className="text-muted-foreground size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {lang === "ko" ? r.ko : r.en}
                      </span>
                      <span className="text-muted-foreground block text-xs tabular-nums">
                        {r.at}
                      </span>
                    </span>
                    <Badge variant="secondary" className="shrink-0 tabular-nums">
                      {r.n}
                      {lang === "ko" ? "장" : ""}
                    </Badge>
                  </div>
                ))}
              </div>
            </section>

            <p className="text-muted-foreground text-xs leading-relaxed">
              {lang === "ko"
                ? "이 화면은 참고한 도구의 구조와 밀도를 이 디자인 시스템으로 다시 그린 것입니다. 상표와 이름은 쓰지 않았고, 임의의 px 없이 토큰만으로 만들었습니다 — 조밀함은 이 화면에서만 --spacing 을 낮춰 얻었습니다."
                : "This screen redraws the structure and density of a reference tool using this design system. No borrowed marks or names, and no arbitrary pixels — the tighter feel comes from lowering --spacing on this screen alone."}
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
