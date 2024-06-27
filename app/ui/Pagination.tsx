"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { generatePagination } from "@/app/lib/utils";
import { ArrowRightIcon, ArrowLeftIcon } from "@/app/ui/icons";
import { cn } from "./utils";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return totalPages > 1 ? (
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          let position: "first" | "last" | "single" | "middle" | undefined;

          if (index === 0) position = "first";
          if (index === allPages.length - 1) position = "last";
          if (allPages.length === 1) position = "single";
          if (page === "...") position = "middle";

          return (
            <PaginationNumber
              key={page}
              href={createPageURL(page)}
              page={page}
              position={position}
              isActive={currentPage === page}
            />
          );
        })}
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  ) : null;
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: "first" | "last" | "middle" | "single";
  isActive: boolean;
}) {
  const className = cn(
    "flex h-8 w-9 items-center justify-center text-sm border transition-transform",
    position === "first" || position === "single" ? "rounded-l-md" : "",
    position === "last" || position === "single" ? "rounded-r-md" : "",
    isActive
      ? "z-10 border-accentViolet text-accentViolet"
      : "text-placeholder border-placeholder",
    !isActive && position !== "middle"
      ? "hover:text-hoverViolet hover:border-hoverViolet hover:z-20"
      : ""
  );

  return isActive || position === "middle" ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const className = cn(
    "flex h-8 w-9 items-center justify-center rounded-md border text-placeholder border-placeholder transition-transform",
    isDisabled
      ? "pointer-events-none text-gray-300"
      : "hover:border-hoverViolet hover:text-hoverViolet",
    direction === "left" ? "mr-2 md:mr-4" : "ml-2 md:ml-4"
  );

  const icon =
    direction === "left" ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}
