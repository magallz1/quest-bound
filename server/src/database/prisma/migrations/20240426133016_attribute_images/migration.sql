-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "PublishedAttribute" ADD COLUMN     "imageId" TEXT;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedAttribute" ADD CONSTRAINT "PublishedAttribute_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
