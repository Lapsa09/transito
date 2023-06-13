-- AddForeignKey
ALTER TABLE "camiones"."operativos" ADD CONSTRAINT "operativos_id_localidad_fkey" FOREIGN KEY ("id_localidad") REFERENCES "public"."vicente_lopez"("id_barrio") ON DELETE NO ACTION ON UPDATE NO ACTION;
