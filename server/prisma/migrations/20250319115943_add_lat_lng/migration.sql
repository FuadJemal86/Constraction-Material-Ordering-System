/*
  Warnings:

  - Added the required column `lat` to the `supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `supplier` ADD COLUMN `lat` DOUBLE NOT NULL,
    ADD COLUMN `lng` DOUBLE NOT NULL;
