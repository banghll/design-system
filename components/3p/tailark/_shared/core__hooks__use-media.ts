// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
'use client'

import { useState, useEffect } from 'react'

export function useMedia(query: string): boolean {
    const [matches, setMatches] = useState(true)

    useEffect(() => {
        const matchMedia = window.matchMedia(query)
        setMatches(matchMedia.matches)

        const handleChange = () => setMatches(matchMedia.matches)

        matchMedia.addEventListener('change', handleChange)

        return () => {
            matchMedia.removeEventListener('change', handleChange)
        }
    }, [query])

    return matches
}
