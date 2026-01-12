import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import {
  createAuthToken,
  setAuthCookie,
  verifyPassword,
} from "@/app/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = createAuthToken(user.id);
  await setAuthCookie(token);

  return NextResponse.json({
    id: user.id,
    email: user.email,
    emailVerifiedAt: user.emailVerifiedAt,
  });
}
