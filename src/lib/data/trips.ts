import { prisma } from "@/lib/db";

export type TripWithResponsibles = Awaited<ReturnType<typeof getTrips>>[number];
export type Employee = Awaited<ReturnType<typeof getEmployees>>[number];

export async function getTrips() {
  const trips = await prisma.trip.findMany({
    include: { responsibles: { select: { id: true, name: true } } },
    orderBy: { date: "asc" },
  });

  return trips.map((trip) => ({ ...trip, costEur: Number(trip.costEur) }));
}

export async function getEmployees() {
  return prisma.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getTripsForUser(userId: string) {
  const trips = await prisma.trip.findMany({
    where: { responsibles: { some: { id: userId } } },
    include: { responsibles: { select: { id: true, name: true } } },
    orderBy: { date: "desc" },
  });

  return trips.map((trip) => ({ ...trip, costEur: Number(trip.costEur) }));
}
