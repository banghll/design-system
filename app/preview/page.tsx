/* 판정 화면.
 *
 * 컴포넌트를 나열한 화면으로는 밀도를 못 본다. 버튼 스무 개를 한 줄에 늘어놓으면
 * 전부 커 보이거나 전부 작아 보이고, 실제로 판단해야 하는 «표 한 줄에 버튼이
 * 들어갔을 때» 나 «폼이 한 화면에 들어오는가» 는 거기서 안 드러난다.
 *
 * 그래서 세 화면만 둔다. 셋이 서로 다른 것을 묻는다.
 *   목록  — 한 줄의 높이. 스무 줄이 한 화면에 들어오는가
 *   폼    — 라벨과 입력의 관계. 스크롤 없이 끝나는가
 *   대시보드 — 카드가 여러 장일 때의 여백. 숫자가 읽히는가
 *
 * /components/button 에서 높이를 바꾸면 이 세 화면이 즉시 따라온다. */
"use client"

import { useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react"

import { CatalogShell } from "@/components/catalog-shell"
import { useLang } from "@/components/lang"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

/* 지어낸 숫자가 아니라 «형식만 있는 자리»다. 판정 화면에서 필요한 건
 * 자릿수와 줄 수이지 값의 의미가 아니다. */
const ROWS = [
  ["INV-2041", "노션 코리아", "결제 완료", "1,240,000", "8월 12일"],
  ["INV-2042", "당근마켓", "검토 중", "860,000", "8월 13일"],
  ["INV-2043", "토스페이먼츠", "결제 완료", "3,180,000", "8월 14일"],
  ["INV-2044", "리디", "반려", "420,000", "8월 15일"],
  ["INV-2045", "야놀자", "검토 중", "990,000", "8월 16일"],
  ["INV-2046", "무신사", "결제 완료", "2,050,000", "8월 18일"],
  ["INV-2047", "배달의민족", "검토 중", "1,700,000", "8월 19일"],
  ["INV-2048", "쿠팡", "결제 완료", "5,320,000", "8월 20일"],
]

const TONE: Record<string, "default" | "secondary" | "outline"> = {
  "결제 완료": "secondary",
  "검토 중": "outline",
  반려: "default",
}

function ListScreen() {
  const [q, setQ] = useState("")
  const rows = ROWS.filter((r) => r.join(" ").includes(q))

  return (
    <div className="flex flex-col gap-4">
      {/* 도구 줄 — 여기서 입력과 버튼이 한 줄에 서므로 높이가 어긋나면 바로 보인다 */}
      <div className="flex flex-wrap items-center gap-2">
        <InputGroup className="w-full max-w-72">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="청구서 · 거래처"
          />
        </InputGroup>
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="paid">결제 완료</SelectItem>
            <SelectItem value="review">검토 중</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter />
          필터
        </Button>
        <Button variant="outline" size="icon" aria-label="열 설정">
          <SlidersHorizontal />
        </Button>
        <Button className="ml-auto">
          <Plus />
          새 청구서
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox aria-label="전체 선택" />
              </TableHead>
              <TableHead>번호</TableHead>
              <TableHead>거래처</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">금액</TableHead>
              <TableHead>기한</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r[0]}>
                <TableCell>
                  <Checkbox aria-label={`${r[0]} 선택`} />
                </TableCell>
                <TableCell className="font-mono text-xs">{r[0]}</TableCell>
                <TableCell className="font-medium">{r[1]}</TableCell>
                <TableCell>
                  <Badge variant={TONE[r[2]] ?? "outline"}>{r[2]}</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">{r[3]}</TableCell>
                <TableCell className="text-muted-foreground">{r[4]}</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost">
                    열기
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-muted-foreground text-xs">
        {rows.length}건 · 표 한 줄의 높이는 그 안에 든 배지와 버튼이 정한다.
        버튼이 커지면 줄이 두꺼워지고, 한 화면에 들어오는 줄 수가 줄어든다.
      </p>
    </div>
  )
}

