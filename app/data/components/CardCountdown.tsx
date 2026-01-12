"use client";
import { useEffect, useState } from "react";

interface Props {
  startsAt: string;
  endsAt: string;
}

export default function CardCountdown({ startsAt, endsAt }: Props) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const start = new Date(startsAt).getTime();
      const end = new Date(endsAt).getTime();

      if (now < start || now > end) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft(end - now);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startsAt, endsAt]);

  if (timeLeft === null) {
    return (
      <span className="text-xs text-gray-500">
        Lukket · {new Date(endsAt).toLocaleDateString("da-DK")}
      </span>
    );
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);

  return (
    <span className="text-xs text-green-700 font-medium">
      Lukker om {days}d {hours}t {minutes}m
    </span>
  );
}
