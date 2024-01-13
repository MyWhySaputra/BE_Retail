-- DropForeignKey
ALTER TABLE "receipt" DROP CONSTRAINT "receipt_member_id_fkey";

-- AlterTable
ALTER TABLE "receipt" ALTER COLUMN "member_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "receipt" ADD CONSTRAINT "receipt_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
