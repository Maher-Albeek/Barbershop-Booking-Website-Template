-- AlterTable
ALTER TABLE `offer` ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `price` DOUBLE NULL;

-- AlterTable
ALTER TABLE `service` ADD COLUMN `durationMinutes` INTEGER NULL,
    ADD COLUMN `price` DOUBLE NULL;
