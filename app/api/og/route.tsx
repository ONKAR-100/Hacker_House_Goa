import { ImageResponse } from "next/og"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const name = (searchParams.get("name") || "BUILDER").toUpperCase()
  const team = (searchParams.get("team") || "NOVASYNC").toUpperCase()
  const passId = searchParams.get("passId") || "HH-2026-0001"
  const mode = searchParams.get("mode") || "builder-id"
  const title = (searchParams.get("title") || "HH GOA BUILDER").toUpperCase()
  const cls = (searchParams.get("cls") || "BUILDER").toUpperCase()
  const passTitle = mode === "team-id" ? "OFFICIAL TEAM ACCESS PASS" : "BUILDER ACCESS PASS"

  try {
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
            padding: 32,
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              borderRadius: 24,
              backgroundColor: "#FFFCF5",
              color: "#164A41",
              padding: 36,
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                backgroundColor: "#007C91",
                borderRadius: 16,
                padding: "16px 24px",
                color: "#FFFCF5",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 3, color: "#FFC857" }}>
                [ HH GOA 2026 ]
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 4, marginTop: 4 }}>
                {passTitle}
              </div>
            </div>

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
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#007C91", letterSpacing: 2 }}>
                  BUILDER / LEADER
                </div>
                <div style={{ fontSize: 44, fontWeight: 900, color: "#164A41", marginTop: 8 }}>
                  {name}
                </div>
                <div style={{ display: "flex", marginTop: 12 }}>
                  <div
                    style={{
                      backgroundColor: "#FF6B5E",
                      color: "white",
                      padding: "8px 20px",
                      borderRadius: 20,
                      fontSize: 18,
                      fontWeight: 700,
                      marginRight: 12,
                    }}
                  >
                    {cls}
                  </div>
                  <div
                    style={{
                      backgroundColor: "#FFC857",
                      color: "#164A41",
                      padding: "8px 20px",
                      borderRadius: 20,
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    {title}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 700, color: "#007C91", letterSpacing: 2 }}>
                  TEAM
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#164A41", marginTop: 8 }}>
                  {team}
                </div>
                <div
                  style={{
                    backgroundColor: "#164A41",
                    color: "#7EDDD3",
                    padding: "10px 22px",
                    borderRadius: 14,
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: 2,
                    marginTop: 12,
                  }}
                >
                  PASS ID: {passId}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                borderTop: "2px dashed #007C91",
                paddingTop: 16,
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 6, color: "#164A41" }}>
                |||||| | ||||| ||| ||||||| ||| |||||
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#007C91", letterSpacing: 2 }}>
                #FrameInGoa
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
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error"
    return new Response(`OG Image generation failed: ${errorMessage}`, {
      status: 500,
    })
  }
}
