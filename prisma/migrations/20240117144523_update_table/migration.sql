/*
  Warnings:

  - You are about to drop the column `receipt_id` on the `items_receipt` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `receipt` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receipt_code` to the `items_receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `receipt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "items_receipt" DROP CONSTRAINT "items_receipt_receipt_id_fkey";

-- AlterTable
ALTER TABLE "items_receipt" DROP COLUMN "receipt_id",
ADD COLUMN     "receipt_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "receipt" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "receipt_code_key" ON "receipt"("code");

-- AddForeignKey
ALTER TABLE "items_receipt" ADD CONSTRAINT "items_receipt_receipt_code_fkey" FOREIGN KEY ("receipt_code") REFERENCES "receipt"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
