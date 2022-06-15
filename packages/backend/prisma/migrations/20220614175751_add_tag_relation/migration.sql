-- AlterTable
ALTER TABLE `blog_tag` ADD COLUMN `articleId` INTEGER NULL;

-- CreateTable
CREATE TABLE `_ArticleTags` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ArticleTags_AB_unique`(`A`, `B`),
    INDEX `_ArticleTags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `blog_tag` ADD CONSTRAINT `blog_tag_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `blog_article`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ArticleTags` ADD CONSTRAINT `_ArticleTags_A_fkey` FOREIGN KEY (`A`) REFERENCES `blog_article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ArticleTags` ADD CONSTRAINT `_ArticleTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `blog_tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
