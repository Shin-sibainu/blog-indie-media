import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/lib/notion";

// タグをURLセーフな形式に変換する関数
function encodeTag(tag: string) {
  return encodeURIComponent(tag.toLowerCase().trim());
}

export default async function TagsPage() {
  const posts = await getAllPosts();

  // 全投稿からタグを集計
  const tagCounts = posts.reduce((acc: { [key: string]: number }, post) => {
    post.tags.forEach((tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  // タグデータを整形
  const tags = Object.entries(tagCounts).map(([name, count]) => ({
    id: name,
    name,
    slug: encodeTag(name),
    count,
  }));

  // タグを記事数で降順ソート
  const sortedTags = tags.sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-foreground">
            タグ一覧
          </h1>
        </div>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {sortedTags.map((tag) => (
            <Link key={tag.id} href={`/tags/${tag.slug}`}>
              <Badge
                variant="secondary"
                className="text-lg px-4 py-2 bg-primary/5 hover:bg-primary/10 transition-colors border border-border/50"
              >
                {tag.name} ({tag.count})
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
