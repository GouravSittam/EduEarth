-- AlterTable
ALTER TABLE "public"."articles" ADD COLUMN     "ai_summary" TEXT,
ADD COLUMN     "image_url" TEXT,
ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

-- CreateIndex
CREATE INDEX "idx_articles_publish_date" ON "public"."articles"("publishDate");

-- CreateIndex
CREATE INDEX "idx_articles_section" ON "public"."articles"("section");

-- CreateIndex
CREATE INDEX "idx_articles_url" ON "public"."articles"("url");
