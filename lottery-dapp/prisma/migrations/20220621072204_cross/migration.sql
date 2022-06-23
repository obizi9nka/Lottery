-- CreateTable
CREATE TABLE "user" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "tokensETH" TEXT,
    "countOfLobbysETH" INTEGER NOT NULL DEFAULT 0,
    "newsETH" TEXT,
    "PromSetETH" TEXT,
    "PromInputETH" TEXT,
    "countOfLobbysBNB" INTEGER NOT NULL DEFAULT 0,
    "tokensBNB" TEXT,
    "newsBNB" TEXT,
    "PromSetBNB" TEXT,
    "PromInputBNB" TEXT
);

-- CreateTable
CREATE TABLE "lobbyETH" (
    "id" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "IERC20" TEXT NOT NULL,
    "players" TEXT NOT NULL,
    "deposit" TEXT NOT NULL,
    "countOfPlayers" INTEGER NOT NULL,
    "nowInLobby" INTEGER NOT NULL,

    PRIMARY KEY ("creator", "id"),
    CONSTRAINT "lobbyETH_creator_fkey" FOREIGN KEY ("creator") REFERENCES "user" ("address") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lobbyHistoryETH" (
    "id" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "IERC20" TEXT NOT NULL,
    "players" TEXT NOT NULL,
    "winner" TEXT NOT NULL,
    "deposit" TEXT NOT NULL,
    "countOfPlayers" INTEGER NOT NULL,

    PRIMARY KEY ("creator", "id"),
    CONSTRAINT "lobbyHistoryETH_creator_fkey" FOREIGN KEY ("creator") REFERENCES "user" ("address") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lobbyBNB" (
    "id" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "IERC20" TEXT NOT NULL,
    "players" TEXT NOT NULL,
    "deposit" TEXT NOT NULL,
    "countOfPlayers" INTEGER NOT NULL,
    "nowInLobby" INTEGER NOT NULL,

    PRIMARY KEY ("creator", "id"),
    CONSTRAINT "lobbyBNB_creator_fkey" FOREIGN KEY ("creator") REFERENCES "user" ("address") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lobbyHistoryBNB" (
    "id" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "IERC20" TEXT NOT NULL,
    "players" TEXT NOT NULL,
    "winner" TEXT NOT NULL,
    "deposit" TEXT NOT NULL,
    "countOfPlayers" INTEGER NOT NULL,

    PRIMARY KEY ("creator", "id"),
    CONSTRAINT "lobbyHistoryBNB_creator_fkey" FOREIGN KEY ("creator") REFERENCES "user" ("address") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_address_key" ON "user"("address");
