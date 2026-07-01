import { prisma } from "@/lib/db";

export async function getExchangeRate(): Promise<number> {
  const rate = await prisma.exchangeRate.findUnique({ where: { id: 1 } });
  return rate ? Number(rate.eurToUah) : 45;
}
