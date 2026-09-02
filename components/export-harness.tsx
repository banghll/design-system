"use client"

/* 측정용 화면.
 *
 * Figma 로 옮길 때 «비슷하게» 는 쓸모가 없다. 버튼 높이가 1px 다르면 그 버튼이
 * 들어간 모든 화면이 1px 씩 어긋나고, 그때부터 Figma 와 코드 중 어느 쪽이
 * 맞는지 아무도 모르게 된다.
 *
 * 그래서 눈으로 옮기지 않는다. 진짜 컴포넌트를 렌더해 두고 브라우저가 계산한
 * 값을 그대로 읽어 간다 — 높이·여백·모서리·글자 크기·색까지 전부.
 * 여기 있는 것은 카탈로그와 같은 컴포넌트이므로, 카탈로그가 바뀌면 이 값도 바뀐다.
 *
 * data-export 는 «컴포넌트/변형/크기/상태» 다. 측정 스크립트가 이 이름으로
 * Figma 의 변형 이름을 만든다. */

import type { Exportable } from "@/lib/exportable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Cell = { key: string; node: React.ReactNode }

const BUTTON_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const
const BUTTON_SIZES = ["xs", "sm", "default", "lg"] as const

function buttonCells(): Cell[] {
  const out: Cell[] = []
  for (const v of BUTTON_VARIANTS) {
    for (const s of BUTTON_SIZES) {
      out.push({
        key: `button/${v}/${s}/default`,
        node: (
          <Button variant={v} size={s}>
            Button
          </Button>
        ),
      })
      out.push({
        key: `button/${v}/${s}/disabled`,
        node: (
          <Button variant={v} size={s} disabled>
            Button
          </Button>
        ),
      })
    }
  }
  /* 아이콘 전용은 정사각이라 따로 잰다 — 글자 폭이 없어 규칙이 다르다 */
  for (const s of ["icon-xs", "icon-sm", "icon", "icon-lg"] as const) {
    out.push({
      key: `button/default/${s}/default`,
      node: (
        <Button size={s} aria-label="icon">
          <span className="block size-4 rounded-full bg-current opacity-70" />
        </Button>
      ),
    })
  }
  return out
}

function inputCells(): Cell[] {
  const out: Cell[] = []
  for (const s of ["xs", "sm", "default", "lg"] as const) {
    out.push({
      key: `input/default/${s}/empty`,
      node: <Input size={s} placeholder="Placeholder" className="w-56" />,
    })
    out.push({
      key: `input/default/${s}/filled`,
      node: <Input size={s} defaultValue="Value" className="w-56" />,
    })
    out.push({
      key: `input/default/${s}/disabled`,
      node: <Input size={s} placeholder="Placeholder" disabled className="w-56" />,
    })
    out.push({
      key: `input/default/${s}/invalid`,
      node: <Input size={s} defaultValue="Value" aria-invalid className="w-56" />,
    })
  }
  return out
}

function badgeCells(): Cell[] {
  return (["default", "secondary", "outline", "destructive"] as const).map((v) => ({
    key: `badge/${v}/default/default`,
    node: <Badge variant={v}>Badge</Badge>,
  }))
}

function cardCells(): Cell[] {
  return (["default", "sm"] as const).map((s) => ({
    key: `card/default/${s}/default`,
    node: (
      <Card size={s} className="w-80">
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Supporting line</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Body copy sits here.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Action</Button>
        </CardFooter>
      </Card>
    ),
  }))
}

function tabsCells(): Cell[] {
  return [
    {
      key: `tabs/default/default/default`,
      node: (
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">General</TabsTrigger>
            <TabsTrigger value="b">Billing</TabsTrigger>
            <TabsTrigger value="c">Goals</TabsTrigger>
          </TabsList>
        </Tabs>
      ),
    },
  ]
}

/* 목록은 lib/exportable.ts 가 정본이다 — 여기서 빠지면 아래 검사가 잡는다 */
const CELLS: Record<Exportable, () => Cell[]> = {
  button: buttonCells,
  input: inputCells,
  badge: badgeCells,
  card: cardCells,
  tabs: tabsCells,
}

export function ExportHarness({ id }: { id: string }) {
  const make = CELLS[id as Exportable]
  if (!make) return null

  return (
    /* 측정만 하는 화면이라 꾸미지 않는다. 여백이나 배경이 붙으면
     * 그것까지 재게 되고, Figma 로 그 여백이 따라간다. */
    <div className="flex flex-col items-start gap-6 p-8">
      {make().map(({ key, node }) => (
        <div key={key} data-export={key} className="w-fit">
          {node}
        </div>
      ))}
    </div>
  )
}
