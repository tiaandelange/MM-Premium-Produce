import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "M & M Premium Produce — fresh fruit and vegetables";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#1c2b24",
          color: "#f7f3ea",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase" }}>
          M & M Premium Produce
        </div>
        <div style={{ fontSize: 64, marginTop: 24, lineHeight: 1.1, maxWidth: 900 }}>
          Premium fresh fruit, vegetables & produce
        </div>
      </div>
    ),
    size,
  );
}
