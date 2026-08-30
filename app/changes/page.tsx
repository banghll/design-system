/* 변경사항 — 저장해 둔 것을 한 번에 레포로 넘기는 자리.
 *
 * 컴포넌트마다 내보내면 파일이 여러 벌 생기고 어느 게 최신인지 알 수 없게 된다.
 * 실제 작업은 버튼을 만지다 입력으로 넘어가 비교하고 다시 돌아오는 식이라,
 * «저장» 은 화면마다 하고 «내보내기» 는 여기 한 곳에서 한다.
 *
 * 내보낸 JSON 을 data/components.json 에 덮고 npm run gen 을 돌리면
 * globals.css · 색인 · 생성 페이지가 전부 따라온다. 그때부터가 정본이다. */
"use client"

import { useState } from "react"
import { Check, Copy, Download, RotateCcw, Trash2 } from "lucide-react"
import Link from "next/link"

import { CatalogHeader, CatalogMain, CatalogShell } from "@/components/catalog-shell"
import {
  editsToCss,
  merged,
  useComponentTokens,
} from "@/components/component-tokens"
import { useLang } from "@/components/lang"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { refToPx, varName, type OpenProp } from "@/lib/tokens"

export default function ChangesPage() {
  const { staged, draft, base, foundation, discardAll, reset } = useComponentTokens()
  const { lang } = useLang()
  const [copied, setCopied] = useState(false)

  const components = [...new Set(Object.keys(staged).map((k) => k.split(".")[0]))].sort()
  const unsaved = [...new Set(Object.keys(draft).map((k) => k.split(".")[0]))].sort()

  const exportJson = () => {
    const blob = new Blob(
      [JSON.stringify(merged(base, staged), null, 2) + "\n"],
      { type: "application/json" }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "components.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyCss = async () => {
    await navigator.clipboard.writeText(editsToCss(staged))
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <CatalogShell>
      <CatalogMain>
        <CatalogHeader
          title={{ ko: "변경사항", en: "Changes" }}
          count={components.length ? String(components.length) : undefined}
        >
          <p>
            {lang === "ko"
              ? "여기 있는 값은 이 브라우저에만 있습니다. 레포에 남기려면 내보내서 data/components.json 에 덮고 커밋하세요 — 그때부터가 정본입니다."
              : "These values live in this browser only. Export, overwrite data/components.json, and commit — that is when they become real."}
          </p>
          {unsaved.length ? (
            <p className="mt-3 text-sm">
              {lang === "ko"
                ? `아직 저장하지 않은 컴포넌트: ${unsaved.join(", ")} — 저장해야 여기 올라옵니다.`
                : `Not saved yet: ${unsaved.join(", ")} — save them to bring them here.`}
            </p>
          ) : null}
        </CatalogHeader>

        {components.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>
                {lang === "ko" ? "저장한 변경이 없습니다" : "Nothing saved yet"}
              </EmptyTitle>
              <EmptyDescription>
                {lang === "ko"
                  ? "컴포넌트 화면에서 값을 고치고 «이 컴포넌트 저장» 을 누르면 여기 모입니다. 여러 컴포넌트를 만진 뒤 한 번에 내보내면 됩니다."
                  : "Change a value on a component page and press save — it collects here. Adjust several, then export once."}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild variant="outline">
                <Link href="/components/button">
                  {lang === "ko" ? "버튼부터 보기" : "Start with the button"}
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="flex flex-col gap-8">
            {components.map((c) => {
              const keys = Object.keys(staged).filter((k) => k.startsWith(c + "."))
              return (
                <section key={c} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="font-mono text-lg font-semibold">{c}</h2>
                    <Badge variant="outline">{keys.length}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-auto"
                      onClick={() => discardAll(c)}
                    >
                      <Trash2 />
                      {lang === "ko" ? "전부 되돌리기" : "Discard all"}
                    </Button>
                  </div>
                  <ItemGroup>
                    {keys.map((k) => {
                      const [, a, b] = k.split(".")
                      const prop = (b ?? a) as OpenProp
                      const size = b ? a : undefined
                      const was =
                        (size
                          ? base[c]?.sizes?.[size]?.[prop]
                          : (base[c] as Record<string, string>)?.[prop]) ?? "—"
                      const now = staged[k]
                      return (
                        <Item key={k} variant="outline" size="sm">
                          <ItemContent>
                            <ItemTitle className="font-mono text-xs">
                              {varName(c, prop, size)}
                            </ItemTitle>
                            <ItemDescription>
                              <span className="line-through opacity-60">{was}</span>
                              {" → "}
                              <span className="text-foreground font-medium">{now}</span>
                              <span className="ml-2 tabular-nums">
                                {refToPx(now, foundation) == null
                                  ? ""
                                  : `${Math.round(refToPx(now, foundation)!)}px`}
                              </span>
                            </ItemDescription>
                          </ItemContent>
                          <ItemActions>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => reset(k)}
                              aria-label={lang === "ko" ? "되돌리기" : "Revert"}
                            >
                              <RotateCcw />
                            </Button>
                          </ItemActions>
                        </Item>
                      )
                    })}
                  </ItemGroup>
                </section>
              )
            })}

            <Separator />

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Button onClick={exportJson}>
                  <Download />
                  {lang === "ko" ? "components.json 내보내기" : "Export components.json"}
                </Button>
                <Button variant="outline" onClick={() => void copyCss()}>
                  {copied ? <Check /> : <Copy />}
                  {lang === "ko" ? "CSS 복사" : "Copy CSS"}
                </Button>
                <Button
                  variant="ghost"
                  className="ml-auto"
                  onClick={() => discardAll()}
                >
                  <RotateCcw />
                  {lang === "ko" ? "전부 버리기" : "Discard everything"}
                </Button>
              </div>

              <div className="bg-muted/40 rounded-lg border p-4">
                <div className="mb-2 text-xs font-semibold">
                  {lang === "ko" ? "레포에 넣는 법" : "Getting it into the repo"}
                </div>
                <ol className="text-muted-foreground flex list-decimal flex-col gap-1 pl-4 text-xs leading-relaxed">
                  <li>
                    {lang === "ko"
                      ? "내려받은 components.json 을 data/components.json 에 덮는다"
                      : "Overwrite data/components.json with the downloaded file"}
                  </li>
                  <li>
                    <code>npm run gen</code>
                    {lang === "ko"
                      ? " — globals.css · 색인 · 생성 페이지가 따라온다"
                      : " — globals.css, the index and generated pages all follow"}
                  </li>
                  <li>
                    {lang === "ko"
                      ? "커밋. 그때부터 이 값이 정본이고, 브라우저 값은 지워도 된다"
                      : "Commit. From then on this is the source of truth"}
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </CatalogMain>
    </CatalogShell>
  )
}
