/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the `ArticleImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArticleImage" DROP CONSTRAINT "ArticleImage_articleId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "coverUrl",
ADD COLUMN     "coverImageId" TEXT,
ADD COLUMN     "coverImageUrl" TEXT;

-- DropTable
DROP TABLE "ArticleImage";

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "articleId" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
