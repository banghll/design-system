/* 랜딩 히어로 — luma.com 의 첫 진입 연출을 이 시스템 위에 옮긴 판.
 *
 * 연출 자체는 색인에 없어서 components/_draft/landing-hero.tsx 에 있다.
 * 화면 → _draft 방향만 허용된다(그 폴더 README). 두 화면에서 더 필요해지면
 * components/ui 로 올린다. */
import { LandingHero } from "@/components/_draft/landing-hero"

export default function LandingPage() {
  return <LandingHero />
}
