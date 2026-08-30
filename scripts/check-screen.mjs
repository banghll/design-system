/* 새로 만든 화면이 이 디자인 시스템을 실제로 쓰는지 검사한다.
 *
 * 배경 — 예제 화면 첫 판은 «컴포넌트를 쓴다» 고 말하면서도 입력 상자·예시 카드·
 * 말풍선을 div 로 새로 짰다. 규칙을 문서에만 적어 두면 이런 일이 계속 난다.
 * 사람이 눈으로 잡을 수 없는 종류의 실수라서, 기계가 잡아야 한다.
 *
 * 검사는 세 가지다.
 *   1) 토큰을 건너뛴 리터럴 — #hex, rgb(), 임의 px
 *   2) 이미 있는 컴포넌트를 손으로 다시 짠 흔적
 *   3) 시스템에서 가져온 것과 직접 짠 것의 비율
 *
 * 실행: node scripts/check-screen.mjs app/<이름>/page.tsx
 *       node scripts/check-screen.mjs            (app 아래 화면 전부)
 */
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()

/* 손으로 다시 짜기 쉬운 것들. 왼쪽이 흔적, 오른쪽이 «이미 있는 것».
 * 규칙을 늘릴 때는 «오탐이 나면 무시하면 그만인가» 를 먼저 본다 —
 * 시끄러운 검사기는 결국 아무도 안 돌린다. */
const SMELLS = [
  {
    id: "card",
    re: /className="[^"]*\bborder\b[^"]*\brounded-(lg|xl|2xl)\b[^"]*\bp-/,
    use: "Card / CardHeader / CardContent (@/components/ui/card)",
    why: "테두리 + 모서리 + 안쪽 여백을 직접 적으면, 카드 여백 토큰(--pad-card)을 바꿔도 이 화면만 안 따라온다",
  },
  {
    id: "input-shell",
    re: /className="[^"]*focus-within:ring[^"]*"/,
    use: "InputGroup / InputGroupInput / InputGroupAddon (@/components/ui/input-group)",
    why: "입력 껍데기와 부속을 한 덩어리로 묶는 일은 InputGroup 이 이미 한다. 포커스 링 규칙까지 같이 온다",
  },
  {
    id: "bubble",
    re: /className="[^"]*bg-primary[^"]*rounded-(2xl|full)[^"]*px-\d/,
    use: "Bubble / BubbleContent (@/components/ui/bubble)",
    why: "말풍선의 정렬·꼬리·연속 발화 처리는 Bubble 이 이미 정해 뒀다",
  },
  {
    id: "empty",
    re: /<h1[^>]*>\s*\{?[^<]{0,40}\}?\s*<\/h1>[\s\S]{0,400}?(예시|Try one|이렇게 적어)/,
    use: "Empty / EmptyHeader / EmptyTitle / EmptyDescription / EmptyContent (@/components/ui/empty)",
    why: "빈 상태의 제목·설명·행동 순서는 Empty 가 이미 정해 뒀다",
  },
  {
    id: "item",
    re: /<button[\s\S]{0,200}?className="[^"]*\bflex\b[^"]*\bitems-center\b[^"]*\bgap-\d[^"]*\bborder\b/,
    use: "Item / ItemMedia / ItemContent / ItemTitle (@/components/ui/item)",
    why: "아이콘 + 글 + 화살표로 된 한 줄짜리 선택지는 Item 이 이미 한다",
  },
  {
    id: "raw-avatar",
    re: /rounded-full[^"]*\b(size|w)-(8|9|10|12)\b/,
    use: "Avatar / AvatarImage / AvatarFallback (@/components/ui/avatar)",
    why: "이미지 실패 시 대체 글자까지 Avatar 가 맡는다",
  },
]

