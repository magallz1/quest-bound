/*
  Warnings:

  - You are about to drop the `_ImageToPublishedSheetComponent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ImageToPublishedSheetComponent" DROP CONSTRAINT "_ImageToPublishedSheetComponent_A_fkey";

-- DropForeignKey
ALTER TABLE "_ImageToPublishedSheetComponent" DROP CONSTRAINT "_ImageToPublishedSheetComponent_B_fkey";

-- DropTable
DROP TABLE "_ImageToPublishedSheetComponent";

-- CreateTable
CREATE TABLE "PublishedComponentImages" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "PublishedComponentImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PublishedComponentImages" ADD CONSTRAINT "PublishedComponentImages_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "PublishedSheetComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedComponentImages" ADD CONSTRAINT "PublishedComponentImages_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
