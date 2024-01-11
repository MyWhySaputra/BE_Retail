-- DropForeignKey
ALTER TABLE "receipt" DROP CONSTRAINT "receipt_transaction_id_fkey";

-- DropIndex
DROP INDEX "transaction_transaction_id_key";

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "receipt"("transaction_id") ON DELETE RESTRICT ON UPDATE CASCADE;
