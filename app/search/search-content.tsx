"use client";

import { useState } from "react";
import { PostCard } from "@/components/post-card";
import { Input } from "@/components/ui/input";
import type { Post } from "@/lib/notion";
import { Search } from "lucide-react";

interface SearchContentProps {
  initialPosts: Post[];
}

export function SearchContent({ initialPosts }: SearchContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts] = useState<Post[]>(initialPosts);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-foreground">
            記事を検索
          </h1>
          <div className="mt-8 max-w-xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="search"
                placeholder="キーワードを入力..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        {searchQuery.length > 0 ? (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {filteredPosts.length === 0 && (
              <p className="text-center text-muted-foreground mt-8">
                検索結果が見つかりませんでした。
              </p>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground">
            検索キーワードを入力してください
          </p>
        )}
      </div>
    </div>
  );
}
