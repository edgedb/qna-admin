"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../utils";

interface HeaderProps {
  links: { href: string; label: string }[];
  moderator: any;
  signoutUrl: string;
}

export default function Header({ links, moderator, signoutUrl }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "py-5 px-10 flex justify-center",
        moderator && "pl-[290px]"
      )}
    >
      <nav className="flex gap-5 grow h-fit justify-center ">
        {links.map(({ href, label }) => {
          return (
            <Link
              key={href}
              href={href}
              className={`px-1 py-0.5 text-sm border-b border-transparent  ${
                pathname.startsWith(href)
                  ? "!border-[#8280ff] hover:!text-[#8280ff]"
                  : ""
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="text-sm flex flex-col items-end w-[250px]">
        <p>{`Logged-in as ${moderator}`}</p>
        <a href={signoutUrl}>LOG OUT</a>
      </div>
    </header>
  );
}
