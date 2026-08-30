// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { Logo } from '@/components/3p/tailark/_shared/bases__radix__mist__ui__logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function ForgotPassword() {
    return (
        <section className="bg-background flex min-h-screen px-4 py-16 md:py-24">
            <div className="m-auto w-full max-w-xs">
                <div className="text-center">
                    <Link
                        href="/"
                        aria-label="go home"
                        className="inline-block py-3"
                    >
                        <Logo className="mx-auto w-fit" />
                    </Link>
                    <h1 className="mt-3 font-serif text-4xl font-medium">Reset password</h1>
                </div>

                <form
                    action=""
                    className="mt-12 space-y-4"
                >
                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="text-sm"
                        >
                            Email
                        </Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <Button className="w-full">Send Reset Link</Button>
                </form>

                <p className="text-muted-foreground mt-8 text-center text-sm">
                    Remember your password?{' '}
                    <Link
                        href="#"
                        className="text-primary font-medium hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </section>
    )
}
