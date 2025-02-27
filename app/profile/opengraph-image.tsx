import { ImageResponse } from "next/server";
import { getProfile } from "@/lib/notion";

export const runtime = "edge";
export const alt = "Profile";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const profile = await getProfile();

  // スキルを3つまでに制限
  const displaySkills = profile.skills.slice(0, 3);
  const hasMoreSkills = profile.skills.length > 3;

  try {
    return new ImageResponse(
      (
        <div
          style={{
            background: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "32px",
          }}
        >
          {/* メインコンテンツコンテナ */}
          <div
            style={{
              background: "linear-gradient(to bottom right, #ffffff, #eef2ff)",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "60px",
              position: "relative",
              overflow: "hidden",
              border: "2px solid rgba(37, 99, 235, 0.6)",
              borderRadius: "24px",
              boxShadow:
                "0 0 40px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(37, 99, 235, 0.3), 0 8px 16px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* 装飾的な要素 - 右上 */}
            <div
              style={{
                position: "absolute",
                top: "-250px",
                right: "-250px",
                width: "600px",
                height: "600px",
                background: "linear-gradient(45deg, #3b82f6 0%, #8b5cf6 100%)",
                borderRadius: "50%",
                opacity: 0.1,
              }}
            />

            {/* 装飾的な要素 - 左下 */}
            <div
              style={{
                position: "absolute",
                bottom: "-250px",
                left: "-250px",
                width: "600px",
                height: "600px",
                background: "linear-gradient(45deg, #2563eb 0%, #3b82f6 100%)",
                borderRadius: "50%",
                opacity: 0.08,
              }}
            />

            {/* プロフィール情報 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "32px",
                textAlign: "center",
              }}
            >
              {/* 名前と役職 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    lineHeight: 1.2,
                    background:
                      "linear-gradient(45deg, #1a365d 30%, #2563eb 100%)",
                    backgroundClip: "text",
                    color: "transparent",
                    textShadow:
                      "0 2px 10px rgba(37, 99, 235, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)",
                    WebkitTextStroke: "0.5px rgba(37, 99, 235, 0.1)",
                    filter: "drop-shadow(0 4px 6px rgba(37, 99, 235, 0.1))",
                  }}
                >
                  {profile.name}
                </div>
                {profile.role && (
                  <div
                    style={{
                      fontSize: 32,
                      color: "#4b5563",
                      lineHeight: 1.6,
                      letterSpacing: "0.02em",
                      maxWidth: "80%",
                      fontWeight: 500,
                    }}
                  >
                    {profile.role}
                  </div>
                )}
              </div>

              {/* スキル */}
              {displaySkills.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    maxWidth: "80%",
                  }}
                >
                  {displaySkills.map((skill) => (
                    <div
                      key={skill}
                      style={{
                        background: "rgba(59, 130, 246, 0.1)",
                        color: "#2563eb",
                        padding: "8px 16px",
                        borderRadius: "9999px",
                        fontSize: "18px",
                        fontWeight: 500,
                        letterSpacing: "0.02em",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                  {hasMoreSkills && (
                    <div
                      style={{
                        background: "rgba(59, 130, 246, 0.1)",
                        color: "#2563eb",
                        padding: "8px 16px",
                        borderRadius: "9999px",
                        fontSize: "18px",
                        fontWeight: 500,
                        letterSpacing: "0.02em",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                      }}
                    >
                      +{profile.skills.length - 3}
                    </div>
                  )}
                </div>
              )}

              {/* SNSリンク */}
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  marginTop: "16px",
                }}
              >
                {profile.social.twitter && (
                  <div
                    style={{
                      color: "#4b5563",
                      fontSize: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    𝕏 {profile.social.twitter.split("/").pop()}
                  </div>
                )}
                {profile.social.github && (
                  <div
                    style={{
                      color: "#4b5563",
                      fontSize: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    GitHub {profile.social.github.split("/").pop()}
                  </div>
                )}
              </div>
            </div>

            {/* NotePressロゴ */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                right: 60,
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "#9ca3af",
                fontSize: 16,
                fontWeight: 400,
                opacity: 0.8,
              }}
            >
              Powered by
              <span
                style={{
                  background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                  backgroundClip: "text",
                  color: "transparent",
                  fontWeight: 500,
                }}
              >
                NotePress
              </span>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (e) {
    console.error("OG Image generation error:", e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
