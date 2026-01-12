import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type VoteCounts = {
  yes: number;
  no: number;
  undecided: number;
};

function buildVoteMap(
  groups: Array<{ questionId: string; choice: string; _count: { _all: number } }>
) {
  const map: Record<string, VoteCounts> = {};

  for (const group of groups) {
    if (!map[group.questionId]) {
      map[group.questionId] = { yes: 0, no: 0, undecided: 0 };
    }

    const key =
      group.choice === "YES" ? "yes" : group.choice === "NO" ? "no" : "undecided";
    map[group.questionId][key] = group._count._all;
  }

  return map;
}

export async function GET() {
  const [questions, voteGroups] = await Promise.all([
    prisma.question.findMany({
      include: { arguments: true },
      orderBy: { startsAt: "desc" },
    }),
    prisma.vote.groupBy({
      by: ["questionId", "choice"],
      _count: { _all: true },
    }),
  ]);

  const voteMap = buildVoteMap(voteGroups);

  const payload = questions.map((question) => ({
    id: question.id,
    title: question.title,
    context: question.context,
    votes: voteMap[question.id] ?? { yes: 0, no: 0, undecided: 0 },
    argumentsFor: question.arguments
      .filter((arg) => arg.side === "FOR")
      .map((arg) => arg.content),
    argumentsAgainst: question.arguments
      .filter((arg) => arg.side === "AGAINST")
      .map((arg) => arg.content),
    startsAt: question.startsAt.toISOString(),
    endsAt: question.endsAt.toISOString(),
  }));

  return NextResponse.json(payload);
}
