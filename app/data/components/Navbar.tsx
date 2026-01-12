"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `px-2 py-1 ${
      pathname === href
        ? "text-black border-b-2 border-black"
        : "text-gray-600 hover:text-black"
    }`;

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / titel */}
        <Link href="/" className="text-lg font-semibold text-black">
          Politisk Platform
        </Link>

        {/* Menu */}
        <div className="flex gap-6 text-sm">
          <Link href="/" className={linkClass("/")}>
            Afstemninger
          </Link>
          <Link href="/om" className={linkClass("/om")}>
            Om
          </Link>
        </div>
      </div>
    </nav>
  );
}
