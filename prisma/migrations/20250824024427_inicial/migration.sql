-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `login` VARCHAR(191) NULL,
    `permissao` ENUM('DEV', 'PARTICIPANTE', 'ADMIN', 'LICITACAO', 'JULGADORA') NOT NULL,
    `senha` VARCHAR(191) NULL,
    `tipo` ENUM('INTERNO', 'EXTERNO') NOT NULL DEFAULT 'INTERNO',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `alterarSenha` BOOLEAN NOT NULL DEFAULT false,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuarios_email_key`(`email`),
    UNIQUE INDEX `usuarios_login_key`(`login`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cadastros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(9) NOT NULL,
    `uf` VARCHAR(2) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `logradouro` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NULL,
    `complemento` VARCHAR(191) NULL,
    `protocolo` VARCHAR(191) NULL,
    `carteira_tipo` ENUM('CAU', 'CREA') NOT NULL DEFAULT 'CAU',
    `carteira_numero` VARCHAR(191) NOT NULL,
    `equipe` BOOLEAN NOT NULL DEFAULT false,
    `usuarioId` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `cadastros_cnpj_key`(`cnpj`),
    UNIQUE INDEX `cadastros_cpf_key`(`cpf`),
    UNIQUE INDEX `cadastros_protocolo_key`(`protocolo`),
    UNIQUE INDEX `cadastros_usuarioId_key`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `participantes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `documento` VARCHAR(191) NOT NULL,
    `cadastroId` INTEGER NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacoes_licitadoras` (
    `id` VARCHAR(191) NOT NULL,
    `cadastroId` INTEGER NOT NULL,
    `avaliadorId` VARCHAR(191) NOT NULL,
    `parecer` VARCHAR(191) NULL,
    `aprovado` BOOLEAN NOT NULL DEFAULT false,
    `observacoes` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `avaliacoes_licitadoras_cadastroId_key`(`cadastroId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacoes_julgadoras` (
    `id` VARCHAR(191) NOT NULL,
    `cadastroId` INTEGER NOT NULL,
    `avaliadorId` VARCHAR(191) NOT NULL,
    `parecer` VARCHAR(191) NULL,
    `aprovado` BOOLEAN NOT NULL DEFAULT false,
    `observacoes` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `avaliacoes_julgadoras_cadastroId_avaliadorId_key`(`cadastroId`, `avaliadorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `arquivos` (
    `id` VARCHAR(191) NOT NULL,
    `caminho` VARCHAR(191) NOT NULL,
    `tipo` ENUM('DOC_ESPECIFICA', 'PROJETOS') NOT NULL,
    `cadastroId` INTEGER NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tamanho` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `duvidas` (
    `id` VARCHAR(191) NOT NULL,
    `pergunta` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `resposta` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs_auditoria` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` ENUM('DATABASE_OPERATION', 'ERROR', 'AUTH', 'API_REQUEST', 'SYSTEM') NOT NULL,
    `nivel` ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL') NOT NULL,
    `operacao` VARCHAR(191) NULL,
    `tabela` VARCHAR(191) NULL,
    `registroId` VARCHAR(191) NULL,
    `dadosAntes` JSON NULL,
    `dadosDepois` JSON NULL,
    `usuario` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `erro` VARCHAR(191) NULL,
    `stackTrace` VARCHAR(191) NULL,
    `duracao` INTEGER NULL,
    `endpoint` VARCHAR(191) NULL,
    `metodo` VARCHAR(191) NULL,
    `headers` JSON NULL,
    `query` VARCHAR(191) NULL,
    `emailEnviado` BOOLEAN NOT NULL DEFAULT false,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `logs_auditoria_tipo_idx`(`tipo`),
    INDEX `logs_auditoria_nivel_idx`(`nivel`),
    INDEX `logs_auditoria_criadoEm_idx`(`criadoEm`),
    INDEX `logs_auditoria_usuario_idx`(`usuario`),
    INDEX `logs_auditoria_tabela_idx`(`tabela`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cadastros` ADD CONSTRAINT `cadastros_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participantes` ADD CONSTRAINT `participantes_cadastroId_fkey` FOREIGN KEY (`cadastroId`) REFERENCES `cadastros`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes_licitadoras` ADD CONSTRAINT `avaliacoes_licitadoras_avaliadorId_fkey` FOREIGN KEY (`avaliadorId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes_licitadoras` ADD CONSTRAINT `avaliacoes_licitadoras_cadastroId_fkey` FOREIGN KEY (`cadastroId`) REFERENCES `cadastros`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes_julgadoras` ADD CONSTRAINT `avaliacoes_julgadoras_avaliadorId_fkey` FOREIGN KEY (`avaliadorId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes_julgadoras` ADD CONSTRAINT `avaliacoes_julgadoras_cadastroId_fkey` FOREIGN KEY (`cadastroId`) REFERENCES `cadastros`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `arquivos` ADD CONSTRAINT `arquivos_cadastroId_fkey` FOREIGN KEY (`cadastroId`) REFERENCES `cadastros`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
