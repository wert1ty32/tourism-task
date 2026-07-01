"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const currencySchema = z.enum(["EUR", "UAH"]);

export async function setPreferredCurrency(currency: string) {
  const parsed = currencySchema.safeParse(currency);
  if (!parsed.success) return;

  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { preferredCurrency: parsed.data },
  });
}
