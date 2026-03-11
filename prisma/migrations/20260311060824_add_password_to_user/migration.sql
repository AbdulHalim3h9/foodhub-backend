/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "meals" ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isVegan" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
