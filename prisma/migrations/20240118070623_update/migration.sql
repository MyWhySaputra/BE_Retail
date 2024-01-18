/*
  Warnings:

  - You are about to drop the column `transaction_id` on the `receipt` table. All the data in the column will be lost.
  - You are about to drop the `transaction` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `receipt` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `receipt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_items_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_transaction_id_fkey";

-- DropIndex
DROP INDEX "receipt_transaction_id_key";

-- AlterTable
ALTER TABLE "receipt" DROP COLUMN "transaction_id",
ADD COLUMN     "code" VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE "transaction";

-- CreateTable
CREATE TABLE "items_receipt" (
    "id" SERIAL NOT NULL,
    "receipt_code" VARCHAR(100) NOT NULL,
    "items_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sub_total_price" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "items_receipt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "receipt_code_key" ON "receipt"("code");

-- AddForeignKey
ALTER TABLE "items_receipt" ADD CONSTRAINT "items_receipt_receipt_code_fkey" FOREIGN KEY ("receipt_code") REFERENCES "receipt"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_receipt" ADD CONSTRAINT "items_receipt_items_id_fkey" FOREIGN KEY ("items_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
