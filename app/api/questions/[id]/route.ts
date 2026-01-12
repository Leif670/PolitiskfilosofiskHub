import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type Params = {
  params: { id: string };
};

export async function GET(_request: Request, { params }: Params) {
  const question = await prisma.question.findUnique({
    where: { id: params.id },
    include: { arguments: true },
  });

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const voteGroups = await prisma.vote.groupBy({
    by: ["choice"],
    where: { questionId: params.id },
    _count: { _all: true },
  });

  const votes = { yes: 0, no: 0, undecided: 0 };
  for (const group of voteGroups) {
    if (group.choice === "YES") votes.yes = group._count._all;
    if (group.choice === "NO") votes.no = group._count._all;
    if (group.choice === "UNDECIDED") votes.undecided = group._count._all;
  }

  const payload = {
    id: question.id,
    title: question.title,
    context: question.context,
    votes,
    argumentsFor: question.arguments
      .filter((arg) => arg.side === "FOR")
      .map((arg) => arg.content),
    argumentsAgainst: question.arguments
      .filter((arg) => arg.side === "AGAINST")
      .map((arg) => arg.content),
    startsAt: question.startsAt.toISOString(),
    endsAt: question.endsAt.toISOString(),
  };

  return NextResponse.json(payload);
}
