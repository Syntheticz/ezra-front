/*
  Warnings:

  - You are about to drop the column `userInputId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserInput` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userInputId_fkey";

-- DropIndex
DROP INDEX "User_userInputId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userInputId";

-- AlterTable
ALTER TABLE "UserInput" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "UserInput_userId_key" ON "UserInput"("userId");

-- AddForeignKey
ALTER TABLE "UserInput" ADD CONSTRAINT "UserInput_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