function FormScreen() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>청구서 만들기</CardTitle>
          <CardDescription>
            보내기 전까지는 임시 저장됩니다. 항목은 나중에 고칠 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="pv-client">거래처</FieldLabel>
              <Input id="pv-client" placeholder="회사 이름" />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="pv-amount">금액</FieldLabel>
                <Input id="pv-amount" placeholder="0" inputMode="numeric" />
              </Field>
              <Field>
                <FieldLabel htmlFor="pv-due">기한</FieldLabel>
                <Select defaultValue="14">
                  <SelectTrigger id="pv-due">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7일 뒤</SelectItem>
                    <SelectItem value="14">14일 뒤</SelectItem>
                    <SelectItem value="30">30일 뒤</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="pv-note">메모</FieldLabel>
              <Textarea id="pv-note" placeholder="받는 사람에게 남길 말" rows={3} />
              <FieldDescription>청구서 아래에 그대로 실립니다.</FieldDescription>
            </Field>

            <Separator />

            <Field>
              <FieldLabel>보내는 방법</FieldLabel>
              <RadioGroup defaultValue="email" className="gap-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="email" id="pv-email" />
                  <Label htmlFor="pv-email" className="font-normal">
                    이메일로 보내기
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="link" id="pv-link" />
                  <Label htmlFor="pv-link" className="font-normal">
                    링크만 만들기
                  </Label>
                </div>
              </RadioGroup>
            </Field>

            <Field orientation="horizontal">
              <FieldLabel htmlFor="pv-remind" className="font-normal">
                기한 3일 전에 다시 알리기
              </FieldLabel>
              <Switch id="pv-remind" defaultChecked />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="ghost">임시 저장</Button>
          <Button>보내기</Button>
        </CardFooter>
      </Card>

      <p className="text-muted-foreground mt-3 text-xs">
        입력 높이와 라벨 사이 간격이 폼 전체 길이를 정한다. 한 화면에 안 들어오면
        사람은 위에 뭐가 있었는지 잊는다.
      </p>
    </div>
  )
}

function DashboardScreen() {
  const stats = [
    ["미수금", "8,240,000", "청구서 12건", 62],
    ["이번 달 수금", "5,180,000", "목표의 74%", 74],
    ["연체", "1,320,000", "3건 · 평균 9일", 22],
  ] as const

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(([label, value, note, pct]) => (
          <Card key={label}>
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {pct >= 50 ? <ArrowUp /> : <ArrowDown />}
                  {pct}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Progress value={pct} />
              <span className="text-muted-foreground text-xs">{note}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>최근 청구서</CardTitle>
            <CardDescription>기한이 가까운 순서</CardDescription>
            <CardAction>
              <Button size="sm" variant="outline">
                전체 보기
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-0">
            {ROWS.slice(0, 5).map((r, i) => (
              <div key={r[0]}>
                {i ? <Separator /> : null}
                <div className="flex items-center gap-3 py-2.5">
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {r[1]}
                  </span>
                  <Badge variant={TONE[r[2]] ?? "outline"}>{r[2]}</Badge>
                  <span className="w-24 text-right text-sm tabular-nums">
                    {r[3]}
                  </span>
                  <Button size="sm" variant="ghost">
                    열기
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>빠른 작업</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button className="justify-start">
              <Plus />
              청구서 만들기
            </Button>
            <Button variant="outline" className="justify-start">
              거래처 추가
            </Button>
            <Button variant="outline" className="justify-start">
              이번 달 마감
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground text-xs">
              카드가 여러 장일 때 여백이 곧 밀도다. 카드 안 여백을 한 단만 늘려도
              화면 하나에 들어가는 카드 수가 바뀐다.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  const { lang } = useLang()

  return (
    <CatalogShell>
      <main className="mx-auto w-full max-w-[1200px] px-6 py-10 lg:px-10">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {lang === "ko" ? "판정 화면" : "Judgement screens"}
          </h1>
          <Badge variant="secondary">
            {lang === "ko" ? "밀도 검증 전용" : "Density only"}
          </Badge>
        </div>
        <p className="text-muted-foreground max-w-[70ch] text-sm leading-relaxed">
          {lang === "ko"
            ? "컴포넌트를 나열한 화면으로는 밀도를 판단할 수 없습니다. 표 한 줄에 버튼이 들어갔을 때, 폼이 한 화면에 들어오는지, 카드가 여러 장일 때 여백이 어떤지 — 그건 실제 화면에서만 보입니다. 컴포넌트 토큰을 바꾸면 이 세 화면이 즉시 따라옵니다."
            : "You cannot judge density from a gallery of components. A button inside a table row, a form that must fit one screen, cards side by side — only real screens show that. Change a component token and these three follow immediately."}
        </p>

        <Separator className="my-8" />

        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">
              {lang === "ko" ? "목록 · 필터" : "List & filter"}
            </TabsTrigger>
            <TabsTrigger value="form">{lang === "ko" ? "폼" : "Form"}</TabsTrigger>
            <TabsTrigger value="dash">
              {lang === "ko" ? "대시보드" : "Dashboard"}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="pt-6">
            <ListScreen />
          </TabsContent>
          <TabsContent value="form" className="pt-6">
            <FormScreen />
          </TabsContent>
          <TabsContent value="dash" className="pt-6">
            <DashboardScreen />
          </TabsContent>
        </Tabs>
      </main>
    </CatalogShell>
  )
}
