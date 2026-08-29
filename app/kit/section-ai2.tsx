/* AI Elements — 산출물 계열 (터미널 · 파일 · 커밋 · 환경변수 · 패키지) */
"use client"

import {
  Commit,
  CommitContent,
  CommitFile,
  CommitFileIcon,
  CommitFileInfo,
  CommitFilePath,
  CommitFiles,
  CommitHash,
  CommitHeader,
  CommitMessage,
} from "@/components/ai-elements/commit"
import {
  EnvironmentVariable,
  EnvironmentVariableGroup,
  EnvironmentVariableName,
  EnvironmentVariableValue,
  EnvironmentVariables,
  EnvironmentVariablesContent,
  EnvironmentVariablesHeader,
  EnvironmentVariablesTitle,
  EnvironmentVariablesToggle,
} from "@/components/ai-elements/environment-variables"
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
  FileTreeName,
} from "@/components/ai-elements/file-tree"
import {
  PackageInfo,
  PackageInfoChangeType,
  PackageInfoContent,
  PackageInfoDescription,
  PackageInfoHeader,
  PackageInfoName,
  PackageInfoVersion,
} from "@/components/ai-elements/package-info"
import {
  Terminal,
  TerminalContent,
  TerminalHeader,
  TerminalStatus,
  TerminalTitle,
} from "@/components/ai-elements/terminal"

import { Group, Kit } from "./kit"

export function SectionAi2() {
  return (
    <Group
      id="g-ai2"
      title="AI Elements · 산출물"
      note="에이전트가 만들어낸 결과를 담는 것"
    >
      <Kit id="ai-terminal">
        <div className="w-[32rem]">
          <Terminal output={"$ npm run collect\n42곳 수집 시작\n3곳 실패 (차단)\n완료 · 39건"}>
            <TerminalHeader>
              <TerminalTitle>collect.log</TerminalTitle>
              <TerminalStatus />
            </TerminalHeader>
            <TerminalContent />
          </Terminal>
        </div>
      </Kit>

      <Kit id="ai-file-tree">
        <div className="w-80">
          <FileTree defaultExpanded={new Set(["app"])}>
            <FileTreeFolder path="app">
              <FileTreeName>app</FileTreeName>
              <FileTreeFile path="app/page.tsx">
                <FileTreeName>page.tsx</FileTreeName>
              </FileTreeFile>
              <FileTreeFile path="app/globals.css">
                <FileTreeName>globals.css</FileTreeName>
              </FileTreeFile>
            </FileTreeFolder>
            <FileTreeFile path="README.md">
              <FileTreeName>README.md</FileTreeName>
            </FileTreeFile>
          </FileTree>
        </div>
      </Kit>

      <Kit id="ai-commit">
        <div className="w-[32rem]">
          <Commit defaultOpen>
            <CommitHeader>
              <CommitHash hash="1ca12a3" />
              <CommitMessage>Paper 내보내기용 추출 지그 추가</CommitMessage>
            </CommitHeader>
            <CommitContent>
              <CommitFiles>
                <CommitFile>
                  <CommitFileIcon />
                  <CommitFileInfo>
                    <CommitFilePath>app/kit/page.tsx</CommitFilePath>
                  </CommitFileInfo>
                </CommitFile>
                <CommitFile>
                  <CommitFileIcon />
                  <CommitFileInfo>
                    <CommitFilePath>app/api/kit-export/route.ts</CommitFilePath>
                  </CommitFileInfo>
                </CommitFile>
              </CommitFiles>
            </CommitContent>
          </Commit>
        </div>
      </Kit>

      <Kit id="ai-environment-variables">
        <div className="w-[32rem]">
          <EnvironmentVariables>
            <EnvironmentVariablesHeader>
              <EnvironmentVariablesTitle>환경 변수</EnvironmentVariablesTitle>
              <EnvironmentVariablesToggle />
            </EnvironmentVariablesHeader>
            <EnvironmentVariablesContent>
              <EnvironmentVariableGroup>
                <EnvironmentVariable name="SLACK_TOKEN" value="xoxb-0000-0000">
                  <EnvironmentVariableName />
                  <EnvironmentVariableValue />
                </EnvironmentVariable>
                <EnvironmentVariable name="REPORT_HOUR" value="08">
                  <EnvironmentVariableName />
                  <EnvironmentVariableValue />
                </EnvironmentVariable>
              </EnvironmentVariableGroup>
            </EnvironmentVariablesContent>
          </EnvironmentVariables>
        </div>
      </Kit>

      <Kit id="ai-package-info">
        <div className="w-[32rem]">
          <PackageInfo
            name="next"
            currentVersion="16.3.2"
            newVersion="16.3.3"
            changeType="patch"
          >
            <PackageInfoHeader>
              <PackageInfoName />
              <PackageInfoVersion />
              <PackageInfoChangeType />
            </PackageInfoHeader>
            <PackageInfoContent>
              <PackageInfoDescription>
                Turbopack 관련 버그 수정.
              </PackageInfoDescription>
            </PackageInfoContent>
          </PackageInfo>
        </div>
      </Kit>
    </Group>
  )
}
