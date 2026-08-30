"use client"

/* 생성물 — node scripts/gen-example-map.mjs. 직접 고치지 말 것.
 *
 * 상세 페이지의 미리보기. 공식 예제가 이미 모든 변형과 상태를 깔아 두었으므로
 * 그걸 그대로 쓴다 — 상세 페이지용 미리보기를 따로 쓰면 62벌이 갈라진다.
 *
 * dynamic import 인 이유: 62개를 정적으로 들여오면 어느 상세 페이지를 열어도
 * 62벌이 전부 번들에 실린다. */
import dynamic from "next/dynamic"

const E0 = dynamic(() => import("@/components/examples/accordion-example"))
const E1 = dynamic(() => import("@/components/examples/alert-dialog-example"))
const E2 = dynamic(() => import("@/components/examples/alert-example"))
const E3 = dynamic(() => import("@/components/examples/aspect-ratio-example"))
const E4 = dynamic(() => import("@/components/examples/attachment-example"))
const E5 = dynamic(() => import("@/components/examples/avatar-example"))
const E6 = dynamic(() => import("@/components/examples/badge-example"))
const E7 = dynamic(() => import("@/components/examples/breadcrumb-example"))
const E8 = dynamic(() => import("@/components/examples/bubble-example"))
const E9 = dynamic(() => import("@/components/examples/button-example"))
const E10 = dynamic(() => import("@/components/examples/button-group-example"))
const E11 = dynamic(() => import("@/components/examples/calendar-example"))
const E12 = dynamic(() => import("@/components/examples/card-example"))
const E13 = dynamic(() => import("@/components/examples/carousel-example"))
const E14 = dynamic(() => import("@/components/examples/chart-example"))
const E15 = dynamic(() => import("@/components/examples/checkbox-example"))
const E16 = dynamic(() => import("@/components/examples/collapsible-example"))
const E17 = dynamic(() => import("@/components/examples/combobox-example"))
const E18 = dynamic(() => import("@/components/examples/command-example"))
const E19 = dynamic(() => import("@/components/examples/context-menu-example"))
const E20 = dynamic(() => import("@/components/examples/dialog-example"))
const E21 = dynamic(() => import("@/components/examples/drawer-example"))
const E22 = dynamic(() => import("@/components/examples/dropdown-menu-example"))
const E23 = dynamic(() => import("@/components/examples/empty-example"))
const E24 = dynamic(() => import("@/components/examples/field-example"))
const E25 = dynamic(() => import("@/components/examples/hover-card-example"))
const E26 = dynamic(() => import("@/components/examples/input-example"))
const E27 = dynamic(() => import("@/components/examples/input-group-example"))
const E28 = dynamic(() => import("@/components/examples/input-otp-example"))
const E29 = dynamic(() => import("@/components/examples/item-example"))
const E30 = dynamic(() => import("@/components/examples/kbd-example"))
const E31 = dynamic(() => import("@/components/examples/label-example"))
const E32 = dynamic(() => import("@/components/examples/marker-example"))
const E33 = dynamic(() => import("@/components/examples/menubar-example"))
const E34 = dynamic(() => import("@/components/examples/message-example"))
const E35 = dynamic(() => import("@/components/examples/message-scroller-example"))
const E36 = dynamic(() => import("@/components/examples/native-select-example"))
const E37 = dynamic(() => import("@/components/examples/navigation-menu-example"))
const E38 = dynamic(() => import("@/components/examples/pagination-example"))
const E39 = dynamic(() => import("@/components/examples/popover-example"))
const E40 = dynamic(() => import("@/components/examples/progress-example"))
const E41 = dynamic(() => import("@/components/examples/questionnaire-example"))
const E42 = dynamic(() => import("@/components/examples/radio-group-example"))
const E43 = dynamic(() => import("@/components/examples/resizable-example"))
const E44 = dynamic(() => import("@/components/examples/scroll-area-example"))
const E45 = dynamic(() => import("@/components/examples/select-example"))
const E46 = dynamic(() => import("@/components/examples/separator-example"))
const E47 = dynamic(() => import("@/components/examples/sheet-example"))
const E48 = dynamic(() => import("@/components/examples/skeleton-example"))
const E49 = dynamic(() => import("@/components/examples/slider-example"))
const E50 = dynamic(() => import("@/components/examples/sonner-example"))
const E51 = dynamic(() => import("@/components/examples/spinner-example"))
const E52 = dynamic(() => import("@/components/examples/switch-example"))
const E53 = dynamic(() => import("@/components/examples/table-example"))
const E54 = dynamic(() => import("@/components/examples/tabs-example"))
const E55 = dynamic(() => import("@/components/examples/textarea-example"))
const E56 = dynamic(() => import("@/components/examples/toggle-example"))
const E57 = dynamic(() => import("@/components/examples/toggle-group-example"))
const E58 = dynamic(() => import("@/components/examples/tooltip-example"))

const MAP: Record<string, React.ComponentType> = {
  "accordion": E0,
  "alert-dialog": E1,
  "alert": E2,
  "aspect-ratio": E3,
  "attachment": E4,
  "avatar": E5,
  "badge": E6,
  "breadcrumb": E7,
  "bubble": E8,
  "button": E9,
  "button-group": E10,
  "calendar": E11,
  "card": E12,
  "carousel": E13,
  "chart": E14,
  "checkbox": E15,
  "collapsible": E16,
  "combobox": E17,
  "command": E18,
  "context-menu": E19,
  "dialog": E20,
  "drawer": E21,
  "dropdown-menu": E22,
  "empty": E23,
  "field": E24,
  "hover-card": E25,
  "input": E26,
  "input-group": E27,
  "input-otp": E28,
  "item": E29,
  "kbd": E30,
  "label": E31,
  "marker": E32,
  "menubar": E33,
  "message": E34,
  "message-scroller": E35,
  "native-select": E36,
  "navigation-menu": E37,
  "pagination": E38,
  "popover": E39,
  "progress": E40,
  "questionnaire": E41,
  "radio-group": E42,
  "resizable": E43,
  "scroll-area": E44,
  "select": E45,
  "separator": E46,
  "sheet": E47,
  "skeleton": E48,
  "slider": E49,
  "sonner": E50,
  "spinner": E51,
  "switch": E52,
  "table": E53,
  "tabs": E54,
  "textarea": E55,
  "toggle": E56,
  "toggle-group": E57,
  "tooltip": E58,
}

export function ComponentExampleFor({ id }: { id: string }) {
  const C = MAP[id]
  return C ? <C /> : null
}
