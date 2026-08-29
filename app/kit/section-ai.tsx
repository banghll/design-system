/* AI Elements — 에이전트가 하는 일을 화면으로 옮긴 조각들 */
"use client"

import {
  Artifact,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "@/components/ai-elements/artifact"
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought"
import { CodeBlock, CodeBlockCopyButton } from "@/components/ai-elements/code-block"
import {
  Confirmation,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRequest,
  ConfirmationTitle,
} from "@/components/ai-elements/confirmation"
import {
  Context,
  ContextContent,
  ContextContentBody,
  ContextContentHeader,
  ContextTrigger,
} from "@/components/ai-elements/context"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  Plan,
  PlanContent,
  PlanHeader,
  PlanTitle,
} from "@/components/ai-elements/plan"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning"
import { Shimmer } from "@/components/ai-elements/shimmer"
import { Snippet, SnippetCopyButton, SnippetText } from "@/components/ai-elements/snippet"
import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"
import { Task, TaskContent, TaskItem, TaskTrigger } from "@/components/ai-elements/task"
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolOutput,
} from "@/components/ai-elements/tool"

import { Group, Kit } from "./kit"

export function SectionAi() {
  return (
    <Group
      id="g-ai"
      title="AI Elements"
      note="대화 · 사고 과정 · 산출물 · 근거"
    >
      <Kit id="ai-message">
        <div className="w-[30rem]">
          <Message from="user">
            <MessageContent>
              <MessageResponse>오늘 수집 실패한 곳 정리해줘</MessageResponse>
            </MessageContent>
          </Message>
          <Message from="assistant">
            <MessageContent>
              <MessageResponse>{`3곳입니다.\n\n- **네이버** — 429 과다 요청\n- **다음** — 로봇 차단\n- **더버지** — 타임아웃`}</MessageResponse>
            </MessageContent>
          </Message>
        </div>
      </Kit>

      <Kit id="ai-conversation" note="빈 상태">
        <div className="h-40 w-[30rem]">
          <Conversation>
            <ConversationContent>
              <ConversationEmptyState
                title="아직 대화가 없습니다"
                description="아래에 무엇이든 물어보세요"
              />
            </ConversationContent>
          </Conversation>
        </div>
      </Kit>

      <Kit id="ai-suggestion">
        <Suggestions>
          <Suggestion suggestion="오늘 수집 실패한 곳" />
          <Suggestion suggestion="리포트 초안 다듬기" />
          <Suggestion suggestion="이번 주 3줄 요약" />
        </Suggestions>
      </Kit>

      <Kit id="ai-reasoning">
        <div className="w-[30rem]">
          <Reasoning defaultOpen>
            <ReasoningTrigger />
            <ReasoningContent>
              요청을 두 조각으로 나눈다 — 무엇을 묻는지, 어떤 형식으로 답할지.
            </ReasoningContent>
          </Reasoning>
        </div>
      </Kit>

      <Kit id="ai-chain-of-thought">
        <div className="w-[30rem]">
          <ChainOfThought defaultOpen>
            <ChainOfThoughtHeader>세 단계로 처리했습니다</ChainOfThoughtHeader>
            <ChainOfThoughtContent>
              <ChainOfThoughtStep label="수집 로그 확인" status="complete" />
              <ChainOfThoughtStep label="실패 원인 분류" status="complete" />
              <ChainOfThoughtStep label="재시도 대상 선정" status="active" />
            </ChainOfThoughtContent>
          </ChainOfThought>
        </div>
      </Kit>

      <Kit id="ai-task">
        <div className="w-[30rem]">
          <Task defaultOpen>
            <TaskTrigger title="수집 재시도" />
            <TaskContent>
              <TaskItem>네이버 뉴스 — 대기 중</TaskItem>
              <TaskItem>다음 뉴스 — 완료</TaskItem>
            </TaskContent>
          </Task>
        </div>
      </Kit>

      <Kit id="ai-plan">
        <div className="w-[30rem]">
          <Plan defaultOpen>
            <PlanHeader>
              <PlanTitle>리포트 재생성 계획</PlanTitle>
            </PlanHeader>
            <PlanContent>
              차단된 3곳을 재시도한 뒤, 성공한 것만 모아 요약을 다시 만듭니다.
            </PlanContent>
          </Plan>
        </div>
      </Kit>

      <Kit id="ai-tool">
        <div className="w-[30rem]">
          <Tool defaultOpen>
            <ToolHeader type="tool-fetchNews" state="output-available" />
            <ToolContent>
              <ToolOutput
                output={"20건 중 17건 수집 성공"}
                errorText={undefined}
              />
            </ToolContent>
          </Tool>
        </div>
      </Kit>

      <Kit id="ai-confirmation">
        <div className="w-[30rem]">
          <Confirmation>
            <ConfirmationTitle>이 작업을 실행할까요?</ConfirmationTitle>
            <ConfirmationRequest>
              수집 대상 42곳에 다시 요청합니다. 5분쯤 걸립니다.
            </ConfirmationRequest>
            <ConfirmationActions>
              <ConfirmationAction>실행</ConfirmationAction>
              <ConfirmationAction variant="outline">취소</ConfirmationAction>
            </ConfirmationActions>
          </Confirmation>
        </div>
      </Kit>

      <Kit id="ai-artifact">
        <div className="w-[30rem]">
          <Artifact>
            <ArtifactHeader>
              <ArtifactTitle>trend-2026-08.md</ArtifactTitle>
              <ArtifactDescription>초안 · 1,240자</ArtifactDescription>
              <ArtifactActions />
            </ArtifactHeader>
            <ArtifactContent>
              <p className="text-body-sm">8월 트렌드 요약 …</p>
            </ArtifactContent>
          </Artifact>
        </div>
      </Kit>

      <Kit id="ai-code-block">
        <div className="w-[30rem]">
          <CodeBlock
            code={`const res = await fetch(url)\nif (!res.ok) throw new Error(res.status)`}
            language="ts"
          >
            <CodeBlockCopyButton />
          </CodeBlock>
        </div>
      </Kit>

      <Kit id="ai-snippet">
        <Snippet className="w-[30rem]">
          <SnippetText>npx shadcn@latest add button</SnippetText>
          <SnippetCopyButton value="npx shadcn@latest add button" />
        </Snippet>
      </Kit>

      <Kit id="ai-sources">
        <div className="w-[30rem]">
          <Sources>
            <SourcesTrigger count={3} />
            <SourcesContent>
              <Source href="#" title="네이버 뉴스" />
              <Source href="#" title="테크크런치" />
              <Source href="#" title="더버지" />
            </SourcesContent>
          </Sources>
        </div>
      </Kit>

      <Kit id="ai-context">
        <Context usedTokens={48200} maxTokens={200000}>
          <ContextTrigger />
          <ContextContent>
            <ContextContentHeader />
            <ContextContentBody>
              <p className="text-body-sm text-subtle">이번 대화에서 쓴 토큰</p>
            </ContextContentBody>
          </ContextContent>
        </Context>
      </Kit>

      <Kit id="ai-shimmer">
        <Shimmer>생성하는 중입니다</Shimmer>
      </Kit>
    </Group>
  )
}
