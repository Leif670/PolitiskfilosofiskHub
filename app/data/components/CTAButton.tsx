"use client";
import Link from "next/link";

interface CTAButtonProps {
  href: string;
  label?: string;
}

export default function CTAButton({
  href,
  label = "Deltag i afstemning →",
}: CTAButtonProps) {
  return (
    <Link
      href={href}

      className="
        inline-flex items-center justify-center
        px-5 py-3
        rounded-lg
        bg-black text-white
        font-medium
        transition
        hover:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-black
      "
    >
      {label}
    </Link>
  
  );
}
