-- AlterTable
ALTER TABLE "public"."Flashcard" ADD COLUMN     "lastReviewed" TIMESTAMP(3),
ADD COLUMN     "nextReview" TIMESTAMP(3),
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0;
