/* slate-ui · surface: 컴포넌트 인벤토리 · focus: 살아 있는 샘플(왼쪽) · states: 기본·hover·focus·disabled
 * tokens: --color-card · --color-border-subtle · --gap-* · --radius-sm
 * spec: none · gates: 0 fail
 */
import Link from "next/link"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

const uiInventory = `accordion alert-dialog alert aspect-ratio attachment avatar badge breadcrumb bubble button-group button calendar card carousel chart checkbox collapsible combobox command context-menu dialog direction drawer dropdown-menu empty field hover-card input-group input-otp input item kbd label marker menubar message-scroller message native-select navigation-menu pagination popover progress questionnaire radio-group resizable scroll-area select separator sheet sidebar skeleton slider sonner spinner switch table tabs textarea toggle-group toggle tooltip`.split(" ")

const aiGroups: { title: string; note: string; items: string[] }[] = [
  {
    title: "대화",
    note: "메시지 스트림을 이루는 것들",
    items: ["conversation", "message", "prompt-input", "suggestion", "attachments", "persona", "queue", "checkpoint", "open-in-chat"],
  },
  {
    title: "사고 과정",
    note: "모델이 무엇을 하고 있는지 보여주는 것들",
    items: ["reasoning", "chain-of-thought", "plan", "task", "tool", "agent", "context", "confirmation", "shimmer"],
  },
  {
    title: "산출물",
    note: "모델이 만들어낸 결과를 담는 것들",
    items: ["artifact", "code-block", "snippet", "image", "jsx-preview", "web-preview", "sandbox", "terminal", "file-tree", "commit", "test-results", "stack-trace", "schema-display", "package-info", "environment-variables"],
  },
  {
    title: "근거",
    note: "출처를 밝히는 것들",
    items: ["sources", "inline-citation"],
  },
  {
    title: "음성 · 미디어",
    note: "",
    items: ["speech-input", "transcription", "audio-player", "mic-selector", "voice-selector"],
  },
  {
    title: "캔버스 · 제어",
    note: "",
    items: ["canvas", "node", "edge", "connection", "controls", "panel", "toolbar", "model-selector"],
  },
]

function Demo({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div
      className="border"
      style={{
        borderColor: "var(--color-border-subtle)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-card)",
        padding: "var(--padding-16)",
      }}
    >
      <code
        className="text-caption-3xs text-muted-foreground"
        style={{ display: "block", marginBottom: "var(--gap-12)" }}
      >
        {name}
      </code>
      {children}
    </div>
  )
}

