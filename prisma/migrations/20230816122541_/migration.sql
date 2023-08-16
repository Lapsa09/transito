/*
  Warnings:

  - You are about to drop the column `legajo_carga` on the `registros` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "camiones"."registros" DROP COLUMN "legajo_carga",
ADD COLUMN     "lpcarga" INTEGER;
