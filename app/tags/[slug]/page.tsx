import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { getAllPosts } from "@/lib/notion";

const POSTS_PER_PAGE = 6;

// タグをURLセーフな形式に変換する関数
function encodeTag(tag: string) {
  return encodeURIComponent(tag.toLowerCase().trim());
}

// URLからタグ名をデコードする関数
function decodeTag(slug: string) {
  return decodeURIComponent(slug);
}

// 動的なタグページの生成
export async function generateStaticParams() {
  const posts = await getAllPosts();
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(encodeTag(tag)));
  });

  return Array.from(tags).map((slug) => ({
    slug,
  }));
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page: string };
}) {
  const posts = await getAllPosts();
  const decodedSlug = decodeTag(params.slug);

  // タグの一覧を取得
  const allTags = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => allTags.add(tag));
  });

  // 現在のタグを検索
  const currentTagName = Array.from(allTags).find(
    (tag) => encodeTag(tag) === params.slug
  );

  if (!currentTagName) {
    notFound();
  }

  // タグに関連する投稿を取得
  const tagPosts = posts
    .filter((post) =>
      post.tags.some(
        (tag) => tag.toLowerCase() === currentTagName.toLowerCase()
      )
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // 日付の新しい順にソート

  const totalPages = Math.ceil(tagPosts.length / POSTS_PER_PAGE);
  const currentPage = Number(searchParams.page) || 1;

  // ページ番号が不正な場合は404を表示
  if (currentPage < 1 || currentPage > totalPages || isNaN(currentPage)) {
    notFound();
  }

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const currentPosts = tagPosts.slice(start, end);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-foreground">
            「{currentTagName}」のタグがついた記事
          </h1>
          <p className="mt-4 text-muted-foreground">
            {tagPosts.length}件の記事が見つかりました
          </p>
          {totalPages > 1 && (
            <p className="mt-2 text-sm text-muted-foreground">
              {currentPage} / {totalPages} ページ目
            </p>
          )}
        </div>
        {currentPosts.length > 0 ? (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {currentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-16">
                <Pagination totalPages={totalPages} />
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground">
            記事が見つかりませんでした
          </p>
        )}
      </div>
    </div>
  );
}
