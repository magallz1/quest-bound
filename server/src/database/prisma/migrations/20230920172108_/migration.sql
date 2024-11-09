/*
  Warnings:

  - Added the required column `userId` to the `PublishedRuleset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `PublishedRuleset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PublishedRuleset" ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;
