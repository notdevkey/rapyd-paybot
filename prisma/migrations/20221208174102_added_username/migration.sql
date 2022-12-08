/*
  Warnings:

  - Added the required column `username` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "username" TEXT NOT NULL;
