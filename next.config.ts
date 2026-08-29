import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    /* shadcn 공식 예제가 아바타 자리표시자로 쓰는 호스트들.
     * 예제를 원본 그대로 두려고 next.config 쪽을 열었다. */
    remotePatterns: [
      { protocol: "https", hostname: "avatar.vercel.sh" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
}

export default nextConfig
