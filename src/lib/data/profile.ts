import { prisma } from "@/lib/db";
import { getTripsForUser } from "@/lib/data/trips";

function getQuarterRange(date = new Date()) {
  const quarter = Math.floor(date.getMonth() / 3);
  const start = new Date(date.getFullYear(), quarter * 3, 1);
  const end = new Date(date.getFullYear(), quarter * 3 + 3, 1);
  return { start, end };
}

export async function getProfileData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, position: true, role: true },
  });
  if (!user) return null;

  const trips = await getTripsForUser(userId);

  const { start, end } = getQuarterRange();
  const thisQuarterTrips = trips.filter(
    (trip) => trip.startDate >= start && trip.startDate < end,
  ).length;

  const now = new Date();
  const upcoming = trips
    .filter((trip) => trip.endDate >= now)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  const nearestTrip = upcoming[0] ?? trips[0] ?? null;

  const totalCostEur = trips.reduce((sum, trip) => sum + trip.costEur, 0);

  return {
    user,
    trips,
    stats: {
      totalTrips: trips.length,
      thisQuarterTrips,
      nearestTrip,
      totalCostEur,
    },
  };
}

export type ProfileData = NonNullable<Awaited<ReturnType<typeof getProfileData>>>;
