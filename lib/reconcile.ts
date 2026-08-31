/* 파운데이션을 고친 뒤 남는 것들을 정리한다.
 *
 * 토큰 하나를 지우는 일은 그 줄 하나를 지우는 일이 아니다. 그 이름을 가리키던
 * 레시피가 전부 «없는 곳» 을 가리키게 되고, 그 자리들은 조용히 기본값으로
 * 떨어진다. 조용한 게 제일 나쁘다 — 지운 사람은 지웠다고 생각하고, 화면은
 * 어딘가 달라져 있는데 어디가 달라졌는지는 아무도 모른다.
 *
 * 그래서 고칠 때마다 «이 변경 때문에 어긋난 것» 을 전부 찾아 목록으로 만든다.
 * 목록은 제안이지 실행이 아니다. 무엇을 어디로 옮길지는 사람이 본 다음 정한다.
 *
 * 이 파일은 규칙만 안다. 더 나은 판단(이름이 무슨 뜻인지, 둘 중 어느 쪽이
 * 정본인지)은 /api/token-cleanup 이 Claude 에게 묻고, 키가 없으면 여기 규칙이
 * 그대로 답이 된다 — 어느 쪽이든 정리 없이 넘어가는 일은 없게. */

export type ColorDef = { light: string; dark?: string; $doc?: string }

export type FoundationData = {
  spacing: { base: string }
  radius: { base: string }
  control: { height: string; paddingX: string }
  text: Record<string, string>
  color: Record<string, ColorDef>
}

/** 사용자가 방금 한 일 */
export type Change =
  | { kind: "add"; layer: "color"; name: string; value: ColorDef }
  | { kind: "add"; layer: "text"; name: string; value: string }
  | { kind: "update"; layer: "color"; name: string; value: ColorDef }
  | { kind: "update"; layer: "text"; name: string; value: string }
  | { kind: "remove"; layer: "color" | "text"; name: string }
  | { kind: "rename"; layer: "color" | "text"; name: string; to: string }

/** 정리 제안 한 건 */
export type Fix = {
  /** repoint: 참조를 옮긴다 · merge: 같은 값의 이름을 하나로 · drop: 아무도 안 쓰니 지운다
   *  pair: 면에 짝이 되는 글자색이 없다 · rename: 이름 규칙에 안 맞는다 · note: 사람이 볼 것 */
  kind: "repoint" | "merge" | "drop" | "pair" | "rename" | "note"
  /** 어디가 — "button.md.fontSize" 또는 "color.brand" */
  where: string
  from: string
  to?: string
  why: string
  /** 자동으로 적용해도 안전한가. 애매한 것은 사람이 고른다. */
  safe: boolean
}

const isRef = (v: unknown): v is string => typeof v === "string"

/** 레시피 전체를 «참조 하나» 단위로 편다. 어디가 무엇을 가리키는지 한 벌로 본다. */
export function refsOf(components: Record<string, unknown>): { at: string; ref: string }[] {
  const out: { at: string; ref: string }[] = []
  for (const [id, recipe] of Object.entries(components)) {
    if (id.startsWith("$") || !recipe || typeof recipe !== "object") continue
    const r = recipe as Record<string, unknown>
    for (const [prop, v] of Object.entries(r)) {
      if (prop.startsWith("$")) continue
      if (prop === "sizes") {
        for (const [size, props] of Object.entries((v ?? {}) as Record<string, unknown>)) {
          for (const [p, ref] of Object.entries((props ?? {}) as Record<string, unknown>)) {
            if (isRef(ref)) out.push({ at: `${id}.${size}.${p}`, ref })
          }
        }
      } else if (isRef(v)) {
        out.push({ at: `${id}.${prop}`, ref: v })
      }
    }
  }
  return out
}

/* ── 값이 얼마나 비슷한가 ──────────────────────────────────
 * oklch(L C H) 세 숫자를 그대로 비교한다. 정확한 색차 공식이 아니라
 * «가까운 것부터 보여 주기» 위한 순서다 — 고르는 것은 사람이다. */
function oklch(v: string): [number, number, number] | null {
  const m = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/i.exec(v)
  if (!m) return null
  const l = m[1].endsWith("%") ? parseFloat(m[1]) / 100 : parseFloat(m[1])
  return [l, parseFloat(m[2]), parseFloat(m[3])]
}

