-- CreateTable
CREATE TABLE "user" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "tokens" TEXT NOT NULL,
    "countOfLobbys" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "lobby" (
    "id" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "IERC20" TEXT NOT NULL,
    "players" TEXT NOT NULL,
    "deposit" TEXT NOT NULL,
    "countOfPlayers" INTEGER NOT NULL,
    "nowInLobby" INTEGER NOT NULL,

    PRIMARY KEY ("creator", "id"),
    CONSTRAINT "lobby_creator_fkey" FOREIGN KEY ("creator") REFERENCES "user" ("address") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lobbyHistory" (
    "id" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "IERC20" TEXT NOT NULL,
    "winner" TEXT NOT NULL,
    "deposit" TEXT NOT NULL,
    "countOfPlayers" INTEGER NOT NULL,

    PRIMARY KEY ("creator", "id"),
    CONSTRAINT "lobbyHistory_creator_fkey" FOREIGN KEY ("creator") REFERENCES "user" ("address") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_address_key" ON "user"("address");
