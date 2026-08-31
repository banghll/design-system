/* 레시피의 이름을 실제 컴포넌트 코드에 연결한다.
 *
 * 편집 패널의 한 줄은 «이 값을 바꿀 수 있다» 는 약속이다. 그런데 그 이름을
 * 코드가 읽지 않으면 값을 바꿔도 화면은 그대로다 — 연결되지 않은 손잡이다.
 * 감사(`npm run audit`)로 세어 보니 485개 슬롯 중 47개만 실제로 연결돼 있었다.
 *
 * 나머지가 안 이어져 있던 이유는 두 가지였고, 그래서 이 표는 둘 다 고친다.
 *
 *   1) 코드가 리터럴을 쓰고 있다        → edits 로 토큰 이름으로 바꾼다
 *   2) 레시피가 그 컴포넌트의 것이 아니다 → recipe 로 실제 슬롯만 다시 적는다
 *
 * (2)가 절반이었다. 레시피를 처음 만든 스크립트가 «면이 있는 것» 과 «한 줄에 서는 것»
 * 두 벌의 틀을 62개에 그대로 찍어 놨다. 그래서 separator 에 좌우 여백이 있고,
 * switch 의 높이가 버튼과 같은 32px 로 적혀 있었다 — 실제로는 18px 인데.
 * 없는 손잡이를 그려 두는 것은 안 되는 손잡이보다 나쁘다. 그 줄은 지운다.
 *
 * recipe 는 «이 컴포넌트가 실제로 가진 슬롯» 이고, 지금 화면 모습을 그대로
 * 재현하는 값으로 적는다. 연결하면서 디자인이 바뀌면 무엇이 원인인지 알 수 없다.
 *
 * edits 는 정확히 일치하는 것만 바꾼다. 못 찾으면 조용히 넘기지 않고 멈춘다 —
 * 반쯤 이어진 상태가 제일 나쁘다. 이미 바뀐 것은 그냥 건너뛴다(여러 번 돌려도 같다).
 *
 * 실행: node scripts/wire-tokens.mjs && npm run gen && npm run audit
 */
import fs from "node:fs"

const UI = (name) => `components/ui/${name}.tsx`

