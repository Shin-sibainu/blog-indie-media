import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { getPostBySlug, getAllPosts } from "@/lib/notion";
import { Metadata } from "next";
import { Fragment, ReactNode } from "react";

// 簡易マークダウンレンダラ。ダミーデータが使う #/##/番号付きリスト/段落のみ対応。
function renderMarkdown(source: string): ReactNode {
  const lines = source.split("\n");
  const blocks: ReactNode[] = [];
  let listBuffer: string[] = [];
  let paragraphBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ol
        key={`ol-${blocks.length}`}
        className="my-4 ml-6 list-decimal space-y-2 text-foreground"
      >
        {listBuffer.map((item, i) => (
          <li key={i} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ol>
    );
    listBuffer = [];
  };

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return;
    blocks.push(
      <p
        key={`p-${blocks.length}`}
        className="my-4 leading-relaxed text-foreground"
      >
        {paragraphBuffer.join(" ")}
      </p>
    );
    paragraphBuffer = [];
  };

  const flushAll = () => {
    flushList();
    flushParagraph();
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.startsWith("## ")) {
      flushAll();
      blocks.push(
        <h2
          key={`h2-${blocks.length}`}
          className="mt-10 mb-4 text-2xl font-bold tracking-tight text-foreground"
        >
          {line.slice(3)}
        </h2>
      );
      continue;
    }
    if (line.startsWith("# ")) {
      flushAll();
      blocks.push(
        <h1
          key={`h1-${blocks.length}`}
          className="mt-12 mb-6 text-3xl font-bold tracking-tight text-foreground"
        >
          {line.slice(2)}
        </h1>
      );
      continue;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      listBuffer.push(orderedMatch[1]);
      continue;
    }

    if (line.trim() === "") {
      flushAll();
      continue;
    }

    flushList();
    paragraphBuffer.push(line);
  }
  flushAll();

  return <Fragment>{blocks}</Fragment>;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "記事が見つかりません",
      description: "お探しの記事は見つかりませんでした。",
    };
  }

  const title = post.title;
  const description = post.description || post.excerpt;
  const ogImage = `/posts/${params.slug}/opengraph-image`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      url: `/posts/${params.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-16 max-w-4xl">
        <div className="px-4">
          <div className="relative h-[32vh] w-full rounded-lg overflow-hidden shadow-md">
            <Image
              src={post.coverImage}
              fill
              alt={post.title}
              className="object-cover"
              priority
            />
          </div>
          <div className="mt-8 flex flex-col items-center justify-center">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
                  <Badge
                    variant="secondary"
                    className="bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4">
              {post.icon && (
                <div className="w-8 h-8 flex items-center justify-center mt-[0.15rem]">
                  {post.icon.startsWith("http") ? (
                    <Image
                      src={post.icon}
                      alt={post.title}
                      width={32}
                      height={32}
                      className="rounded-sm"
                    />
                  ) : (
                    <span className="text-2xl">{post.icon}</span>
                  )}
                </div>
              )}
              <h1 className="text-3xl font-bold text-foreground">
                {post.title}
              </h1>
            </div>
            <div className="mt-4">
              <time className="text-sm text-muted-foreground">
                {formatDate(post.date)}
              </time>
            </div>
          </div>
        </div>
        <div className="prose prose-slate dark:prose-invert mt-8 max-w-none">
          {typeof post.content === "string" ? renderMarkdown(post.content) : null}
        </div>
      </div>
    </div>
  );
}
