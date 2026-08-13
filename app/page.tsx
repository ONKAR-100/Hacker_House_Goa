import { Hero } from "@/components/hero"
import { GoaStreetSign } from "@/components/goa-street-sign"
import { GoaStatusWidget } from "@/components/goa-status-widget"
import { FloatingTimeController } from "@/components/floating-time-controller"
import { IdentityGeneratorSection } from "@/components/identity-builder/identity-generator-section"

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
