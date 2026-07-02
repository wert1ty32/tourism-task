"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return session.user;
}

const createUserSchema = z.object({
  name: z.string().trim().min(1, "Вкажіть ім'я").max(200),
  email: z.string().trim().toLowerCase().email("Некоректний email"),
  role: z.enum(["admin", "employee"]),
  position: z.string().trim().max(200).optional().or(z.literal("")),
  startPassword: z.string().min(8, "Пароль має містити щонайменше 8 символів"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export async function createUser(input: CreateUserInput) {
  await requireAdmin();
  const data = createUserSchema.parse(input);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return { ok: false as const, error: "Користувач із таким email вже існує" };
  }

  const passwordHash = await bcrypt.hash(data.startPassword, 12);

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      position: data.position || null,
      passwordHash,
      mustChangePassword: true,
    },
  });

  revalidatePath("/admin");
  return { ok: true as const };
}

const updateUserSchema = z.object({
  name: z.string().trim().min(1, "Вкажіть ім'я").max(200),
  role: z.enum(["admin", "employee"]),
  position: z.string().trim().max(200).optional().or(z.literal("")),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export async function updateUser(userId: string, input: UpdateUserInput) {
  const admin = await requireAdmin();
  const data = updateUserSchema.parse(input);

  if (admin.id === userId && data.role !== "admin") {
    return { ok: false as const, error: "Не можна зняти роль адміністратора із власного акаунта" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      role: data.role,
      position: data.position || null,
    },
  });

  revalidatePath("/admin");
  return { ok: true as const };
}

export async function setUserActive(userId: string, isActive: boolean) {
  const admin = await requireAdmin();

  if (admin.id === userId && !isActive) {
    return { ok: false as const, error: "Не можна деактивувати власний акаунт" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });

  revalidatePath("/admin");
  return { ok: true as const };
}

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Пароль має містити щонайменше 8 символів"),
});

export async function resetUserPassword(userId: string, newPassword: string) {
  await requireAdmin();
  const data = resetPasswordSchema.parse({ newPassword });

  const passwordHash = await bcrypt.hash(data.newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash, mustChangePassword: true },
  });

  revalidatePath("/admin");
  return { ok: true as const };
}
