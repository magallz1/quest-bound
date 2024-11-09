/*
  Warnings:

  - You are about to drop the column `sortIndex` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "sortIndex",
ADD COLUMN     "sortParentId" TEXT;