/* [id]: { recipe, edits } — recipe 는 $doc 을 빼고 통째로 갈아 끼운다. */
const WIRING = {
  /* ── 이미 이어져 있던 것들 (형태만 새 표에 맞춰 옮겨 적음) ────────── */

  /* 탭 띠의 면 색. 사용자가 실제로 물은 자리 —
   * «이 면 색을 바꿀 데가 없는데?» 는 bg-muted 가 코드에 박혀 있었기 때문이다. */
  tabs: {
    recipe: {
      surface: "color.muted",
      surfaceForeground: "color.muted-foreground",
      activeSurface: "color.background",
      activeSurfaceForeground: "color.foreground",
      radius: "radius.lg",
      gap: "spacing.1.5",
      /* 예전에는 --h-tab · --pad-tab 이라는 이름으로 파운데이션 패널에 있었다.
       * 탭 하나의 높이는 전역이 아니라 그 컴포넌트의 값이다 — 컴포넌트 층으로 내린다. */
      sizes: { md: { height: "spacing.7", paddingX: "spacing.1.5", fontSize: "text.sm" } },
    },
    edits: [
      [UI("tabs"), 'default: "bg-muted"', 'default: "bg-(--tabs-surface) text-(--tabs-surface-foreground)"'],
      /* 골라진 탭. «지금 어디» 를 말하는 색이라 면 색만큼 중요하다 */
      [
        UI("tabs"),
        "data-active:bg-background data-active:text-foreground",
        "data-active:bg-(--tabs-active-surface) data-active:text-(--tabs-active-surface-foreground)",
      ],
      /* 다크 전용 덮개를 걷어 낸다.
       *
       * 라이트에서는 토큰이 먹는데 다크에서는 안 먹었다. dark:data-active:bg-input/30
       * 이 뒤에 남아 토큰을 덮고 있었기 때문이다. 토큰을 열어 놓고 그 위에 조건부
       * 리터럴을 얹어 두면, «어떤 모드에서는 편집이 되고 어떤 모드에서는 안 되는»
       * 도구가 된다. 모드별 값은 파운데이션의 색이 이미 갖고 있다. */
      [
        UI("tabs"),
        " dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
        "",
      ],
      [
        UI("tabs"),
        "justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-(--h-tab)",
        "justify-center rounded-(--tabs-radius) p-[3px] text-muted-foreground group-data-horizontal/tabs:h-(--tabs-md-height)",
      ],
      [
        UI("tabs"),
        "gap-1.5 rounded-md border border-transparent px-(--pad-tab) py-0.5 text-sm",
        "gap-(--tabs-gap) rounded-md border border-transparent px-(--tabs-md-padding-x) py-0.5 text-(length:--tabs-md-font-size)",
      ],
    ],
  },

  alert: {
    recipe: {
      surface: "color.card",
      surfaceForeground: "color.card-foreground",
      radius: "radius.lg",
      gap: "spacing.2",
      sizes: { md: { paddingX: "spacing.4", fontSize: "text.sm" } },
    },
    edits: [
      [UI("alert"), "rounded-lg", "rounded-(--alert-radius)"],
      [
        UI("alert"),
        "border px-2.5 py-2 text-left text-sm",
        "border px-(--alert-md-padding-x) py-2 text-left text-(length:--alert-md-font-size)",
      ],
      [UI("alert"), "has-[>svg]:gap-x-2", "has-[>svg]:gap-x-(--alert-gap)"],
      [
        UI("alert"),
        'default: "bg-card text-card-foreground"',
        'default: "bg-(--alert-surface) text-(--alert-surface-foreground)"',
      ],
    ],
  },

  /* 입력에는 요소 사이 간격이 없다 — 칸 하나가 전부다. 있지도 않은 gap 줄을
   * 그려 두고 있었다. */
  input: {
    recipe: {
      radius: "radius.md",
      sizes: {
        xs: { height: "spacing.6", paddingX: "spacing.2", fontSize: "text.xs" },
        sm: { height: "spacing.7", paddingX: "spacing.2.5", fontSize: "text.xs" },
        md: { height: "control.height", paddingX: "control.paddingX", fontSize: "text.sm" },
        lg: { height: "spacing.9", paddingX: "spacing.3", fontSize: "text.sm" },
      },
    },
    edits: [],
  },

  card: {
    recipe: {
      radius: "radius.xl",
      gap: "spacing.1",
      sizes: {
        md: { paddingX: "spacing.4", fontSize: "text.sm" },
        sm: { paddingX: "spacing.3", fontSize: "text.sm" },
      },
    },
    edits: [
      /* sm 의 글자 크기 줄만 코드에 자리가 없었다. 패널에는 있고 화면에는 없는 값. */
      [
        UI("card"),
        "data-[size=sm]:[--card-spacing:var(--card-sm-padding-x)]",
        "data-[size=sm]:[--card-spacing:var(--card-sm-padding-x)] data-[size=sm]:text-(length:--card-sm-font-size)",
      ],
    ],
  },

  /* 항목의 면은 배리언트가 정한다(default 는 투명). 여기서 열 수 있는 색은
   * hover 로 올라오는 면 하나뿐이라 그것만 둔다. */
  item: {
    recipe: {
      activeSurface: "color.muted",
      radius: "radius.lg",
      gap: "spacing.2.5",
      sizes: {
        md: { paddingX: "spacing.3", fontSize: "text.sm" },
        xs: { paddingX: "spacing.2.5", gap: "spacing.2" },
      },
    },
    edits: [
      [
        UI("item"),
        "rounded-(--item-radius) border text-sm transition-colors duration-100",
        "rounded-(--item-radius) border text-(length:--item-md-font-size) transition-colors duration-100",
      ],
      /* hover 의 면. «지금 이거» 를 색으로 말하는 자리라 골라진 면과 같은 칸에 둔다. */
      [UI("item"), "[a]:hover:bg-muted", "[a]:hover:bg-(--item-active-surface)"],
      /* default 와 sm 이 같은 문자열이라 한 번에 둘 다 바뀐다.
       * 찾는 문자열은 반드시 한 줄이어야 한다 — 이 레포의 파일은 CRLF 라
       * 여러 줄을 걸치면 \n 으로는 절대 안 맞는다. */
      [
        UI("item"),
        '"gap-2.5 px-3 py-2.5"',
        '"gap-(--item-gap) px-(--item-md-padding-x) py-2.5"',
      ],
      [
        UI("item"),
        'xs: "gap-2 px-2.5 py-2 ',
        'xs: "gap-(--item-xs-gap) px-(--item-xs-padding-x) py-2 ',
      ],
    ],
  },

  dialog: {
    recipe: {
      surface: "color.popover",
      surfaceForeground: "color.popover-foreground",
      radius: "radius.xl",
      gap: "spacing.4",
      sizes: { md: { paddingX: "spacing.6", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("dialog"),
        "rounded-xl bg-popover",
        "rounded-(--dialog-radius) bg-(--dialog-surface) text-(--dialog-surface-foreground)",
      ],
      /* 토큰 뒤에 리터럴 text-popover-foreground 가 남아 있었다. 둘 다 글자색이라
       * tailwind-merge 가 뒤엣것만 남기고 토큰을 버린다 — 이어 놓고도 안 먹던 이유다. */
      [
        UI("dialog"),
        "text-(--dialog-surface-foreground) p-4 text-sm text-popover-foreground",
        "text-(--dialog-surface-foreground) p-(--dialog-md-padding-x) text-(length:--dialog-md-font-size)",
      ],
      [UI("dialog"), "-translate-y-1/2 gap-4 rounded-(--dialog-radius)", "-translate-y-1/2 gap-(--dialog-gap) rounded-(--dialog-radius)"],
    ],
  },

  popover: {
    recipe: {
      surface: "color.popover",
      surfaceForeground: "color.popover-foreground",
      radius: "radius.lg",
      gap: "spacing.2.5",
      sizes: { md: { paddingX: "spacing.2.5", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("popover"),
        "rounded-lg bg-popover",
        "rounded-(--popover-radius) bg-(--popover-surface) text-(--popover-surface-foreground)",
      ],
      [
        UI("popover"),
        "text-(--popover-surface-foreground) p-2.5 text-sm text-popover-foreground",
        "text-(--popover-surface-foreground) p-(--popover-md-padding-x) text-(length:--popover-md-font-size)",
      ],
      [UI("popover"), "flex-col gap-2.5 rounded-(--popover-radius)", "flex-col gap-(--popover-gap) rounded-(--popover-radius)"],
    ],
  },

  "dropdown-menu": {
    recipe: {
      surface: "color.popover",
      surfaceForeground: "color.popover-foreground",
      activeSurface: "color.accent",
      activeSurfaceForeground: "color.accent-foreground",
      radius: "radius.lg",
      gap: "spacing.1.5",
      sizes: { md: { paddingX: "spacing.1.5", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("dropdown-menu"),
        "rounded-lg bg-popover",
        "rounded-(--dropdown-menu-radius) bg-(--dropdown-menu-surface) text-(--dropdown-menu-surface-foreground)",
      ],
      /* dialog·popover 와 같은 자리. 토큰 뒤의 리터럴이 토큰을 버리게 하고 있었다. */
      [
        UI("dropdown-menu"),
        "text-(--dropdown-menu-surface-foreground) p-1 text-popover-foreground",
        "text-(--dropdown-menu-surface-foreground) p-1",
      ],
      /* 항목의 골라진 면. 메뉴에서 «지금 이거» 는 focus 가 말한다. */
      [
        UI("dropdown-menu"),
        "focus:bg-accent focus:text-accent-foreground",
        "focus:bg-(--dropdown-menu-active-surface) focus:text-(--dropdown-menu-active-surface-foreground)",
      ],
      [
        UI("dropdown-menu"),
        "items-center gap-1.5 rounded-md px-1.5 py-1 text-sm",
        "items-center gap-(--dropdown-menu-gap) rounded-md px-(--dropdown-menu-md-padding-x) py-1 text-(length:--dropdown-menu-md-font-size)",
      ],
      [
        UI("dropdown-menu"),
        "items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm",
        "items-center gap-(--dropdown-menu-gap) rounded-md py-1 pr-8 pl-(--dropdown-menu-md-padding-x) text-(length:--dropdown-menu-md-font-size)",
      ],
    ],
  },

  /* ── 여기서부터 이번에 이은 것들 ────────────────────────────── */

  badge: {
    /* 면 색은 default 배리언트가 정한다. secondary·outline 은 각자의 뜻이 있는
     * 색이라 토큰 하나로 묶으면 그 뜻이 사라진다 — 기본만 연다. */
    recipe: {
      surface: "color.primary",
      surfaceForeground: "color.primary-foreground",
      radius: "radius.4xl",
      gap: "spacing.1",
      sizes: { md: { height: "spacing.5", paddingX: "spacing.2", fontSize: "text.xs" } },
    },
    edits: [
      [
        UI("badge"),
        "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs",
        "inline-flex h-(--badge-md-height) w-fit shrink-0 items-center justify-center gap-(--badge-gap) overflow-hidden rounded-(--badge-radius) border border-transparent px-(--badge-md-padding-x) py-0.5 text-(length:--badge-md-font-size)",
      ],
      [
        UI("badge"),
        'default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80"',
        'default: "bg-(--badge-surface) text-(--badge-surface-foreground) [a]:hover:bg-primary/80"',
      ],
    ],
  },

  checkbox: {
    /* 코드에 크기 배리언트가 없다. 있지도 않은 sm·lg 줄을 그려 두면
     * 그건 편집기가 아니라 함정이다 — md 하나만 둔다. */
    recipe: {
      radius: "radius.sm",
      activeSurface: "color.primary",
      activeSurfaceForeground: "color.primary-foreground",
      sizes: { md: { height: "spacing.4" } },
    },
    edits: [
      [
        UI("checkbox"),
        "flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input",
        "flex size-(--checkbox-md-height) shrink-0 items-center justify-center rounded-(--checkbox-radius) border border-input",
      ],
      [
        UI("checkbox"),
        "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
        "data-checked:border-(--checkbox-active-surface) data-checked:bg-(--checkbox-active-surface) data-checked:text-(--checkbox-active-surface-foreground)",
      ],
      /* 다크 전용 덮개. 토큰을 덮어 «다크에서는 편집이 안 되는» 상태를 만든다. */
      [UI("checkbox"), " dark:data-checked:bg-primary", ""],
    ],
  },

  switch: {
    /* 손잡이(thumb)는 열지 않는다. 트랙 위에서 뒤집힌 색이어야 해서
     * 모드마다 다른 값이 필요한데, 그건 지금 토큰 한 칸으로 말할 수 없다. */
    recipe: {
      surface: "color.input",
      activeSurface: "color.primary",
      radius: "radius.4xl",
      sizes: { sm: { height: "spacing.3.5" }, md: { height: "spacing.4.5" } },
    },
    edits: [
      [
        UI("switch"),
        "relative inline-flex shrink-0 items-center rounded-full border border-transparent",
        "relative inline-flex shrink-0 items-center rounded-(--switch-radius) border border-transparent",
      ],
      [
        UI("switch"),
        "data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]",
        "data-[size=default]:h-(--switch-md-height) data-[size=default]:w-[32px] data-[size=sm]:h-(--switch-sm-height) data-[size=sm]:w-[24px]",
      ],
      [
        UI("switch"),
        "data-checked:bg-primary data-unchecked:bg-input",
        "data-checked:bg-(--switch-active-surface) data-unchecked:bg-(--switch-surface)",
      ],
      [UI("switch"), " dark:data-unchecked:bg-input/80", ""],
    ],
  },

  avatar: {
    recipe: {
      surface: "color.muted",
      surfaceForeground: "color.muted-foreground",
      radius: "radius.4xl",
      sizes: {
        sm: { height: "spacing.6" },
        md: { height: "spacing.8", fontSize: "text.sm" },
        lg: { height: "spacing.10" },
      },
    },
    edits: [
      [
        UI("avatar"),
        "relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full",
        "relative flex size-(--avatar-md-height) shrink-0 rounded-(--avatar-radius) select-none after:absolute after:inset-0 after:rounded-(--avatar-radius)",
      ],
      [
        UI("avatar"),
        "data-[size=lg]:size-10 data-[size=sm]:size-6",
        "data-[size=lg]:size-(--avatar-lg-height) data-[size=sm]:size-(--avatar-sm-height)",
      ],
      [
        UI("avatar"),
        "aspect-square size-full rounded-full object-cover",
        "aspect-square size-full rounded-(--avatar-radius) object-cover",
      ],
      [
        UI("avatar"),
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground",
        "flex size-full items-center justify-center rounded-(--avatar-radius) bg-(--avatar-surface) text-(length:--avatar-md-font-size) text-(--avatar-surface-foreground)",
      ],
    ],
  },

  separator: {
    /* 선에는 면 색 하나뿐이다. 좌우 여백도 글자 크기도 없다. */
    recipe: { surface: "color.border" },
    edits: [
      [
        UI("separator"),
        "shrink-0 bg-border data-horizontal:h-px",
        "shrink-0 bg-(--separator-surface) data-horizontal:h-px",
      ],
    ],
  },

  progress: {
    recipe: {
      surface: "color.muted",
      activeSurface: "color.primary",
      radius: "radius.4xl",
      sizes: { md: { height: "spacing.1" } },
    },
    edits: [
      [
        UI("progress"),
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        "relative flex h-(--progress-md-height) w-full items-center overflow-x-hidden rounded-(--progress-radius) bg-(--progress-surface)",
      ],
      [
        UI("progress"),
        "size-full flex-1 bg-primary transition-all",
        "size-full flex-1 bg-(--progress-active-surface) transition-all",
      ],
    ],
  },

  skeleton: {
    recipe: { surface: "color.muted", radius: "radius.md" },
    edits: [
      [
        UI("skeleton"),
        "animate-pulse rounded-md bg-muted",
        "animate-pulse rounded-(--skeleton-radius) bg-(--skeleton-surface)",
      ],
    ],
  },

  kbd: {
    recipe: {
      surface: "color.muted",
      surfaceForeground: "color.muted-foreground",
      radius: "radius.sm",
      gap: "spacing.1",
      sizes: { md: { height: "spacing.5", paddingX: "spacing.1", fontSize: "text.xs" } },
    },
    edits: [
      [
        UI("kbd"),
        "inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground",
        "inline-flex h-(--kbd-md-height) w-fit min-w-5 items-center justify-center gap-(--kbd-gap) rounded-(--kbd-radius) bg-(--kbd-surface) px-(--kbd-md-padding-x) font-sans text-(length:--kbd-md-font-size) font-medium text-(--kbd-surface-foreground)",
      ],
    ],
  },

  textarea: {
    /* 높이는 내용이 정한다(field-sizing-content). 높이 줄을 열어 두면
     * 바꿔도 아무 일이 안 일어난다 — 열지 않는다. */
    recipe: {
      radius: "radius.lg",
      sizes: { md: { paddingX: "control.paddingX", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("textarea"),
        "w-full rounded-lg border border-input bg-transparent px-(--pad-control) py-2 text-base",
        "w-full rounded-(--textarea-radius) border border-input bg-transparent px-(--textarea-md-padding-x) py-2 text-base",
      ],
      [UI("textarea"), "md:text-sm", "md:text-(length:--textarea-md-font-size)"],
    ],
  },

  toggle: {
    recipe: {
      radius: "radius.lg",
      gap: "spacing.1",
      activeSurface: "color.muted",
      sizes: {
        sm: { height: "spacing.7", paddingX: "spacing.2", fontSize: "text.xs" },
        md: { height: "control.height", paddingX: "control.paddingX", fontSize: "text.sm" },
        lg: { height: "spacing.9", paddingX: "spacing.3" },
      },
    },
    edits: [
      [
        UI("toggle"),
        "gap-1 rounded-lg text-sm font-medium",
        "gap-(--toggle-gap) rounded-(--toggle-radius) text-(length:--toggle-md-font-size) font-medium",
      ],
      [
        UI("toggle"),
        "aria-pressed:bg-muted data-[state=on]:bg-muted",
        "aria-pressed:bg-(--toggle-active-surface) data-[state=on]:bg-(--toggle-active-surface)",
      ],
      [
        UI("toggle"),
        "h-(--h-control) min-w-(--h-control) px-(--pad-control)",
        "h-(--toggle-md-height) min-w-(--toggle-md-height) px-(--toggle-md-padding-x)",
      ],
      [
        UI("toggle"),
        "h-(--h-control-sm) min-w-(--h-control-sm) rounded-[min(var(--radius-md),12px)] px-(--pad-control-sm) text-[0.8rem]",
        "h-(--toggle-sm-height) min-w-(--toggle-sm-height) rounded-[min(var(--radius-md),12px)] px-(--toggle-sm-padding-x) text-(length:--toggle-sm-font-size)",
      ],
      [
        UI("toggle"),
        "h-(--h-control-lg) min-w-(--h-control-lg) px-(--pad-control-lg)",
        "h-(--toggle-lg-height) min-w-(--toggle-lg-height) px-(--toggle-lg-padding-x)",
      ],
    ],
  },

  /* 묶음 자체가 가진 것은 모서리 하나뿐이다. 안의 항목은 toggle 의 값을 쓴다. */
  "toggle-group": {
    recipe: { radius: "radius.lg" },
    edits: [
      [
        UI("toggle-group"),
        "flex-row items-center gap-[--spacing(var(--gap))] rounded-lg",
        "flex-row items-center gap-[--spacing(var(--gap))] rounded-(--toggle-group-radius)",
      ],
    ],
  },

  tooltip: {
    /* 뒤집힌 면. 본문 위에 뜨는 것이라 배경과 글자가 서로 바뀐다. */
    recipe: {
      surface: "color.foreground",
      surfaceForeground: "color.background",
      radius: "radius.md",
      gap: "spacing.1.5",
      sizes: { md: { paddingX: "spacing.3", fontSize: "text.xs" } },
    },
    edits: [
      [
        UI("tooltip"),
        "items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background",
        "items-center gap-(--tooltip-gap) rounded-(--tooltip-radius) bg-(--tooltip-surface) px-(--tooltip-md-padding-x) py-1.5 text-(length:--tooltip-md-font-size) text-(--tooltip-surface-foreground)",
      ],
      /* 화살표도 같은 면이다. 따로 두면 면 색을 바꿨을 때 화살표만 옛 색으로 남는다. */
      [
        UI("tooltip"),
        "rotate-45 rounded-[2px] bg-foreground fill-foreground",
        "rotate-45 rounded-[2px] bg-(--tooltip-surface) fill-(--tooltip-surface)",
      ],
    ],
  },

  "radio-group": {
    recipe: {
      radius: "radius.4xl",
      gap: "spacing.2",
      activeSurface: "color.primary",
      activeSurfaceForeground: "color.primary-foreground",
      sizes: { md: { height: "spacing.4" } },
    },
    edits: [
      [UI("radio-group"), '"grid w-full gap-2"', '"grid w-full gap-(--radio-group-gap)"'],
      [
        UI("radio-group"),
        "flex aspect-square size-4 shrink-0 rounded-full border border-input",
        "flex aspect-square size-(--radio-group-md-height) shrink-0 rounded-(--radio-group-radius) border border-input",
      ],
      [
        UI("radio-group"),
        "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
        "data-checked:border-(--radio-group-active-surface) data-checked:bg-(--radio-group-active-surface) data-checked:text-(--radio-group-active-surface-foreground)",
      ],
      [UI("radio-group"), " dark:data-checked:bg-primary", ""],
      [
        UI("radio-group"),
        "-translate-y-1/2 rounded-full bg-primary-foreground",
        "-translate-y-1/2 rounded-full bg-(--radio-group-active-surface-foreground)",
      ],
    ],
  },

  slider: {
    /* 손잡이는 열지 않는다 — switch 와 같은 이유로 뒤집힌 색이 필요하다. */
    recipe: {
      surface: "color.muted",
      activeSurface: "color.primary",
      radius: "radius.4xl",
      sizes: { md: { height: "spacing.1" } },
    },
    edits: [
      [
        UI("slider"),
        "relative grow overflow-hidden rounded-full bg-muted data-horizontal:h-1",
        "relative grow overflow-hidden rounded-(--slider-radius) bg-(--slider-surface) data-horizontal:h-(--slider-md-height)",
      ],
      [
        UI("slider"),
        "absolute bg-primary select-none",
        "absolute bg-(--slider-active-surface) select-none",
      ],
    ],
  },

  "native-select": {
    recipe: {
      radius: "radius.lg",
      sizes: {
        sm: { height: "spacing.7", paddingX: "spacing.2" },
        md: { height: "control.height", paddingX: "control.paddingX", fontSize: "text.sm" },
      },
    },
    edits: [
      [
        UI("native-select"),
        "h-(--h-control) w-full min-w-0 appearance-none rounded-lg border border-input",
        "h-(--native-select-md-height) w-full min-w-0 appearance-none rounded-(--native-select-radius) border border-input",
      ],
      [
        UI("native-select"),
        "pl-(--pad-control) text-sm",
        "pl-(--native-select-md-padding-x) text-(length:--native-select-md-font-size)",
      ],
      [
        UI("native-select"),
        "data-[size=sm]:h-(--h-control-sm)",
        "data-[size=sm]:h-(--native-select-sm-height)",
      ],
      [
        UI("native-select"),
        "data-[size=sm]:pl-(--pad-control-sm)",
        "data-[size=sm]:pl-(--native-select-sm-padding-x)",
      ],
    ],
  },

  bubble: {
    recipe: {
      surface: "color.muted",
      radius: "radius.xl",
      gap: "spacing.1",
      sizes: { md: { paddingX: "spacing.3", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("bubble"),
        '"*:data-[slot=bubble-content]:bg-muted [&>',
        '"*:data-[slot=bubble-content]:bg-(--bubble-surface) [&>',
      ],
      [
        UI("bubble"),
        "overflow-hidden rounded-xl border border-transparent px-3 py-2 text-sm leading-relaxed",
        "overflow-hidden rounded-(--bubble-radius) border border-transparent px-(--bubble-md-padding-x) py-2 text-(length:--bubble-md-font-size) leading-relaxed",
      ],
      [
        UI("bubble"),
        "flex-col gap-1 group-data-[align=end]/message:self-end",
        "flex-col gap-(--bubble-gap) group-data-[align=end]/message:self-end",
      ],
    ],
  },

  sidebar: {
    recipe: {
      surface: "color.sidebar",
      surfaceForeground: "color.sidebar-foreground",
      activeSurface: "color.sidebar-accent",
      activeSurfaceForeground: "color.sidebar-accent-foreground",
      radius: "radius.md",
      gap: "spacing.2",
      sizes: { md: { paddingX: "spacing.2", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("sidebar"),
        "bg-sidebar text-sidebar-foreground",
        "bg-(--sidebar-surface) text-(--sidebar-surface-foreground)",
      ],
      [
        UI("sidebar"),
        "flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg",
        "flex size-full flex-col bg-(--sidebar-surface) group-data-[variant=floating]:rounded-(--sidebar-radius)",
      ],
      /* 골라진 항목의 면. 사이드바에서 «지금 여기» 를 말하는 색이라
       * 열한 군데에 흩어져 있던 것을 한 이름으로 모은다. */
      [UI("sidebar"), "bg-sidebar-accent", "bg-(--sidebar-active-surface)"],
      [UI("sidebar"), "text-sidebar-accent-foreground", "text-(--sidebar-active-surface-foreground)"],
      [
        UI("sidebar"),
        "items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm",
        "items-center gap-(--sidebar-gap) overflow-hidden rounded-(--sidebar-radius) p-(--sidebar-md-padding-x) text-left text-(length:--sidebar-md-font-size)",
      ],
    ],
  },

  calendar: {
    /* 달력은 이미 --cell-size · --cell-radius 라는 자기 이름을 갖고 있었다.
     * 그 둘이 리터럴을 가리키고 있었을 뿐이라, 가리키는 곳만 컴포넌트 토큰으로
     * 바꾸면 칸 서른 개가 한 번에 따라온다. */
    recipe: {
      surface: "color.background",
      activeSurface: "color.primary",
      activeSurfaceForeground: "color.primary-foreground",
      radius: "radius.md",
      gap: "spacing.4",
      sizes: { md: { height: "spacing.7", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("calendar"),
        '"group/calendar bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)]',
        '"group/calendar bg-(--calendar-surface) p-2 [--cell-radius:var(--calendar-radius)] [--cell-size:var(--calendar-md-height)]',
      ],
      [UI("calendar"), '"relative flex flex-col gap-4 md:flex-row"', '"relative flex flex-col gap-(--calendar-gap) md:flex-row"'],
      [
        UI("calendar"),
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground",
        "data-[selected-single=true]:bg-(--calendar-active-surface) data-[selected-single=true]:text-(--calendar-active-surface-foreground)",
      ],
      [
        UI("calendar"),
        "justify-center gap-1.5 text-sm font-medium",
        "justify-center gap-1.5 text-(length:--calendar-md-font-size) font-medium",
      ],
    ],
  },

  chart: {
    /* 차트 자체는 recharts 가 그린다. 우리 것은 툴팁·범례의 면뿐이다. */
    recipe: {
      surface: "color.background",
      radius: "radius.lg",
      gap: "spacing.1.5",
      sizes: { md: { paddingX: "spacing.2.5", fontSize: "text.xs" } },
    },
    edits: [
      [
        UI("chart"),
        "items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        "items-start gap-(--chart-gap) rounded-(--chart-radius) border border-border/50 bg-(--chart-surface) px-(--chart-md-padding-x) py-1.5 text-(length:--chart-md-font-size) shadow-xl",
      ],
    ],
  },

  questionnaire: {
    recipe: {
      activeSurface: "color.muted",
      radius: "radius.lg",
      gap: "spacing.4",
      sizes: { md: { height: "spacing.11", paddingX: "spacing.3", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("questionnaire"),
        '"flex w-full min-w-0 flex-col gap-4"',
        '"flex w-full min-w-0 flex-col gap-(--questionnaire-gap)"',
      ],
      [
        UI("questionnaire"),
        "relative flex min-h-11 cursor-pointer items-start gap-2.5 rounded-lg border border-input bg-transparent px-3 py-2.5 text-start text-sm",
        "relative flex min-h-(--questionnaire-md-height) cursor-pointer items-start gap-2.5 rounded-(--questionnaire-radius) border border-input bg-transparent px-(--questionnaire-md-padding-x) py-2.5 text-start text-(length:--questionnaire-md-font-size)",
      ],
      [
        UI("questionnaire"),
        "data-checked:bg-muted dark:data-checked:bg-muted",
        "data-checked:bg-(--questionnaire-active-surface) dark:data-checked:bg-(--questionnaire-active-surface)",
      ],
    ],
  },

  /* 캐러셀이 가진 것은 좌우 이동 버튼의 모서리 하나다. 나머지는 안에 담긴
   * 것들의 값이라 여기서 열면 두 곳에서 같은 값을 만지게 된다. */
  carousel: {
    recipe: { radius: "radius.4xl" },
    edits: [
      [UI("carousel"), "absolute touch-manipulation rounded-full", "absolute touch-manipulation rounded-(--carousel-radius)"],
    ],
  },

  message: {
    recipe: {
      surface: "color.muted",
      surfaceForeground: "color.muted-foreground",
      radius: "radius.4xl",
      gap: "spacing.2",
      sizes: { md: { paddingX: "spacing.3", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("message"),
        "relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse",
        "relative flex w-full min-w-0 gap-(--message-gap) text-(length:--message-md-font-size) data-[align=end]:flex-row-reverse",
      ],
      [
        UI("message"),
        "self-end overflow-hidden rounded-full bg-muted",
        "self-end overflow-hidden rounded-(--message-radius) bg-(--message-surface)",
      ],
      [
        UI("message"),
        "items-center px-3 text-xs font-medium text-muted-foreground",
        "items-center px-(--message-md-padding-x) text-xs font-medium text-(--message-surface-foreground)",
      ],
    ],
  },

  "message-scroller": {
    recipe: {
      surface: "color.background",
      surfaceForeground: "color.foreground",
      activeSurface: "color.muted",
      gap: "spacing.6",
    },
    edits: [
      [
        UI("message-scroller"),
        '"flex h-max min-h-full flex-col gap-6"',
        '"flex h-max min-h-full flex-col gap-(--message-scroller-gap)"',
      ],
      [
        UI("message-scroller"),
        "border-border bg-background text-foreground transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground",
        "border-border bg-(--message-scroller-surface) text-(--message-scroller-surface-foreground) transition-[translate,scale,opacity] duration-200 hover:bg-(--message-scroller-active-surface) hover:text-foreground",
      ],
    ],
  },

  attachment: {
    recipe: {
      surface: "color.card",
      surfaceForeground: "color.card-foreground",
      radius: "radius.xl",
      gap: "spacing.2",
      sizes: {
        xs: { paddingX: "spacing.1.5", fontSize: "text.xs" },
        sm: { paddingX: "spacing.2", fontSize: "text.xs" },
        md: { paddingX: "spacing.2.5", fontSize: "text.sm" },
      },
    },
    edits: [
      [
        UI("attachment"),
        "flex-wrap rounded-xl border bg-card text-card-foreground transition-colors",
        "flex-wrap rounded-(--attachment-radius) border bg-(--attachment-surface) text-(--attachment-surface-foreground) transition-colors",
      ],
      [
        UI("attachment"),
        '"gap-2 text-sm has-data-[slot=attachment-content]:px-2.5',
        '"gap-(--attachment-gap) text-(length:--attachment-md-font-size) has-data-[slot=attachment-content]:px-(--attachment-md-padding-x)',
      ],
      [
        UI("attachment"),
        '"gap-2.5 text-xs has-data-[slot=attachment-content]:px-2 ',
        '"gap-2.5 text-(length:--attachment-sm-font-size) has-data-[slot=attachment-content]:px-(--attachment-sm-padding-x) ',
      ],
      [
        UI("attachment"),
        '"gap-1.5 rounded-lg text-xs has-data-[slot=attachment-content]:px-1.5',
        '"gap-1.5 rounded-lg text-(length:--attachment-xs-font-size) has-data-[slot=attachment-content]:px-(--attachment-xs-padding-x)',
      ],
    ],
  },

  menubar: {
    recipe: {
      surface: "color.popover",
      surfaceForeground: "color.popover-foreground",
      activeSurface: "color.accent",
      activeSurfaceForeground: "color.accent-foreground",
      radius: "radius.lg",
      gap: "spacing.1.5",
      sizes: { md: { height: "spacing.8", paddingX: "spacing.1.5", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("menubar"),
        '"flex h-8 items-center gap-0.5 rounded-lg border p-[3px]"',
        '"flex h-(--menubar-md-height) items-center gap-0.5 rounded-(--menubar-radius) border p-[3px]"',
      ],
      [
        UI("menubar"),
        "overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground",
        "overflow-hidden rounded-(--menubar-radius) bg-(--menubar-surface) p-1 text-(--menubar-surface-foreground)",
      ],
      [
        UI("menubar"),
        "focus:bg-accent focus:text-accent-foreground",
        "focus:bg-(--menubar-active-surface) focus:text-(--menubar-active-surface-foreground)",
      ],
      [
        UI("menubar"),
        "items-center gap-1.5 rounded-md px-1.5 py-1 text-sm",
        "items-center gap-(--menubar-gap) rounded-md px-(--menubar-md-padding-x) py-1 text-(length:--menubar-md-font-size)",
      ],
    ],
  },

  "navigation-menu": {
    recipe: {
      surface: "color.popover",
      surfaceForeground: "color.popover-foreground",
      activeSurface: "color.muted",
      radius: "radius.lg",
      gap: "spacing.2",
      sizes: { md: { height: "spacing.9", paddingX: "spacing.2.5", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("navigation-menu"),
        "inline-flex h-9 w-max items-center justify-center rounded-lg px-2.5 py-1.5 text-sm font-medium",
        "inline-flex h-(--navigation-menu-md-height) w-max items-center justify-center rounded-(--navigation-menu-radius) px-(--navigation-menu-md-padding-x) py-1.5 text-(length:--navigation-menu-md-font-size) font-medium",
      ],
      [
        UI("navigation-menu"),
        "hover:bg-muted focus:bg-muted focus-visible:ring-3",
        "hover:bg-(--navigation-menu-active-surface) focus:bg-(--navigation-menu-active-surface) focus-visible:ring-3",
      ],
      [
        UI("navigation-menu"),
        "overflow-hidden rounded-lg bg-popover text-popover-foreground shadow ring-1",
        "overflow-hidden rounded-(--navigation-menu-radius) bg-(--navigation-menu-surface) text-(--navigation-menu-surface-foreground) shadow ring-1",
      ],
      [
        UI("navigation-menu"),
        "group-data-[viewport=false]/navigation-menu:rounded-lg group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground",
        "group-data-[viewport=false]/navigation-menu:rounded-(--navigation-menu-radius) group-data-[viewport=false]/navigation-menu:bg-(--navigation-menu-surface) group-data-[viewport=false]/navigation-menu:text-(--navigation-menu-surface-foreground)",
      ],
      [
        UI("navigation-menu"),
        "flex items-center gap-2 rounded-lg p-2 text-sm transition-all",
        "flex items-center gap-(--navigation-menu-gap) rounded-(--navigation-menu-radius) p-2 text-(length:--navigation-menu-md-font-size) transition-all",
      ],
    ],
  },

  combobox: {
    recipe: {
      surface: "color.popover",
      surfaceForeground: "color.popover-foreground",
      radius: "radius.lg",
      gap: "spacing.1",
      sizes: { md: { height: "spacing.8", paddingX: "spacing.2.5", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("combobox"),
        "overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md",
        "overflow-hidden rounded-(--combobox-radius) bg-(--combobox-surface) text-(--combobox-surface-foreground) shadow-md",
      ],
      [
        UI("combobox"),
        "flex min-h-8 flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent bg-clip-padding px-2.5 py-1 text-sm",
        "flex min-h-(--combobox-md-height) flex-wrap items-center gap-(--combobox-gap) rounded-(--combobox-radius) border border-input bg-transparent bg-clip-padding px-(--combobox-md-padding-x) py-1 text-(length:--combobox-md-font-size)",
      ],
    ],
  },

  pagination: {
    recipe: { gap: "spacing.0.5", sizes: { md: { height: "spacing.8" } } },
    edits: [
      [UI("pagination"), '"flex items-center gap-0.5"', '"flex items-center gap-(--pagination-gap)"'],
      [
        UI("pagination"),
        '"flex size-8 items-center justify-center [&_svg',
        '"flex size-(--pagination-md-height) items-center justify-center [&_svg',
      ],
    ],
  },

  field: {
    recipe: { gap: "spacing.4", sizes: { md: { fontSize: "text.sm" } } },
    edits: [
      [
        UI("field"),
        '"flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3',
        '"flex flex-col gap-(--field-gap) has-[>[data-slot=checkbox-group]]:gap-3',
      ],
      [
        UI("field"),
        "flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50",
        "flex w-fit items-center gap-2 text-(length:--field-md-font-size) font-medium group-data-[disabled=true]/field:opacity-50",
      ],
      [
        UI("field"),
        "text-left text-sm leading-normal font-normal text-muted-foreground",
        "text-left text-(length:--field-md-font-size) leading-normal font-normal text-muted-foreground",
      ],
    ],
  },

  marker: {
    recipe: {
      surface: "color.border",
      surfaceForeground: "color.muted-foreground",
      gap: "spacing.2",
      sizes: { md: { fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("marker"),
        "relative flex min-h-4 w-full items-center gap-2 text-left text-sm text-muted-foreground",
        "relative flex min-h-4 w-full items-center gap-(--marker-gap) text-left text-(length:--marker-md-font-size) text-(--marker-surface-foreground)",
      ],
      [
        UI("marker"),
        "before:bg-border after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-border",
        "before:bg-(--marker-surface) after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-(--marker-surface)",
      ],
    ],
  },

  "overlay-stage": {
    recipe: { surface: "color.background", radius: "radius.lg" },
    edits: [
      [
        UI("overlay-stage"),
        "overflow-hidden rounded-lg border border-dashed border-border bg-background",
        "overflow-hidden rounded-(--overlay-stage-radius) border border-dashed border-border bg-(--overlay-stage-surface)",
      ],
    ],
  },

  "alert-dialog": {
    recipe: {
      surface: "color.popover",
      surfaceForeground: "color.popover-foreground",
      radius: "radius.xl",
      gap: "spacing.4",
      sizes: { md: { paddingX: "spacing.4", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("alert-dialog"),
        "-translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground",
        "-translate-y-1/2 gap-(--alert-dialog-gap) rounded-(--alert-dialog-radius) bg-(--alert-dialog-surface) p-(--alert-dialog-md-padding-x) text-(--alert-dialog-surface-foreground)",
      ],
      [
        UI("alert-dialog"),
        "text-sm text-balance text-muted-foreground md:text-pretty",
        "text-(length:--alert-dialog-md-font-size) text-balance text-muted-foreground md:text-pretty",
      ],
    ],
  },

  drawer: {
    recipe: {
      surface: "color.popover",
      surfaceForeground: "color.popover-foreground",
      radius: "radius.xl",
      sizes: { md: { paddingX: "spacing.4", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("drawer"),
        "flex h-auto flex-col bg-popover text-sm text-popover-foreground",
        "flex h-auto flex-col bg-(--drawer-surface) text-(length:--drawer-md-font-size) text-(--drawer-surface-foreground)",
      ],
      /* 네 방향 각각의 모서리. 하나만 이으면 아래에서 열 때는 따라오고
       * 옆에서 열 때는 안 따라오는 서랍이 된다. */
      [UI("drawer"), "=bottom]:rounded-t-xl", "=bottom]:rounded-t-(--drawer-radius)"],
      [UI("drawer"), "=left]:rounded-r-xl", "=left]:rounded-r-(--drawer-radius)"],
      [UI("drawer"), "=right]:rounded-l-xl", "=right]:rounded-l-(--drawer-radius)"],
      [UI("drawer"), "=top]:rounded-b-xl", "=top]:rounded-b-(--drawer-radius)"],
      [UI("drawer"), "flex flex-col gap-0.5 p-4 group-data-", "flex flex-col gap-0.5 p-(--drawer-md-padding-x) group-data-"],
      [UI("drawer"), '"mt-auto flex flex-col gap-2 p-4"', '"mt-auto flex flex-col gap-2 p-(--drawer-md-padding-x)"'],
    ],
  },

  "context-menu": {
    recipe: {
      surface: "color.popover",
      surfaceForeground: "color.popover-foreground",
      activeSurface: "color.accent",
      activeSurfaceForeground: "color.accent-foreground",
      radius: "radius.lg",
      gap: "spacing.1.5",
      sizes: { md: { paddingX: "spacing.1.5", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("context-menu"),
        "rounded-lg bg-popover p-1 text-popover-foreground shadow-md",
        "rounded-(--context-menu-radius) bg-(--context-menu-surface) p-1 text-(--context-menu-surface-foreground) shadow-md",
      ],
      [
        UI("context-menu"),
        "focus:bg-accent focus:text-accent-foreground",
        "focus:bg-(--context-menu-active-surface) focus:text-(--context-menu-active-surface-foreground)",
      ],
      [
        UI("context-menu"),
        "items-center gap-1.5 rounded-md px-1.5 py-1 text-sm",
        "items-center gap-(--context-menu-gap) rounded-md px-(--context-menu-md-padding-x) py-1 text-(length:--context-menu-md-font-size)",
      ],
    ],
  },

  empty: {
    recipe: {
      surface: "color.muted",
      surfaceForeground: "color.foreground",
      radius: "radius.xl",
      gap: "spacing.4",
      sizes: { md: { paddingX: "spacing.6", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("empty"),
        "justify-center gap-4 rounded-xl border-dashed p-6 text-center",
        "justify-center gap-(--empty-gap) rounded-(--empty-radius) border-dashed p-(--empty-md-padding-x) text-center",
      ],
      [
        UI("empty"),
        "justify-center rounded-lg bg-muted text-foreground",
        "justify-center rounded-lg bg-(--empty-surface) text-(--empty-surface-foreground)",
      ],
      [
        UI("empty"),
        "items-center gap-2.5 text-sm text-balance",
        "items-center gap-2.5 text-(length:--empty-md-font-size) text-balance",
      ],
    ],
  },

  "scroll-area": {
    /* 보이는 것은 손잡이 하나뿐이다. */
    recipe: { surface: "color.border", radius: "radius.4xl" },
    edits: [
      [
        UI("scroll-area"),
        "relative flex-1 rounded-full bg-border",
        "relative flex-1 rounded-(--scroll-area-radius) bg-(--scroll-area-surface)",
      ],
    ],
  },

  resizable: {
    recipe: { surface: "color.border", radius: "radius.lg" },
    edits: [
      [
        UI("resizable"),
        "justify-center bg-border ring-offset-background",
        "justify-center bg-(--resizable-surface) ring-offset-background",
      ],
      [
        UI("resizable"),
        "z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border",
        "z-10 flex h-6 w-1 shrink-0 rounded-(--resizable-radius) bg-(--resizable-surface)",
      ],
    ],
  },

  "button-group": {
    recipe: {
      surface: "color.muted",
      radius: "radius.lg",
      gap: "spacing.2",
      sizes: { md: { paddingX: "spacing.2.5", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("button-group"),
        "flex items-center gap-2 rounded-lg border bg-muted px-2.5 text-sm font-medium",
        "flex items-center gap-(--button-group-gap) rounded-(--button-group-radius) border bg-(--button-group-surface) px-(--button-group-md-padding-x) text-(length:--button-group-md-font-size) font-medium",
      ],
    ],
  },

  "input-otp": {
    recipe: {
      radius: "radius.lg",
      sizes: { md: { height: "spacing.8", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("input-otp"),
        "flex items-center rounded-lg has-aria-invalid:border-destructive",
        "flex items-center rounded-(--input-otp-radius) has-aria-invalid:border-destructive",
      ],
      [
        UI("input-otp"),
        "relative flex size-8 items-center justify-center border-y border-r border-input text-sm",
        "relative flex size-(--input-otp-md-height) items-center justify-center border-y border-r border-input text-(length:--input-otp-md-font-size)",
      ],
      [
        UI("input-otp"),
        "first:rounded-l-lg first:border-l last:rounded-r-lg",
        "first:rounded-l-(--input-otp-radius) first:border-l last:rounded-r-(--input-otp-radius)",
      ],
    ],
  },

  "input-group": {
    recipe: {
      radius: "radius.lg",
      gap: "spacing.2",
      sizes: { md: { height: "control.height", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("input-group"),
        "relative flex h-(--h-control) w-full min-w-0 items-center rounded-lg border border-input",
        "relative flex h-(--input-group-md-height) w-full min-w-0 items-center rounded-(--input-group-radius) border border-input",
      ],
      [
        UI("input-group"),
        "justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground",
        "justify-center gap-(--input-group-gap) py-1.5 text-(length:--input-group-md-font-size) font-medium text-muted-foreground",
      ],
    ],
  },

  /* 토스트는 클래스가 아니라 style 로 값을 받는다. 바꿀 자리가 다를 뿐
   * 토큰을 가리켜야 하는 것은 같다 — 여기만 리터럴로 두면 토스트 하나가
   * 테마를 안 따라온다. */
  sonner: {
    recipe: {
      surface: "color.popover",
      surfaceForeground: "color.popover-foreground",
      radius: "radius.lg",
    },
    edits: [
      [UI("sonner"), '"--normal-bg": "var(--popover)"', '"--normal-bg": "var(--sonner-surface)"'],
      [
        UI("sonner"),
        '"--normal-text": "var(--popover-foreground)"',
        '"--normal-text": "var(--sonner-surface-foreground)"',
      ],
      [UI("sonner"), '"--border-radius": "var(--radius)"', '"--border-radius": "var(--sonner-radius)"'],
    ],
  },

  select: {
    recipe: {
      surface: "color.popover",
      surfaceForeground: "color.popover-foreground",
      activeSurface: "color.accent",
      activeSurfaceForeground: "color.accent-foreground",
      radius: "radius.lg",
      gap: "spacing.1.5",
      sizes: {
        sm: { height: "spacing.7", paddingX: "spacing.2" },
        md: { height: "control.height", paddingX: "control.paddingX", fontSize: "text.sm" },
      },
    },
    edits: [
      [
        UI("select"),
        "gap-1.5 rounded-lg border border-input bg-transparent px-(--pad-control) py-2 text-sm",
        "gap-(--select-gap) rounded-(--select-radius) border border-input bg-transparent px-(--select-md-padding-x) py-2 text-(length:--select-md-font-size)",
      ],
      [UI("select"), "data-[size=default]:h-(--h-control)", "data-[size=default]:h-(--select-md-height)"],
      [UI("select"), "data-[size=sm]:h-(--h-control-sm)", "data-[size=sm]:h-(--select-sm-height)"],
      [UI("select"), "data-[size=sm]:px-(--pad-control-sm)", "data-[size=sm]:px-(--select-sm-padding-x)"],
      [
        UI("select"),
        "rounded-lg bg-popover text-popover-foreground shadow-md",
        "rounded-(--select-radius) bg-(--select-surface) text-(--select-surface-foreground) shadow-md",
      ],
      [
        UI("select"),
        "focus:bg-accent focus:text-accent-foreground",
        "focus:bg-(--select-active-surface) focus:text-(--select-active-surface-foreground)",
      ],
      /* 위·아래 스크롤 버튼도 같은 면이다. 남겨 두면 목록을 스크롤할 때
       * 그 두 줄만 옛 색으로 남는다. */
      [UI("select"), "justify-center bg-popover py-1", "justify-center bg-(--select-surface) py-1"],
    ],
  },

  command: {
    recipe: {
      surface: "color.popover",
      surfaceForeground: "color.popover-foreground",
      activeSurface: "color.muted",
      activeSurfaceForeground: "color.foreground",
      radius: "radius.xl",
      gap: "spacing.2",
      sizes: { md: { paddingX: "spacing.2", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("command"),
        "flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground",
        "flex-col overflow-hidden rounded-(--command-radius)! bg-(--command-surface) p-1 text-(--command-surface-foreground)",
      ],
      [
        UI("command"),
        "items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
        "items-center gap-(--command-gap) rounded-sm px-(--command-md-padding-x) py-1.5 text-(length:--command-md-font-size)",
      ],
      [
        UI("command"),
        "data-selected:bg-muted data-selected:text-foreground",
        "data-selected:bg-(--command-active-surface) data-selected:text-(--command-active-surface-foreground)",
      ],
    ],
  },

  accordion: {
    recipe: { radius: "radius.lg", sizes: { md: { fontSize: "text.sm" } } },
    edits: [
      [
        UI("accordion"),
        "justify-between rounded-lg border border-transparent py-2.5 text-left text-sm",
        "justify-between rounded-(--accordion-radius) border border-transparent py-2.5 text-left text-(length:--accordion-md-font-size)",
      ],
      [
        UI("accordion"),
        "overflow-hidden text-sm data-open:animate-accordion-down",
        "overflow-hidden text-(length:--accordion-md-font-size) data-open:animate-accordion-down",
      ],
    ],
  },

  table: {
    recipe: {
      surface: "color.muted",
      activeSurface: "color.muted",
      sizes: { md: { height: "spacing.10", paddingX: "spacing.2", fontSize: "text.sm" } },
    },
    edits: [
      [UI("table"), '"w-full caption-bottom text-sm"', '"w-full caption-bottom text-(length:--table-md-font-size)"'],
      [
        UI("table"),
        "h-10 px-2 text-left align-middle font-medium",
        "h-(--table-md-height) px-(--table-md-padding-x) text-left align-middle font-medium",
      ],
      [UI("table"), '"p-2 align-middle whitespace-nowrap', '"p-(--table-md-padding-x) align-middle whitespace-nowrap'],
      [UI("table"), "border-t bg-muted/50 font-medium", "border-t bg-(--table-surface) font-medium"],
      [UI("table"), "data-[state=selected]:bg-muted", "data-[state=selected]:bg-(--table-active-surface)"],
    ],
  },

  sheet: {
    recipe: {
      surface: "color.popover",
      surfaceForeground: "color.popover-foreground",
      gap: "spacing.4",
      sizes: { md: { paddingX: "spacing.4", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("sheet"),
        "flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg",
        "flex flex-col gap-(--sheet-gap) bg-(--sheet-surface) bg-clip-padding text-(length:--sheet-md-font-size) text-(--sheet-surface-foreground) shadow-lg",
      ],
      [UI("sheet"), '"flex flex-col gap-0.5 p-4"', '"flex flex-col gap-0.5 p-(--sheet-md-padding-x)"'],
      [UI("sheet"), '"mt-auto flex flex-col gap-2 p-4"', '"mt-auto flex flex-col gap-2 p-(--sheet-md-padding-x)"'],
    ],
  },

  breadcrumb: {
    recipe: { gap: "spacing.1.5", sizes: { md: { fontSize: "text.sm" } } },
    edits: [
      [
        UI("breadcrumb"),
        "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word",
        "flex flex-wrap items-center gap-(--breadcrumb-gap) text-(length:--breadcrumb-md-font-size) wrap-break-word",
      ],
    ],
  },

  "hover-card": {
    recipe: {
      surface: "color.popover",
      surfaceForeground: "color.popover-foreground",
      radius: "radius.lg",
      sizes: { md: { paddingX: "spacing.2.5", fontSize: "text.sm" } },
    },
    edits: [
      [
        UI("hover-card"),
        "rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md",
        "rounded-(--hover-card-radius) bg-(--hover-card-surface) p-(--hover-card-md-padding-x) text-(length:--hover-card-md-font-size) text-(--hover-card-surface-foreground) shadow-md",
      ],
    ],
  },

  /* ── 스타일을 갖지 않는 것들 ──────────────────────────────
   * 자기 면도 모서리도 없다. 자리를 잡거나 상태를 나를 뿐이라 편집할 값이 없다.
   * 여기에 면 색과 좌우 여백 줄이 있던 것은 레시피를 찍어 낸 스크립트 때문이고,
   * 그 줄들은 무엇을 해도 아무 일이 일어나지 않았다. 지운다. */
  collapsible: { recipe: {}, edits: [] },
  "aspect-ratio": { recipe: {}, edits: [] },
  spinner: { recipe: {}, edits: [] },
  direction: { recipe: {}, edits: [] },

  label: {
    recipe: { gap: "spacing.2", sizes: { md: { fontSize: "text.sm" } } },
    edits: [
      [
        UI("label"),
        "flex items-center gap-2 text-sm leading-none font-medium",
        "flex items-center gap-(--label-gap) text-(length:--label-md-font-size) leading-none font-medium",
      ],
    ],
  },
}

/* ── 적용 ────────────────────────────────────────────────── */

const FILE = "data/components.json"
const components = JSON.parse(fs.readFileSync(FILE, "utf8"))

let touched = 0
const missing = []
for (const [id, entry] of Object.entries(WIRING)) {
  for (const [file, from, to] of entry.edits ?? []) {
    const src = fs.readFileSync(file, "utf8")
    /* 찾을 것이 없으면 이미 이어진 것이다. to 로 판단하면 안 된다 —
     * 지우는 작업(to 가 빈 문자열)은 언제나 «이미 포함» 으로 읽혀 건너뛰어진다.
     * 실제로 그래서 다크 덮개가 안 지워졌다. */
    if (!src.includes(from)) {
      if (src.includes(to) || to === "") continue
      missing.push(`${file}: «${from.slice(0, 60)}…»`)
      continue
    }
    fs.writeFileSync(file, src.split(from).join(to))
  }

  if (entry.recipe && components[id]) {
    /* $doc 은 사람이 쓴 설명이라 남긴다. 나머지는 이 표가 정본이다. */
    components[id] = { $doc: components[id].$doc, ...entry.recipe }
    touched++
  }
}

if (missing.length) {
  throw new Error(
    `찾지 못한 자리가 ${missing.length}곳 있다. 코드가 바뀐 것이니 표를 고칠 것:\n` +
      missing.join("\n")
  )
}

fs.writeFileSync(FILE, JSON.stringify(components, null, 2) + "\n")

const all = Object.keys(components).filter((k) => !k.startsWith("$"))
const wired = all.filter((k) => components[k].$wired !== false)
console.log(
  `레시피 ${touched}개 갱신 · 연결됨 ${wired.length}/${all.length}\n` +
    `다음: npm run gen && npm run audit`
)
