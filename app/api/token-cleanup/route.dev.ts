/* 정리안을 다듬는다.
 *
 * lib/reconcile.ts 의 규칙은 «무엇이 어긋났는가» 까지는 정확히 안다 —
 * 끊긴 참조가 어디인지, 값이 같은 이름이 무엇인지는 세면 나오는 것이다.
 * 규칙이 못 하는 것은 그다음이다. «brand 와 accent 중 어느 쪽이 정본인가»,
 * «이 색을 지웠으면 이 자리는 secondary 가 맞나 muted 가 맞나» 는
 * 이름의 뜻과 이 시스템이 무엇을 하려는지를 읽어야 답이 나온다.
 *
 * 그래서 규칙이 만든 목록을 Claude 에게 한 번 보여 주고, 더 나은 대상과
 * 사람이 읽을 근거를 받아 온다. 키가 없으면 규칙의 답이 그대로 나간다 —
 * 어느 쪽이든 정리 없이 넘어가는 일은 없다. 이 화면이 붙잡고 있는 것은
 * «조용히 어긋난 채 남는 것» 이고, 그건 LLM 이 있든 없든 막아야 한다.
 *
 * 개발 중에만 쓴다. */
import Anthropic from "@anthropic-ai/sdk"
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod"
import { NextResponse } from "next/server"
import { z } from "zod"

import type { Change, Fix, FoundationData } from "@/lib/reconcile"

const Plan = z.object({
  fixes: z.array(
    z.object({
      kind: z.enum(["repoint", "merge", "drop", "pair", "rename", "note"]),
      where: z.string(),
      from: z.string(),
      to: z.string().nullable(),
      why: z.string(),
      safe: z.boolean(),
    })
  ),
  summary: z.string(),
})

const SYSTEM = `당신은 디자인 시스템의 토큰을 정리한다.

규칙 엔진이 «무엇이 어긋났는지» 는 이미 찾아 두었다. 당신이 하는 일은 그 목록을
다듬는 것이다 — 새 문제를 지어내지 말고, 주어진 항목마다 다음을 판단한다.

1. to 가 맞는가. 끊긴 참조를 어디로 옮길지는 값이 가까운 쪽이 아니라
   «뜻이 같은 쪽» 이다. 예를 들어 카드 면이 사라졌으면 값이 비슷한 popover 보다
   그 자리의 의미에 맞는 이름이 낫다.
2. why 를 사람이 읽을 한 문장으로. 무엇이 왜 문제인지, 그대로 두면 무엇이
   어긋나는지를 말한다. 일반론 말고 이 항목에 대해서.
3. safe 는 답이 하나뿐일 때만 true 다. 추측이 섞이면 false —
   사람이 보고 고르게 한다.

목록에 없는 항목을 더하지 않는다. 항목을 지우지도 않는다. 순서만 바꾸거나
내용을 다듬는다. 한국어로 쓴다. summary 는 한 문장.`

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "개발 중에만 쓸 수 있습니다." }, { status: 403 })
  }

  let body: { change?: Change; fixes?: Fix[]; foundation?: FoundationData }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "본문을 읽을 수 없습니다." }, { status: 400 })
  }

  const fixes = body.fixes ?? []
  /* 정리할 게 없으면 부를 이유도 없다. */
  if (!fixes.length) {
    return NextResponse.json({ fixes, source: "rules", summary: "정리할 것이 없습니다." })
  }
  /* 키가 없으면 규칙의 답이 그대로 답이다. 실패가 아니라 다른 경로다 —
   * 여기서 막아 버리면 키 없는 사람은 정리 자체를 못 하게 된다. */
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      fixes,
      source: "rules",
      summary: `규칙으로 ${fixes.length}건을 찾았습니다. ANTHROPIC_API_KEY 를 .env.local 에 넣으면 Claude 가 대상과 근거를 다듬습니다.`,
    })
  }

  const names = Object.keys(body.foundation?.color ?? {}).filter((k) => !k.startsWith("$"))

  try {
    const client = new Anthropic()
    const res = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 8000,
      system: SYSTEM,
      output_config: { format: zodOutputFormat(Plan) },
      messages: [
        {
          role: "user",
          content: [
            `방금 한 변경: ${JSON.stringify(body.change)}`,
            `지금 남아 있는 색 이름: ${names.join(", ")}`,
            `글자 크기: ${Object.keys(body.foundation?.text ?? {})
              .filter((k) => !k.startsWith("$"))
              .join(", ")}`,
            `규칙 엔진이 찾은 것 ${fixes.length}건:`,
            JSON.stringify(fixes, null, 2),
          ].join("\n\n"),
        },
      ],
    })

    const parsed = res.parsed_output
    if (!parsed) throw new Error("정리안을 읽지 못했습니다")

    /* 개수가 달라졌으면 규칙 쪽을 믿는다. 다듬으라고 보낸 것이지
     * 목록을 새로 쓰라고 보낸 게 아니다. */
    if (parsed.fixes.length !== fixes.length) {
      return NextResponse.json({
        fixes,
        source: "rules",
        summary: "정리안의 항목 수가 달라져 규칙의 목록을 그대로 씁니다.",
      })
    }

    return NextResponse.json({
      fixes: parsed.fixes.map((f) => ({ ...f, to: f.to ?? undefined })),
      source: "claude",
      summary: parsed.summary,
    })
  } catch (e) {
    /* Claude 를 못 불렀다고 정리를 못 하면 안 된다. 규칙의 답으로 내려간다. */
    return NextResponse.json({
      fixes,
      source: "rules",
      summary: `Claude 를 부르지 못해 규칙의 목록을 씁니다 (${
        e instanceof Error ? e.message : String(e)
      }).`,
    })
  }
}
