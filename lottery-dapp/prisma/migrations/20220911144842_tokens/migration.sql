-- CreateTable
CREATE TABLE "tokens" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "chain" BOOLEAN NOT NULL,
    "isImageAdded" BOOLEAN NOT NULL,
    "symbol" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_address_key" ON "tokens"("address");
