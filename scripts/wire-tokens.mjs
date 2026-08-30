/* 레시피의 이름을 실제 컴포넌트 코드에 연결한다.
 *
 * gen-recipes 가 만든 것은 «이름과 기본값» 까지다. 그 이름을 코드가 쓰지 않으면
 * 편집 패널에서 값을 바꿔도 화면은 그대로다. 여기서 그 마지막 한 칸을 잇는다.
 *
 * 한 번에 다 잇지 않는다. 문자열 하나를 잘못 바꾸면 그 컴포넌트가 통째로
 * 망가지는데, 62개를 한꺼번에 바꾸면 어느 것이 원인인지 알 수 없다.
 * 여기 적힌 것만 잇고, 이은 것은 $wired 를 지워 «연결됨» 으로 표시한다.
 *
 * 실행: node scripts/wire-tokens.mjs
 */
import fs from "node:fs"

/* [파일, [찾을 것, 바꿀 것] …] — 정확히 일치하는 것만 바꾼다.
 * 못 찾으면 조용히 넘기지 않고 멈춘다. 반쯤 이어진 상태가 제일 나쁘다. */
const WIRING = {
  /* 탭 띠의 면 색. 사용자가 실제로 물은 자리 —
   * «이 면 색을 바꿀 데가 없는데?» 는 bg-muted 가 코드에 박혀 있었기 때문이다. */
  tabs: [
    ["components/ui/tabs.tsx", "default: \"bg-muted\"", "default: \"bg-(--tabs-surface) text-(--tabs-surface-foreground)\""],
    /* 골라진 탭. «지금 어디» 를 말하는 색이라 면 색만큼 중요하다 */
    [
      "components/ui/tabs.tsx",
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
      "components/ui/tabs.tsx",
      " dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
      "",
    ],
  ],
  alert: [
    ["components/ui/alert.tsx", "rounded-lg", "rounded-(--alert-radius)"],
  ],
  item: [
    ["components/ui/item.tsx", "items-center rounded-lg border text-sm", "items-center rounded-(--item-radius) border text-sm"],
  ],
  dialog: [
    ["components/ui/dialog.tsx", "rounded-xl bg-popover", "rounded-(--dialog-radius) bg-(--dialog-surface) text-(--dialog-surface-foreground)"],
  ],
  popover: [
    ["components/ui/popover.tsx", "rounded-lg bg-popover", "rounded-(--popover-radius) bg-(--popover-surface) text-(--popover-surface-foreground)"],
  ],
  "dropdown-menu": [
    ["components/ui/dropdown-menu.tsx", "rounded-lg bg-popover", "rounded-(--dropdown-menu-radius) bg-(--dropdown-menu-surface) text-(--dropdown-menu-surface-foreground)"],
  ],
}

const components = JSON.parse(fs.readFileSync("data/components.json", "utf8"))

let done = 0
for (const [id, edits] of Object.entries(WIRING)) {
  for (const [file, from, to] of edits) {
    const src = fs.readFileSync(file, "utf8")
    /* 찾을 것이 없으면 이미 이어진 것이다. to 로 판단하면 안 된다 —
     * 지우는 작업(to 가 빈 문자열)은 언제나 «이미 포함» 으로 읽혀 건너뛰어진다.
     * 실제로 그래서 다크 덮개가 안 지워졌다. */
    if (!src.includes(from)) {
      if (src.includes(to) || to === "") continue
      throw new Error(`${file}: «${from}» 을 못 찾았다. 코드가 바뀐 것이니 이 표를 고칠 것.`)
    }
    fs.writeFileSync(file, src.split(from).join(to))
  }
  if (components[id]) {
    delete components[id].$wired
    done++
  }
}

fs.writeFileSync("data/components.json", JSON.stringify(components, null, 2) + "\n")

const all = Object.keys(components).filter((k) => !k.startsWith("$"))
const wired = all.filter((k) => components[k].$wired !== false)
console.log(
  `연결 ${done}개 · 지금까지 연결됨 ${wired.length}/${all.length} — ${wired.join(", ")}`
)