export default function ComponentsPage() {
  return (
    <main
      className="mx-auto w-full"
      style={{
        maxWidth: "64rem",
        padding: "var(--padding-24)",
        paddingTop: "var(--padding-48)",
        paddingBottom: "var(--padding-48)",
      }}
    >
      <header style={{ marginBottom: "var(--gap-40)" }}>
        <Button variant="ghost" size="sm" asChild style={{ marginBottom: "var(--gap-16)" }}>
          <Link href="/">← 토큰</Link>
        </Button>
        <h1 className="text-title-xl" style={{ marginBottom: "var(--gap-8)" }}>
          컴포넌트 {uiInventory.length + 48}개
        </h1>
        <p className="text-body-sm text-muted-foreground" style={{ maxWidth: "60ch" }}>
          shadcn/ui {uiInventory.length}개 + AI Elements 48개. 전부 이 레포 안의
          소스 파일이고, 전부 slate 토큰을 참조한다. 아래 샘플에 색상값을 적은
          곳은 한 군데도 없다.
        </p>
      </header>

      <Separator style={{ marginBottom: "var(--gap-40)" }} />

      <section style={{ marginBottom: "var(--gap-44)" }}>
        <h2 className="text-heading-md" style={{ marginBottom: "var(--gap-16)" }}>
          살아 있는 샘플
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Demo name="button">
            <div className="flex flex-wrap" style={{ gap: "var(--gap-8)" }}>
              <Button size="sm">기본</Button>
              <Button size="sm" variant="secondary">보조</Button>
              <Button size="sm" variant="outline">외곽선</Button>
              <Button size="sm" variant="ghost">고스트</Button>
              <Button size="sm" variant="destructive">삭제</Button>
              <Button size="sm" disabled>비활성</Button>
            </div>
          </Demo>

          <Demo name="badge · avatar">
            <div className="flex flex-wrap items-center" style={{ gap: "var(--gap-8)" }}>
              <Badge>기본</Badge>
              <Badge variant="secondary">보조</Badge>
              <Badge variant="outline">외곽선</Badge>
              <Badge variant="destructive">오류</Badge>
              <Avatar>
                <AvatarFallback>PD</AvatarFallback>
              </Avatar>
            </div>
          </Demo>

          <Demo name="input · label · textarea">
            <div className="flex flex-col" style={{ gap: "var(--gap-12)" }}>
              <div className="flex flex-col" style={{ gap: "var(--gap-6)" }}>
                <Label htmlFor="c-name">이름</Label>
                <Input id="c-name" placeholder="입력하세요" />
              </div>
              <Textarea placeholder="여러 줄 입력" rows={2} />
            </div>
          </Demo>

          <Demo name="checkbox · radio · switch">
            <div className="flex flex-col" style={{ gap: "var(--gap-12)" }}>
              <div className="flex items-center" style={{ gap: "var(--gap-8)" }}>
                <Checkbox id="c-1" defaultChecked />
                <Label htmlFor="c-1">매일 아침 발송</Label>
              </div>
              <RadioGroup defaultValue="a" className="flex" style={{ gap: "var(--gap-16)" }}>
                <div className="flex items-center" style={{ gap: "var(--gap-6)" }}>
                  <RadioGroupItem value="a" id="r-a" />
                  <Label htmlFor="r-a">요약</Label>
                </div>
                <div className="flex items-center" style={{ gap: "var(--gap-6)" }}>
                  <RadioGroupItem value="b" id="r-b" />
                  <Label htmlFor="r-b">전문</Label>
                </div>
              </RadioGroup>
              <div className="flex items-center" style={{ gap: "var(--gap-8)" }}>
                <Switch id="c-2" defaultChecked />
                <Label htmlFor="c-2">Slack 알림</Label>
              </div>
            </div>
          </Demo>

          <Demo name="tabs">
            <Tabs defaultValue="a">
              <TabsList>
                <TabsTrigger value="a">수집</TabsTrigger>
                <TabsTrigger value="b">가공</TabsTrigger>
                <TabsTrigger value="c">발송</TabsTrigger>
              </TabsList>
              <TabsContent value="a" className="text-body-sm text-muted-foreground" style={{ paddingTop: "var(--padding-8)" }}>
                크롤링 대상 42곳
              </TabsContent>
              <TabsContent value="b" className="text-body-sm text-muted-foreground" style={{ paddingTop: "var(--padding-8)" }}>
                요약 4종 생성
              </TabsContent>
              <TabsContent value="c" className="text-body-sm text-muted-foreground" style={{ paddingTop: "var(--padding-8)" }}>
                08:00 스레드 DM
              </TabsContent>
            </Tabs>
          </Demo>

          <Demo name="alert">
            <Alert>
              <AlertTitle>수집 일부 실패</AlertTitle>
              <AlertDescription>3곳이 차단되어 재시도 대기 중입니다.</AlertDescription>
            </Alert>
          </Demo>

          <Demo name="progress · slider · spinner">
            <div className="flex flex-col" style={{ gap: "var(--gap-16)" }}>
              <Progress value={64} />
              <Slider defaultValue={[40]} max={100} step={1} />
              <div className="flex items-center" style={{ gap: "var(--gap-8)" }}>
                <Spinner />
                <span className="text-body-sm text-muted-foreground">처리 중</span>
              </div>
            </div>
          </Demo>

          <Demo name="skeleton">
            <div className="flex flex-col" style={{ gap: "var(--gap-8)" }}>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Demo>

          <Demo name="accordion">
            <Accordion type="single" collapsible>
              <AccordionItem value="i1">
                <AccordionTrigger className="text-body-sm">차단된 사이트는 어떻게 되나요?</AccordionTrigger>
                <AccordionContent className="text-body-sm text-muted-foreground">
                  다음 회차에 자동으로 재시도합니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="i2">
                <AccordionTrigger className="text-body-sm">발송 시각을 바꿀 수 있나요?</AccordionTrigger>
                <AccordionContent className="text-body-sm text-muted-foreground">
                  스케줄 설정에서 변경합니다.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Demo>

          <Demo name="table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>리포트</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>트렌드</TableCell>
                  <TableCell><Badge variant="secondary">완료</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>경쟁사</TableCell>
                  <TableCell><Badge variant="destructive">실패</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Demo>
        </div>
      </section>

      <Separator style={{ marginBottom: "var(--gap-40)" }} />

      <section style={{ marginBottom: "var(--gap-44)" }}>
        <h2 className="text-heading-md" style={{ marginBottom: "var(--gap-8)" }}>
          AI Elements 48개
        </h2>
        <p className="text-body-sm text-muted-foreground" style={{ marginBottom: "var(--gap-24)", maxWidth: "60ch" }}>
          에이전트가 하는 일을 화면으로 옮긴 조각들이다. 대부분 데이터를 물려야
          의미가 생기므로 여기서는 이름과 쓰임만 적는다.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {aiGroups.map((g) => (
            <Card key={g.title}>
              <CardHeader>
                <CardTitle className="text-body-sm">{g.title}</CardTitle>
                {g.note ? (
                  <p className="text-caption-2xs text-muted-foreground">{g.note}</p>
                ) : null}
              </CardHeader>
              <CardContent className="flex flex-wrap" style={{ gap: "var(--gap-6)" }}>
                {g.items.map((i) => (
                  <code
                    key={i}
                    className="text-caption-3xs"
                    style={{
                      background: "var(--color-fill-subtle)",
                      color: "var(--color-foreground)",
                      borderRadius: "var(--radius-xs)",
                      padding: "var(--padding-3) var(--padding-6)",
                    }}
                  >
                    {i}
                  </code>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-heading-md" style={{ marginBottom: "var(--gap-16)" }}>
          shadcn/ui {uiInventory.length}개
        </h2>
        <div className="flex flex-wrap" style={{ gap: "var(--gap-6)" }}>
          {uiInventory.map((i) => (
            <code
              key={i}
              className="text-caption-3xs text-muted-foreground"
              style={{
                border: "1px solid var(--color-border-faint)",
                borderRadius: "var(--radius-xs)",
                padding: "var(--padding-3) var(--padding-6)",
              }}
            >
              {i}
            </code>
          ))}
        </div>
      </section>
    </main>
  )
}
