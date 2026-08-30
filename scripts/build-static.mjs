/* 공유용 정적 빌드. out/ 하나가 나오고, 그걸 아무 데나 올리면 된다.
 *
 * app/api 아래는 data/*.json 을 «파일에 쓰는» 것이라 개발 중에만 뜻이 있다.
 * 정적 내보내기는 POST 를 가진 route handler 를 담을 수 없으므로,
 * 그 파일들은 route.dev.ts 라는 이름을 쓰고 next.config 의 pageExtensions 가
 * 정적 빌드에서만 그 확장자를 뺀다. 파일을 옮기는 방식도 해 봤는데,
 * dev 서버가 폴더를 물고 있어서 Windows 에서 EPERM 으로 죽었다.
 *
 * 실행: npm run share
 *       BASE_PATH=/design-system npm run share   (하위 경로에 올릴 때)
 */
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()

execSync("npx next build", {
  stdio: "inherit",
  env: { ...process.env, STATIC_EXPORT: "1" },
})

const out = path.join(root, "out")
if (!fs.existsSync(out)) {
  console.error("out/ 이 안 생겼다. next.config 의 STATIC_EXPORT 분기를 확인할 것.")
  process.exit(1)
}

/* GitHub Pages 는 _next 로 시작하는 폴더를 Jekyll 이 걸러 낸다.
 * 이 빈 파일 하나가 그걸 끈다 — 없으면 CSS 가 통째로 404 난다. */
fs.writeFileSync(path.join(out, ".nojekyll"), "")

const count = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .reduce((n, d) => n + (d.isDirectory() ? count(path.join(dir, d.name)) : 1), 0)

console.log(`
out/ — 파일 ${count(out)}개. 이 폴더째로 올리면 된다.`)
