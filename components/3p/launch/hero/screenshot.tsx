// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";

interface ScreenshotProps {
  srcLight: string;
  srcDark?: string;
  alt: string;
  width: number;
  height: number;
  loading?: ImageProps["loading"];
  className?: string;
}

export default function Screenshot({
  srcLight,
  srcDark,
  alt,
  width,
  height,
  loading,
  className,
}: ScreenshotProps) {
  if (!srcDark) {
    return (
      <Image
        src={srcLight}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={className}
        unoptimized={srcLight.endsWith(".svg")}
      />
    );
  }

  return (
    <>
      <Image
        src={srcLight}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={cn(className, "block dark:hidden")}
        unoptimized={srcLight.endsWith(".svg")}
      />
      <Image
        src={srcDark}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={cn(className, "hidden dark:block")}
        unoptimized={srcDark.endsWith(".svg")}
      />
    </>
  );
}
