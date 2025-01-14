-- CreateTable
CREATE TABLE "QualificationCategory" (
    "id" TEXT NOT NULL,
    "qualificationId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "QualificationCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QualificationCategory" ADD CONSTRAINT "QualificationCategory_qualificationId_fkey" FOREIGN KEY ("qualificationId") REFERENCES "Qualification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualificationCategory" ADD CONSTRAINT "QualificationCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
