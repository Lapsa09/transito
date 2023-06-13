-- AlterTable
ALTER TABLE "motos"."moto_motivo" RENAME CONSTRAINT "moto_motivo_pkey" TO "pk_moto_motivo";

-- AddForeignKey
ALTER TABLE "operativos"."operativos" ADD CONSTRAINT "operativos_id_localidad_fkey" FOREIGN KEY ("id_localidad") REFERENCES "public"."vicente_lopez"("id_barrio") ON DELETE NO ACTION ON UPDATE NO ACTION;
