import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM ?? "noreply@example.com";

const resend = apiKey ? new Resend(apiKey) : null;

export async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.log("Email (dev):", { to, subject, html });
    return;
  }

  await resend.emails.send({
    from: emailFrom,
    to,
    subject,
    html,
  });
}
