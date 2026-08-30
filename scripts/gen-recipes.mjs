/* data/components.json 에 나머지 컴포넌트의 레시피를 채운다.
 *
 * 62개를 손으로 적으면 반드시 어긋난다. 그래서 «어떤 종류인가» 로 묶고 종류마다
 * 기본 레시피를 준다. 손으로 정한 것(파일럿 셋)은 건드리지 않는다.
 *
 * 종류는 실제 코드가 무엇을 쓰는지에서 왔다 —
 *   control  한 줄에 서는 것. 높이·좌우여백을 control 기준에서 받는다
 *   surface  면을 가진 것. 색·모서리·안쪽 여백
 *   text     글자만. 크기와 줄 간격
 *   overlay  떠 있는 판. 면 + 그림자 + 여백
 *
 * $wired: false 는 «토큰은 있지만 아직 컴포넌트 코드가 안 쓴다» 는 뜻이다.
 * 거짓말을 하지 않으려고 붙인다 — 편집 패널이 그 상태를 그대로 보여 준다.
 *
 * 실행: node scripts/gen-recipes.mjs
 */
import fs from "node:fs"

const file = "data/components.json"
const cur = JSON.parse(fs.readFileSync(file, "utf8"))
const registry = JSON.parse(fs.readFileSync("design-system.json", "utf8"))

/* 이미 손으로 정한 것 — 절대 덮지 않는다 */
const PILOT = new Set(cur.$pilot ?? [])

const KIND = {
  /* 한 줄에 서는 컨트롤 */
  control: [
    "select", "native-select", "combobox", "toggle", "toggle-group",
    "button-group", "input-otp", "input-group", "textarea", "slider",
    "switch", "checkbox", "radio-group", "pagination", "breadcrumb",
  ],
  /* 면을 가진 것 */
  surface: [
    "alert", "badge", "item", "empty", "table", "chart", "calendar",
    "carousel", "avatar", "skeleton", "progress", "separator", "kbd",
    "marker", "attachment", "bubble", "message", "message-scroller",
    "questionnaire", "resizable", "scroll-area", "aspect-ratio", "spinner",
    "field", "label", "accordion", "collapsible", "tabs", "navigation-menu",
    "menubar", "sidebar", "direction", "overlay-stage",
  ],
  /* 떠 있는 판 */
  overlay: [
    "dialog", "alert-dialog", "sheet", "drawer", "popover", "dropdown-menu",
    "context-menu", "hover-card", "tooltip", "command", "sonner",
  ],
}

const RECIPE = {
  control: {
    activeSurface: "color.accent",
    activeSurfaceForeground: "color.accent-foreground",
    radius: "radius.md",
    gap: "spacing.2",
    sizes: {
      sm: { height: "spacing.7", paddingX: "spacing.2.5", fontSize: "text.xs" },
      md: { height: "control.height", paddingX: "control.paddingX", fontSize: "text.sm" },
      lg: { height: "spacing.9", paddingX: "spacing.3", fontSize: "text.sm" },
    },
  },
  surface: {
    surface: "color.muted",
    surfaceForeground: "color.foreground",
    activeSurface: "color.background",
    activeSurfaceForeground: "color.foreground",
    radius: "radius.lg",
    gap: "spacing.2",
    sizes: {
      md: { paddingX: "spacing.3", fontSize: "text.sm" },
    },
  },
  overlay: {
    surface: "color.popover",
    surfaceForeground: "color.popover-foreground",
    radius: "radius.xl",
    gap: "spacing.4",
    sizes: {
      md: { paddingX: "spacing.4", fontSize: "text.sm" },
    },
  },
}

const kindOf = (id) => {
  for (const [k, list] of Object.entries(KIND)) if (list.includes(id)) return k
  return null
}

let added = 0
for (const c of registry.components) {
  if (PILOT.has(c.id)) continue
  if (cur[c.id]) continue
  const kind = kindOf(c.id)
  if (!kind) continue
  cur[c.id] = {
    $doc: c.doc?.what?.ko ?? "",
    /* 토큰은 있지만 아직 컴포넌트 코드가 이 이름을 안 쓴다.
     * 연결한 것은 이 표시를 지운다. */
    $wired: false,
    ...structuredClone(RECIPE[kind]),
  }
  added++
}

fs.writeFileSync(file, JSON.stringify(cur, null, 2) + "\n")

const total = Object.keys(cur).filter((k) => !k.startsWith("$")).length
const wired = Object.entries(cur).filter(
  ([k, v]) => !k.startsWith("$") && v.$wired !== false
).length
console.log(`components.json — ${total}개 (연결됨 ${wired} · 토큰만 ${total - wired}), 이번에 추가 ${added}`)
