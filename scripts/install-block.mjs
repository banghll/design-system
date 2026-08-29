/* 공식 shadcn 블록을 하나씩 받아 블록별 폴더로 격리한다.
 * 블록들이 전부 app/dashboard/page.tsx · components/app-sidebar.tsx 같은
 * 같은 경로에 쓰기 때문에, 받은 직후 옮기지 않으면 서로 덮어쓴다.
 *
 *   node scripts/install-block.mjs sidebar-01 sidebar-02 ...
 */
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const NPX = "C:\\Users\\kis85\\tools\\nodejs\\npx.cmd"

const listUntracked = () =>
  new Set(
    execFileSync("git", ["status", "--porcelain", "-uall"], { encoding: "utf8" })
      .split("\n")
      .filter(Boolean)
      .map((l) => l.slice(3).trim().replace(/^"|"$/g, ""))
  )

const moveInto = (from, toDir) => {
  fs.mkdirSync(toDir, { recursive: true })
  const to = path.join(toDir, path.basename(from))
  fs.renameSync(from, to)
  return to
}

for (const name of process.argv.slice(2)) {
  const before = listUntracked()
  try {
    // Windows 에서 .cmd 는 execFile 로 직접 못 부른다 (EINVAL) — cmd /c 를 거친다
    execFileSync(
      "cmd.exe",
      ["/c", NPX, "--yes", "shadcn@latest", "add", name, "--yes", "--overwrite"],
      { stdio: "pipe", encoding: "utf8" }
    )
  } catch (e) {
    console.log(`${name.padEnd(16)} 설치 실패 — ${String(e.stderr || e.message).split("\n")[0].slice(0, 80)}`)
    continue
  }
  const after = listUntracked()
  const fresh = [...after].filter((f) => !before.has(f))

  const appDirs = new Set(
    fresh
      .filter((f) => f.startsWith("app/") && !f.startsWith("app/blocks/") && !f.startsWith("app/kit/"))
      .map((f) => f.split("/").slice(0, 2).join("/"))
  )
  const looseComps = fresh.filter((f) => /^components\/[^/]+\.tsx$/.test(f))

  const blockApp = path.join(ROOT, "app", "blocks", name)
  const blockComp = path.join(ROOT, "components", "blocks", name)

  // 1) 라우트 파일을 app/blocks/<name>/ 로
  for (const d of appDirs) {
    const abs = path.join(ROOT, d)
    if (!fs.existsSync(abs)) continue
    fs.mkdirSync(blockApp, { recursive: true })
    for (const f of fs.readdirSync(abs)) {
      fs.renameSync(path.join(abs, f), path.join(blockApp, f))
    }
    fs.rmSync(abs, { recursive: true, force: true })
  }

  // 2) 평평하게 깔린 컴포넌트를 components/blocks/<name>/ 로
  const moved = []
  for (const f of looseComps) {
    const abs = path.join(ROOT, f)
    if (!fs.existsSync(abs)) continue
    moveInto(abs, blockComp)
    moved.push(path.basename(f, ".tsx"))
  }

  // 3) 옮긴 파일들끼리의 import 경로를 새 위치로 고친다
  const touch = []
  for (const dir of [blockApp, blockComp]) {
    if (!fs.existsSync(dir)) continue
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".tsx") || f.endsWith(".ts")) touch.push(path.join(dir, f))
    }
  }
  for (const file of touch) {
    let s = fs.readFileSync(file, "utf8")
    for (const base of moved) {
      s = s.split(`@/components/${base}"`).join(`@/components/blocks/${name}/${base}"`)
    }
    fs.writeFileSync(file, s)
  }

  console.log(
    `${name.padEnd(16)} 라우트 ${appDirs.size} · 컴포넌트 ${moved.length}`
  )
}
