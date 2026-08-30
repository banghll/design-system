"use client"

/* 컴포넌트 토큰의 브라우저 쪽 상태.
 *
 * 정본은 레포의 data/components.json 이다. 여기 있는 값은 **임시**다 —
 * 정적 배포라 레포에 쓸 수 없고, 쓸 수 있다 해도 "브라우저에서 만진 값이
 * 곧 정본" 이 되면 두 사람이 각자 다른 시스템을 갖게 된다.
 *
 * 값은 두 칸으로 나눠 둔다.
 *
 *   초안(draft)   지금 만지고 있는 값. 화면에는 바로 반영되지만 아직 «결정» 은 아니다.
 *   저장(staged)  «이건 이걸로 간다» 고 정한 값. 컴포넌트를 옮겨 다녀도 남는다.
 *
 * 이렇게 가른 이유는 실제 작업 순서 때문이다. 버튼을 만지다가 입력으로 넘어가
 * 비교하고, 다시 버튼으로 돌아오는 일이 계속 생긴다. 그때마다 내보내기를 하면
 * 파일이 여러 벌 생기고 어느 게 최신인지 알 수 없게 된다. 그래서 개별 화면에서는
 * **저장만** 하고, 레포로 넘기는 것은 /changes 에서 한 번에 한다.
 *
 *   레포 JSON → 화면(기본값) → 초안 → 저장 → 한 번에 내보내기 → 사람이 커밋 → 레포 JSON
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import {
  OPEN_PROPS,
  type ComponentRecipe,
  type Components,
  type Foundation,
  type OpenProp,
  flatten,
  resolveRef,
  varName,
} from "@/lib/tokens"

const DRAFT_KEY = "ds-token-draft"
const STAGED_KEY = "ds-token-staged"

/** { "button.md.height": "spacing.10" } — 참조로 저장한다. 리터럴은 여기서도 안 받는다. */
export type Edits = Record<string, string>

export const editKey = (component: string, prop: OpenProp, size?: string) =>
  size ? `${component}.${size}.${prop}` : `${component}.${prop}`

export const componentOf = (key: string) => key.split(".")[0]

function read(key: string): Edits {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as Edits) : {}
  } catch {
    return {}
  }
}

function write(key: string, e: Edits) {
  try {
    localStorage.setItem(key, JSON.stringify(e))
  } catch {}
}

/** 화면에 실제로 얹히는 값 — 저장된 것 위에 지금 만지는 것이 덮인다. */
const effective = (staged: Edits, draft: Edits): Edits => ({ ...staged, ...draft })

function apply(edits: Edits, base: Components) {
  const root = document.documentElement
  const live = new Set<string>()

  for (const [k, ref] of Object.entries(edits)) {
    const [component, a, b] = k.split(".")
    const prop = (b ?? a) as OpenProp
    const size = b ? a : undefined
    if (!OPEN_PROPS.includes(prop)) continue
    const name = varName(component, prop, size)
    try {
      root.style.setProperty(name, resolveRef(ref))
      live.add(name)
    } catch {
      /* 참조가 깨졌으면 그냥 두고 넘어간다 — 화면이 멈추는 것보다 낫다 */
    }
  }

  for (const name of Object.keys(base)) {
    if (name.startsWith("$")) continue
    for (const v of flatten(name, base[name] as ComponentRecipe)) {
      if (!live.has(v.name)) root.style.removeProperty(v.name)
    }
  }

  nudge(root)
}

/* 값만 바꿨을 때 이미 그려진 요소가 옛 크기에 머무르는 브라우저가 있다.
 * `height: var(--x)` 규칙 자체는 안 바뀌고 x 만 바뀌므로 스타일을 다시 계산하지
 * 않는 것이다. 실제로 확인한 모습:
 *
 *   변수 바꿈        → 버튼 32px  (그대로)
 *   해당 클래스 토글  → 48px      (맞게)
 *   문서 재부착       → 48px      (맞게)
 *
 * 그래서 값이 바뀌는 순간에만 문서를 한 번 재부착한다. 편집할 때만 도는 코드라
 * 평소 성능과는 무관하고, 이게 없으면 «바꿨는데 화면이 그대로» 가 된다. */
function nudge(root: HTMLElement) {
  const before = root.style.display
  root.style.display = "none"
  void root.offsetHeight
  root.style.display = before
}

type Ctx = {
  draft: Edits
  staged: Edits
  base: Components
  foundation: Foundation
  /** 지금 만지는 값 — 화면에는 바로 반영되지만 아직 저장은 아니다 */
  set: (key: string, ref: string) => void
  /** 한 항목을 레포 값으로 되돌린다 (초안·저장 양쪽에서 뺀다) */
  reset: (key: string) => void
  /** 이 컴포넌트의 초안을 저장으로 옮긴다 */
  save: (component: string) => void
  /** 이 컴포넌트의 초안을 버린다 — 저장된 값은 남는다 */
  discardDraft: (component: string) => void
  /** 저장까지 전부 버린다. component 를 주면 그것만 */
  discardAll: (component?: string) => void
  refOf: (component: string, prop: OpenProp, size?: string) => string | undefined
  /** 이 값이 어느 칸에서 왔는가 */
  layerOf: (component: string, prop: OpenProp, size?: string) => "draft" | "staged" | "repo"
  /** 저장된 컴포넌트 목록 */
  savedComponents: string[]
}

