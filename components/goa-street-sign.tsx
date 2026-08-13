"use client"

import { useEffect, useState } from "react"
import { useGoaTimeContext } from "@/components/goa-time-provider"

const SIGNS = [
  { label: "Beach", href: "#top", rotate: -3 },
  { label: "Build", href: "#build", rotate: 2 },
  { label: "Coffee", href: "#why-goa", rotate: -2 },
  { label: "Chaos", href: "#shack-status", rotate: 3 },
  { label: "Surf", href: "#footer", rotate: -1 },
]

export function GoaStreetSign() {
  const { palette } = useGoaTimeContext()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // check on mount

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      aria-label="Section navigation"
      className={`fixed left-1/2 top-3 z-40 -translate-x-1/2 transition-all duration-300 ease-in-out ${
        scrolled ? "opacity-0 -translate-y-6 pointer-events-none" : "opacity-100 translate-y-0 pointer-events-auto"
      }`}
    >
      <div
        className="flex items-end gap-0 rounded-xl border px-3 py-2 backdrop-blur-md transition-colors duration-[3000ms]"
        style={{ borderColor: `${palette.accent}44`, background: "rgba(11,14,26,0.6)" }}
      >
        {/* signpost */}
        <div className="hidden h-8 w-1.5 rounded-sm bg-[#5b3a29] sm:block" aria-hidden />
        <ul className="flex flex-wrap items-center gap-1.5 pl-0 sm:pl-2">
          {SIGNS.map((sign) => (
            <li key={sign.label}>
              <a
                href={sign.href}
                className="block rounded-[3px] border-2 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#3b2416] shadow-sm transition-transform hover:-translate-y-0.5 sm:text-xs"
                style={{
                  background: "#e8c98a",
                  borderColor: "#5b3a29",
                  transform: `rotate(${sign.rotate}deg)`,
                }}
              >
                {sign.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
