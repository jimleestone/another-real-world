-- AlterTable
ALTER TABLE `blog_article` MODIFY `body` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `blog_comment` MODIFY `body` VARCHAR(1024) NOT NULL;
