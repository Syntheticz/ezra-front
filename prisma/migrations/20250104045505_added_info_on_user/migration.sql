/*
  Warnings:

  - You are about to drop the column `name` on the `PriorityCategory` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `PriorityCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobId` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `UserInput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `UserInput` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PriorityCategory" DROP COLUMN "name",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "jobId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserInput" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT;

-- AddForeignKey
ALTER TABLE "PriorityCategory" ADD CONSTRAINT "PriorityCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
