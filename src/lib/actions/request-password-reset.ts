"use server";

import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({ email: z.string().email() });

export async function requestPasswordReset(rawEmail: string) {
  const parsed = schema.safeParse({ email: rawEmail });
  if (!parsed.success) {
    return { ok: false as const };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (user && user.isActive) {
    const token = crypto.randomBytes(32).toString("hex");
    // Email delivery is not wired up yet (Stage 1 stub) — log instead of sending mail.
    console.log(`[password-reset] token for ${user.email}: ${token}`);
  }

  // Always report success so the response doesn't reveal whether the email is registered.
  return { ok: true as const };
}
