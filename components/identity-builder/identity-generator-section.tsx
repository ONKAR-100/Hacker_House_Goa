"use client"

import { IdentityBuilderProvider } from "@/components/identity-builder/identity-context"
import { IdentityBuilderLayout } from "@/components/identity-builder/identity-builder-layout"

export function IdentityGeneratorSection() {
  return (
    <section id="build" className="relative mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      {/* Section heading */}
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          🏄 Builder Identity Generator
        </span>
        <h2 className="font-display mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
          Build Your Goa Identity
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground sm:text-base">
          Choose your format, customise in one page, and export instantly — PFP, Builder ID, or Team card.
        </p>
      </div>

      <IdentityBuilderProvider>
        <IdentityBuilderLayout />
      </IdentityBuilderProvider>
    </section>
  )
}
