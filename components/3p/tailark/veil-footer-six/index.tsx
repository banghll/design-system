// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { LogoIcon } from '@/components/3p/tailark/_shared/bases__radix__mist__ui__logo'
import Link from 'next/link'
import { ThemeSwitcher } from './theme-switcher'
import { SocialMedias } from './social-medias'

const links = [
    { label: 'Features', href: '#' },
    { label: 'Pricing', href: '#' },
    { label: 'Blog', href: '#' },
]

export default function Footer() {
    return (
        <footer className="bg-background @container py-12">
            <div className="mx-auto max-w-2xl px-6">
                <div className="flex flex-col">
                    <Link
                        href="/"
                        aria-label="go home"
                        className="hover:bg-foreground/5 -ml-1.5 flex size-8 rounded-lg *:m-auto"
                    >
                        <LogoIcon
                            uniColor
                            className="size-5"
                        />
                    </Link>
                    <nav className="my-8 flex flex-col gap-y-4">
                        {links.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex justify-between">
                        <ThemeSwitcher />
                        <SocialMedias />
                    </div>

                    <p className="text-muted-foreground border-foreground/10 mt-2 border-t border-dashed pt-6 text-sm">&copy; {2026} Veil. </p>
                </div>
            </div>
        </footer>
    )
}
