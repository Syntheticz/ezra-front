/*
  Warnings:

  - You are about to drop the column `qualificationId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_qualificationId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "qualificationId";

-- CreateTable
CREATE TABLE "_CategoryToQualification" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToQualification_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToQualification_B_index" ON "_CategoryToQualification"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToQualification" ADD CONSTRAINT "_CategoryToQualification_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToQualification" ADD CONSTRAINT "_CategoryToQualification_B_fkey" FOREIGN KEY ("B") REFERENCES "Qualification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
