-- DropForeignKey
ALTER TABLE "_CharacterArchetypes" DROP CONSTRAINT "_CharacterArchetypes_A_fkey";

-- DropForeignKey
ALTER TABLE "_CharacterArchetypes" DROP CONSTRAINT "_CharacterArchetypes_B_fkey";

-- AddForeignKey
ALTER TABLE "_CharacterArchetypes" ADD CONSTRAINT "_CharacterArchetypes_A_fkey" FOREIGN KEY ("A") REFERENCES "Archetype"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterArchetypes" ADD CONSTRAINT "_CharacterArchetypes_B_fkey" FOREIGN KEY ("B") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
