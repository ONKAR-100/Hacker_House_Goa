import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const name = (searchParams.get("name") || "BUILDER").toUpperCase()
  const team = (searchParams.get("team") || "NOVASYNC").toUpperCase()
  const passId = searchParams.get("passId") || "HH-2026-0001"
  const mode = searchParams.get("mode") || "builder-id"
  const title = (searchParams.get("title") || "HH GOA BUILDER").toUpperCase()
  const cls = (searchParams.get("cls") || "BUILDER").toUpperCase()

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#164A41",
          padding: "32px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            borderRadius: "24px",
            border: "4px dashed #7EDDD3",
            backgroundColor: "#FFFCF5",
            color: "#164A41",
            padding: "36px",
            boxSizing: "border-box",
            justifyContent: "space-between",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              backgroundColor: "#007C91",
              borderRadius: "16px",
              padding: "16px 24px",
              color: "#FFFCF5",
            }}
          >
            <div style={{ fontSize: "18px", fontWeight: "bold", letterSpacing: "3px", color: "#FFC857" }}>
              [ HH GOA 2026 ]
            </div>
            <div style={{ fontSize: "32px", fontWeight: "900", letterSpacing: "4px", marginTop: "4px" }}>
              {mode === "team-id" ? "OFFICIAL TEAM ACCESS PASS" : "BUILDER ACCESS PASS"}
            </div>
          </div>

          {/* Main Body */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "0 24px",
            }}
          >
            {/* Left Col */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#007C91", letterSpacing: "2px" }}>
                BUILDER / LEADER
              </div>
              <div style={{ fontSize: "44px", fontWeight: "900", color: "#164A41", letterSpacing: "1px" }}>
                {name}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <div
                  style={{
                    backgroundColor: "#FF6B5E",
                    color: "white",
                    padding: "8px 20px",
                    borderRadius: "20px",
                    fontSize: '18px',
                    fontWeight: "bold",
                  }}
                >
                  {cls}
                </div>
                <div
                  style={{
                    backgroundColor: "#FFC857",
                    color: "#164A41",
                    padding: "8px 20px",
                    borderRadius: "20px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {title}
                </div>
              </div>
            </div>

            {/* Right Col */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "10px",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#007C91", letterSpacing: "2px" }}>
                TEAM
              </div>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#164A41" }}>
                {team}
              </div>
              <div
                style={{
                  backgroundColor: "#164A41",
                  color: "#7EDDD3",
                  padding: "10px 22px",
                  borderRadius: "14px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                  marginTop: "6px",
                }}
              >
                PASS ID: {passId}
              </div>
            </div>
          </div>

          {/* Footer Barcode */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              borderTop: "2px dashed #007C91",
              paddingTop: "16px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "bold", letterSpacing: "6px", color: "#164A41" }}>
              |||||| | ||||| ||| ||||||| ||| |||||
            </div>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#007C91", letterSpacing: "2px" }}>
              GOA, INDIA • #FrameInGoa
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
