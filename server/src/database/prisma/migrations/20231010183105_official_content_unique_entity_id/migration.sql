/*
  Warnings:

  - A unique constraint covering the columns `[entityId]` on the table `OfficialContent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OfficialContent_entityId_key" ON "OfficialContent"("entityId");
