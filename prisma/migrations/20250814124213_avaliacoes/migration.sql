-- CreateTable
CREATE TABLE "public"."avaliacoes_licitadoras" (
    "id" TEXT NOT NULL,
    "cadastroId" INTEGER NOT NULL,
    "avaliadorId" TEXT NOT NULL,
    "parecer" TEXT,
    "aprovado" BOOLEAN NOT NULL DEFAULT false,
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avaliacoes_licitadoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."avaliacoes_julgadoras" (
    "id" TEXT NOT NULL,
    "cadastroId" INTEGER NOT NULL,
    "avaliadorId" TEXT NOT NULL,
    "parecer" TEXT,
    "aprovado" BOOLEAN NOT NULL DEFAULT false,
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avaliacoes_julgadoras_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_licitadoras_cadastroId_key" ON "public"."avaliacoes_licitadoras"("cadastroId");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_julgadoras_cadastroId_avaliadorId_key" ON "public"."avaliacoes_julgadoras"("cadastroId", "avaliadorId");

-- AddForeignKey
ALTER TABLE "public"."avaliacoes_licitadoras" ADD CONSTRAINT "avaliacoes_licitadoras_cadastroId_fkey" FOREIGN KEY ("cadastroId") REFERENCES "public"."cadastros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avaliacoes_licitadoras" ADD CONSTRAINT "avaliacoes_licitadoras_avaliadorId_fkey" FOREIGN KEY ("avaliadorId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avaliacoes_julgadoras" ADD CONSTRAINT "avaliacoes_julgadoras_cadastroId_fkey" FOREIGN KEY ("cadastroId") REFERENCES "public"."cadastros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avaliacoes_julgadoras" ADD CONSTRAINT "avaliacoes_julgadoras_avaliadorId_fkey" FOREIGN KEY ("avaliadorId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
