/*
  Warnings:

  - You are about to drop the column `transaction_id` on the `receipt` table. All the data in the column will be lost.
  - You are about to drop the `transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_items_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_transaction_id_fkey";

-- DropIndex
DROP INDEX "receipt_transaction_id_key";

-- AlterTable
ALTER TABLE "receipt" DROP COLUMN "transaction_id";

-- DropTable
DROP TABLE "transaction";

-- CreateTable
CREATE TABLE "items_receipt" (
    "id" SERIAL NOT NULL,
    "receipt_id" INTEGER NOT NULL,
    "items_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sub_total_price" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "items_receipt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "items_receipt" ADD CONSTRAINT "items_receipt_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_receipt" ADD CONSTRAINT "items_receipt_items_id_fkey" FOREIGN KEY ("items_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
