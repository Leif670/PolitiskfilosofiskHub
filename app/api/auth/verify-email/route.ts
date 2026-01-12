import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getUserIdFromRequest } from "@/app/lib/auth";
import { sendEmail } from "@/app/lib/email";

export async function POST(request: NextRequest) {
  const demoMode = process.env.DEMO_MODE === "true";
  const body = await request.json().catch(() => ({}));
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const userIdFromCookie = getUserIdFromRequest(request);

  const user = userIdFromCookie
    ? await prisma.user.findUnique({ where: { id: userIdFromCookie } })
    : email
    ? await prisma.user.findUnique({ where: { email } })
    : null;

  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  const origin =
    process.env.APP_URL ?? request.headers.get("origin") ?? "http://localhost:3000";
  const link = `${origin}/api/auth/verify-email/confirm?token=${token}`;

  const subject = "Bekræft din email";
  const html = `
    <p>Bekræft din email ved at klikke her:</p>
    <p><a href="${link}">${link}</a></p>
    <p>Linket udløber om 30 minutter.</p>
  `;

  await sendEmail(user.email, subject, html);

  if (demoMode || process.env.NODE_ENV !== "production") {
    return NextResponse.json({ ok: true, link });
  }

  return NextResponse.json({ ok: true });
}
