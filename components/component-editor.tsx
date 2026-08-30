"use client"

/* 컴포넌트 하나의 토큰 편집 패널.
 *
 * 파운데이션 편집기와 다른 점이 하나 있다 — 여기서는 **참조**를 고른다.
 * px 를 직접 적게 하면 그 자리만 파운데이션에서 떨어져 나가고, 밀도 기준을
 * 바꿨을 때 이 컴포넌트만 안 따라온다. 그래서 고를 수 있는 것은 언제나
 * spacing.n · radius.md 처럼 이름이다.
 *
 * 여기서는 **저장까지만** 한다. 레포로 넘기는 것은 /changes 에서 한 번에 —
 * 버튼 만지다 입력으로 넘어가 비교하고 다시 돌아오는 게 실제 작업 순서라,
 * 화면마다 내보내면 파일이 여러 벌 생기고 어느 게 최신인지 알 수 없게 된다. */

import { ArrowRight, Check, RotateCcw, Save } from "lucide-react"
import Link from "next/link"

import { useComponentTokens } from "@/components/component-tokens"
import { editKey } from "@/components/component-tokens"
import { useLang } from "@/components/lang"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { COLOR_PROPS, OPEN_PROPS, type OpenProp, refToPx } from "@/lib/tokens"

/* 고를 수 있는 참조. 속성마다 «말이 되는 것» 만 연다 —
 * 높이 자리에 radius 를 고를 수 있으면 그건 선택지가 아니라 함정이다. */
const SPACING_STEPS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16]
const RADIUS_STEPS = ["sm", "md", "lg", "xl", "2xl", "3xl"]
const TEXT_STEPS = ["xs", "sm", "base", "lg"]

/* 면에 쓸 수 있는 색. 파운데이션의 이름만 고를 수 있고, 여기 없는 색은 쓸 수 없다 —
 * 컴포넌트가 자기만의 색을 갖기 시작하면 팔레트가 팔레트가 아니게 된다. */
const SURFACES = [
  "background", "card", "popover", "muted", "secondary", "accent",
  "primary", "destructive", "sidebar", "input", "border",
]
const FOREGROUNDS = [
  "foreground", "muted-foreground", "card-foreground", "popover-foreground",
  "secondary-foreground", "accent-foreground", "primary-foreground", "destructive",
]

function optionsFor(prop: OpenProp): string[] {
  if (prop === "surface") return SURFACES.map((c) => `color.${c}`)
  if (prop === "surfaceForeground") return FOREGROUNDS.map((c) => `color.${c}`)
  if (prop === "radius") return RADIUS_STEPS.map((r) => `radius.${r}`)
  if (prop === "fontSize") return TEXT_STEPS.map((t) => `text.${t}`)
  const spacing = SPACING_STEPS.map((n) => `spacing.${n}`)
  /* 높이·좌우여백은 «기준을 그대로 받는다» 를 첫 선택지로 둔다.
   * 이게 없으면 모두가 숫자를 골라 버리고, 한 줄 정렬이 첫날에 깨진다. */
  if (prop === "height") return ["control.height", ...spacing]
  if (prop === "paddingX") return ["control.paddingX", ...spacing]
  return spacing
}

const PROP_LABEL: Record<OpenProp, { ko: string; en: string }> = {
  height: { ko: "높이", en: "Height" },
  paddingX: { ko: "좌우 여백", en: "Padding X" },
  radius: { ko: "모서리", en: "Radius" },
  fontSize: { ko: "글자 크기", en: "Font size" },
  gap: { ko: "요소 사이", en: "Gap" },
  surface: { ko: "면 색", en: "Surface" },
  surfaceForeground: { ko: "면 위 글자", en: "On surface" },
}

function Row({
  component,
  prop,
  size,
}: {
  component: string
  prop: OpenProp
  size?: string
}) {
  const { refOf, layerOf, set, reset, foundation } = useComponentTokens()
  const { lang } = useLang()
  const ref = refOf(component, prop, size)
  if (!ref) return null

  const layer = layerOf(component, prop, size)
  const px = refToPx(ref, foundation)
  const key = editKey(component, prop, size)

  return (
    <div className="flex items-center gap-2">
      <Label className="text-muted-foreground flex w-24 shrink-0 items-center gap-1 text-xs font-normal">
        {/* 저장 안 한 값에는 점을 찍는다. 색만으로는 어느 게 «아직» 인지 안 보인다 */}
        {layer === "draft" ? (
          <span
            className="bg-primary size-1.5 shrink-0 rounded-full"
            title={lang === "ko" ? "저장 안 함" : "Unsaved"}
          />
        ) : null}
        {lang === "ko" ? PROP_LABEL[prop].ko : PROP_LABEL[prop].en}
      </Label>
      <Select value={ref} onValueChange={(v) => set(key, v)}>
        <SelectTrigger size="sm" className="min-w-0 flex-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {optionsFor(prop).map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {COLOR_PROPS.includes(prop as (typeof COLOR_PROPS)[number]) ? (
        <span
          className="size-5 shrink-0 rounded border"
          style={{ background: `var(--${ref.split(".")[1]})` }}
          title={ref}
        />
      ) : (
        <code className="text-muted-foreground w-12 shrink-0 text-right text-[11px] tabular-nums">
          {px == null ? "—" : `${Math.round(px)}px`}
        </code>
      )}
      {layer === "repo" ? (
        <span className="w-3.5 shrink-0" />
      ) : (
        <button
          type="button"
          onClick={() => reset(key)}
          title={lang === "ko" ? "레포 값으로 되돌리기" : "Back to the repo value"}
          className="text-muted-foreground hover:text-foreground shrink-0"
        >
          <RotateCcw className="size-3.5" />
        </button>
      )}
    </div>
  )
}

