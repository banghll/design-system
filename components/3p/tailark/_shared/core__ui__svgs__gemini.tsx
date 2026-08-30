// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { type SVGProps } from 'react'

export function Gemini(props: SVGProps) {
    return (
        <svg
            height="1em"
            style={{
                flex: 'none',
                lineHeight: 1,
            }}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            {...props}
        >
            <title>{'Gemini'}</title>
            <path
                d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
                fill="currentColor"
                fillRule="nonzero"
            />
        </svg>
    )
}
