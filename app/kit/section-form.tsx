/* 액션 · 입력 계열 */
"use client"

import { Bold, Italic, Search, Send, Star, Underline } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Group, Kit } from "./kit"

export function SectionForm() {
  return (
    <Group
      id="g-action"
      title="액션 · 입력"
      note="누르면 무언가 일어나거나, 사용자가 값을 넣는 것"
    >
      <Kit id="button" note="7 variants">
        <Button>기본</Button>
        <Button variant="secondary">보조</Button>
        <Button variant="outline">외곽선</Button>
        <Button variant="ghost">고스트</Button>
        <Button variant="link">링크</Button>
        <Button variant="destructive">삭제</Button>
        <Button disabled>비활성</Button>
      </Kit>

      <Kit id="button-size" note="sm · default · lg · icon">
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="검색">
          <Search />
        </Button>
        <Button>
          <Star /> 아이콘 동반
        </Button>
        <Button variant="secondary">
          보내기 <Send />
        </Button>
      </Kit>

      <Kit id="button-group">
        <ButtonGroup>
          <Button variant="outline">일</Button>
          <Button variant="outline">주</Button>
          <Button variant="outline">월</Button>
        </ButtonGroup>
        <ButtonGroup>
          <ButtonGroupText>정렬</ButtonGroupText>
          <ButtonGroupSeparator />
          <Button variant="outline">최신순</Button>
        </ButtonGroup>
      </Kit>

      <Kit id="toggle">
        <Toggle aria-label="굵게">
          <Bold />
        </Toggle>
        <Toggle defaultPressed aria-label="기울임">
          <Italic />
        </Toggle>
        <Toggle disabled aria-label="밑줄">
          <Underline />
        </Toggle>
      </Kit>

      <Kit id="toggle-group">
        <ToggleGroup type="single" defaultValue="b">
          <ToggleGroupItem value="a">왼쪽</ToggleGroupItem>
          <ToggleGroupItem value="b">가운데</ToggleGroupItem>
          <ToggleGroupItem value="c">오른쪽</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="multiple" defaultValue={["bold"]}>
          <ToggleGroupItem value="bold">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic">
            <Italic />
          </ToggleGroupItem>
        </ToggleGroup>
      </Kit>

      <Kit id="kbd">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Shift</Kbd>
          <Kbd>Enter</Kbd>
        </KbdGroup>
      </Kit>

      <Kit id="input" note="기본 · 값 있음 · 비활성 · 오류">
        <div className="flex w-56 flex-col gap-1.5">
          <Label htmlFor="i1">이름</Label>
          <Input id="i1" placeholder="입력하세요" />
        </div>
        <div className="flex w-56 flex-col gap-1.5">
          <Label htmlFor="i2">값 있음</Label>
          <Input id="i2" defaultValue="김보경" />
        </div>
        <div className="flex w-56 flex-col gap-1.5">
          <Label htmlFor="i3">비활성</Label>
          <Input id="i3" defaultValue="수정 불가" disabled />
        </div>
        <div className="flex w-56 flex-col gap-1.5">
          <Label htmlFor="i4">오류</Label>
          <Input id="i4" defaultValue="잘못된 값" aria-invalid />
        </div>
      </Kit>

      <Kit id="input-group">
        <InputGroup className="w-72">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput placeholder="검색" />
        </InputGroup>
        <InputGroup className="w-72">
          <InputGroupInput placeholder="사이트 주소" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>.com</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup className="w-72">
          <InputGroupTextarea placeholder="여러 줄" />
          <InputGroupAddon align="block-end">
            <InputGroupButton size="sm">보내기</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Kit>

      <Kit id="input-otp">
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Kit>

      <Kit id="textarea">
        <Textarea className="w-72" placeholder="여러 줄 입력" rows={3} />
        <Textarea
          className="w-72"
          defaultValue="팀에 전달할 내용"
          rows={3}
          disabled
        />
      </Kit>

      <Kit id="native-select">
        <NativeSelect className="w-48" defaultValue="b">
          <NativeSelectOption value="a">최신순</NativeSelectOption>
          <NativeSelectOption value="b">평점순</NativeSelectOption>
        </NativeSelect>
        <NativeSelect className="w-48" defaultValue="x">
          <NativeSelectOptGroup label="국내">
            <NativeSelectOption value="x">네이버</NativeSelectOption>
            <NativeSelectOption value="y">다음</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      </Kit>

      <Kit id="checkbox">
        <div className="flex items-center gap-2">
          <Checkbox id="c1" defaultChecked />
          <Label htmlFor="c1">매일 발송</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="c2" />
          <Label htmlFor="c2">주말 제외</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="c3" disabled />
          <Label htmlFor="c3">비활성</Label>
        </div>
      </Kit>

      <Kit id="radio-group">
        <RadioGroup defaultValue="a" className="flex w-auto gap-4">
          <div className="flex items-center gap-1.5">
            <RadioGroupItem value="a" id="r1" />
            <Label htmlFor="r1">요약</Label>
          </div>
          <div className="flex items-center gap-1.5">
            <RadioGroupItem value="b" id="r2" />
            <Label htmlFor="r2">전문</Label>
          </div>
          <div className="flex items-center gap-1.5">
            <RadioGroupItem value="c" id="r3" disabled />
            <Label htmlFor="r3">비활성</Label>
          </div>
        </RadioGroup>
      </Kit>

      <Kit id="switch">
        <div className="flex items-center gap-2">
          <Switch id="s1" defaultChecked />
          <Label htmlFor="s1">켜짐</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="s2" />
          <Label htmlFor="s2">꺼짐</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="s3" disabled />
          <Label htmlFor="s3">비활성</Label>
        </div>
      </Kit>

      <Kit id="slider">
        <Slider defaultValue={[40]} max={100} step={1} className="w-56" />
        <Slider defaultValue={[25, 75]} max={100} step={1} className="w-56" />
        <Slider defaultValue={[50]} max={100} disabled className="w-56" />
      </Kit>

      <Kit id="label">
        <Label>기본 라벨</Label>
        <Label className="text-subtle">보조 라벨</Label>
      </Kit>

      <Kit id="field" note="FieldSet · Field · FieldError">
        <FieldSet className="w-80">
          <FieldLegend>발송 설정</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="f1">발송 시각</FieldLabel>
              <Input id="f1" defaultValue="08:00" />
              <FieldDescription>매일 이 시각에 나갑니다.</FieldDescription>
            </Field>
            <FieldSeparator />
            <Field data-invalid>
              <FieldLabel htmlFor="f2">받는 사람</FieldLabel>
              <Input id="f2" aria-invalid />
              <FieldError>한 명 이상 지정해야 합니다.</FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>
      </Kit>
    </Group>
  )
}
