/*
  Warnings:

  - You are about to drop the column `industryField` on the `Job` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_qualificationId_fkey";

-- DropForeignKey
ALTER TABLE "PossibleCredential" DROP CONSTRAINT "PossibleCredential_qualificationId_fkey";

-- DropForeignKey
ALTER TABLE "PriorityCategory" DROP CONSTRAINT "PriorityCategory_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Qualification" DROP CONSTRAINT "Qualification_jobId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "industryField";

-- CreateTable
CREATE TABLE "IndustryField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "IndustryField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInput" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "userInputId" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userInputId" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userInputId" TEXT NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userInputId" TEXT NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IndustryField" ADD CONSTRAINT "IndustryField_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qualification" ADD CONSTRAINT "Qualification_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriorityCategory" ADD CONSTRAINT "PriorityCategory_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PossibleCredential" ADD CONSTRAINT "PossibleCredential_qualificationId_fkey" FOREIGN KEY ("qualificationId") REFERENCES "Qualification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_qualificationId_fkey" FOREIGN KEY ("qualificationId") REFERENCES "Qualification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_userInputId_fkey" FOREIGN KEY ("userInputId") REFERENCES "UserInput"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_userInputId_fkey" FOREIGN KEY ("userInputId") REFERENCES "UserInput"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_userInputId_fkey" FOREIGN KEY ("userInputId") REFERENCES "UserInput"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_userInputId_fkey" FOREIGN KEY ("userInputId") REFERENCES "UserInput"("id") ON DELETE CASCADE ON UPDATE CASCADE;
