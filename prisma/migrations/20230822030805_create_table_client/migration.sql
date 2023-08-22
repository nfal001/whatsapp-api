-- CreateTable
CREATE TABLE `clients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_name` VARCHAR(100) NOT NULL,
    `qr_code` TEXT NULL,
    `state` VARCHAR(20) NULL,
    `foward` TINYINT NOT NULL DEFAULT 0,
    `username` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE InnoDB;

-- AddForeignKey
ALTER TABLE `clients` ADD CONSTRAINT `clients_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
