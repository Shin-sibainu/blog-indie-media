import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center bg-background">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-xl text-muted-foreground">
          お探しのページが見つかりませんでした
        </p>
        <p className="text-sm text-muted-foreground/80">
          URLが間違っているか、削除された可能性があります
        </p>
        <Button asChild className="mt-8">
          <Link href="/">ホームに戻る</Link>
        </Button>
      </div>
    </div>
  );
}
