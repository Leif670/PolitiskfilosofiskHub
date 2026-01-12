"use client";
import { useEffect, useState } from "react";

interface Props {
  startsAt: string;
  endsAt: string;
}

export function StatusBadge({ startsAt, endsAt }: Props) {
  const [status, setStatus] = useState<"open" | "closed">("closed");

  useEffect(() => {
    const now = new Date();
    const start = new Date(startsAt);
    const end = new Date(endsAt);

    setStatus(now >= start && now <= end ? "open" : "closed");
  }, [startsAt, endsAt]);

  return status === "open" ? (
    <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">
      Åben
    </span>
  ) : (
    <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-gray-200 text-gray-700">
      Lukket
    </span>
  );
}
