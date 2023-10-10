/*
  Warnings:

  - You are about to drop the column `cantidad` on the `pedido_repuesto` table. All the data in the column will be lost.
  - You are about to drop the column `repuestoId` on the `pedido_repuesto` table. All the data in the column will be lost.
  - You are about to drop the column `cantidad` on the `repuesto` table. All the data in the column will be lost.
  - Made the column `patente` on table `reparaciones` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id_pedido` to the `repuesto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "logistica"."pedido_repuesto" DROP CONSTRAINT "pedido_repuesto_repuestoId_fkey";

-- DropForeignKey
ALTER TABLE "logistica"."reparaciones" DROP CONSTRAINT "reparaciones_patente_fkey";

-- AlterTable
ALTER TABLE "logistica"."pedido_repuesto" DROP COLUMN "cantidad",
DROP COLUMN "repuestoId";

-- AlterTable
ALTER TABLE "logistica"."reparaciones" ALTER COLUMN "patente" SET NOT NULL;

-- AlterTable
ALTER TABLE "logistica"."repuesto" DROP COLUMN "cantidad",
ADD COLUMN     "id_pedido" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "logistica"."reparaciones" ADD CONSTRAINT "reparaciones_patente_fkey" FOREIGN KEY ("patente") REFERENCES "logistica"."movil"("patente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistica"."repuesto" ADD CONSTRAINT "repuesto_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "logistica"."pedido_repuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
