/*
  Warnings:

  - You are about to drop the column `userId` on the `Sheet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sheet" DROP CONSTRAINT "Sheet_userId_fkey";

-- AlterTable
ALTER TABLE "Character" ALTER COLUMN "attributeData" SET DEFAULT '[]';

-- AlterTable
ALTER TABLE "PublishedSheet" ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "Sheet" DROP COLUMN "userId",
ADD COLUMN     "createdBy" TEXT;
