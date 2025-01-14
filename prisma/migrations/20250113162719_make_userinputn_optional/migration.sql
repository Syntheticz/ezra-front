-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userInputId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userInputId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userInputId_fkey" FOREIGN KEY ("userInputId") REFERENCES "UserInput"("id") ON DELETE SET NULL ON UPDATE CASCADE;
