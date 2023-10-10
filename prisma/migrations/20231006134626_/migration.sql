-- DropForeignKey
ALTER TABLE "logistica"."stock" DROP CONSTRAINT "stock_id_fkey";

-- AddForeignKey
ALTER TABLE "logistica"."repuesto" ADD CONSTRAINT "repuesto_id_fkey" FOREIGN KEY ("id") REFERENCES "logistica"."reparaciones"("articulo") ON DELETE RESTRICT ON UPDATE CASCADE;
