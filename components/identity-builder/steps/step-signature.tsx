"use client"

import { useIdentity } from "@/components/identity-builder/identity-context"
import { useGoaTimeContext } from "@/components/goa-time-provider"

export function StepSignature() {
  const { state, dispatch } = useIdentity()
  const { palette } = useGoaTimeContext()

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Sign Your ID</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a personal signature — it&apos;ll render in ink on your Builder ID.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="signature" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Your Name
        </label>
        <input
          id="signature"
          value={state.signature}
          onChange={(e) => dispatch({ type: "SET_SIGNATURE", signature: e.target.value })}
          placeholder="e.g. Alex Rao"
          maxLength={32}
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Signature Preview
        </p>
        <p
          className="font-signature text-4xl leading-none"
          style={{ color: palette.accent }}
        >
          {state.signature || "Your Signature"}
        </p>
      </div>

      <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
        <p>
          Pass ID <span className="font-mono font-semibold text-foreground">{state.passId}</span> · Serial{" "}
          <span className="font-mono font-semibold text-foreground">{state.serial}</span>
        </p>
        <p className="mt-1 text-xs">This unique pass ID stays with your Builder ID for the whole festival.</p>
      </div>
    </div>
  )
}