const LITERALS = [
  {
    id: "hex",
    re: /(?<!--[a-z-]{0,40}: )#[0-9a-fA-F]{3,8}\b/g,
    msg: "색 리터럴. 토큰 이름으로 부른다 — bg-primary, text-muted-foreground …",
    skip: /theme-|preset|globals\.css/,
  },
  {
    /* 글자 크기와 폭은 뺀다. text-[10px] 은 라벨의 «작게» 를 말하는 것이고,
     * max-w-[1200px] 은 본문 폭이라 간격 스케일과 다른 층의 결정이다.
     * 잡으려는 건 여백과 높이를 손으로 적은 자리다. */
    id: "arbitrary-px",
    re: /(?<!text-)(?<!max-w-)(?<!min-w-)(?<!\bw-)(?<!\bh-)\[(\d{2,4})px\]/g,
    msg: "임의 px. 간격은 --spacing 배수로, 높이는 --h-* 토큰으로 잡는다",
  },
]

function scan(file) {
  const src = fs.readFileSync(path.join(root, file), "utf8")
  /* 생성물은 사람이 쓴 화면이 아니다. 고칠 곳은 이 파일이 아니라 만드는 스크립트라,
   * 여기서 지적해 봐야 갈 곳이 없다. */
  if (/직접 고치지 말 것|생성한다. 직접/.test(src.slice(0, 400))) {
    return { file, generated: true, imports: {}, divs: 0, parts: 0, findings: [] }
  }
  const findings = []

  /* 어디서 가져왔나 */
  const imports = [...src.matchAll(/from "@\/components\/([^"]+)"/g)].map((m) => m[1])
  const fromUi = imports.filter((i) => i.startsWith("ui/"))
  const fromPattern = imports.filter((i) => i.startsWith("blocks/") || i.startsWith("3p/"))
  const fromAi = imports.filter((i) => i.startsWith("ai-elements/"))

  for (const s of SMELLS) {
    if (s.re.test(src)) findings.push({ level: "손으로 다시 짬", ...s })
  }

  for (const l of LITERALS) {
    if (l.skip && l.skip.test(file)) continue
    const hits = [...src.matchAll(l.re)]
    if (hits.length) {
      findings.push({
        level: "토큰 건너뜀",
        id: l.id,
        use: l.msg,
        why: `${hits.length}곳 — 예: ${hits
          .slice(0, 3)
          .map((h) => h[0])
          .join(", ")}`,
      })
    }
  }

  /* 직접 짠 정도. div 대비 시스템 컴포넌트 비율을 센다.
   * 숫자 자체가 목표는 아니다 — 판을 갈랐는지 판을 새로 짰는지 가늠하는 눈금이다. */
  const divs = (src.match(/<div\b/g) ?? []).length
  const parts = (src.match(/<[A-Z][A-Za-z0-9]*/g) ?? []).length

  return {
    file,
    imports: { ui: fromUi.length, pattern: fromPattern.length, ai: fromAi.length },
    divs,
    parts,
    findings,
  }
}

const args = process.argv.slice(2)
const targets = args.length
  ? args
  : fs
      .readdirSync(path.join(root, "app"), { withFileTypes: true })
      .filter((d) => d.isDirectory() && !["api", "blocks"].includes(d.name))
      .map((d) => `app/${d.name}/page.tsx`)
      .filter((p) => fs.existsSync(path.join(root, p)))

let bad = 0
for (const t of targets) {
  const r = scan(t)
  if (r.generated) {
    console.log(`
${r.file}
  · 생성물 — 건너뜀 (고칠 곳은 scripts/gen-*.mjs)`)
    continue
  }
  const ratio = r.parts ? Math.round((r.parts / (r.parts + r.divs)) * 100) : 0
  console.log(
    `\n${r.file}\n  가져다 씀: ui ${r.imports.ui} · 패턴 ${r.imports.pattern} · ai ${r.imports.ai}` +
      `  |  조립 비율 ${ratio}% (컴포넌트 ${r.parts} vs div ${r.divs})`
  )
  if (!r.findings.length) {
    console.log("  ✓ 걸리는 것 없음")
    continue
  }
  for (const f of r.findings) {
    bad++
    console.log(`  · [${f.level}] ${f.id}\n      대신: ${f.use}\n      왜:   ${f.why}`)
  }
}

console.log(
  bad
    ? `\n${bad}건. 전부 «이미 있는 것으로 바꿀 수 있나» 를 먼저 묻는다. 못 바꾸는 이유가 있으면 그 이유를 코드 옆에 적는다.`
    : "\n전부 통과."
)