function colorDistance(a: string, b: string): number {
  const x = oklch(a)
  const y = oklch(b)
  if (!x || !y) return a.trim() === b.trim() ? 0 : Number.POSITIVE_INFINITY
  const dh = Math.min(Math.abs(x[2] - y[2]), 360 - Math.abs(x[2] - y[2])) / 360
  return Math.abs(x[0] - y[0]) * 2 + Math.abs(x[1] - y[1]) * 3 + dh * (x[1] + y[1])
}

/** 이름이 얼마나 비슷한가 — 토큰 이름은 «-» 로 나뉜 낱말이라 낱말 단위로 본다. */
function nameDistance(a: string, b: string): number {
  const A = new Set(a.split("-"))
  const B = new Set(b.split("-"))
  const shared = [...A].filter((w) => B.has(w)).length
  return 1 - (2 * shared) / (A.size + B.size)
}

/** 지워진 색을 대신할 가장 그럴듯한 이름. 값이 비슷한 쪽을 먼저, 그다음 이름. */
export function nearestColor(
  removed: string,
  def: ColorDef | undefined,
  colors: Record<string, ColorDef>
): string | undefined {
  const others = Object.keys(colors).filter((k) => !k.startsWith("$") && k !== removed)
  if (!others.length) return undefined
  const scored = others.map((name) => ({
    name,
    d:
      (def ? colorDistance(def.light, colors[name].light) : 1) * 1 +
      nameDistance(removed, name) * 0.5,
  }))
  scored.sort((a, b) => a.d - b.d)
  return scored[0]?.name
}

