import { ImageResponse } from "next/server";
import { getPostBySlug } from "@/lib/notion";

export const runtime = "edge";
export const revalidate = 60 * 60 * 24;
export const alt = "Blog Post OGP";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return new Response("Not Found", { status: 404 });

  // タイトルの長さに応じてフォントサイズを調整
  const titleLength = post.title.length;
  const titleFontSize = titleLength > 30 ? 56 : titleLength > 20 ? 64 : 72;

  // 説明文を制限（最大2行程度）
  const description =
    post.description.length > 80
      ? post.description.slice(0, 80) + "..."
      : post.description;

  // タグを最大3つまでに制限
  const displayTags = post.tags.slice(0, 3);
  const hasMoreTags = post.tags.length > 3;

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
              justifyContent: "flex-start",
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

            {/* タイトルコンテナ */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                width: "100%",
                marginBottom: "auto",
                position: "relative",
                // zIndex: 10,
              }}
            >
              {/* タイトル */}
              <div
                style={{
                  fontSize: titleFontSize,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  lineHeight: 1.2,
                  background:
                    "linear-gradient(45deg, #1a365d 30%, #2563eb 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                  width: "90%",
                  textShadow:
                    "0 2px 10px rgba(37, 99, 235, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)",
                  WebkitTextStroke: "0.5px rgba(37, 99, 235, 0.1)",
                  filter: "drop-shadow(0 4px 6px rgba(37, 99, 235, 0.1))",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {post.title}
              </div>

              {/* 説明文 */}
              <div
                style={{
                  fontSize: 32,
                  color: "#4b5563",
                  lineHeight: 1.6,
                  letterSpacing: "0.02em",
                  width: "85%",
                  fontWeight: 500,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {description}
              </div>
            </div>

            {/* タグとメタ情報のコンテナ */}
            <div
              style={{
                position: "absolute",
                bottom: 60,
                left: 60,
                right: 140,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                // zIndex: 10,
              }}
            >
              {/* タグ */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "nowrap",
                  maxWidth: "70%",
                }}
              >
                {displayTags.map((tag) => (
                  <div
                    key={tag}
                    style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      color: "#2563eb",
                      padding: "8px 16px",
                      borderRadius: 9999,
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "160px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span>{tag}</span>
                  </div>
                ))}
                {hasMoreTags && (
                  <div
                    style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      color: "#2563eb",
                      padding: "8px 16px",
                      borderRadius: 9999,
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    +{post.tags.length - 3}
                  </div>
                )}
              </div>

              {/* 日付 */}
              <div
                style={{
                  color: "#6b7280",
                  fontSize: 24,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                }}
              >
                {new Date(post.date).toLocaleDateString("ja-JP")}
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
                // zIndex: 10,
              }}
            >
              Powered by
              <span
                style={{
                  background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                  backgroundClip: "text",
                  color: "transparent",
                  fontWeight: 600,
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
