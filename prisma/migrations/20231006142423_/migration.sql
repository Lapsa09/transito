/*
  Warnings:

  - Made the column `orden_compra` on table `pedido_repuesto` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "logistica"."pedido_repuesto" ALTER COLUMN "orden_compra" SET NOT NULL;
