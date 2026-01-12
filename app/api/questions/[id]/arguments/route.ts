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
  const side =
    body?.type === "for" ? "FOR" : body?.type === "against" ? "AGAINST" : null;
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!side || content.length < 3) {
    return NextResponse.json({ error: "Invalid argument" }, { status: 400 });
  }

  const argument = await prisma.argument.create({
    data: {
      userId,
      questionId: id,
      side,
      content,
    },
  });

  return NextResponse.json({
    id: argument.id,
    type: side === "FOR" ? "for" : "against",
    content: argument.content,
  });
}
