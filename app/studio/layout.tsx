import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Studio — image generation",
  description:
    "An image-generation surface drawn with this design system. Conditions on the left, canvas on the right.",
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
