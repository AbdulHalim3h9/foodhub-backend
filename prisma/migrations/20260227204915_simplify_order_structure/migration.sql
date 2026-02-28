/*
  Warnings:

  - You are about to drop the `order_items` table. If the table is not empty, all the data it contains will be lost.

*/

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_mealId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_orderId_fkey";

-- Add new columns as nullable first
ALTER TABLE "orders" ADD COLUMN     "mealId" TEXT,
ADD COLUMN     "pricePerItem" DECIMAL(10,2),
ADD COLUMN     "quantity" INTEGER;

-- Migrate data from order_items to orders (only handle single-item orders)
UPDATE "orders" 
SET 
  "mealId" = (
    SELECT "mealId" 
    FROM "order_items" 
    WHERE "order_items"."orderId" = "orders"."id" 
    LIMIT 1
  ),
  "pricePerItem" = (
    SELECT "price" 
    FROM "order_items" 
    WHERE "order_items"."orderId" = "orders"."id" 
    LIMIT 1
  ),
  "quantity" = (
    SELECT COALESCE(SUM("quantity"), 1) 
    FROM "order_items" 
    WHERE "order_items"."orderId" = "orders"."id"
  );

-- Make columns NOT NULL after data migration
ALTER TABLE "orders" ALTER COLUMN "mealId" SET NOT NULL,
ALTER COLUMN "pricePerItem" SET NOT NULL,
ALTER COLUMN "quantity" SET NOT NULL;

-- DropTable
DROP TABLE "order_items";

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
