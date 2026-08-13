import type { Metadata } from "next"
import { Hero } from "@/components/hero"
import { GoaStreetSign } from "@/components/goa-street-sign"
import { GoaStatusWidget } from "@/components/goa-status-widget"
import { FloatingTimeController } from "@/components/floating-time-controller"
import { IdentityGeneratorSection } from "@/components/identity-builder/identity-generator-section"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const params = await searchParams
  const name = (params.name as string) || "BUILDER"
  const team = (params.team as string) || "NovaSync"
  const passId = (params.passId as string) || "HH-2026-3363"
  const mode = (params.mode as string) || "builder-id"
  const title = (params.title as string) || "HH GOA BUILDER"
  const cls = (params.cls as string) || "BUILDER"

  const ogImageUrl = `/api/og?name=${encodeURIComponent(name)}&team=${encodeURIComponent(team)}&passId=${encodeURIComponent(passId)}&mode=${encodeURIComponent(mode)}&title=${encodeURIComponent(title)}&cls=${encodeURIComponent(cls)}`

  return {
    title: `HH Goa 2026 Pass — ${name} (Team ${team})`,
    description: `Just generated my HH Goa 2026 Builder Access Pass! Presented by Team ${team}. #FrameInGoa`,
    openGraph: {
      title: `HH Goa 2026 Builder Pass — ${name}`,
      description: `Presented by Team ${team} #FrameInGoa`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `HH Goa 2026 Pass for ${name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `HH Goa 2026 Builder Pass — ${name}`,
      description: `Presented by Team ${team} #FrameInGoa`,
      images: [ogImageUrl],
    },
  }
}

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <GoaStreetSign />
      <Hero />
      <div className="flex justify-center py-6">
        <GoaStatusWidget />
      </div>
      <IdentityGeneratorSection />
      <FloatingTimeController />
    </main>
  )
}
