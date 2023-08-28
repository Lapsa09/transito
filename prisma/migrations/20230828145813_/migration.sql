/*
  Warnings:

  - Made the column `acopio` on table `recibos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "sueldos"."recibos" ALTER COLUMN "acopio" SET NOT NULL;
