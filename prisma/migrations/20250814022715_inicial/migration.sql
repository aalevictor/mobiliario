-- CreateEnum
CREATE TYPE "public"."Permissao" AS ENUM ('DEV', 'PARTICIPANTE', 'TOTAL', 'LICITACAO', 'JULGADORA');

-- CreateEnum
CREATE TYPE "public"."Tipo_Usuario" AS ENUM ('INTERNO', 'EXTERNO');

-- CreateEnum
CREATE TYPE "public"."Tipo_Carteira" AS ENUM ('CAU', 'CREA');

-- CreateEnum
CREATE TYPE "public"."TipoArquivo" AS ENUM ('DOC_ESPECIFICA', 'PROJETOS');

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "login" TEXT,
    "permissao" "public"."Permissao" NOT NULL,
    "senha" TEXT,
    "tipo" "public"."Tipo_Usuario" NOT NULL DEFAULT 'INTERNO',
    "status" BOOLEAN NOT NULL DEFAULT true,
    "alterarSenha" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cadastroId" INTEGER NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cadastros" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "cep" VARCHAR(9) NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "cidade" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT,
    "complemento" TEXT,
    "protocolo" TEXT,
    "carteira_tipo" "public"."Tipo_Carteira" NOT NULL DEFAULT 'CAU',
    "carteira_numero" TEXT NOT NULL,
    "equipe" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cadastros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."participantes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "cadastroId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."arquivos" (
    "id" TEXT NOT NULL,
    "caminho" TEXT NOT NULL,
    "tipo" "public"."TipoArquivo" NOT NULL,
    "cadastroId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arquivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."duvidas" (
    "id" TEXT NOT NULL,
    "pergunta" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "resposta" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "duvidas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_login_key" ON "public"."usuarios"("login");

-- CreateIndex
CREATE UNIQUE INDEX "cadastros_cnpj_key" ON "public"."cadastros"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "cadastros_cpf_key" ON "public"."cadastros"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "cadastros_protocolo_key" ON "public"."cadastros"("protocolo");

-- CreateIndex
CREATE UNIQUE INDEX "cadastros_usuarioId_key" ON "public"."cadastros"("usuarioId");

-- AddForeignKey
ALTER TABLE "public"."cadastros" ADD CONSTRAINT "cadastros_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."participantes" ADD CONSTRAINT "participantes_cadastroId_fkey" FOREIGN KEY ("cadastroId") REFERENCES "public"."cadastros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."arquivos" ADD CONSTRAINT "arquivos_cadastroId_fkey" FOREIGN KEY ("cadastroId") REFERENCES "public"."cadastros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
