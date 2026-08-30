// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { ReactNode } from "react";


import Figma from "./figma";
import React from "./react";
import ShadcnUi from "./shadcn-ui";
import Tailwind from "./tailwind";
import TypeScript from "./typescript";
import { Badge } from "@/components/ui/badge";
import Logo from "./logo";
import { Section } from "./section";

interface LogosProps {
  title?: string;
  badge?: ReactNode | false;
  logos?: ReactNode[] | false;
  className?: string;
}

export default function Logos({
  title = "Built with industry-standard tools and best practices",
  badge = (
    <Badge variant="outline" className="border-brand/30 text-brand">
      Last updated: 1000
    </Badge>
  ),
  logos = [
    <Logo key="figma" image={Figma} name="Figma" />,
    <Logo
      key="react"
      image={React}
      name="React"
      version="19.2.7"
      badge="New"
    />,
    <Logo
      key="typescript"
      image={TypeScript}
      name="TypeScript"
      version="6.0.3"
      badge="New"
    />,
    <Logo
      key="shadcn"
      image={ShadcnUi}
      name="Shadcn/ui"
      version="4.11.0"
      badge="New"
    />,
    <Logo key="tailwind" image={Tailwind} name="Tailwind" version="4.2.1" />,
  ],
  className,
}: LogosProps) {
  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-6">
          {badge !== false && badge}
          <h2 className="text-md font-semibold sm:text-2xl">{title}</h2>
        </div>
        {logos !== false && logos.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-8">
            {logos}
          </div>
        )}
      </div>
    </Section>
  );
}
