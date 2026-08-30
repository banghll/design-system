/* 한국어 · English.
 *
 * 디자인 시스템의 설명문은 두 종류의 독자를 갖는다 — 같이 만드는 사람과,
 * 이 문서를 읽고 화면을 짜는 에이전트. 둘 다 영어로만 읽지 않는다.
 * 그래서 설명을 { ko, en } 한 쌍으로 두고, 화면에서 고른다.
 *
 * 서버는 항상 ko 로 그린다. 저장된 언어는 마운트 뒤에 반영되므로
 * 첫 렌더가 어긋나지 않는다. */
"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type Lang = "ko" | "en"

/** 두 언어를 함께 들고 다니는 문자열. */
export type Copy = { ko: string; en: string }

const KEY = "ds-lang"

const Ctx = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
}>({ lang: "ko", setLang: () => {} })

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ko")

  useEffect(() => {
    const saved = localStorage.getItem(KEY)
    if (saved === "en" || saved === "ko") setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem(KEY, l)
    document.documentElement.lang = l
  }

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>
}

export function useLang() {
  const { lang, setLang } = useContext(Ctx)
  /** Copy 든 평문이든 받아서 지금 언어의 문자열을 준다. */
  const t = (v: Copy | string | undefined) =>
    v == null ? "" : typeof v === "string" ? v : v[lang]
  return { lang, setLang, t }
}

/** 문장 하나를 그대로 그린다. <T v={COPY.x} /> */
export function T({ v }: { v: Copy | string | undefined }) {
  const { t } = useLang()
  return <>{t(v)}</>
}
