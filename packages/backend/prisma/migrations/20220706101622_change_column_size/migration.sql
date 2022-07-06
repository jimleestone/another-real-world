-- AlterTable
ALTER TABLE `blog_article` MODIFY `description` VARCHAR(300) NOT NULL;

-- AlterTable
ALTER TABLE `blog_user` MODIFY `bio` VARCHAR(300) NULL,
    MODIFY `image` VARCHAR(1024) NULL;
