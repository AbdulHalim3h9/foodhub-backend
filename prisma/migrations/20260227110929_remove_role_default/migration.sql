/*
  Warnings:

  - You are about to drop the column `cuisine` on the `meals` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `meals` table. All the data in the column will be lost.
  - You are about to drop the column `isVegan` on the `meals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "meals" DROP COLUMN "cuisine",
DROP COLUMN "isAvailable",
DROP COLUMN "isVegan",
ADD COLUMN     "cuisineId" TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;

-- CreateTable
CREATE TABLE "cuisines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cuisines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cuisines_name_key" ON "cuisines"("name");

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_cuisineId_fkey" FOREIGN KEY ("cuisineId") REFERENCES "cuisines"("id") ON DELETE SET NULL ON UPDATE CASCADE;