/** 이름 규칙. 토큰 이름은 소문자와 «-» 만 — 한 곳에서만 정한다. */
export function normalizeName(raw: string): string {
  return raw
    .trim()
    .replace(/^--/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
}

/**
 * 이 변경 때문에 어긋난 것들.
 *
 * `next` 는 변경이 **이미 반영된** 파운데이션이다. 그래야 «지금 남은 것 중에서»
 * 무엇으로 옮길지 고를 수 있다.
 */
export function plan(
  next: FoundationData,
  components: Record<string, unknown>,
  change: Change,
  before?: FoundationData
): Fix[] {
  const fixes: Fix[] = []
  const refs = refsOf(components)
  const colors = next.color ?? {}
  const names = Object.keys(colors).filter((k) => !k.startsWith("$"))

  /* 1) 끊긴 참조 — 지우거나 이름을 바꾼 것을 아직 가리키는 자리들 */
  if (change.kind === "remove" || change.kind === "rename") {
    const gone = `${change.layer}.${change.name}`
    const replacement =
      change.kind === "rename"
        ? `${change.layer}.${change.to}`
        : change.layer === "color"
          ? (() => {
              const n = nearestColor(change.name, before?.color?.[change.name], colors)
              return n ? `color.${n}` : undefined
            })()
          : (() => {
              /* 글자 크기는 숫자로 가까운 쪽. rem 을 숫자로 되돌려 견준다. */
              const px = (v?: string) => (v ? parseFloat(v) : NaN)
              const goneV = px(before?.text?.[change.name])
              const rest = Object.keys(next.text ?? {}).filter((k) => !k.startsWith("$"))
              if (!rest.length || Number.isNaN(goneV)) return undefined
              rest.sort((a, b) => Math.abs(px(next.text[a]) - goneV) - Math.abs(px(next.text[b]) - goneV))
              return `text.${rest[0]}`
            })()

    for (const { at, ref } of refs) {
      if (ref !== gone) continue
      fixes.push({
        kind: "repoint",
        where: at,
        from: gone,
        to: replacement,
        why:
          change.kind === "rename"
            ? `이름이 바뀌었다 — 가리키는 곳을 함께 옮기지 않으면 이 자리는 없는 이름을 가리킨다.`
            : `«${gone}» 이 사라졌다. 그대로 두면 이 자리는 조용히 기본값으로 떨어진다.`,
        /* 이름 변경은 답이 하나뿐이라 안전하다. 삭제는 «가장 가까운 것» 이라
         * 추측이 섞이므로 사람이 본다. */
        safe: change.kind === "rename",
      })
    }

    /* 짝 잃은 글자색 — --brand 를 지웠는데 --brand-foreground 가 남는 경우 */
    if (change.kind === "remove" && change.layer === "color") {
      for (const n of names) {
        if (n === `${change.name}-foreground`) {
          fixes.push({
            kind: "drop",
            where: `color.${n}`,
            from: n,
            why: `면 «${change.name}» 이 사라져 이 글자색이 얹힐 곳이 없다.`,
            safe: false,
          })
        }
      }
    }
  }

  /* 2) 값이 같은 두 이름 — 더한 색이 이미 있던 색과 같은 경우가 대부분이다 */
  if (change.kind === "add" || change.kind === "update") {
    if (change.layer === "color") {
      const mine = colors[change.name]
      for (const n of names) {
        if (n === change.name || !mine) continue
        if (colorDistance(mine.light, colors[n].light) === 0) {
          fixes.push({
            kind: "merge",
            where: `color.${change.name}`,
            from: change.name,
            to: n,
            why: `«${n}» 과 값이 같다. 같은 색에 이름이 둘이면 나중에 어느 쪽을 고쳐야 하는지 알 수 없게 된다.`,
            safe: false,
          })
        }
      }
      /* 면을 더했으면 그 위에 얹을 글자색도 있어야 한다 */
      const looksLikeSurface =
        !change.name.endsWith("-foreground") && !/^(border|ring|input|chart-)/.test(change.name)
      if (
        change.kind === "add" &&
        looksLikeSurface &&
        !names.includes(`${change.name}-foreground`)
      ) {
        fixes.push({
          kind: "pair",
          where: `color.${change.name}-foreground`,
          from: change.name,
          to: `${change.name}-foreground`,
          why: `면은 있는데 그 위에 얹을 글자색이 없다. 짝이 없으면 이 면을 쓰는 자리마다 글자색을 따로 정하게 된다.`,
          safe: false,
        })
      }
    }
    if (change.layer === "text") {
      const mine = next.text?.[change.name]
      for (const [n, v] of Object.entries(next.text ?? {})) {
        if (n.startsWith("$") || n === change.name) continue
        if (mine && v === mine) {
          fixes.push({
            kind: "merge",
            where: `text.${change.name}`,
            from: change.name,
            to: n,
            why: `«${n}» 과 값이 같다 — 크기 하나에 이름이 둘이면 스케일이 아니라 목록이 된다.`,
            safe: false,
          })
        }
      }
    }
  }

  /* 3) 이름 규칙 */
  const target = change.kind === "rename" ? change.to : change.name
  const normal = normalizeName(target)
  if (normal !== target) {
    fixes.push({
      kind: "rename",
      where: `${change.layer}.${target}`,
      from: target,
      to: normal,
      why: "토큰 이름은 소문자와 «-» 로만 적는다. CSS 변수 이름이 되는 자리라 규칙이 갈리면 찾을 수가 없다.",
      safe: true,
    })
  }

  /* 4) 아무도 안 쓰는 색 — 더하거나 지운 김에 한 번 훑는다.
   * 지우자고 강요하지 않는다. «있다» 는 것만 알린다. */
  if (change.layer === "color") {
    const used = new Set(refs.map((r) => r.ref))
    for (const n of names) {
      /* 파운데이션이 스스로 쓰는 색(면-글자 짝, 차트 계열)은 레시피에 안 나와도 쓰인다 */
      if (/^(background|foreground|chart-|sidebar|ring|border|input)/.test(n)) continue
      if (n.endsWith("-foreground")) continue
      /* 방금 더한 색은 당연히 아직 아무도 안 쓴다. 더하자마자 «쓰는 곳이 없다» 고
       * 말하면 그건 정리가 아니라 잔소리다. */
      if (change.kind === "add" && n === change.name) continue
      if (!used.has(`color.${n}`)) {
        fixes.push({
          kind: "note",
          where: `color.${n}`,
          from: n,
          why: "레시피 어디에서도 이 색을 가리키지 않는다. 쓰는 곳이 없다면 팔레트에서 빼는 편이 낫다.",
          safe: false,
        })
      }
    }
  }

  return fixes
}

/** 제안을 레시피에 실제로 반영한다. repoint 만 적용 대상이다. */
export function applyFixes(
  components: Record<string, unknown>,
  fixes: Fix[]
): Record<string, unknown> {
  const out = JSON.parse(JSON.stringify(components)) as Record<string, unknown>
  for (const fix of fixes) {
    if (fix.kind !== "repoint" || !fix.to) continue
    const parts = fix.where.split(".")
    const id = parts[0]
    const recipe = out[id] as Record<string, unknown> | undefined
    if (!recipe) continue
    if (parts.length === 3) {
      const sizes = recipe.sizes as Record<string, Record<string, string>> | undefined
      if (sizes?.[parts[1]]) sizes[parts[1]][parts[2]] = fix.to
    } else {
      recipe[parts[1]] = fix.to
    }
  }
  return out
}
