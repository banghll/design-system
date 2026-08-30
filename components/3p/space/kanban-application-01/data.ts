// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { Circle, CircleDot, CircleCheck, CircleEllipsis } from "lucide-react";
import { Column } from "./types";

export const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    icon: Circle,
    iconClassName: "text-muted-foreground fill-muted-foreground size-2!",
    tasks: [
      { id: "task-1", content: "Configure Shadcn & Tailwind" },
      { id: "task-2", content: "Design drag-and-drop" },
      { id: "task-3", content: "Implement dark mode" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    icon: CircleDot,
    iconClassName: "text-orange-400",
    tasks: [
      { id: "task-4", content: "Animate card drops" },
      { id: "task-5", content: "Sync state to local storage" },
    ],
  },
  {
    id: "in-review",
    title: "In Review",
    icon: CircleEllipsis,
    iconClassName: "text-purple-500",
    tasks: [
      { id: "task-9", content: "Design drag-and-drop" },
      { id: "task-10", content: "Animate card drops" },
    ]
  },
  {
    id: "done",
    title: "Done",
    icon: CircleCheck,
    iconClassName: "text-blue-500",
    tasks: [
      { id: "task-6", content: "Add Auth.js middleware" },
      { id: "task-7", content: "Scaffold sidebar layout" },
      { id: "task-8", content: "Init Next.js TS project" },
    ],
  },
];
