// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import {
  Example,
  ExampleWrapper,
} from "@/components/blocks/_shared/example"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

export default function TextareaExample() {
  return (
    <ExampleWrapper>
      <TextareaBasic />
      <TextareaInvalid />
      <TextareaWithLabel />
      <TextareaWithDescription />
      <TextareaDisabled />
    </ExampleWrapper>
  )
}

function TextareaBasic() {
  return (
    <Example title="Basic">
      <Textarea placeholder="Type your message here." />
    </Example>
  )
}

function TextareaInvalid() {
  return (
    <Example title="Invalid">
      <Textarea placeholder="Type your message here." aria-invalid="true" />
    </Example>
  )
}

function TextareaWithLabel() {
  return (
    <Example title="With Label">
      <Field>
        <FieldLabel htmlFor="textarea-demo-message">Message</FieldLabel>
        <Textarea
          id="textarea-demo-message"
          placeholder="Type your message here."
          rows={6}
        />
      </Field>
    </Example>
  )
}

function TextareaWithDescription() {
  return (
    <Example title="With Description">
      <Field>
        <FieldLabel htmlFor="textarea-demo-message-2">Message</FieldLabel>
        <Textarea
          id="textarea-demo-message-2"
          placeholder="Type your message here."
          rows={6}
        />
        <FieldDescription>
          Type your message and press enter to send.
        </FieldDescription>
      </Field>
    </Example>
  )
}

function TextareaDisabled() {
  return (
    <Example title="Disabled">
      <Field>
        <FieldLabel htmlFor="textarea-demo-disabled">Message</FieldLabel>
        <Textarea
          id="textarea-demo-disabled"
          placeholder="Type your message here."
          disabled
        />
      </Field>
    </Example>
  )
}
