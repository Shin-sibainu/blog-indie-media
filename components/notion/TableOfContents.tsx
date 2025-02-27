"use client";

import { ExtendedRecordMap } from "notion-types";
import { getPageTableOfContents } from "notion-utils";
import { useEffect, useState } from "react";
import { List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  recordMap: ExtendedRecordMap;
}

export function TableOfContents({ recordMap }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [toc] = useState(() => {
    const firstPageId = Object.keys(recordMap.block)[0];
    return getPageTableOfContents(
      recordMap.block[firstPageId].value as any,
      recordMap
    );
  });

  useEffect(() => {
    if (toc.length < 3) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const blockId = entry.target.getAttribute("data-block-id");
            if (blockId) {
              setActiveId(blockId);
              if (
                !window.location.hash ||
                window.location.hash.slice(1) !== blockId
              ) {
                window.history.replaceState({}, "", `#${blockId}`);
              }
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1,
      }
    );

    const headings = document.querySelectorAll(
      ".notion-h1, .notion-h2, .notion-h3"
    );
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [toc.length]);

  if (toc.length < 3) return null;

  return (
    <>
      {/* デスクトップ表示 */}
      <nav className="fixed right-8 top-40 w-64 bg-background/80 backdrop-blur-sm p-4 rounded-lg border shadow-sm hidden xl:block">
        <h2 className="font-bold mb-4 text-sm">目次</h2>
        <ul className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {toc.map((item) => (
            <li
              key={item.id}
              className="text-sm"
              style={{ paddingLeft: `${item.indentLevel * 12}px` }}
            >
              <a
                href={`#${item.id.replace(/-/g, "")}`}
                className={`block w-full text-left py-1 text-muted-foreground hover:text-foreground transition-colors ${
                  activeId === item.id ? "text-foreground font-bold" : ""
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* モバイル表示 */}
      <div className="xl:hidden">
        {/* フローティングボタン */}
        <Button
          variant="outline"
          size="icon"
          className="fixed right-4 bottom-4 z-50 rounded-full shadow-lg bg-background/80 backdrop-blur-sm"
          onClick={() => setIsOpen(true)}
        >
          <List className="h-5 w-5" />
          <span className="sr-only">目次を開く</span>
        </Button>

        {/* モーダル */}
        <div
          className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsOpen(false)}
        >
          <div
            className={cn(
              "fixed right-0 top-0 h-full w-[80%] max-w-xs bg-background border-l p-6 shadow-lg transition-transform",
              isOpen ? "translate-x-0" : "translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm">目次</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">閉じる</span>
              </Button>
            </div>
            <ul className="space-y-2 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {toc.map((item) => (
                <li
                  key={item.id}
                  className="text-sm"
                  style={{ paddingLeft: `${item.indentLevel * 12}px` }}
                >
                  <a
                    href={`#${item.id.replace(/-/g, "")}`}
                    className={`block w-full text-left py-1 text-muted-foreground hover:text-foreground transition-colors ${
                      activeId === item.id ? "text-foreground font-bold" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
