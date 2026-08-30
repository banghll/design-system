/* 내 기록 — 평가 · 봤음 · 위시리스트.
 *
 * 서버가 없으므로 브라우저에 둔다. 제품이라면 계정에 붙을 자리다.
 * "봤음" 과 "위시리스트" 는 배타적이지 않다 — 다시 볼 것이 있다. */
"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Record = {
  /** 0.5 ~ 5.0, 0.5 단위 */
  score: number
  /** 한 줄평은 선택이다. 점수만 남기고 닫아도 된다. */
  note?: string
  /** ISO 날짜 */
  at: string
}

type State = {
  records: { [id: string]: Record }
  wish: string[]
  rate: (id: string, score: number, note?: string) => void
  unrate: (id: string) => void
  toggleWish: (id: string) => void
  clear: () => void
}

export const useLibrary = create<State>()(
  persist(
    (set) => ({
      records: {},
      wish: [],
      rate: (id, score, note) =>
        set((s) => ({
          records: {
            ...s.records,
            [id]: { score, note: note?.trim() || undefined, at: new Date().toISOString() },
          },
        })),
      unrate: (id) =>
        set((s) => {
          const next = { ...s.records }
          delete next[id]
          return { records: next }
        }),
      toggleWish: (id) =>
        set((s) => ({
          wish: s.wish.includes(id) ? s.wish.filter((x) => x !== id) : [...s.wish, id],
        })),
      clear: () => set({ records: {}, wish: [] }),
    }),
    { name: "cinedeck" }
  )
)
