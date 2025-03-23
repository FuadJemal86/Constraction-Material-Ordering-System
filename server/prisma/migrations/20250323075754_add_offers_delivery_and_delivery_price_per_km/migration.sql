-- AlterTable
ALTER TABLE `product` ADD COLUMN `deliveryPricePerKm` DOUBLE NULL,
    ADD COLUMN `offersDelivery` BOOLEAN NOT NULL DEFAULT false;
