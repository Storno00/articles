-- CreateTable
CREATE TABLE "ArticleImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "articleId" TEXT,

    CONSTRAINT "ArticleImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArticleImage" ADD CONSTRAINT "ArticleImage_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
