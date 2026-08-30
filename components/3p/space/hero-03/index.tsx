// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import Navbar from "./navbar";
import { NavLinkItem } from "./navlink";
import HeroSection from "./hero";

const HeroPage = () => {
  const navigationData: NavLinkItem[] = [
    { title: "Home", href: "#", isActive: true },
    { title: "Properties", href: "#", isActive: false },
    { title: "Blog", href: "#", isActive: false },
    { title: "Contact", href: "#", isActive: false },
    { title: "Docs", href: "#", isActive: false },
  ];
  return (
    <>
      <Navbar navigationData={navigationData} />
      <main className="-mt-20">
        <HeroSection />
      </main>
    </>
  );
};

export default HeroPage;
