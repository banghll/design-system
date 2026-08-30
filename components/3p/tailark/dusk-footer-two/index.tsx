// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import Link from 'next/link'
import { LogoIcon } from '@/components/3p/tailark/_shared/bases__radix__mist__ui__logo'
import { Gemini } from '@/components/3p/tailark/_shared/core__ui__svgs__gemini'
import { ClaudeAI } from '@/components/3p/tailark/_shared/core__ui__svgs__claude-ai'
import { Openai } from '@/components/3p/tailark/_shared/core__ui__svgs__openai'
import { Perplexity } from '@/components/3p/tailark/_shared/core__ui__svgs__perplexity'
import { Button } from '@/components/ui/button'

const footerLinks = [
    {
        name: 'Product',
        links: [
            { href: '#', label: 'Features' },
            { href: '#', label: 'Solutions' },
            { href: '#', label: 'Agents' },
            { href: '#', label: 'Pricing' },
        ],
    },
    {
        name: 'Company',
        links: [
            { href: '#', label: 'About' },
            { href: '#', label: 'Blog' },
            { href: '#', label: 'Contact' },
            { href: '#', label: 'LinkedIn' },
            { href: '#', label: 'X' },
        ],
    },
    {
        name: 'Legal',
        links: [
            { href: '#', label: 'Licence' },
            { href: '#', label: 'Privacy Policy' },
            { href: '#', label: 'Terms of Service' },
        ],
    },
]

export default function Footer() {
    return (
        <footer>
            <div className="mx-auto max-w-7xl space-y-16 px-6 pb-6 pt-32">
                <div className="grid grid-cols-2 gap-x-3 gap-y-12 sm:grid-cols-4 lg:grid-cols-6">
                    <div className="col-span-full lg:col-span-3">
                        <Link
                            href="/"
                            aria-label="go home"
                        >
                            <LogoIcon uniColor />
                        </Link>
                    </div>

                    {footerLinks.map((linksGroup, index) => (
                        <div key={index}>
                            <span className="text-foreground text-sm">{linksGroup.name}</span>
                            <ul className="mt-4 list-inside space-y-4">
                                {linksGroup.links.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={link.href}
                                            className="hover:text-primary text-muted-foreground text-sm duration-150"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-24 grid gap-x-3 gap-y-6 border-t pt-6 sm:grid-cols-2">
                    <div>
                        <p className="text-muted-foreground text-sm">Get an AI summary of this page</p>
                        <div className="-ml-2.5 mt-2 flex items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                            >
                                <Link
                                    href="#"
                                    aria-label="Claude AI"
                                >
                                    <ClaudeAI />
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                            >
                                <Link
                                    href="#"
                                    aria-label="OpenAI"
                                >
                                    <Openai />
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                            >
                                <Link
                                    href="#"
                                    aria-label="Perplexity"
                                >
                                    <Perplexity className="size-5!" />
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                            >
                                <Link
                                    href="#"
                                    aria-label="Gemini"
                                >
                                    <Gemini />
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <span className="text-muted-foreground block text-sm">&copy; Tailark 2025 - Present</span>
                </div>
            </div>
        </footer>
    )
}
