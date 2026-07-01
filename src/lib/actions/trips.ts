"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const tripInputSchema = z.object({
  title: z.string().trim().min(1, "Вкажіть назву").max(200),
  destination: z.string().trim().min(1, "Вкажіть місце призначення").max(200),
  description: z.string().trim().min(1, "Додайте опис").max(2000),
  date: z.string().min(1, "Вкажіть дату"),
  costEur: z.coerce.number().min(0, "Вартість не може бути від'ємною"),
  status: z.enum(["planned", "in_prep", "done"]),
  responsibleIds: z.array(z.string()).min(1, "Оберіть хоча б одного відповідального"),
});

export type TripInput = z.infer<typeof tripInputSchema>;

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function createTrip(input: TripInput) {
  await requireUser();
  const data = tripInputSchema.parse(input);

  await prisma.trip.create({
    data: {
      title: data.title,
      destination: data.destination,
      description: data.description,
      date: new Date(data.date),
      costEur: data.costEur,
      status: data.status,
      responsibles: { connect: data.responsibleIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/");
}

export async function updateTrip(tripId: string, input: TripInput) {
  await requireUser();
  const data = tripInputSchema.parse(input);

  await prisma.trip.update({
    where: { id: tripId },
    data: {
      title: data.title,
      destination: data.destination,
      description: data.description,
      date: new Date(data.date),
      costEur: data.costEur,
      status: data.status,
      responsibles: { set: data.responsibleIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/");
}
