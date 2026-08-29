/* 오버레이 계열 — 포털로 그려져서 인라인 캡처가 안 된다. 트리거를 눌러 확인한다. */
"use client"

import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Group, Kit } from "./kit"

export function SectionOverlay() {
  return (
    <Group
      id="g-overlay"
      title="오버레이 · 팝업"
      note="포털로 화면 위에 그려진다 — 트리거를 눌러야 보인다"
    >
      <Kit id="dialog">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Dialog 열기</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>리포트 이름 바꾸기</DialogTitle>
              <DialogDescription>
                발송된 리포트에는 소급 적용되지 않습니다.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="d1">이름</Label>
              <Input id="d1" defaultValue="트렌드 리포트" />
            </div>
            <DialogFooter>
              <Button variant="ghost">취소</Button>
              <Button>저장</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Kit>

      <Kit id="alert-dialog">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">삭제</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>리포트를 삭제할까요?</AlertDialogTitle>
              <AlertDialogDescription>
                지난 발송 기록도 함께 사라집니다. 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction>삭제</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Kit>

      <Kit id="sheet">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Sheet 열기</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>발송 설정</SheetTitle>
              <SheetDescription>오른쪽에서 밀려 나옵니다.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </Kit>

      <Kit id="drawer">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Drawer 열기</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>필터</DrawerTitle>
              <DrawerDescription>아래에서 올라옵니다.</DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      </Kit>

      <Kit id="popover">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Popover 열기</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>수집 주기</PopoverTitle>
              <PopoverDescription>기본은 하루 한 번입니다.</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      </Kit>

      <Kit id="dropdown-menu">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">메뉴 열기</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>리포트</DropdownMenuLabel>
            <DropdownMenuItem>
              지금 발송 <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuCheckboxItem checked>주말 제외</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">삭제</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Kit>

      <Kit id="context-menu" note="영역에서 우클릭">
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div
              className="text-body-sm text-subtle flex h-20 w-64 items-center justify-center rounded-lg border border-dashed"
              style={{ borderColor: "var(--color-border)" }}
            >
              여기서 우클릭
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              열기 <ContextMenuShortcut>⏎</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">삭제</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Kit>

      <Kit id="menubar">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>파일</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                새 리포트 <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>내보내기</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>보기</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>목록</MenubarItem>
              <MenubarItem>격자</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </Kit>

      <Kit id="navigation-menu">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>리포트</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-64 gap-1 p-2">
                  <NavigationMenuLink href="#">트렌드</NavigationMenuLink>
                  <NavigationMenuLink href="#">경쟁사</NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#">설정</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Kit>

      <Kit id="tooltip" note="hover 하면 나타남">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">여기에 마우스를</Button>
          </TooltipTrigger>
          <TooltipContent>차단된 곳은 다음 회차에 재시도합니다</TooltipContent>
        </Tooltip>
      </Kit>

      <Kit id="hover-card">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">봉준호</Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-body-sm">감독 · 기생충, 살인의 추억</p>
          </HoverCardContent>
        </HoverCard>
      </Kit>

      <Kit id="select">
        <Select defaultValue="b">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>정렬</SelectLabel>
              <SelectItem value="a">최신순</SelectItem>
              <SelectItem value="b">평점순</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectItem value="c">이름순</SelectItem>
          </SelectContent>
        </Select>
      </Kit>

      <Kit id="sonner" note="토스트 — 화면 모서리에 뜸">
        <Button
          variant="outline"
          onClick={() => toast("리포트를 발송했습니다", { description: "42건" })}
        >
          토스트 띄우기
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error("발송에 실패했습니다", { description: "토큰 만료" })}
        >
          오류 토스트
        </Button>
      </Kit>
    </Group>
  )
}
