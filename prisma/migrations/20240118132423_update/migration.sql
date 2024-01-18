/*
  Warnings:

  - You are about to drop the `items_receipt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "items_receipt" DROP CONSTRAINT "items_receipt_items_id_fkey";

-- DropForeignKey
ALTER TABLE "items_receipt" DROP CONSTRAINT "items_receipt_receipt_code_fkey";

-- DropTable
DROP TABLE "items_receipt";

-- CreateTable
CREATE TABLE "receipt_items" (
    "id" SERIAL NOT NULL,
    "receipt_code" VARCHAR(100) NOT NULL,
    "items_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sub_total_price" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "receipt_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "receipt_items" ADD CONSTRAINT "receipt_items_receipt_code_fkey" FOREIGN KEY ("receipt_code") REFERENCES "receipt"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_items" ADD CONSTRAINT "receipt_items_items_id_fkey" FOREIGN KEY ("items_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
