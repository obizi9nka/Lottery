-- CreateTable
CREATE TABLE "user" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "tokens" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "lobby" (
    "creator" TEXT NOT NULL PRIMARY KEY,
    "IERC20" TEXT NOT NULL,
    "winer" TEXT NOT NULL,
    "players" TEXT NOT NULL,
    "deposit" TEXT NOT NULL,
    "countOfPlayers" INTEGER NOT NULL,
    "nowInLobby" INTEGER NOT NULL,
    "userAddress" TEXT,
    CONSTRAINT "lobby_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "user" ("address") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_address_key" ON "user"("address");
