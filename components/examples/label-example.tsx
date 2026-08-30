// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import {
  Example,
  ExampleWrapper,
} from "@/components/blocks/_shared/example"
import { Checkbox } from "@/components/ui/checkbox"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function LabelExample() {
  return (
    <ExampleWrapper>
      <LabelWithCheckbox />
      <LabelWithInput />
      <LabelDisabled />
      <LabelWithTextarea />
    </ExampleWrapper>
  )
}

function LabelWithCheckbox() {
  return (
    <Example title="With Checkbox">
      <Field orientation="horizontal">
        <Checkbox id="label-demo-terms" />
        <Label htmlFor="label-demo-terms">Accept terms and conditions</Label>
      </Field>
    </Example>
  )
}

function LabelWithInput() {
  return (
    <Example title="With Input">
      <Field>
        <Label htmlFor="label-demo-username">Username</Label>
        <Input id="label-demo-username" placeholder="Username" />
      </Field>
    </Example>
  )
}

function LabelDisabled() {
  return (
    <Example title="Disabled">
      <Field data-disabled={true}>
        <Label htmlFor="label-demo-disabled">Disabled</Label>
        <Input id="label-demo-disabled" placeholder="Disabled" disabled />
      </Field>
    </Example>
  )
}

function LabelWithTextarea() {
  return (
    <Example title="With Textarea">
      <Field>
        <Label htmlFor="label-demo-message">Message</Label>
        <Textarea id="label-demo-message" placeholder="Message" />
      </Field>
    </Example>
  )
}
