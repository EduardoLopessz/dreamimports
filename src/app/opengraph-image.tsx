import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Dream Store: vista seu sonho. Streetwear em drops semanais.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Arquivos locais lidos uma vez (fonte TTF e foto da capa, do Pexels).
const anton = readFile(join(process.cwd(), "src/app/og/anton.ttf"));
const hero = readFile(join(process.cwd(), "src/app/og/hero.jpg"), "base64");

export default async function Image() {
  const [font, photo] = await Promise.all([anton, hero]);
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#111111" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 60,
          width: 700,
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontFamily: "Anton", fontSize: 44 }}>
          DREAM<span style={{ color: "#8b63ff", marginLeft: 12 }}>STORE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Anton", fontSize: 128, lineHeight: 0.92 }}>
          <span>VISTA</span>
          <span>SEU SONHO</span>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#d4d4d4" }}>Streetwear em drops semanais</div>
      </div>
      <img
        src={`data:image/jpeg;base64,${photo}`}
        alt=""
        width={500}
        height={630}
        style={{ objectFit: "cover", objectPosition: "50% 30%" }}
      />
    </div>,
    { ...size, fonts: [{ name: "Anton", data: await font, style: "normal", weight: 400 }] },
  );
}
