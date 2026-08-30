// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import Link from 'next/link'
import { Logo } from '@/components/3p/tailark/_shared/bases__radix__mist__ui__logo'
import { Code2 as Github, Link2 as Linkedin, Send as Twitter } from 'lucide-react'

const links = [
    { label: 'Features', href: '#' },
    { label: 'Pricing', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' },
]

const social = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
]

export default function Footer() {
    return (
        <footer className="bg-background @container border-t py-12">
            <div className="mx-auto max-w-2xl px-6">
                <div className="flex flex-col items-center text-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2"
                    >
                        <Logo className="h-5" />
                    </Link>
                    <nav className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
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
                    <div className="mt-8 flex gap-4">
                        {social.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-muted-foreground hover:text-foreground size-8 rounded-full transition-colors"
                                aria-label={item.label}
                            >
                                <item.icon className="size-4" />
                            </Link>
                        ))}
                    </div>
                    <p className="text-muted-foreground mt-8 text-sm">&copy; {2026} Veil.</p>
                </div>
            </div>
        </footer>
    )
}
