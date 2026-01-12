"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { questions as fallbackQuestions } from "./data/questions";
import { StatusBadge } from "@/app/data/components/StatusBadge";
import CardCountdown from "./data/components/CardCountdown";

export default function HomePage() {
  const [questions, setQuestions] = useState(fallbackQuestions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await fetch("/api/questions");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setQuestions(Array.isArray(data) && data.length > 0 ? data : fallbackQuestions);
      } catch {
        setQuestions(fallbackQuestions);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const sortedQuestions = [...questions].sort((a, b) => {
    const now = new Date().getTime();
    const aOpen =
      now >= new Date(a.startsAt).getTime() &&
      now <= new Date(a.endsAt).getTime();
    const bOpen =
      now >= new Date(b.startsAt).getTime() &&
      now <= new Date(b.endsAt).getTime();

    return Number(bOpen) - Number(aOpen);
  });

  const activityItems = [
    {
      id: "a1",
      text: 'En bruger stemte "Ja" i "Er demokrati moralsk overlegent?"',
      time: "for 5 min siden",
    },
    {
      id: "a2",
      text: 'En bruger tilføjede et argument i "Skal staten omfordele rigdom?"',
      time: "for 12 min siden",
    },
    {
      id: "a3",
      text: 'En bruger stemte "Uafklaret" i "Findes objektiv moral?"',
      time: "for 24 min siden",
    },
    {
      id: "a4",
      text: 'En bruger stemte "Nej" i "Skal Danmark indføre borgerløn?"',
      time: "for 41 min siden",
    },
  ];

  const topArguments = [
    {
      id: "t1",
      side: "FOR",
      question: "Er demokrati moralsk overlegent?",
      text: "Demokrati respekterer individets lige politiske værdi.",
      votes: 34,
    },
    {
      id: "t2",
      side: "IMOD",
      question: "Skal staten omfordele rigdom?",
      text: "Staten fordeler ofte ineffektivt og skævt.",
      votes: 27,
    },
    {
      id: "t3",
      side: "FOR",
      question: "Skal Danmark indføre borgerløn?",
      text: "Borgerløn kan skabe økonomisk tryghed.",
      votes: 19,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <header className="max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
          Offentlige afstemninger om politik og samfund
        </h1>
        <p className="text-gray-600 text-lg">
          Et non-profit initiativ, der giver indblik i holdninger til centrale politiske
          spørgsmål i Danmark.
        </p>
      </header>

      <div className="max-w-3xl mx-auto mb-10 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Demo: Denne side er en portfolio-demo med simulerede data. Afstemningerne er ikke
        repræsentative for Danmark og bør ikke bruges som faktagrundlag.
      </div>

      <section className="max-w-3xl mx-auto mb-12 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold mb-3">Hvordan det virker</h2>
        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
          <li>Vælg en aktuel afstemning og læs konteksten.</li>
          <li>Stem Ja, Nej eller Uafklaret i den åbne periode.</li>
          <li>Se resultaterne efter du har stemt eller når afstemningen lukker.</li>
          <li>Tilføj korte argumenter for og imod.</li>
        </ol>
      </section>

      <h2 className="text-3xl font-bold mb-2">Aktuelle afstemninger</h2>
      <p className="text-gray-600 mb-8 max-w-xl">
        Deltag i politiske afstemninger og se, hvad andre mener. En stemme per person.
      </p>

      {loading && <p className="text-gray-500 mb-4">Indlæser afstemninger...</p>}

      {sortedQuestions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
          Der er ingen aktive afstemninger lige nu. Kom tilbage senere.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {sortedQuestions.map((q) => (
            <Link key={q.id} href={`/question/${q.id}`} className="block">
              <div
                className={`bg-white border rounded-xl p-6 transition ${
                  new Date() >= new Date(q.startsAt) && new Date() <= new Date(q.endsAt)
                    ? "hover:shadow-md border-gray-200"
                    : "opacity-60"
                }`}
              >
                <h2 className="text-xl font-semibold mb-2">{q.title}</h2>

                <p className="text-gray-600 text-sm mb-4">{q.context}</p>

                <span className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                  Deltag i afstemning
                </span>

                <div className="flex items-center justify-between mt-4">
                  <StatusBadge startsAt={q.startsAt} endsAt={q.endsAt} />
                  <CardCountdown startsAt={q.startsAt} endsAt={q.endsAt} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-2">Top argumenter i dag</h2>
        <p className="text-gray-600 mb-4">
          Et hurtigt blik på de mest upvotede argumenter.
        </p>
        <ul className="space-y-3">
          {topArguments.map((item) => (
            <li key={item.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-gray-500">
                  {item.side} - {item.question}
                </span>
                <span className="text-xs text-gray-500">{item.votes} stemmer</span>
              </div>
              <p className="text-sm text-gray-700 mt-2">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-2">Seneste aktivitet</h2>
        <p className="text-gray-600 mb-4">
          Et lille udsnit af, hvad brugerne har gjort i dag.
        </p>
        <ul className="space-y-3">
          {activityItems.map((item) => (
            <li
              key={item.id}
              className="bg-white border rounded-lg p-4 flex items-center justify-between"
            >
              <span className="text-sm text-gray-700">{item.text}</span>
              <span className="text-xs text-gray-500">{item.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
