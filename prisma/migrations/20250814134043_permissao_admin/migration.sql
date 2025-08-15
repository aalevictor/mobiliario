/*
  Warnings:

  - The values [TOTAL] on the enum `Permissao` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Permissao_new" AS ENUM ('DEV', 'PARTICIPANTE', 'ADMIN', 'LICITACAO', 'JULGADORA');
ALTER TABLE "public"."usuarios" ALTER COLUMN "permissao" TYPE "public"."Permissao_new" USING ("permissao"::text::"public"."Permissao_new");
ALTER TYPE "public"."Permissao" RENAME TO "Permissao_old";
ALTER TYPE "public"."Permissao_new" RENAME TO "Permissao";
DROP TYPE "public"."Permissao_old";
COMMIT;
