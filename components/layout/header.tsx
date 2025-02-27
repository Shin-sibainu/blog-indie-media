import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { HeaderContent } from "./header-content";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "@/components/theme-toggle";

const navigation = [
  { name: "ホーム", href: "/" },
  { name: "タグ", href: "/tags" },
  { name: "プロフィール", href: "/profile" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-xl">
              <Suspense fallback={<span>読み込み中...</span>}>
                <HeaderContent />
              </Suspense>
            </Link>
            <NavLinks
              items={navigation}
              className="ml-10 hidden space-x-8 lg:block"
            />
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Link href="/search">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-secondary/50"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">検索</span>
              </Button>
            </Link>
          </div>
        </div>
        <NavLinks
          items={navigation}
          className="flex flex-wrap justify-center space-x-4 py-4 lg:hidden"
        />
      </nav>
    </header>
  );
}
