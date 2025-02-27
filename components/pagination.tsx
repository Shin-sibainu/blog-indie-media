"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // 前のページと次のページの存在確認
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        disabled={!hasPreviousPage}
        className="cursor-pointer disabled:cursor-not-allowed"
      >
        {hasPreviousPage ? (
          <Link href={createPageURL(1)}>
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">最初のページ</span>
          </Link>
        ) : (
          <>
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">最初のページ</span>
          </>
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={!hasPreviousPage}
        className="cursor-pointer disabled:cursor-not-allowed"
      >
        {hasPreviousPage ? (
          <Link href={createPageURL(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">前のページ</span>
          </Link>
        ) : (
          <>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">前のページ</span>
          </>
        )}
      </Button>
      <span className="text-sm">
        {currentPage} / {totalPages}ページ
      </span>
      <Button
        variant="outline"
        size="icon"
        disabled={!hasNextPage}
        className="cursor-pointer disabled:cursor-not-allowed"
      >
        {hasNextPage ? (
          <Link href={createPageURL(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">次のページ</span>
          </Link>
        ) : (
          <>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">次のページ</span>
          </>
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={!hasNextPage}
        className="cursor-pointer disabled:cursor-not-allowed"
      >
        {hasNextPage ? (
          <Link href={createPageURL(totalPages)}>
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">最後のページ</span>
          </Link>
        ) : (
          <>
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">最後のページ</span>
          </>
        )}
      </Button>
    </div>
  );
}
