import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@tourism.dept";
  const defaultPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Адміністратор",
      position: "Керівник департаменту",
      role: "admin",
    },
  });
  console.log(`Seeded admin user: ${admin.email}`);

  const employeeSeeds = [
    { email: "d.kovalchuk@tourism.dept", name: "Дмитро Ковальчук", position: "Менеджер з туризму" },
    { email: "o.petrenko@tourism.dept", name: "Оксана Петренко", position: "Спеціаліст із партнерств" },
    { email: "i.melnyk@tourism.dept", name: "Ігор Мельник", position: "Менеджер з туризму" },
    { email: "s.bondar@tourism.dept", name: "Світлана Бондар", position: "Координатор поїздок" },
  ];

  const employees = [];
  for (const seedUser of employeeSeeds) {
    const user = await prisma.user.upsert({
      where: { email: seedUser.email },
      update: {},
      create: {
        email: seedUser.email,
        passwordHash,
        name: seedUser.name,
        position: seedUser.position,
        role: "employee",
      },
    });
    employees.push(user);
  }
  console.log(`Seeded ${employees.length} employee users`);

  await prisma.exchangeRate.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, eurToUah: 45 },
  });
  console.log("Seeded EUR->UAH exchange rate");

  const [dmytro, oksana, ihor, svitlana] = employees;

  const tripSeeds = [
    {
      title: "Виставка ITB Berlin",
      destination: "Берлін, Німеччина",
      description:
        "Участь у міжнародній туристичній виставці, переговори з новими партнерами та збір контактів.",
      startDate: new Date("2026-03-17"),
      endDate: new Date("2026-03-21"),
      costEur: 2400,
      status: "planned" as const,
      responsibles: [dmytro.id, oksana.id],
    },
    {
      title: "Корпоративний ретрит",
      destination: "Буковель, Карпати",
      description: "Тимбілдинг команди, планування сезону та стратегічна сесія на два дні.",
      startDate: new Date("2026-03-23"),
      endDate: new Date("2026-03-24"),
      costEur: 1150,
      status: "planned" as const,
      responsibles: [ihor.id, svitlana.id],
    },
    {
      title: "Огляд готелів партнерів",
      destination: "Барселона, Іспанія",
      description: "Інспекція нових об'єктів розміщення та узгодження умов співпраці на літній сезон.",
      startDate: new Date("2026-04-04"),
      endDate: new Date("2026-04-04"),
      costEur: 3200,
      status: "planned" as const,
      responsibles: [oksana.id],
    },
    {
      title: "Партнерська зустріч",
      destination: "Рим, Італія",
      description: "Підписання угоди з італійським туроператором. Бронювання квитків у процесі.",
      startDate: new Date("2026-03-10"),
      endDate: new Date("2026-03-12"),
      costEur: 1800,
      status: "in_prep" as const,
      responsibles: [dmytro.id],
    },
    {
      title: "Навчальний семінар",
      destination: "Відень, Австрія",
      description: "Підвищення кваліфікації менеджерів. Узгодження програми та учасників.",
      startDate: new Date("2026-03-16"),
      endDate: new Date("2026-03-18"),
      costEur: 980,
      status: "in_prep" as const,
      responsibles: [ihor.id, oksana.id, svitlana.id],
    },
    {
      title: "Аудит партнерів",
      destination: "Львів, Україна",
      description: "Перевірка місцевих партнерів та оновлення договорів. Звіт завантажено.",
      startDate: new Date("2026-03-03"),
      endDate: new Date("2026-03-04"),
      costEur: 1420,
      status: "done" as const,
      responsibles: [dmytro.id],
    },
    {
      title: "Виставка у Парижі",
      destination: "Париж, Франція",
      description: "Промо стенду департаменту. Отримано 40+ нових контактів для співпраці.",
      startDate: new Date("2026-02-12"),
      endDate: new Date("2026-02-12"),
      costEur: 2650,
      status: "done" as const,
      responsibles: [oksana.id, ihor.id],
    },
  ];

  for (const trip of tripSeeds) {
    const existing = await prisma.trip.findFirst({ where: { title: trip.title } });
    if (existing) continue;
    await prisma.trip.create({
      data: {
        title: trip.title,
        destination: trip.destination,
        description: trip.description,
        startDate: trip.startDate,
        endDate: trip.endDate,
        costEur: trip.costEur,
        status: trip.status,
        responsibles: { connect: trip.responsibles.map((id) => ({ id })) },
      },
    });
  }
  console.log(`Seeded ${tripSeeds.length} sample trips`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
