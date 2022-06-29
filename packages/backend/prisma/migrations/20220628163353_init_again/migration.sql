/*
  Warnings:

  - You are about to drop the column `articleId` on the `blog_tag` table. All the data in the column will be lost.
  - You are about to drop the `_ArticleTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserFavorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserFollows` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `password` on table `blog_user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `blog_user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `_ArticleTags` DROP FOREIGN KEY `_ArticleTags_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ArticleTags` DROP FOREIGN KEY `_ArticleTags_B_fkey`;

-- DropForeignKey
ALTER TABLE `_UserFavorites` DROP FOREIGN KEY `_UserFavorites_A_fkey`;

-- DropForeignKey
ALTER TABLE `_UserFavorites` DROP FOREIGN KEY `_UserFavorites_B_fkey`;

-- DropForeignKey
ALTER TABLE `_UserFollows` DROP FOREIGN KEY `_UserFollows_A_fkey`;

-- DropForeignKey
ALTER TABLE `_UserFollows` DROP FOREIGN KEY `_UserFollows_B_fkey`;

-- DropForeignKey
ALTER TABLE `blog_tag` DROP FOREIGN KEY `blog_tag_articleId_fkey`;

-- AlterTable
ALTER TABLE `blog_tag` DROP COLUMN `articleId`;

-- AlterTable
ALTER TABLE `blog_user` MODIFY `password` VARCHAR(191) NOT NULL,
    MODIFY `username` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_ArticleTags`;

-- DropTable
DROP TABLE `_UserFavorites`;

-- DropTable
DROP TABLE `_UserFollows`;

-- CreateTable
CREATE TABLE `blog_follows` (
    `follower_id` INTEGER NOT NULL,
    `following_id` INTEGER NOT NULL,

    PRIMARY KEY (`follower_id`, `following_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_favorites` (
    `article_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`article_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_articles_tags` (
    `article_id` INTEGER NOT NULL,
    `tag_id` INTEGER NOT NULL,

    PRIMARY KEY (`article_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `blog_follows` ADD CONSTRAINT `blog_follows_follower_id_fkey` FOREIGN KEY (`follower_id`) REFERENCES `blog_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_follows` ADD CONSTRAINT `blog_follows_following_id_fkey` FOREIGN KEY (`following_id`) REFERENCES `blog_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_favorites` ADD CONSTRAINT `blog_favorites_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `blog_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_favorites` ADD CONSTRAINT `blog_favorites_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `blog_article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_articles_tags` ADD CONSTRAINT `blog_articles_tags_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `blog_article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_articles_tags` ADD CONSTRAINT `blog_articles_tags_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `blog_tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
