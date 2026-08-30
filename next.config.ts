import type { NextConfig } from "next"

/* 공유용 빌드에서만 정적 내보내기로 바꾼다.
 *
 * 평소(개발·`next build`)에는 지금까지와 똑같다. `node scripts/build-static.mjs`
 * 가 이 플래그를 세우고, 그때만 out/ 이 나온다 — 서버 없이 올릴 수 있는 한 벌.
 *
 * basePath 는 GitHub Pages 처럼 하위 경로에 올릴 때 쓴다.
 * 예) BASE_PATH=/design-system node scripts/build-static.mjs */
const isStatic = process.env.STATIC_EXPORT === "1"
const basePath = process.env.BASE_PATH ?? ""

const nextConfig: NextConfig = {
  /* api 폴더 아래의 route.dev.ts 는 개발 중에만 라우트가 된다.
   * 파일에 쓰는 API 라 정적 빌드에는 담을 수 없고(POST 를 못 담는다),
   * 파일을 옮기는 대신 확장자로 가른다 — 옮기면 dev 서버가 물고 있어서 실패한다. */
  pageExtensions: isStatic
    ? ["tsx", "ts", "jsx", "js"]
    : ["dev.ts", "tsx", "ts", "jsx", "js"],
  ...(isStatic
    ? {
        output: "export",
        /* 정적 호스트에는 이미지 최적화 서버가 없다 — 원본을 그대로 내보낸다 */
        images: { unoptimized: true },
        /* /blocks 처럼 폴더로 끝나는 주소가 정적 호스트에서 404 나지 않게 */
        trailingSlash: true,
        ...(basePath ? { basePath, assetPrefix: basePath } : {}),
      }
    : {}),
  images: {
    /* shadcn 공식 예제가 아바타 자리표시자로 쓰는 호스트들.
     * 예제를 원본 그대로 두려고 next.config 쪽을 열었다. */
    remotePatterns: [
      { protocol: "https", hostname: "avatar.vercel.sh" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    ...(isStatic ? { unoptimized: true } : {}),
  },
}

export default nextConfig
