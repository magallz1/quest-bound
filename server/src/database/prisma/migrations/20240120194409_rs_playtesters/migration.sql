-- CreateTable
CREATE TABLE "PlayTester" (
    "id" TEXT NOT NULL,
    "rulesetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PlayTester_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlayTester" ADD CONSTRAINT "PlayTester_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayTester" ADD CONSTRAINT "PlayTester_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
