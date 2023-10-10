/*
  Warnings:

  - You are about to drop the `stock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "logistica"."pedido_repuesto" DROP CONSTRAINT "pedido_repuesto_repuestoId_fkey";

-- DropForeignKey
ALTER TABLE "logistica"."stock" DROP CONSTRAINT "fk_repuesto";

-- AlterTable
ALTER TABLE "logistica"."repuesto" ADD COLUMN     "cantidad" INTEGER DEFAULT 0;

-- DropTable
DROP TABLE "logistica"."stock";

-- AddForeignKey
ALTER TABLE "logistica"."pedido_repuesto" ADD CONSTRAINT "pedido_repuesto_repuestoId_fkey" FOREIGN KEY ("repuestoId") REFERENCES "logistica"."repuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
