/*
  Warnings:

  - Added the required column `amount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balance` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "balance" INTEGER NOT NULL;
