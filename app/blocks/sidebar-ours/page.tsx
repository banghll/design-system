/* 우리 카탈로그 셸을 블록 예제로도 세워 둔다.
 * 공식 사이드바 16종 옆에 나란히 놓고 비교할 수 있어야,
 * "왜 이 구조를 골랐는지" 가 시스템 안에서 설명된다. */
import { CatalogShell } from "@/components/catalog-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  return (
    <CatalogShell>
      <div className="mx-auto max-w-4xl px-8 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">카탈로그 셸</h1>
        <p className="text-muted-foreground mt-3 max-w-[62ch] text-base leading-relaxed">
          왼쪽이 이 사이트가 실제로 쓰는 사이드바다. 상위 항목을 누르면 페이지가
          바뀌고, 화살표를 누르면 그 페이지 안의 구획이 펼쳐진다. 구획을 누르면
          페이지를 옮기지 않고 해당 위치로 스크롤한다.
        </p>

        <Separator className="my-10" />

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">한 곳에서만 온다</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-relaxed">
              메뉴와 각 페이지의 구획 목록이 <code>lib/catalog-nav.ts</code> 하나에서
              나온다. 사이드바와 본문이 갈라질 수 없다.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">구분선을 두지 않는다</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-relaxed">
              구획은 여백과 들여쓰기로만 나눈다. 선을 그으면 항목이 늘어날수록
              화면이 격자로 잘려 보인다.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">하나만 펼친다</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-relaxed">
              지금 보는 페이지만 펼쳐 둔다. 여러 개를 동시에 펼치면 스크롤이
              길어져 어디를 보고 있는지 잃는다.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">앵커를 다시 맞춘다</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-relaxed">
              차트와 이미지가 늦게 자리를 잡아 브라우저 기본 이동만으로는
              목표가 어긋난다. 해시가 바뀌면 잠깐 동안 위치를 다시 맞춘다.
            </CardContent>
          </Card>
        </div>
      </div>
    </CatalogShell>
  )
}
