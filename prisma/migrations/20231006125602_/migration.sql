/*
  Warnings:

  - You are about to drop the column `stock` on the `repuesto` table. All the data in the column will be lost.
  - Added the required column `repuestoId` to the `pedido_repuesto` table without a default value. This is not possible if the table is not empty.
  - Made the column `item` on table `repuesto` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "logistica"."repuesto" DROP CONSTRAINT "fk_pedido";

-- DropForeignKey
ALTER TABLE "logistica"."repuesto" DROP CONSTRAINT "repuesto_id_fkey";

-- AlterTable
ALTER TABLE "logistica"."pedido_repuesto" ADD COLUMN     "repuestoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "logistica"."repuesto" DROP COLUMN "stock",
ALTER COLUMN "item" SET NOT NULL;

-- CreateTable
CREATE TABLE "logistica"."stock" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER DEFAULT 0,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "logistica"."pedido_repuesto" ADD CONSTRAINT "pedido_repuesto_repuestoId_fkey" FOREIGN KEY ("repuestoId") REFERENCES "logistica"."stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistica"."stock" ADD CONSTRAINT "fk_repuesto" FOREIGN KEY ("id") REFERENCES "logistica"."repuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistica"."stock" ADD CONSTRAINT "stock_id_fkey" FOREIGN KEY ("id") REFERENCES "logistica"."reparaciones"("articulo") ON DELETE RESTRICT ON UPDATE CASCADE;
