// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
"use client";
import Feature from "./feature";
import { Box, CirclePlay, CodeXml } from "lucide-react"

const featureData = [
    {
      icon: Box,
      title: "Streamline your international payroll.",
      content: "Launch faster with modular tools that automate workflows, centralize data, and scale securely, helping teams build, deploy, and manage products.",
    },
    {
      icon: CirclePlay,
      title: "Easily track your spend and growth analytics.",
      content: "Power your business with real-time analytics, seamless integrations, and cloud-ready architecture designed to reduce costs, boost productivity.",
    },
    {
      icon: CodeXml,
      title: "Build better products in half the time.",
      content: "All-in-one SaaS platform offering automation, collaboration, and performance monitoring so growing teams can optimize operations.",
    }
];

const Feature02 = () => {
  return (
    <>
      <Feature featureData={featureData} />
    </>
  );
};

export default Feature02;
