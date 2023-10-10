/*
  Warnings:

  - The `latitud` column on the `operativos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `longitud` column on the `operativos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `direccion_full` on the `registros` table. All the data in the column will be lost.
  - You are about to drop the column `latitud` on the `registros` table. All the data in the column will be lost.
  - You are about to drop the column `longitud` on the `registros` table. All the data in the column will be lost.
  - The `latitud` column on the `operativos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `longitud` column on the `operativos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `direccion_full` on the `registros` table. All the data in the column will be lost.
  - You are about to drop the column `latitud` on the `registros` table. All the data in the column will be lost.
  - You are about to drop the column `longitud` on the `registros` table. All the data in the column will be lost.
  - The `latitud` column on the `operativos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `longitud` column on the `operativos` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "camiones"."operativos" DROP CONSTRAINT "operativos_id_localidad_fkey";

-- DropForeignKey
ALTER TABLE "logistica"."movil" DROP CONSTRAINT "movil_id_uso_fkey";

-- DropForeignKey
ALTER TABLE "motos"."operativos" DROP CONSTRAINT "operativos_id_zona_fkey";

-- DropForeignKey
ALTER TABLE "motos"."registros" DROP CONSTRAINT "fk_licencia";

-- DropForeignKey
ALTER TABLE "motos"."registros" DROP CONSTRAINT "fk_zona_infractor";

-- DropForeignKey
ALTER TABLE "motos"."registros" DROP CONSTRAINT "registros_id_operativo_fkey";

-- DropForeignKey
ALTER TABLE "nuevo_control"."registros" DROP CONSTRAINT "fk_localidad";

-- DropForeignKey
ALTER TABLE "nuevo_control"."registros" DROP CONSTRAINT "registros_id_operativo_fkey";

-- DropForeignKey
ALTER TABLE "nuevo_control"."registros" DROP CONSTRAINT "registros_id_zona_fkey";

-- DropForeignKey
ALTER TABLE "public"."puntajes" DROP CONSTRAINT "puntajes_id_mes_fkey";

-- DropForeignKey
ALTER TABLE "public"."puntajes" DROP CONSTRAINT "puntajes_legajo_fkey";

-- DropForeignKey
ALTER TABLE "sueldos"."servicios" DROP CONSTRAINT "servicios_id_cliente_fkey";

-- AlterTable
ALTER TABLE "camiones"."operativos" ALTER COLUMN "latitud" TYPE REAL USING "latitud"::REAL,
ALTER COLUMN "longitud" TYPE REAL USING "longitud"::REAL;
;

-- AlterTable
ALTER TABLE "camiones"."registros" DROP COLUMN "direccion_full",
DROP COLUMN "latitud",
DROP COLUMN "longitud";

-- AlterTable
ALTER TABLE "logistica"."movil" ALTER COLUMN "tipo_combustible" DROP NOT NULL,
ALTER COLUMN "id_uso" DROP NOT NULL,
ALTER COLUMN "tipo_motor" DROP NOT NULL,
ALTER COLUMN "empresa_seguimiento" DROP NOT NULL,
ALTER COLUMN "plan_renovacion" SET DEFAULT false,
ALTER COLUMN "no_chasis" DROP NOT NULL,
ALTER COLUMN "no_chasis" SET DATA TYPE VARCHAR;

-- AlterTable
ALTER TABLE "motos"."moto_motivo" RENAME CONSTRAINT "moto_motivo_pkey" TO "pk_moto_motivo";

-- AlterTable
ALTER TABLE "motos"."operativos" ALTER COLUMN "latitud" TYPE REAL USING "latitud"::REAL,
ALTER COLUMN "longitud" TYPE REAL USING "longitud"::REAL;
;

-- AlterTable
ALTER TABLE "motos"."registros" DROP COLUMN "direccion_full",
DROP COLUMN "latitud",
DROP COLUMN "longitud";

-- AlterTable
ALTER TABLE "operativos"."operativos" ALTER COLUMN "latitud" TYPE REAL USING "latitud"::REAL,
ALTER COLUMN "longitud" TYPE REAL USING "longitud"::REAL;

-- AddForeignKey
ALTER TABLE "camiones"."operativos" ADD CONSTRAINT "operativos_id_localidad_fkey" FOREIGN KEY ("id_localidad") REFERENCES "public"."vicente_lopez"("id_barrio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "motos"."operativos" ADD CONSTRAINT "operativos_id_zona_fkey" FOREIGN KEY ("id_zona") REFERENCES "public"."vicente_lopez"("id_barrio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "motos"."registros" ADD CONSTRAINT "fk_licencia" FOREIGN KEY ("id_licencia") REFERENCES "public"."tipo_licencias"("id_tipo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "motos"."registros" ADD CONSTRAINT "fk_zona_infractor" FOREIGN KEY ("id_zona_infractor") REFERENCES "public"."barrios"("id_barrio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "motos"."registros" ADD CONSTRAINT "registros_id_operativo_fkey" FOREIGN KEY ("id_operativo") REFERENCES "motos"."operativos"("id_op") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nuevo_control"."registros" ADD CONSTRAINT "fk_localidad" FOREIGN KEY ("id_localidad") REFERENCES "public"."barrios"("id_barrio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nuevo_control"."registros" ADD CONSTRAINT "registros_id_operativo_fkey" FOREIGN KEY ("id_operativo") REFERENCES "nuevo_control"."operativos"("id_op") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nuevo_control"."registros" ADD CONSTRAINT "registros_id_zona_fkey" FOREIGN KEY ("id_zona") REFERENCES "nuevo_control"."zonas"("id_zona") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."puntajes" ADD CONSTRAINT "puntajes_id_mes_fkey" FOREIGN KEY ("id_mes") REFERENCES "public"."mensual"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."puntajes" ADD CONSTRAINT "puntajes_legajo_fkey" FOREIGN KEY ("legajo") REFERENCES "public"."operario"("legajo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sueldos"."servicios" ADD CONSTRAINT "servicios_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "sueldos"."clientes"("id_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logistica"."movil" ADD CONSTRAINT "movil_id_uso_fkey" FOREIGN KEY ("id_uso") REFERENCES "logistica"."uso"("id_uso") ON DELETE SET NULL ON UPDATE CASCADE;
