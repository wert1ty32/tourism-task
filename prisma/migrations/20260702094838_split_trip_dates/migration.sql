/*
  Warnings:

  - You are about to drop the column `date` on the `trips` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trips"
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);

-- Backfill: existing single-day trips become start = end = date
UPDATE "trips" SET "startDate" = "date", "endDate" = "date";

-- AlterTable
ALTER TABLE "trips"
ALTER COLUMN "startDate" SET NOT NULL,
ALTER COLUMN "endDate" SET NOT NULL,
DROP COLUMN "date";
