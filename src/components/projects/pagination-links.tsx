import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PaginationLinks({
  page,
  pageCount,
  hrefFor,
}: {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3">
      <p className="text-muted-foreground text-sm">
        Page {page} of {pageCount}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link
            href={hrefFor(page - 1)}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Previous
          </Link>
        ) : (
          <span
            className={cn(
              buttonVariants({ variant: "outline" }),
              "pointer-events-none opacity-50",
            )}
          >
            Previous
          </span>
        )}
        {page < pageCount ? (
          <Link
            href={hrefFor(page + 1)}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Next
          </Link>
        ) : (
          <span
            className={cn(
              buttonVariants({ variant: "outline" }),
              "pointer-events-none opacity-50",
            )}
          >
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
