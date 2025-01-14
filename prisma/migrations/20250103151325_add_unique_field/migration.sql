/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `IndustryField` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postedDate` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "description" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "postedDate" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "userInputId" TEXT NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IndustryField_name_key" ON "IndustryField"("name");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userInputId_fkey" FOREIGN KEY ("userInputId") REFERENCES "UserInput"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
