"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface SearchProps {
  className?: string;
  placeholder?: string;
}

export default function Search({
  className,
  placeholder = "Search...",
}: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback(async (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className={className}>
      <div className="flex">
        <input
          type="text"
          placeholder={placeholder}
          defaultValue={searchParams.get("query")?.toString()}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          className="rounded pr-2.5 pl-[36px] py-1.5 outline-none bg-element w-80 bg-search-icon bg-no-repeat text-text bg-[12px] placeholder:text-placeholder"
        />
      </div>
    </div>
  );
}
