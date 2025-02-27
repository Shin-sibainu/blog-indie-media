import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/lib/notion";
import { CalendarIcon } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  // デフォルトのアイキャッチ画像
  const coverImage = post.coverImage || "/default-cover.jpg";
  const hasIcon =
    post.author.image && post.author.image !== "/default-avatar.png";

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300 bg-card border-border">
      <CardHeader className="p-0">
        <Link href={`/posts/${post.slug}`} className="relative block">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={post.featured}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag.toLowerCase().trim())}`}
            >
              <Badge
                variant="secondary"
                className="bg-primary/5 hover:bg-primary/10 transition-colors border border-border/50"
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
        <div className="flex items-start gap-2 mb-2">
          {hasIcon && (
            <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-border/50 ">
              {post.icon?.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.icon}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl leading-none">
                  {post.icon}
                </div>
              )}
            </div>
          )}
          <Link href={`/posts/${post.slug}`} className="group/title">
            <h2 className="text-xl font-semibold transition-colors group-hover/title:text-primary">
              {post.title}
            </h2>
          </Link>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="px-6 py-4 mt-auto border-t border-border/50">
        <time className="text-sm text-muted-foreground flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          {formatDate(post.date)}
        </time>
      </CardFooter>
    </Card>
  );
}
