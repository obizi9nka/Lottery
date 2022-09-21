-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tokens" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "chain" INTEGER NOT NULL,
    "isImageAdded" BOOLEAN NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL DEFAULT 18
);
INSERT INTO "new_tokens" ("address", "chain", "isImageAdded", "symbol") SELECT "address", "chain", "isImageAdded", "symbol" FROM "tokens";
DROP TABLE "tokens";
ALTER TABLE "new_tokens" RENAME TO "tokens";
CREATE UNIQUE INDEX "tokens_address_key" ON "tokens"("address");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
