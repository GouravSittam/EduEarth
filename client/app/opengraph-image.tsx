import { ImageResponse } from "next/og";

export const alt = "EduEarth — Learn. Play. Save the Planet.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card, rendered at build time in EduEarth's arcade style. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 15% 20%, rgba(250,204,21,0.35), transparent 40%), radial-gradient(circle at 85% 85%, rgba(56,189,248,0.3), transparent 40%), linear-gradient(160deg, #0b2f1d 0%, #064e3b 60%, #022c22 100%)",
          color: "#000",
        }}
      >
        {/* Planet */}
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 9999,
            border: "10px solid #000",
            background:
              "radial-gradient(circle at 35% 35%, #4ade80 0%, #16a34a 35%, #0ea5e9 36%, #0369a1 100%)",
            boxShadow: "0 12px 0 #000",
            marginBottom: 44,
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            padding: "26px 56px",
            borderRadius: 40,
            border: "10px solid #000",
            background: "linear-gradient(135deg, #fde047, #facc15, #f59e0b)",
            boxShadow: "0 14px 0 #000",
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: -2,
          }}
        >
          EduEarth
        </div>

        <div
          style={{
            marginTop: 44,
            fontSize: 44,
            fontWeight: 700,
            color: "#fefce8",
            display: "flex",
          }}
        >
          Learn. Play. Save the Planet.
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 28,
            color: "#bbf7d0",
            display: "flex",
          }}
        >
          Gamified environmental education for schools
        </div>
      </div>
    ),
    size,
  );
}
