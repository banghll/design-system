// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import HeroSection from "./hero"
import Navbar from "./navbar";
import { NavLinkItem } from "./navbar";

const Hero02Page = () => {

    const navData:NavLinkItem[] = [
        { name: 'Home', href: '#',isActive: true },
        { name: 'Properties', href: '#' ,isActive: false},
        { name: 'Blog', href: '#' ,isActive: false},
        { name: 'Contact', href: '#' ,isActive: false},
        { name: 'Docs', href: '#' ,isActive: false},
    ]
    return (
        <>
            <Navbar navData={navData} />
            <main className="-mt-20">
                <HeroSection />
            </main>
        </>
    )
}

export default Hero02Page