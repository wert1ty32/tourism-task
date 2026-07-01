-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'UAH');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('planned', 'in_prep', 'done');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "preferredCurrency" "Currency" NOT NULL DEFAULT 'EUR';

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "costEur" DECIMAL(10,2) NOT NULL,
    "status" "TripStatus" NOT NULL DEFAULT 'planned',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchange_rate" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "eurToUah" DECIMAL(10,4) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exchange_rate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TripResponsibles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TripResponsibles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TripResponsibles_B_index" ON "_TripResponsibles"("B");

-- AddForeignKey
ALTER TABLE "_TripResponsibles" ADD CONSTRAINT "_TripResponsibles_A_fkey" FOREIGN KEY ("A") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TripResponsibles" ADD CONSTRAINT "_TripResponsibles_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
