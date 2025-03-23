/*
  Warnings:

  - Added the required column `productId` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `productId` INTEGER NOT NULL,
    ADD COLUMN `transactionId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `unit` VARCHAR(191) NOT NULL DEFAULT 'piece';

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_productId_fkey` FOREIGN KEY (`customerId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
