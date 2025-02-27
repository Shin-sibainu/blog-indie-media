// https://splitbee.io/blog/notion-as-cms-using-nextjs
// Notionデータ取得用の関数を改善
import { NotionAPI } from "notion-client";
import { getPageImageUrls } from "notion-utils";
import { cache } from "react";

const NOTION_API_BASE = "https://notion-api.splitbee.io/v1";
const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID as string;
const NOTION_PROFILE_ID = process.env.NOTION_PROFILE_ID as string;

const notion = new NotionAPI();

interface NotionBlock {
  value: {
    type: string;
    format?: {
      page_cover?: string;
      page_icon?: string;
    };
    properties?: {
      title?: string[][];
      description?: string[][];
      role?: string[][];
      twitter?: string[][];
      github?: string[][];
      linkedin?: string[][];
      skills?: string[][];
    };
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  description: string;
  excerpt: string;
  content: any;
  author: {
    name: string;
    image: string;
    bio: string;
  };
  coverImage: string;
  tags: string[];
  featured: boolean;
  icon?: string | null;
}

export interface Profile {
  name: string;
  bio: string;
  avatar: string;
  role: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  skills: string[];
  content: any;
}

// Notionの画像URLを適切な形式に変換する関数
function formatImageUrl(url: string, blockId: string) {
  if (!url) return "/default-cover.jpg";

  // attachmentスキームの処理
  if (url.startsWith("attachment:")) {
    const attachmentId = url.split(":")[1].split(":")[0];
    return `https://www.notion.so/image/${encodeURIComponent(
      `https://prod-files-secure.s3.us-west-2.amazonaws.com/${attachmentId}`
    )}?table=block&id=${blockId}&width=3840`;
  }

  // signed URLの処理
  if (url.includes("/signed/")) {
    const signedId = url.split("/signed/")[1].split("?")[0];
    return `https://www.notion.so/image/${encodeURIComponent(
      `https://prod-files-secure.s3.us-west-2.amazonaws.com/${signedId}`
    )}?table=block&id=${blockId}&width=3840`;
  }

  if (url.startsWith("/images")) {
    return `https://www.notion.so${url}`;
  }

  if (url.startsWith("https://prod-files-secure")) {
    return `https://www.notion.so/image/${encodeURIComponent(
      url
    )}?table=block&id=${blockId}&width=3840`;
  }

  // 外部URLの場合
  if (url.startsWith("http")) {
    return `https://www.notion.so/image/${encodeURIComponent(
      url
    )}?table=block&id=${blockId}&width=3840`;
  }

  return url;
}

//notion-api-worker and react-notion
export const getAllPosts = cache(async (): Promise<Post[]> => {
  try {
    const res = await fetch(`${NOTION_API_BASE}/table/${NOTION_PAGE_ID}`, {
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status}`);
    }

    const posts = await res.json();

    // 各投稿のページ情報を取得してカバー画像を取得
    const postsWithCover = await Promise.all(
      posts
        .filter((post: any) => post.Public)
        .map(async (post: any) => {
          const pageRes = await fetch(`${NOTION_API_BASE}/page/${post.id}`);
          const page = await pageRes.json();

          // ページの最初のブロックを取得し、その値を確認
          const firstBlock = Object.values(page).find(
            (block): block is NotionBlock =>
              (block as NotionBlock)?.value?.type === "page"
          );

          // カバー画像の処理を修正
          let coverImage = "/default-cover.jpg";
          if (firstBlock?.value?.format?.page_cover) {
            const coverUrl = firstBlock.value.format.page_cover;
            if (coverUrl.startsWith("https://prod-files-secure")) {
              // S3のURLの場合
              coverImage = `https://www.notion.so/image/${encodeURIComponent(
                coverUrl
              )}?table=block&id=${post.id}&width=3840`;
            } else if (coverUrl.startsWith("/images")) {
              // Notionの内部画像の場合
              coverImage = `https://www.notion.so${coverUrl}`;
            } else {
              // その他のURLの場合
              coverImage = `https://www.notion.so/image/${encodeURIComponent(
                coverUrl
              )}?table=block&id=${post.id}&width=3840`;
            }
          }

          // アイコンの処理
          let icon = null;
          if (firstBlock?.value?.format?.page_icon) {
            const pageIcon = firstBlock.value.format.page_icon;
            if (
              pageIcon.length === 1 ||
              pageIcon.length === 2 ||
              pageIcon.startsWith("🏺") // 絵文字の場合
            ) {
              // 絵文字の場合
              icon = pageIcon;
            } else if (pageIcon.startsWith("http")) {
              // 画像URLの場合
              icon = pageIcon;
            } else if (pageIcon.includes("notion.so")) {
              // Notion内部の絵文字URLの場合
              try {
                const decodedIcon = decodeURIComponent(pageIcon);
                if (decodedIcon.startsWith("🏺")) {
                  icon = decodedIcon;
                } else {
                  icon = pageIcon;
                }
              } catch {
                icon = pageIcon;
              }
            }
          }

          // アイコンの処理
          let authorImage = post.AuthorImage || "/default-avatar.png";
          if (firstBlock?.value?.format?.page_icon) {
            const pageIcon = firstBlock.value.format.page_icon;
            if (
              pageIcon.length === 1 ||
              pageIcon.length === 2 ||
              pageIcon.startsWith("🏺") // 絵文字の場合
            ) {
              // 絵文字の場合
              authorImage = pageIcon;
            } else if (pageIcon.startsWith("http")) {
              // 画像URLの場合
              authorImage = pageIcon;
            } else if (pageIcon.includes("notion.so")) {
              // Notion内部の絵文字URLの場合
              try {
                const decodedIcon = decodeURIComponent(pageIcon);
                if (decodedIcon.startsWith("🏺")) {
                  authorImage = decodedIcon;
                } else {
                  authorImage = pageIcon;
                }
              } catch {
                authorImage = pageIcon;
              }
            }
          }

          const date = post.Published
            ? new Date(post.Published).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];

          return {
            id: post.id,
            title: post.Name || "無題",
            slug: post.Slug || `untitled-${post.id}`,
            date,
            author: {
              name: post.Author || "匿名",
              image: authorImage,
              bio: post.AuthorBio || "",
            },
            coverImage,
            tags: Array.isArray(post.Tags) ? post.Tags : [],
            description: post.Description || "",
            excerpt: post.Description || "",
            content: "",
            featured: post.Featured || false,
            icon,
          };
        })
    );

    return postsWithCover.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
});

