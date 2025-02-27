"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  items: {
    name: string;
    href: string;
  }[];
  className?: string;
}

export function NavLinks({ items, className }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <div className={className}>
      {items.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === link.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
} 