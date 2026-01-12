import type { Poll, PollResult } from "@/app/domain/types";

/**
 * Midlertidige afstemninger
 * (erstattes senere af backend)
 */
export const polls: Poll[] = [
  {
    id: "klima-afgift",
    title: "Skal der indføres en national klimaafgift?",
    context:
      "Afstemningen handler om, hvorvidt Danmark bør indføre en national afgift på CO2-udledning.",
    options: [
      { id: "yes", label: "Ja" },
      { id: "no", label: "Nej" },
      { id: "undecided", label: "Uafklaret" },
    ],
    startsAt: "2025-01-01T00:00:00Z",
    endsAt: null,
  },
  {
    id: "fire-dages-arbejdsuge",
    title: "Skal Danmark indføre 4-dages arbejdsuge?",
    context:
      "Afstemningen undersøger holdningen til en forkortet arbejdsuge med fuld lønkompensation.",
    options: [
      { id: "yes", label: "Ja" },
      { id: "no", label: "Nej" },
    ],
    startsAt: "2025-01-01T00:00:00Z",
    endsAt: "2025-12-31T23:59:59Z",
  },
];
