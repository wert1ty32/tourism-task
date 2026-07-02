import { prisma } from "@/lib/db";

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      position: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { name: "asc" },
  });
}

export type AdminUser = Awaited<ReturnType<typeof getAllUsers>>[number];
