-- CreateTable
CREATE TABLE "ETH1000" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isMinted" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT
);

-- CreateTable
CREATE TABLE "BNB1000" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isMinted" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT
);