export function ComponentEditor({ component }: { component: string }) {
  const { base, draft, staged, save, discardDraft, discardAll } = useComponentTokens()
  const { lang } = useLang()
  const recipe = base[component]

  const unsaved = Object.keys(draft).filter((k) => k.startsWith(component + "."))
  const savedHere = Object.keys(staged).filter((k) => k.startsWith(component + "."))
  const totalPending = new Set(Object.keys(staged).map((k) => k.split(".")[0])).size

  if (!recipe) {
    return (
      <p className="text-muted-foreground text-sm leading-relaxed">
        {lang === "ko"
          ? "아직 토큰화하지 않은 컴포넌트입니다. data/components.json 에 레시피를 적으면 여기에 패널이 생깁니다."
          : "Not tokenized yet. Add a recipe to data/components.json and this panel appears."}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          {lang === "ko" ? "컴포넌트 층" : "Component layer"}
        </Badge>
        {unsaved.length ? (
          <Badge>{lang === "ko" ? `저장 안 함 ${unsaved.length}` : `${unsaved.length} unsaved`}</Badge>
        ) : savedHere.length ? (
          <Badge variant="outline">
            <Check />
            {lang === "ko" ? `저장됨 ${savedHere.length}` : `${savedHere.length} saved`}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">
            {lang === "ko" ? "레포 값 그대로" : "Repo values"}
          </span>
        )}
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed">
        {lang === "ko"
          ? "값이 아니라 참조를 고릅니다. spacing.9 처럼 파운데이션의 이름을 가리키므로, 밀도 기준을 바꾸면 이 값도 함께 움직입니다."
          : "You pick a reference, not a number. It points at a foundation name, so it keeps following when the base changes."}
      </p>

      {/* 크기와 무관한 것 먼저 — 이 컴포넌트 전체에 걸리는 값이다 */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold">
          {lang === "ko" ? "모든 크기 공통" : "All sizes"}
        </div>
        {(["surface", "surfaceForeground", "radius", "gap"] as const).map((p) => (
          <Row key={p} component={component} prop={p} />
        ))}
      </div>

      {Object.keys(recipe.sizes ?? {}).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="text-xs font-semibold">{size}</div>
            {size === "md" ? (
              <span className="text-muted-foreground text-[11px]">
                {lang === "ko" ? "기본" : "default"}
              </span>
            ) : null}
          </div>
          {OPEN_PROPS.filter((p) => recipe.sizes?.[size]?.[p]).map((p) => (
            <Row key={p} component={component} prop={p} size={size} />
          ))}
        </div>
      ))}

      <Separator />

      {/* 여기서는 저장까지만. 레포로 넘기는 것은 /changes 한 곳에서 한다 —
        * 화면마다 내보내면 파일이 여러 벌 생기고 어느 게 최신인지 모르게 된다. */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => save(component)}
            disabled={!unsaved.length}
          >
            <Save />
            {lang === "ko" ? "이 컴포넌트 저장" : "Save this component"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => discardDraft(component)}
            disabled={!unsaved.length}
          >
            {lang === "ko" ? "되돌리기" : "Discard"}
          </Button>
        </div>

        <p className="text-muted-foreground text-xs leading-relaxed">
          {lang === "ko"
            ? "저장해도 레포에는 들어가지 않습니다. 이 브라우저에 모아 뒀다가 변경사항 화면에서 한 번에 내보냅니다."
            : "Saving keeps it in this browser. Export everything at once from the changes screen."}
        </p>

        {savedHere.length ? (
          <Button
            size="sm"
            variant="ghost"
            className="justify-start"
            onClick={() => discardAll(component)}
          >
            <RotateCcw />
            {lang === "ko"
              ? "이 컴포넌트를 레포 값으로"
              : "Reset this component to repo values"}
          </Button>
        ) : null}

        {totalPending ? (
          <Button size="sm" variant="secondary" asChild className="justify-between">
            <Link href="/changes">
              {lang === "ko"
                ? `변경사항 ${totalPending}개 컴포넌트`
                : `${totalPending} components changed`}
              <ArrowRight />
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
