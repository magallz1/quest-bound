/*
  Warnings:

  - You are about to drop the `PublishedSheetImages` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[imageId]` on the table `PublishedRuleset` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageId]` on the table `PublishedSheet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PublishedSheetImages" DROP CONSTRAINT "PublishedSheetImages_imageId_fkey";

-- DropForeignKey
ALTER TABLE "PublishedSheetImages" DROP CONSTRAINT "PublishedSheetImages_sheetId_fkey";

-- AlterTable
ALTER TABLE "PublishedRuleset" ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "PublishedSheet" ADD COLUMN     "imageId" TEXT;

-- DropTable
DROP TABLE "PublishedSheetImages";

-- CreateIndex
CREATE UNIQUE INDEX "PublishedRuleset_imageId_key" ON "PublishedRuleset"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "PublishedSheet_imageId_key" ON "PublishedSheet"("imageId");

-- AddForeignKey
ALTER TABLE "PublishedRuleset" ADD CONSTRAINT "PublishedRuleset_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedSheet" ADD CONSTRAINT "PublishedSheet_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
