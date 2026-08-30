// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
'use client';
import { Marquee } from './marquee';
import { useEffect, useState } from 'react';

export default function SeamlessCloud({
  top = "top-72 sm:top-20",
  cloudCount = 5,
  minSize = 400,
  maxSize = 678,
  opacity = "opacity-60",
  gapMin = 50,
  gapMax = 200,
}) {
  const [clouds, setClouds] = useState<{ width: number; gap: number }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: cloudCount }).map(() => ({
      width: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
      gap: Math.floor(Math.random() * (gapMax - gapMin + 1)) + gapMin,
    }));

    setClouds(generated);
  }, [cloudCount, minSize, maxSize, gapMin, gapMax]);

  if (clouds.length === 0) return null; // prevents mismatch

  return (
    <div
      className={`absolute ${top} inset-x-0 z-0 overflow-hidden pointer-events-none`}
    >
      <Marquee pauseOnHover className="[--duration:30s]">
        {clouds.map((cloud, i) => (
          <img
            key={i}
            src="https://images.shadcnspace.com/assets/backgrounds/cloud.webp"
            alt="cloud"
            width={cloud.width}
            height={350}
            className={opacity}
            style={{ marginRight: cloud.gap }}
          />
        ))}
      </Marquee>
    </div>
  );
}
