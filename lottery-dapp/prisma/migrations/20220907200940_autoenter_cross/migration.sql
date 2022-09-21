/*
  Warnings:

  - You are about to drop the column `AutoEnter` on the `user` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "tokensETH" TEXT,
    "countOfLobbysETH" INTEGER NOT NULL DEFAULT 0,
    "newsETH" TEXT,
    "PromSetETH" TEXT,
    "PromInputETH" TEXT,
    "AutoEnterETH" TEXT,
    "countOfLobbysBNB" INTEGER NOT NULL DEFAULT 0,
    "tokensBNB" TEXT,
    "newsBNB" TEXT,
    "PromSetBNB" TEXT,
    "PromInputBNB" TEXT,
    "AutoEnterBNB" TEXT,
    "message" TEXT
);
INSERT INTO "new_user" ("PromInputBNB", "PromInputETH", "PromSetBNB", "PromSetETH", "address", "countOfLobbysBNB", "countOfLobbysETH", "message", "newsBNB", "newsETH", "tokensBNB", "tokensETH") SELECT "PromInputBNB", "PromInputETH", "PromSetBNB", "PromSetETH", "address", "countOfLobbysBNB", "countOfLobbysETH", "message", "newsBNB", "newsETH", "tokensBNB", "tokensETH" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_address_key" ON "user"("address");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
