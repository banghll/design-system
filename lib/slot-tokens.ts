/* 어느 컴포넌트가 어떤 토큰을 쓰는가.
 *
 * 화면에서 요소를 눌렀을 때 "이건 무엇으로 만들어졌나" 를 답하려면 그 대응을
 * 어딘가 적어 둬야 한다. 다행히 shadcn 컴포넌트는 전부 data-slot 을 달고 있어서
 * 새로 표시를 붙일 필요가 없다 — 이미 있는 것을 단서로 쓴다.
 *
 * 색은 굳이 적지 않는다. 화면에 그려진 값과 토큰 값을 맞춰 보면 알아낼 수 있어서,
 * 여기에는 계산으로 알 수 없는 것(간격 · 크기)만 적는다. */

import type { Copy } from "@/components/lang"

/** 편집기가 다루는 토큰 한 종류 */
export type TokenSpec = {
  name: string
  label: Copy
  note: Copy
  kind: "color" | "px" | "multiple"
  /** multiple · px 일 때 */
  min?: number
  max?: number
  step?: number
}

export const TOKEN_SPECS: Record<string, TokenSpec> = {
  radius: {
    name: "radius",
    label: { ko: "모서리", en: "Radius" },
    note: {
      ko: "기준값 하나가 sm 부터 4xl 까지 일곱 단계를 만든다",
      en: "One base value derives all seven steps",
    },
    kind: "px",
    min: 0,
    max: 24,
    step: 1,
  },
  "spacing-base": {
    name: "spacing-base",
    label: { ko: "밀도", en: "Density" },
    note: {
      ko: "간격 스케일의 기준. p-4 는 이 값의 4배다",
      en: "The base of the spacing scale — p-4 is four times this",
    },
    kind: "px",
    min: 3,
    max: 5.5,
    step: 0.25,
  },
  "card-md-padding-x": {
    name: "card-md-padding-x",
    label: { ko: "카드 안쪽 여백", en: "Card padding" },
    note: {
      ko: "카드의 여백이자 카드 안 요소 사이 간격",
      en: "Both the padding and the gap between things inside",
    },
    kind: "multiple",
    min: 2,
    max: 8,
    step: 0.5,
  },
  "h-control": {
    name: "h-control",
    label: { ko: "컨트롤 높이", en: "Control height" },
    note: {
      ko: "버튼과 입력이 같은 값을 쓴다 — 나란히 놓이므로",
      en: "Buttons and inputs share this — they sit side by side",
    },
    kind: "multiple",
    min: 6,
    max: 12,
    step: 0.5,
  },
  "pad-control": {
    name: "pad-control",
    label: { ko: "컨트롤 좌우 여백", en: "Control padding" },
    note: {
      ko: "버튼·입력 안쪽의 좌우 여백",
      en: "Horizontal room inside buttons and inputs",
    },
    kind: "multiple",
    min: 1,
    max: 6,
    step: 0.5,
  },
}

/* data-slot → 그 컴포넌트가 쓰는 간격·크기 토큰.
 * 색은 여기 없다 — 화면에서 읽어 맞춘다. */
export const SLOT_TOKENS: Record<string, string[]> = {
  card: ["card-md-padding-x", "radius"],
  "card-header": ["card-md-padding-x"],
  "card-content": ["card-md-padding-x"],
  "card-footer": ["card-md-padding-x", "radius"],
  button: ["h-control", "pad-control", "radius"],
  input: ["h-control", "pad-control", "radius"],
  "input-group": ["h-control", "pad-control", "radius"],
  textarea: ["pad-control", "radius"],
  "select-trigger": ["h-control", "pad-control", "radius"],
  badge: ["radius"],
  alert: ["radius"],
  avatar: ["radius"],
  popover: ["radius"],
  "dropdown-menu-content": ["radius"],
  "dialog-content": ["radius"],
  "sheet-content": ["radius"],
  skeleton: ["radius"],
  table: ["radius"],
  tabs: ["radius"],
  separator: [],
}

/** 슬롯 이름을 사람이 읽는 이름으로. 없으면 슬롯 이름 그대로 쓴다. */
export const SLOT_LABEL: Record<string, Copy> = {
  card: { ko: "카드", en: "Card" },
  "card-header": { ko: "카드 머리", en: "Card header" },
  "card-content": { ko: "카드 본문", en: "Card content" },
  "card-footer": { ko: "카드 발치", en: "Card footer" },
  button: { ko: "버튼", en: "Button" },
  input: { ko: "입력", en: "Input" },
  textarea: { ko: "여러 줄 입력", en: "Textarea" },
  badge: { ko: "배지", en: "Badge" },
  alert: { ko: "알림", en: "Alert" },
  avatar: { ko: "아바타", en: "Avatar" },
  separator: { ko: "구분선", en: "Separator" },
  skeleton: { ko: "뼈대", en: "Skeleton" },
  table: { ko: "표", en: "Table" },
}

/* 화면에서 읽어 맞춰 볼 색 토큰. 면과 글자를 나눠 본다 —
 * 어느 쪽을 고치려는지가 다르기 때문이다. */
export const SURFACE_TOKENS = [
  "background",
  "card",
  "popover",
  "primary",
  "secondary",
  "muted",
  "accent",
  "destructive",
  "sidebar",
  "sidebar-accent",
]

export const TEXT_TOKENS = [
  "foreground",
  "card-foreground",
  "popover-foreground",
  "primary-foreground",
  "secondary-foreground",
  "muted-foreground",
  "accent-foreground",
  "sidebar-foreground",
]

export const LINE_TOKENS = ["border", "input", "ring"]
