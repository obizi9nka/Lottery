/*
  Warnings:

  - You are about to alter the column `chain` on the `tokens` table. The data in that column could be lost. The data in that column will be cast from `Boolean` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tokens" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "chain" INTEGER NOT NULL,
    "isImageAdded" BOOLEAN NOT NULL,
    "symbol" TEXT NOT NULL
);
INSERT INTO "new_tokens" ("address", "chain", "isImageAdded", "symbol") SELECT "address", "chain", "isImageAdded", "symbol" FROM "tokens";
DROP TABLE "tokens";
ALTER TABLE "new_tokens" RENAME TO "tokens";
CREATE UNIQUE INDEX "tokens_address_key" ON "tokens"("address");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
