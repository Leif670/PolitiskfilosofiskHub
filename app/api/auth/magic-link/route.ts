import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";
import { sendEmail } from "@/app/lib/email";

export async function POST(request: Request) {
  const demoMode = process.env.DEMO_MODE === "true";
  const body = await request.json();
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.magicLinkToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  const origin =
    process.env.APP_URL ?? request.headers.get("origin") ?? "http://localhost:3000";
  const link = `${origin}/api/auth/magic-link/verify?token=${token}`;

  const subject = "Dit magic-link";
  const html = `
    <p>Klik på linket for at logge ind:</p>
    <p><a href="${link}">${link}</a></p>
    <p>Linket udløber om 15 minutter.</p>
  `;

  await sendEmail(email, subject, html);

  if (demoMode || process.env.NODE_ENV !== "production") {
    return NextResponse.json({ ok: true, link });
  }

  return NextResponse.json({ ok: true });
}
