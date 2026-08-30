// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { LogoIcon } from '@/components/3p/tailark/_shared/bases__radix__mist__ui__logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function ForgotPassword() {
    return (
        <section className="bg-linear-to-b from-muted to-background flex min-h-screen px-4 py-16 md:py-20">
            <form
                action=""
                className="max-w-92 m-auto h-fit w-full"
            >
                <div className="p-6">
                    <div>
                        <Link
                            href="/mist"
                            aria-label="go home"
                        >
                            <LogoIcon />
                        </Link>
                        <h1 className="mt-6 text-balance text-xl font-semibold">Forgot Your Password?</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Enter your email to receive a reset link</p>
                    </div>

                    <div className="mt-6 space-y-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="block text-sm"
                            >
                                Email
                            </Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                                placeholder="Your email"
                                className="ring-foreground/15 border-transparent ring-1"
                            />
                        </div>

                        <Button
                            className="w-full"
                            size="default"
                        >
                            Send Reset Link
                        </Button>
                    </div>
                </div>
                <div className="px-6">
                    <p className="text-muted-foreground text-sm">
                        You remember your password ?
                        <Button
                            asChild
                            variant="link"
                            className="px-2"
                        >
                            <Link href="#">Sign In</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    )
}
