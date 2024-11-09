-- AlterTable
ALTER TABLE "Archetype" ADD COLUMN     "imageId" TEXT;

-- AddForeignKey
ALTER TABLE "Archetype" ADD CONSTRAINT "Archetype_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
