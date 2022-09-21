/*
  Warnings:

  - You are about to drop the column `message` on the `user` table. All the data in the column will be lost.

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
    "messageETH" TEXT,
    "countOfLobbysBNB" INTEGER NOT NULL DEFAULT 0,
    "tokensBNB" TEXT,
    "newsBNB" TEXT,
    "PromSetBNB" TEXT,
    "PromInputBNB" TEXT,
    "AutoEnterBNB" TEXT,
    "messageBNB" TEXT
);
INSERT INTO "new_user" ("AutoEnterBNB", "AutoEnterETH", "PromInputBNB", "PromInputETH", "PromSetBNB", "PromSetETH", "address", "countOfLobbysBNB", "countOfLobbysETH", "newsBNB", "newsETH", "tokensBNB", "tokensETH") SELECT "AutoEnterBNB", "AutoEnterETH", "PromInputBNB", "PromInputETH", "PromSetBNB", "PromSetETH", "address", "countOfLobbysBNB", "countOfLobbysETH", "newsBNB", "newsETH", "tokensBNB", "tokensETH" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_address_key" ON "user"("address");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
