// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export function RollerShades() {
  const [position, setPosition] = React.useState([50])

  const preset =
    position[0] <= 10 ? "open" : position[0] >= 90 ? "closed" : "half"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Living Room</CardTitle>
        <CardDescription>Roller Shades</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex h-32 flex-col overflow-hidden rounded-lg border bg-muted">
          <div
            className="bg-muted-foreground transition-all duration-300"
            style={{ height: `${position[0]}%` }}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Open
          </span>
          <Slider
            value={position}
            onValueChange={setPosition}
            max={100}
            className="flex-1"
          />
          <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Close
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <ToggleGroup
          type="single"
          value={preset}
          onValueChange={(value) => {
            if (value === "open") setPosition([0])
            if (value === "half") setPosition([50])
            if (value === "closed") setPosition([100])
          }}
          variant="outline"
          spacing={1}
          className="w-full"
        >
          <ToggleGroupItem value="open" className="flex-1">
            Open
          </ToggleGroupItem>
          <ToggleGroupItem value="half" className="flex-1">
            Half
          </ToggleGroupItem>
          <ToggleGroupItem value="closed" className="flex-1">
            Closed
          </ToggleGroupItem>
        </ToggleGroup>
      </CardFooter>
    </Card>
  )
}
