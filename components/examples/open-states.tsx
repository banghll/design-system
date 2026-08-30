"use client"

import * as React from "react"

import { useLang, type Copy } from "@/components/lang"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { OverlayStage } from "@/components/ui/overlay-stage"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

/* «눌러야 보이는» 것들을 눌러 두고 보여 준다.
 *
 * 카탈로그에서 확인하고 싶은 건 트리거가 아니라 열렸을 때의 판이다.
 * 진짜 컴포넌트를 open 인 채로 두고, 포털만 무대 안으로 돌린다 —
 * 흉내 낸 마크업을 따로 두면 진짜가 바뀔 때 여기만 옛날 모습으로 남는다. */

function Caption({ v }: { v: Copy }) {
  const { t } = useLang()
  return (
    <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{t(v)}</p>
  )
}

function Label({ v }: { v: Copy }) {
  const { t } = useLang()
  return (
    <div className="text-muted-foreground mb-1.5 text-xs font-medium">{t(v)}</div>
  )
}

const OPEN_LABEL: Copy = { ko: "열린 상태", en: "Open state" }

function Frame({
  label,
  children,
  className,
}: {
  label: Copy
  children: React.ReactNode
  className?: string
}) {
  return (
    <div>
      <Label v={label} />
      <OverlayStage className={className}>{children}</OverlayStage>
    </div>
  )
}

function DialogOpen() {
  return (
    <Frame label={OPEN_LABEL} className="min-h-80">
      <Dialog open modal={false}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>프로필 수정</DialogTitle>
            <DialogDescription>
              바꾼 내용은 저장을 눌러야 반영됩니다.
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="os-name">이름</FieldLabel>
            <Input id="os-name" defaultValue="김병길" />
          </Field>
          <DialogFooter>
            <Button variant="outline">취소</Button>
            <Button>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Frame>
  )
}

function SheetOpen() {
  return (
    <Frame label={{ ko: "열린 상태 · 오른쪽", en: "Open state · right" }} className="min-h-80">
      <Sheet open modal={false}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>필터</SheetTitle>
            <SheetDescription>
              목록을 좁히는 조건입니다. 닫아도 유지됩니다.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-3 px-4">
            <Field>
              <FieldLabel htmlFor="os-q">검색어</FieldLabel>
              <Input id="os-q" placeholder="이름 · 태그" />
            </Field>
          </div>
          <SheetFooter>
            <Button>적용</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Frame>
  )
}

function DrawerOpen() {
  return (
    <Frame label={{ ko: "열린 상태 · 아래", en: "Open state · bottom" }} className="min-h-80">
      <Drawer open modal={false}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>공유</DrawerTitle>
            <DrawerDescription>
              링크를 아는 사람은 누구나 볼 수 있습니다.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>링크 복사</Button>
            <Button variant="outline">취소</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Frame>
  )
}

function PopoverOpen() {
  return (
    <Frame label={OPEN_LABEL} className="min-h-64 grid place-items-center">
      <Popover open modal={false}>
        <PopoverTrigger asChild>
          <Button variant="outline">치수</Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" sideOffset={8}>
          <div className="flex flex-col gap-3">
            <div className="text-sm font-medium">치수</div>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="os-w">너비</FieldLabel>
              <Input id="os-w" defaultValue="320" size="sm" />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="os-h">높이</FieldLabel>
              <Input id="os-h" defaultValue="180" size="sm" />
            </Field>
          </div>
        </PopoverContent>
      </Popover>
    </Frame>
  )
}

function DropdownOpen() {
  return (
    <Frame label={OPEN_LABEL} className="min-h-72 grid place-items-center">
      <DropdownMenu open modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">더 보기</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={8} className="w-48">
          <DropdownMenuLabel>작업</DropdownMenuLabel>
          <DropdownMenuItem>
            이름 바꾸기<DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            복제<DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">삭제</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Frame>
  )
}

function TooltipOpen() {
  return (
    <Frame label={OPEN_LABEL} className="min-h-40 grid place-items-center">
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="outline">저장</Button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8}>
          마지막 저장 2분 전
        </TooltipContent>
      </Tooltip>
    </Frame>
  )
}

function HoverCardOpen() {
  return (
    <Frame label={OPEN_LABEL} className="min-h-64 grid place-items-center">
      <HoverCard open>
        <HoverCardTrigger asChild>
          <Button variant="link">@nation-a</Button>
        </HoverCardTrigger>
        <HoverCardContent side="bottom" sideOffset={8} className="w-64">
          <div className="text-sm font-medium">Nation A</div>
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            링크에 마우스를 올리면 따라오는 미리보기. 누르지 않고도 판단할 수
            있게 하는 것이 목적입니다.
          </p>
        </HoverCardContent>
      </HoverCard>
    </Frame>
  )
}

const OPEN: Record<string, () => React.ReactElement> = {
  dialog: DialogOpen,
  sheet: SheetOpen,
  drawer: DrawerOpen,
  popover: PopoverOpen,
  "dropdown-menu": DropdownOpen,
  tooltip: TooltipOpen,
  "hover-card": HoverCardOpen,
}

/* 무대에 올릴 수 없는 둘은 이유를 적어 둔다 — 빠진 이유를 모르면
 * 다음 사람이 «왜 얘만 없지» 를 다시 조사한다. */
const WHY: Record<string, Copy> = {
  "alert-dialog": {
    ko: "얼럿 다이얼로그는 정의상 모달입니다. 열어 둔 채로 두면 뒤 화면의 스크롤까지 잠그기 때문에 여기서는 트리거만 둡니다. 판의 생김새는 위 다이얼로그와 같고, 버튼 구성만 «취소 · 실행» 으로 고정됩니다.",
    en: "An alert dialog is modal by definition. Left open it would lock the page behind it, so only the trigger is shown here. The panel looks like the dialog above; only the buttons are fixed to cancel/confirm.",
  },
  "context-menu": {
    ko: "컨텍스트 메뉴는 오른쪽 클릭으로만 열립니다. 열림 상태를 밖에서 지정할 수 없어 트리거만 둡니다 — 위 영역에서 오른쪽 클릭해 보세요.",
    en: "A context menu opens on right-click only; its open state cannot be set from outside. Right-click the area above.",
  },
}

export function OpenState({ id }: { id: string }) {
  const Comp = OPEN[id]
  if (Comp) {
    return (
      <div className="mt-4 border-t border-dashed pt-4">
        <Comp />
        <Caption
          v={{
            ko: "누르지 않아도 보이도록 열어 둔 것입니다. 진짜 컴포넌트를 그대로 쓰되, 띄우는 곳만 이 상자로 돌렸습니다.",
            en: "Held open so you can see it without clicking. This is the real component — only its portal was pointed at this box.",
          }}
        />
      </div>
    )
  }
  if (WHY[id]) {
    return (
      <div className="mt-4 border-t border-dashed pt-4">
        <Caption v={WHY[id]} />
      </div>
    )
  }
  return null
}
