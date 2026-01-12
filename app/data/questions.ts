export interface Question {
  id: string;
  title: string;
  context: string;
  votes: {
    yes: number;
    no: number;
    undecided: number;
  };
  argumentsFor: string[];
  argumentsAgainst: string[];
  startsAt: string; // ISO string
  endsAt: string; // ISO string
}

export const questions: Question[] = [
  {
    id: "1",
    title: "Er demokrati moralsk overlegent?",
    context: "Diskuteret i politisk filosofi...",
    votes: { yes: 142, no: 98, undecided: 33 },
    argumentsFor: [
      "Demokrati respekterer individets lige politiske værdi.",
      "Det giver en fredelig mekanisme til magtskifte.",
      "Fejl kan rettes gennem åbne valg og debat.",
    ],
    argumentsAgainst: [
      "Sandhed er ikke et flertalsspørgsmål.",
      "Populisme kan skade minoriteter.",
      "Komplekse problemer forenkles i kampagner.",
    ],
    startsAt: "2025-01-01T00:00:00Z",
    endsAt: "2026-01-15T23:59:59Z",
  },
  {
    id: "2",
    title: "Skal staten omfordele rigdom?",
    context: "En klassisk debat om velfærd og retfærdighed.",
    votes: { yes: 205, no: 171, undecided: 44 },
    argumentsFor: [
      "Omfordeling kan reducere ulighed og social uro.",
      "Velfærd beskytter borgere mod uforudsete risici.",
      "Alle drager fordel af stabile, trygge samfund.",
    ],
    argumentsAgainst: [
      "Høj beskatning kan hæmme innovation.",
      "Staten fordeler ofte ineffektivt.",
      "Individuel frihed bør vægtes højt.",
    ],
    startsAt: "2024-01-01T00:00:00Z",
    endsAt: "2024-12-31T23:59:59Z",
  },
  {
    id: "3",
    title: "Findes objektiv moral?",
    context: "Et klassisk spørgsmål i metaetik.",
    votes: { yes: 118, no: 134, undecided: 62 },
    argumentsFor: [
      "Visse normer fremmer menneskelig trivsel på tværs af kulturer.",
      "Logiske principper i etik peger mod objektive standarder.",
      "Universelle rettigheder antyder en objektiv kerne.",
    ],
    argumentsAgainst: [
      "Moral varierer historisk og kulturelt.",
      "Etiske domme afhænger af værdier og følelser.",
      "Ingen empirisk metode kan bevise moralske fakta.",
    ],
    startsAt: "2025-01-01T00:00:00Z",
    endsAt: "2025-06-30T23:59:59Z",
  },
  {
    id: "4",
    title: "Skal Danmark indføre borgerløn?",
    context: "Debat om universel grundindkomst og arbejdsmarkedets fremtid.",
    votes: { yes: 164, no: 210, undecided: 58 },
    argumentsFor: [
      "Borgerløn kan skabe økonomisk tryghed.",
      "Det kan styrke iværksætteri og uddannelse.",
      "Administrationen af ydelser kan forenkles.",
    ],
    argumentsAgainst: [
      "Det kan svække arbejdsincitamentet.",
      "Finansieringen kan blive meget dyr.",
      "Målrettede ydelser rammer bedre.",
    ],
    startsAt: "2025-02-01T00:00:00Z",
    endsAt: "2025-12-31T23:59:59Z",
  },
  {
    id: "5",
    title: "Bør ytringsfrihed have flere begrænsninger?",
    context: "Afvejning mellem frihed og beskyttelse mod had og misinformation.",
    votes: { yes: 96, no: 238, undecided: 41 },
    argumentsFor: [
      "Skadeligt indhold kan ramme sårbare grupper.",
      "Demokratiet kan beskyttes mod manipulation.",
      "Platforme har allerede et ansvar for moderering.",
    ],
    argumentsAgainst: [
      "Begrænsninger kan misbruges politisk.",
      "Åben debat er bedst til at afsløre dårlige idéer.",
      "Grænser er svære at definere objektivt.",
    ],
    startsAt: "2025-03-01T00:00:00Z",
    endsAt: "2025-08-15T23:59:59Z",
  },
  {
    id: "6",
    title: "Skal Danmark indføre en national klimaafgift?",
    context: "Spørgsmål om afgifter på CO2-udledning og grøn omstilling.",
    votes: { yes: 274, no: 143, undecided: 52 },
    argumentsFor: [
      "Afgifter kan accelerere den grønne omstilling.",
      "Forureneren bør betale for omkostningerne.",
      "Indtægter kan bruges til grønne investeringer.",
    ],
    argumentsAgainst: [
      "Det kan ramme lavindkomstgrupper hårdt.",
      "Virksomheder kan miste konkurrenceevne.",
      "Effekten afhænger af global koordinering.",
    ],
    startsAt: "2025-01-01T00:00:00Z",
    endsAt: "2026-01-01T23:59:59Z",
  },
  {
    id: "7",
    title: "Skal stemmeretten sænkes til 16 år?",
    context: "Debat om politisk deltagelse og unges indflydelse.",
    votes: { yes: 132, no: 190, undecided: 37 },
    argumentsFor: [
      "Unge påvirkes af politik og bør høres.",
      "Tidlig deltagelse kan øge valgdeltagelse.",
      "Mange 16-årige er velinformerede.",
    ],
    argumentsAgainst: [
      "Politiske beslutninger kræver modenhed.",
      "16-årige er stadig afhængige af forældre.",
      "Grænsen bliver arbitrær at flytte.",
    ],
    startsAt: "2024-09-01T00:00:00Z",
    endsAt: "2025-01-31T23:59:59Z",
  },
];
