"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Пароль має містити щонайменше 8 символів"),
});

export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const data = schema.parse({ currentPassword, newPassword });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    throw new Error("Unauthorized");
  }

  const matches = await bcrypt.compare(data.currentPassword, user.passwordHash);
  if (!matches) {
    return { ok: false as const, error: "Поточний пароль невірний" };
  }

  const passwordHash = await bcrypt.hash(data.newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, mustChangePassword: false },
  });

  return { ok: true as const };
}
