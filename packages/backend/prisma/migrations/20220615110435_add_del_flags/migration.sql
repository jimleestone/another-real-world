-- AlterTable
ALTER TABLE `blog_article` ADD COLUMN `del` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `blog_comment` ADD COLUMN `del` BOOLEAN NOT NULL DEFAULT false;
