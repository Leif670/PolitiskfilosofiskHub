import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getUserIdFromRequest } from "@/app/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerifiedAt: true },
  });

  if (!user?.emailVerifiedAt) {
    return NextResponse.json({ error: "Email not verified" }, { status: 403 });
  }

  const body = await request.json();
  const choice =
    body?.choice === "yes"
      ? "YES"
      : body?.choice === "no"
      ? "NO"
      : body?.choice === "undecided"
      ? "UNDECIDED"
      : null;

  if (!choice) {
    return NextResponse.json({ error: "Invalid choice" }, { status: 400 });
  }

  try {
    await prisma.vote.create({
      data: {
        userId,
        questionId: id,
        choice,
      },
    });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Already voted" }, { status: 409 });
    }
    return NextResponse.json({ error: "Vote failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
