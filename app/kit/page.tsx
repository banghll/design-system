/* Paper 로 내보내기 위한 컴포넌트 격리 렌더 페이지.
 * data-kit 으로 표시해두면 브라우저에서 계산된 스타일을 인라인으로 바꿔 추출할 수 있다.
 * 이 페이지는 제품 화면이 아니라 추출용 지그다. */
"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

function Kit({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div
      data-kit={id}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
  )
}

export default function KitPage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 28,
        padding: 40,
        width: 900,
      }}
    >
      <Kit id="button-variants">
        <Button>기본</Button>
        <Button variant="secondary">보조</Button>
        <Button variant="outline">외곽선</Button>
        <Button variant="ghost">고스트</Button>
        <Button variant="destructive">삭제</Button>
        <Button disabled>비활성</Button>
      </Kit>

      <Kit id="button-sizes">
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
      </Kit>

      <Kit id="badge">
        <Badge>기본</Badge>
        <Badge variant="secondary">보조</Badge>
        <Badge variant="outline">외곽선</Badge>
        <Badge variant="destructive">오류</Badge>
      </Kit>

      <Kit id="input">
        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: 280 }}>
          <Label htmlFor="k1">이름</Label>
          <Input id="k1" placeholder="입력하세요" />
        </div>
      </Kit>

      <Kit id="textarea">
        <Textarea placeholder="여러 줄 입력" rows={3} style={{ width: 280 }} />
      </Kit>

      <Kit id="choice">
        <Checkbox defaultChecked />
        <Checkbox />
        <RadioGroup defaultValue="a" style={{ display: "flex", gap: 12 }}>
          <RadioGroupItem value="a" />
          <RadioGroupItem value="b" />
        </RadioGroup>
        <Switch defaultChecked />
        <Switch />
      </Kit>

      <Kit id="tabs">
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">수집</TabsTrigger>
            <TabsTrigger value="b">가공</TabsTrigger>
            <TabsTrigger value="c">발송</TabsTrigger>
          </TabsList>
        </Tabs>
      </Kit>

      <Kit id="alert">
        <Alert style={{ width: 420 }}>
          <AlertTitle>수집 일부 실패</AlertTitle>
          <AlertDescription>3곳이 차단되어 재시도 대기 중입니다.</AlertDescription>
        </Alert>
      </Kit>

      <Kit id="card">
        <Card style={{ width: 320 }}>
          <CardHeader>
            <CardTitle>리포트 설정</CardTitle>
            <CardDescription>매일 아침 발송되는 기본값입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm">저장</Button>
          </CardContent>
        </Card>
      </Kit>

      <Kit id="feedback">
        <Progress value={64} style={{ width: 220 }} />
        <Slider defaultValue={[40]} max={100} step={1} style={{ width: 220 }} />
        <Spinner />
        <Avatar>
          <AvatarFallback>PD</AvatarFallback>
        </Avatar>
      </Kit>

      <Kit id="skeleton">
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 280 }}>
          <Skeleton style={{ height: 20, width: "75%" }} />
          <Skeleton style={{ height: 20, width: "50%" }} />
        </div>
      </Kit>

      <Kit id="separator">
        <Separator style={{ width: 280 }} />
      </Kit>

      <Kit id="table">
        <Table style={{ width: 420 }}>
          <TableHeader>
            <TableRow>
              <TableHead>리포트</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>트렌드</TableCell>
              <TableCell>
                <Badge variant="secondary">완료</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>경쟁사</TableCell>
              <TableCell>
                <Badge variant="destructive">실패</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Kit>

      <Kit id="accordion">
        <Accordion type="single" collapsible style={{ width: 420 }} defaultValue="i1">
          <AccordionItem value="i1">
            <AccordionTrigger>차단된 사이트는 어떻게 되나요?</AccordionTrigger>
            <AccordionContent>다음 회차에 자동으로 재시도합니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Kit>
    </main>
  )
}
