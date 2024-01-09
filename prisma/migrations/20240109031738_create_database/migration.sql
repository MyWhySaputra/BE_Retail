-- CreateTable
CREATE TABLE "kasir" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "kasir_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" SERIAL NOT NULL,
    "kasir_id" INTEGER NOT NULL,
    "profile_picture" VARCHAR(255) NOT NULL,
    "identity_type" VARCHAR(100) NOT NULL,
    "identity_number" VARCHAR(100) NOT NULL,
    "address" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "identity_type" VARCHAR(100) NOT NULL,
    "identity_number" VARCHAR(100) NOT NULL,
    "address" TEXT NOT NULL,
    "total_point" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipt" (
    "id" SERIAL NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "total_discount" INTEGER NOT NULL,
    "cash" INTEGER NOT NULL,
    "PPN" INTEGER NOT NULL,
    "cash_refund" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "point" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "kasir_id" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" SERIAL NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "items_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sub_total_price" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kasir_email_key" ON "kasir"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profile_kasir_id_key" ON "profile"("kasir_id");

-- CreateIndex
CREATE UNIQUE INDEX "member_identity_number_key" ON "member"("identity_number");

-- CreateIndex
CREATE UNIQUE INDEX "receipt_transaction_id_key" ON "receipt"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_transaction_id_key" ON "transaction"("transaction_id");

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_kasir_id_fkey" FOREIGN KEY ("kasir_id") REFERENCES "kasir"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt" ADD CONSTRAINT "receipt_kasir_id_fkey" FOREIGN KEY ("kasir_id") REFERENCES "kasir"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt" ADD CONSTRAINT "receipt_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt" ADD CONSTRAINT "receipt_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("transaction_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_items_id_fkey" FOREIGN KEY ("items_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
