/*
  Warnings:

  - You are about to drop the column `refreshExpiresAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tokenExpiresAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "refreshExpiresAt",
DROP COLUMN "tokenExpiresAt";
