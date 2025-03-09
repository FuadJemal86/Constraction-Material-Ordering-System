/*
  Warnings:

  - You are about to drop the column `paymentId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `payment` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankId` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `paymentId`,
    ADD COLUMN `addressId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `payment` DROP COLUMN `method`,
    ADD COLUMN `bankId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bank` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplierId` INTEGER NOT NULL,
    `bankName` VARCHAR(191) NOT NULL,
    `account` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bank` ADD CONSTRAINT `bank_supplierId` FOREIGN KEY (`supplierId`) REFERENCES `supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_address` FOREIGN KEY (`addressId`) REFERENCES `address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `Payment_bankId_fkey` FOREIGN KEY (`bankId`) REFERENCES `bank`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
