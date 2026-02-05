-- AlterTable
ALTER TABLE "meals" ADD COLUMN     "cuisine" TEXT,
ADD COLUMN     "isVegan" BOOLEAN;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
