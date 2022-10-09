-- CreateTable
CREATE TABLE "user" (
    "address" TEXT NOT NULL,
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
    "messageBNB" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("address")
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

    CONSTRAINT "lobbyETH_pkey" PRIMARY KEY ("creator","id")
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

    CONSTRAINT "lobbyHistoryETH_pkey" PRIMARY KEY ("creator","id")
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

    CONSTRAINT "lobbyBNB_pkey" PRIMARY KEY ("creator","id")
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

    CONSTRAINT "lobbyHistoryBNB_pkey" PRIMARY KEY ("creator","id")
);

-- CreateTable
CREATE TABLE "ETH1000" (
    "id" SERIAL NOT NULL,
    "isMinted" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "players" INTEGER,
    "price" DOUBLE PRECISION,

    CONSTRAINT "ETH1000_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BNB1000" (
    "id" SERIAL NOT NULL,
    "isMinted" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "players" INTEGER,
    "price" DOUBLE PRECISION,

    CONSTRAINT "BNB1000_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "address" TEXT NOT NULL,
    "chain" INTEGER NOT NULL,
    "isImageAdded" BOOLEAN NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL DEFAULT 18,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("address")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_address_key" ON "user"("address");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_address_key" ON "tokens"("address");
