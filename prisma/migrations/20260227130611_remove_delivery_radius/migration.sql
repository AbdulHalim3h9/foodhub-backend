-- AlterTable
ALTER TABLE "provider_profiles" ADD COLUMN     "cuisine" TEXT,
ADD COLUMN     "openingHours" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
