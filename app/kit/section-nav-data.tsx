/* 탐색 · 데이터 계열 */
"use client"

import { ChevronDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Group, Kit } from "./kit"

const chartData = [
  { month: "5월", 수집: 186, 실패: 12 },
  { month: "6월", 수집: 205, 실패: 8 },
  { month: "7월", 수집: 237, 실패: 19 },
  { month: "8월", 수집: 173, 실패: 5 },
]

const chartConfig = {
  수집: { label: "수집", color: "var(--color-accent-blue)" },
  실패: { label: "실패", color: "var(--color-destructive)" },
}

export function SectionNavData() {
  return (
    <Group
      id="g-nav"
      title="탐색 · 데이터"
      note="위치를 옮기고, 접고 펴고, 목록과 표를 다루는 것"
    >
      <Kit id="breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">리포트</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>8월</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Kit>

      <Kit id="pagination">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Kit>

      <Kit id="tabs">
        <Tabs defaultValue="a" className="w-96">
          <TabsList>
            <TabsTrigger value="a">수집</TabsTrigger>
            <TabsTrigger value="b">가공</TabsTrigger>
            <TabsTrigger value="c">발송</TabsTrigger>
          </TabsList>
          <TabsContent value="a" className="text-body-sm text-subtle pt-3">
            크롤링 대상 42곳
          </TabsContent>
        </Tabs>
      </Kit>

      <Kit id="accordion">
        <Accordion type="single" collapsible className="w-96" defaultValue="i1">
          <AccordionItem value="i1">
            <AccordionTrigger>차단된 사이트는 어떻게 되나요?</AccordionTrigger>
            <AccordionContent>다음 회차에 자동으로 재시도합니다.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="i2">
            <AccordionTrigger>발송 시각을 바꿀 수 있나요?</AccordionTrigger>
            <AccordionContent>스케줄 설정에서 변경합니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Kit>

      <Kit id="collapsible">
        <Collapsible defaultOpen className="w-96">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              수집 대상 42곳 <ChevronDown />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-body-sm text-subtle pt-2">
              네이버 · 다음 · 구글 뉴스 · 테크크런치 …
            </p>
          </CollapsibleContent>
        </Collapsible>
      </Kit>

      <Kit id="table">
        <Table className="w-[28rem]">
          <TableCaption>최근 발송 내역</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>리포트</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">건수</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>트렌드</TableCell>
              <TableCell>
                <Badge variant="secondary">완료</Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">42</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>경쟁사</TableCell>
              <TableCell>
                <Badge variant="destructive">실패</Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">3</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>합계</TableCell>
              <TableCell className="text-right tabular-nums">45</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Kit>

      <Kit id="chart" note="recharts + ChartContainer">
        <ChartContainer config={chartConfig} className="h-56 w-[28rem]">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="수집" fill="var(--color-수집)" radius={4} />
            <Bar dataKey="실패" fill="var(--color-실패)" radius={4} />
          </BarChart>
        </ChartContainer>
      </Kit>

      <Kit id="calendar">
        <Calendar mode="single" className="rounded-lg border" />
      </Kit>

      <Kit id="carousel">
        <Carousel className="w-72">
          <CarouselContent>
            {[1, 2, 3].map((n) => (
              <CarouselItem key={n}>
                <div
                  className="flex h-28 items-center justify-center rounded-lg"
                  style={{ background: "var(--color-fill-subtle)" }}
                >
                  <span className="text-heading-md">{n}</span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Kit>

      <Kit id="command" note="인라인 · Dialog 형태는 오버레이 섹션">
        <Command className="w-80 rounded-lg border">
          <CommandInput placeholder="명령을 검색하세요" />
          <CommandList>
            <CommandEmpty>결과가 없습니다.</CommandEmpty>
            <CommandGroup heading="리포트">
              <CommandItem>
                새 리포트 만들기 <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem>지금 발송</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="설정">
              <CommandItem>발송 시각 바꾸기</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </Kit>

      <Kit id="scroll-area">
        <ScrollArea className="h-32 w-72 rounded-lg border p-3">
          <div className="text-body-sm flex flex-col gap-2">
            {[
              "네이버 뉴스",
              "다음 뉴스",
              "구글 뉴스",
              "테크크런치",
              "더버지",
              "아르스테크니카",
              "와이어드",
            ].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </ScrollArea>
      </Kit>

      <Kit id="resizable">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-32 w-96 rounded-lg border"
        >
          <ResizablePanel defaultSize={40}>
            <div className="text-body-sm text-subtle flex h-full items-center justify-center">
              목록
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60}>
            <div className="text-body-sm text-subtle flex h-full items-center justify-center">
              본문
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Kit>
    </Group>
  )
}
