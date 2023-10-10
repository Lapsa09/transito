-- DropForeignKey
ALTER TABLE "logistica"."repuesto" DROP CONSTRAINT "repuesto_id_fkey";

-- AddForeignKey
ALTER TABLE "logistica"."reparaciones" ADD CONSTRAINT "reparaciones_articulo_fkey" FOREIGN KEY ("articulo") REFERENCES "logistica"."repuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