export const getPostBySlug = cache(async (slug: string) => {
  try {
    const posts = await getAllPosts();
    const post = posts.find((p: any) => p.slug === slug);

    if (!post || !post.title) return null;

    // NotionAPIを使用してrecordMapを取得
    const recordMap = await notion.getPage(post.id);

    // アイコンの取得
    const block = Object.values(recordMap.block)[0]?.value;
    let icon = null;

    if (block?.format?.page_icon) {
      const pageIcon = block.format.page_icon;
      if (
        pageIcon.length === 1 ||
        pageIcon.length === 2 ||
        pageIcon.startsWith("🏺") // 絵文字の場合
      ) {
        // 絵文字の場合
        icon = pageIcon;
      } else if (pageIcon.startsWith("http")) {
        // 画像URLの場合
        icon = pageIcon;
      } else if (pageIcon.includes("notion.so")) {
        // Notion内部の絵文字URLの場合
        try {
          const decodedIcon = decodeURIComponent(pageIcon);
          if (decodedIcon.startsWith("🏺")) {
            icon = decodedIcon;
          } else {
            icon = pageIcon;
          }
        } catch {
          icon = pageIcon;
        }
      }
    }

    return {
      ...post,
      content: recordMap,
      icon,
    };
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
});

// react-notion-x
export const getDatabase = cache(async () => {
  try {
    const recordMap = await notion.getPage(NOTION_PAGE_ID);

    getPageImageUrls(recordMap, {
      mapImageUrl: (url: string, block: any) => {
        if (url.startsWith("/images")) {
          return `https://www.notion.so${url}`;
        }

        if (url.startsWith("https://prod-files-secure")) {
          const encoded = encodeURIComponent(url);
          return `https://www.notion.so/image/${encoded}?table=block&id=${block.id}&cache=v2`;
        }

        return url;
      },
    });

    const block = Object.values(recordMap.block)[0]?.value;

    if (!block) {
      throw new Error("No block data found");
    }

    // アイコンの処理を修正
    let icon;
    if (block?.format?.page_icon) {
      // 絵文字の場合は直接その文字を使用
      if (
        block.format.page_icon.length === 1 ||
        block.format.page_icon.length === 2
      ) {
        icon = block.format.page_icon; // 絵文字をそのまま返す
      } else {
        // 画像URLの場合は変換処理
        icon = `https://www.notion.so/image/${encodeURIComponent(
          block.format.page_icon
        )}?table=block&id=${block.id}&cache=v2`;
      }
    }

    // データベースのプロパティから追加情報を取得
    const properties = block?.properties || {};
    const author = properties.author?.[0]?.[0];
    const site = properties.site?.[0]?.[0];

    // descriptionの取得を試みる
    // 1. プロパティからの取得
    let description = properties.description?.[0]?.[0];

    // 2. プロパティになければ、最初のテキストブロックを探す
    if (!description) {
      const blocks = Object.values(recordMap.block);
      const textBlock = blocks.find(
        (block) =>
          block?.value?.type === "text" &&
          block?.value?.properties?.title?.[0]?.[0]
      );
      description = textBlock?.value?.properties?.title?.[0]?.[0];
    }

    const result = {
      icon,
      cover: block?.format?.page_cover
        ? block.format.page_cover.startsWith("/images")
          ? `https://www.notion.so${block.format.page_cover}`
          : block.format.page_cover
        : undefined,
      title: block?.properties?.title?.[0]?.[0] || undefined,
      coverPosition: block?.format?.page_cover_position || 0.5,
      // 追加の情報
      author,
      site,
      description:
        description || "A classic blog template built with Next.js and Notion", // デフォルト値を設定
    };

    return result;
  } catch (error) {
    console.error("Failed to fetch database:", error);
    return {
      icon: undefined,
      cover: undefined,
      title: "Minimalist",
      coverPosition: 0.5,
      author: undefined,
      site: undefined,
      description: "A classic blog template built with Next.js and Notion",
    };
  }
});

export const getProfile = cache(async (): Promise<Profile> => {
  try {
    // メインページからコンテンツを取得
    const recordMap = await notion.getPage(NOTION_PAGE_ID);

    // 画像URLを適切に処理
    getPageImageUrls(recordMap, {
      mapImageUrl: (url: string, block: any) => {
        if (url.startsWith("/images")) {
          return `https://www.notion.so${url}`;
        }

        if (url.startsWith("https://prod-files-secure")) {
          const encoded = encodeURIComponent(url);
          return `https://www.notion.so/image/${encoded}?table=block&id=${block.id}&cache=v2`;
        }

        return url;
      },
    });

    // プロフィールページのブロックを探す
    const blocks = Object.values(recordMap.block);
    const profileBlock = blocks.find((block) => {
      const value = block?.value;
      if (!value) return false;

      // より広範な検索条件を設定
      const text = JSON.stringify(value);
      const hasProfileText =
        text.includes("Profile") ||
        text.includes("プロフィール") ||
        text.includes("1801dcf229c28113a9e0d9080a7b9319");

      return hasProfileText;
    });

    if (!profileBlock) {
      throw new Error("Profile block not found in the main page");
    }

    // プロフィールページのIDを取得
    const profileId = profileBlock.value.id;

    // プロフィールページの内容を取得
    const profileRecordMap = await notion.getPage(profileId);

    // SNSリンクを探す
    const socialLinks = Object.values(profileRecordMap.block).reduce(
      (acc: any, block) => {
        const value = block?.value;
        if (!value || value.type !== "text") return acc;

        const text = JSON.stringify(value.properties || {});

        // TwitterリンクをチェックしてURLを抽出
        if (text.includes("Twitter") || text.includes("twitter.com")) {
          const match = text.match(/https:\/\/twitter\.com\/[^\s"]+/);
          if (match) acc.twitter = match[0];
        }

        // GitHubリンクをチェックしてURLを抽出
        if (text.includes("GitHub") || text.includes("github.com")) {
          const match = text.match(/https:\/\/github\.com\/[^\s"]+/);
          if (match) acc.github = match[0];
        }

        // LinkedInリンクをチェックしてURLを抽出
        if (text.includes("LinkedIn") || text.includes("linkedin.com")) {
          const match = text.match(/https:\/\/[^\s"]*linkedin\.com[^\s"]+/);
          if (match) acc.linkedin = match[0];
        }

        return acc;
      },
      {}
    );

    // ページの基本情報を取得
    const block = Object.values(profileRecordMap.block)[0]?.value;
    const pageTitle = block?.properties?.title?.[0]?.[0] || "Profile";

    return {
      name: pageTitle,
      bio: "",
      avatar: "/default-avatar.png",
      role: "",
      social: {
        twitter: socialLinks.twitter || "",
        github: socialLinks.github || "",
        linkedin: socialLinks.linkedin || "",
      },
      skills: [],
      content: profileRecordMap,
    };
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return {
      name: "名前未設定",
      bio: "",
      avatar: "/default-avatar.png",
      role: "役職未設定",
      social: {
        twitter: "",
        github: "",
        linkedin: "",
      },
      skills: [],
      content: null,
    };
  }
});
