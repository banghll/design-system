/* 표시 계열 — 상태와 내용을 보여주는 것 */
"use client"

import { AlertTriangle, FileText, Inbox, Paperclip, Sparkles } from "lucide-react"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Attachment,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
} from "@/components/ui/message"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

import { Group, Kit } from "./kit"

export function SectionDisplay() {
  return (
    <Group
      id="g-display"
      title="표시"
      note="상태와 내용을 보여주는 것"
    >
      <Kit id="badge">
        <Badge>기본</Badge>
        <Badge variant="secondary">보조</Badge>
        <Badge variant="outline">외곽선</Badge>
        <Badge variant="destructive">오류</Badge>
      </Kit>

      <Kit id="avatar" note="fallback · badge · group">
        <Avatar>
          <AvatarFallback>PD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>BK</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>B</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+4</AvatarGroupCount>
        </AvatarGroup>
      </Kit>

      <Kit id="alert" note="기본 · 오류 · 액션 동반">
        <Alert className="w-96">
          <AlertTitle>수집 일부 실패</AlertTitle>
          <AlertDescription>3곳이 차단되어 재시도 대기 중입니다.</AlertDescription>
        </Alert>
        <Alert variant="destructive" className="w-96">
          <AlertTriangle />
          <AlertTitle>발송에 실패했습니다</AlertTitle>
          <AlertDescription>Slack 토큰이 만료되었습니다.</AlertDescription>
          <AlertAction>
            <Button size="sm" variant="outline">
              다시 연결
            </Button>
          </AlertAction>
        </Alert>
      </Kit>

      <Kit id="card">
        <Card className="w-80">
          <CardHeader>
            <CardTitle>리포트 설정</CardTitle>
            <CardDescription>매일 아침 발송되는 기본값입니다.</CardDescription>
            <CardAction>
              <Badge variant="secondary">활성</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-body-sm text-subtle">
              수집 대상 42곳 · 실패 3곳
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">저장</Button>
          </CardFooter>
        </Card>
      </Kit>

      <Kit id="item">
        <ItemGroup className="w-96">
          <Item>
            <ItemMedia>
              <Avatar>
                <AvatarFallback>TR</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>트렌드 리포트</ItemTitle>
              <ItemDescription>오늘 08:00 발송 완료</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="ghost">
                열기
              </Button>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item variant="outline">
            <ItemMedia variant="icon">
              <FileText />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>경쟁사 리포트</ItemTitle>
              <ItemDescription>수집 실패 · 재시도 대기</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </Kit>

      <Kit id="empty">
        <Empty className="w-96">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>아직 기록이 없습니다</EmptyTitle>
            <EmptyDescription>첫 리포트를 만들면 여기에 쌓입니다.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">리포트 만들기</Button>
          </EmptyContent>
        </Empty>
      </Kit>

      <Kit id="marker">
        <Marker>
          <MarkerIcon>
            <Sparkles />
          </MarkerIcon>
          <MarkerContent>새로 추가된 항목</MarkerContent>
        </Marker>
      </Kit>

      <Kit id="bubble" note="채팅 말풍선">
        <BubbleGroup className="w-96">
          <Bubble align="end">
            <BubbleContent>오늘 수집 실패한 곳 정리해줘</BubbleContent>
          </Bubble>
          <Bubble>
            <BubbleContent>3곳입니다. 전부 차단이 원인이에요.</BubbleContent>
          </Bubble>
        </BubbleGroup>
      </Kit>

      <Kit id="message" note="ui/message — ai-elements 것과 다름">
        <MessageGroup className="w-96">
          <Message>
            <MessageAvatar>
              <Avatar>
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            </MessageAvatar>
            <MessageContent>수집을 시작할까요?</MessageContent>
          </Message>
          <Message align="end">
            <MessageContent>네, 지금 해주세요.</MessageContent>
          </Message>
        </MessageGroup>
      </Kit>

      <Kit id="attachment" note="done · uploading · error">
        <AttachmentGroup className="w-96">
          <Attachment>
            <AttachmentMedia variant="icon">
              <Paperclip />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>trend-2026-08.csv</AttachmentTitle>
              <AttachmentDescription>24KB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions />
          </Attachment>
          <Attachment state="uploading">
            <AttachmentMedia variant="icon">
              <Paperclip />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>report.pdf</AttachmentTitle>
              <AttachmentDescription>올리는 중 · 62%</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
          <Attachment state="error">
            <AttachmentMedia variant="icon">
              <Paperclip />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>video.mp4</AttachmentTitle>
              <AttachmentDescription>용량 초과 · 100MB까지</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </AttachmentGroup>
      </Kit>

      <Kit id="progress">
        <Progress value={64} className="w-56" />
        <Progress value={100} className="w-56" />
        <Progress value={0} className="w-56" />
      </Kit>

      <Kit id="spinner">
        <Spinner />
        <div className="flex items-center gap-2">
          <Spinner />
          <span className="text-body-sm text-subtle">처리 중</span>
        </div>
      </Kit>

      <Kit id="skeleton">
        <div className="flex w-72 flex-col gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Kit>

      <Kit id="separator">
        <div className="w-72">
          <Separator />
        </div>
        <div className="flex h-10 items-center">
          <Separator orientation="vertical" />
        </div>
      </Kit>

      <Kit id="aspect-ratio">
        <div className="w-60">
          <AspectRatio ratio={16 / 9}>
            <div
              className="size-full rounded-lg"
              style={{ background: "var(--color-fill-subtle)" }}
            />
          </AspectRatio>
        </div>
      </Kit>
    </Group>
  )
}
