/*
  Warnings:

  - You are about to drop the column `favorites_count` on the `blog_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `blog_article` ADD COLUMN `favorites_count` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `blog_user` DROP COLUMN `favorites_count`;