const Ctx = createContext<Ctx | null>(null)

export function ComponentTokenProvider({
  base,
  foundation,
  children,
}: {
  base: Components
  foundation: Foundation
  children: React.ReactNode
}) {
  const [draft, setDraft] = useState<Edits>({})
  const [staged, setStaged] = useState<Edits>({})

  /* 저장된 값은 마운트 뒤에 읽는다. 서버가 그린 것과 어긋나면 안 되므로. */
  useEffect(() => {
    const d = read(DRAFT_KEY)
    const s = read(STAGED_KEY)
    setDraft(d)
    setStaged(s)
    apply(effective(s, d), base)
  }, [base])

  /* 다른 탭에서 고친 것도 따라온다 — /components/button 과 /preview 를
   * 두 탭에 띄워 놓고 비교하는 게 이 도구의 실제 쓰임이다. */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== DRAFT_KEY && e.key !== STAGED_KEY) return
      const d = read(DRAFT_KEY)
      const s = read(STAGED_KEY)
      setDraft(d)
      setStaged(s)
      apply(effective(s, d), base)
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [base])

  const commit = useCallback(
    (d: Edits, s: Edits) => {
      write(DRAFT_KEY, d)
      write(STAGED_KEY, s)
      setDraft(d)
      setStaged(s)
      apply(effective(s, d), base)
    },
    [base]
  )

  const set = useCallback(
    (key: string, ref: string) => commit({ ...draft, [key]: ref }, staged),
    [commit, draft, staged]
  )

  const reset = useCallback(
    (key: string) => {
      const d = { ...draft }
      const s = { ...staged }
      delete d[key]
      delete s[key]
      commit(d, s)
    },
    [commit, draft, staged]
  )

  const save = useCallback(
    (component: string) => {
      const d = { ...draft }
      const s = { ...staged }
      for (const k of Object.keys(draft)) {
        if (componentOf(k) !== component) continue
        s[k] = draft[k]
        delete d[k]
      }
      commit(d, s)
    },
    [commit, draft, staged]
  )

  const discardDraft = useCallback(
    (component: string) => {
      const d = Object.fromEntries(
        Object.entries(draft).filter(([k]) => componentOf(k) !== component)
      )
      commit(d, staged)
    },
    [commit, draft, staged]
  )

  const discardAll = useCallback(
    (component?: string) => {
      if (!component) return commit({}, {})
      const keep = (e: Edits) =>
        Object.fromEntries(Object.entries(e).filter(([k]) => componentOf(k) !== component))
      commit(keep(draft), keep(staged))
    },
    [commit, draft, staged]
  )

  const refOf = useCallback(
    (component: string, prop: OpenProp, size?: string) => {
      const k = editKey(component, prop, size)
      if (draft[k]) return draft[k]
      if (staged[k]) return staged[k]
      const recipe = base[component] as ComponentRecipe | undefined
      if (!recipe) return undefined
      return size
        ? recipe.sizes?.[size]?.[prop]
        : (recipe[prop as "radius" | "gap"] as string | undefined)
    },
    [draft, staged, base]
  )

  const layerOf = useCallback(
    (component: string, prop: OpenProp, size?: string) => {
      const k = editKey(component, prop, size)
      if (draft[k]) return "draft" as const
      if (staged[k]) return "staged" as const
      return "repo" as const
    },
    [draft, staged]
  )

  const savedComponents = useMemo(
    () => [...new Set(Object.keys(staged).map(componentOf))].sort(),
    [staged]
  )

  return (
    <Ctx.Provider
      value={{
        draft,
        staged,
        base,
        foundation,
        set,
        reset,
        save,
        discardDraft,
        discardAll,
        refOf,
        layerOf,
        savedComponents,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useComponentTokens() {
  const c = useContext(Ctx)
  if (!c) throw new Error("ComponentTokenProvider 안에서만 쓸 수 있다")
  return c
}

/** 내보내기용 — 레시피에 편집값을 얹은 결과. 이걸 data/components.json 에 덮으면 재현된다. */
export function merged(base: Components, edits: Edits): Components {
  const out: Components = JSON.parse(JSON.stringify(base))
  for (const [k, ref] of Object.entries(edits)) {
    const [component, a, b] = k.split(".")
    const target = out[component] as ComponentRecipe | undefined
    if (!target) continue
    if (b) {
      target.sizes ??= {}
      target.sizes[a] ??= {}
      target.sizes[a][b as OpenProp] = ref
    } else {
      ;(target as Record<string, unknown>)[a] = ref
    }
  }
  return out
}

/** 붙여 넣어 쓸 CSS. 값은 참조를 푼 결과라 그대로 globals.css 에 들어간다. */
export function editsToCss(edits: Edits): string {
  const rows = Object.entries(edits).map(([k, ref]) => {
    const [component, a, b] = k.split(".")
    const prop = (b ?? a) as OpenProp
    const size = b ? a : undefined
    return `  ${varName(component, prop, size)}: ${resolveRef(ref)};`
  })
  return rows.length ? `:root {\n${rows.join("\n")}\n}` : "/* 바꾼 값 없음 */"
}
