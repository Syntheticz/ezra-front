/*
  Warnings:

  - Added the required column `userInputId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userInputId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userInputId_fkey" FOREIGN KEY ("userInputId") REFERENCES "UserInput"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
