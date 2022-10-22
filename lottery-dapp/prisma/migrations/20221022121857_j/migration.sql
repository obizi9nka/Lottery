/*
  Warnings:

  - You are about to drop the column `messageBNB` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `messageETH` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "messageBNB",
DROP COLUMN "messageETH";
