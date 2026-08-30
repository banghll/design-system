// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
"use client";
import AboutUs from "./about-us";
import { Target, WandSparkles, Zap } from "lucide-react";

const aboutusData = [
    {
      icon: WandSparkles,
      title: "Creativity",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      icon: Zap,
      title: "Innovation",
      color: "bg-teal-400/10 text-teal-400" 
    },
    {
      icon: Target,
      title: "Strategy",
      color: "bg-orange-400/10 text-orange-400" 
    }
];

const statisticsCounter = [
    {
        title: "Total Projects Completed",
        count: 40
    },
    {
        title: "Years of Experience",
        count: 15
    },
    {
        title: "Design Awards",
        count: 12
    },
]

const AboutAndStats01 = () => {
  return (
    <>
      <AboutUs aboutusData={aboutusData} statisticsCounter={statisticsCounter} />
    </>
  );
};

export default AboutAndStats01;
