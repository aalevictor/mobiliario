/*
  Warnings:

  - You are about to drop the column `equipe` on the `cadastros` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cadastros` DROP COLUMN `equipe`;

-- AlterTable
ALTER TABLE `logs_auditoria` MODIFY `erro` TEXT NULL,
    MODIFY `stackTrace` TEXT NULL,
    MODIFY `query` TEXT NULL;

-- CreateTable
CREATE TABLE `informes` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `subtitulo` VARCHAR(191) NULL,
    `conteudo` TEXT NOT NULL,
    `dataPublicacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `publicado` BOOLEAN NOT NULL DEFAULT false,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `links` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `informeId` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `arquivos_informes` (
    `id` VARCHAR(191) NOT NULL,
    `caminho` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `informeId` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `links` ADD CONSTRAINT `links_informeId_fkey` FOREIGN KEY (`informeId`) REFERENCES `informes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `arquivos_informes` ADD CONSTRAINT `arquivos_informes_informeId_fkey` FOREIGN KEY (`informeId`) REFERENCES `informes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
