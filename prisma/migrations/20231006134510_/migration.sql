-- DropForeignKey
ALTER TABLE "logistica"."pedido_repuesto" DROP CONSTRAINT "pedido_repuesto_repuestoId_fkey";

-- AddForeignKey
ALTER TABLE "logistica"."pedido_repuesto" ADD CONSTRAINT "pedido_repuesto_repuestoId_fkey" FOREIGN KEY ("repuestoId") REFERENCES "logistica"."repuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
