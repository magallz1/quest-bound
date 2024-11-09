-- AlterTable
ALTER TABLE "Archetype" ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "Archetype" ADD CONSTRAINT "Archetype_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Archetype"("id") ON DELETE SET NULL ON UPDATE CASCADE;
