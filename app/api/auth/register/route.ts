import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { createAuthToken, hashPassword, setAuthCookie } from "@/app/lib/auth";
import { sendEmail } from "@/app/lib/email";

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || password.length < 8) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash },
  });

  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  const origin = process.env.APP_URL ?? "http://localhost:3000";
  const link = `${origin}/api/auth/verify-email/confirm?token=${token}`;

  const subject = "Bekræft din email";
  const html = `
    <p>Bekræft din email ved at klikke her:</p>
    <p><a href="${link}">${link}</a></p>
    <p>Linket udløber om 30 minutter.</p>
  `;

  await sendEmail(email, subject, html);

  const authToken = createAuthToken(user.id);
  await setAuthCookie(authToken);

  return NextResponse.json({ id: user.id, email: user.email, emailVerifiedAt: null });
}
