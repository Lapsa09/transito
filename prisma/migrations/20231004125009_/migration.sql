/*
  Warnings:

  - You are about to drop the column `interno` on the `kilometraje_vehiculos` table. All the data in the column will be lost.
  - You are about to drop the column `km/dia` on the `movil` table. All the data in the column will be lost.
  - Made the column `marca` on table `movil` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nro_movil` on table `movil` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modelo` on table `movil` required. This step will fail if there are existing NULL values in that column.
  - Made the column `año` on table `movil` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tipo_combustible` on table `movil` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id_uso` on table `movil` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tipo_motor` on table `movil` required. This step will fail if there are existing NULL values in that column.
  - Made the column `empresa_seguimiento` on table `movil` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plan_renovacion` on table `movil` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id_tipo_vehiculo` on table `movil` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id_dependencia` on table `movil` required. This step will fail if there are existing NULL values in that column.
  - Made the column `no_chasis` on table `movil` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "logistica"."movil" DROP CONSTRAINT "movil_id_dependencia_fkey";

-- DropForeignKey
ALTER TABLE "logistica"."movil" DROP CONSTRAINT "movil_id_tipo_vehiculo_fkey";

-- DropForeignKey
ALTER TABLE "logistica"."movil" DROP CONSTRAINT "movil_id_uso_fkey";

-- AlterTable
ALTER TABLE "logistica"."kilometraje_vehiculos" DROP COLUMN "interno";

-- AlterTable
ALTER TABLE "logistica"."movil" DROP COLUMN "km/dia",
ALTER COLUMN "marca" SET NOT NULL,
ALTER COLUMN "nro_movil" SET NOT NULL,
ALTER COLUMN "modelo" SET NOT NULL,
ALTER COLUMN "año" SET NOT NULL,
ALTER COLUMN "tipo_combustible" SET NOT NULL,
ALTER COLUMN "id_uso" SET NOT NULL,
ALTER COLUMN "tipo_motor" SET NOT NULL,
ALTER COLUMN "empresa_seguimiento" SET NOT NULL,
ALTER COLUMN "plan_renovacion" SET NOT NULL,
ALTER COLUMN "id_tipo_vehiculo" SET NOT NULL,
ALTER COLUMN "id_dependencia" SET NOT NULL,
ALTER COLUMN "no_chasis" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "logistica"."movil" ADD CONSTRAINT "movil_id_dependencia_fkey" FOREIGN KEY ("id_dependencia") REFERENCES "logistica"."dependencia"("id_dependencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistica"."movil" ADD CONSTRAINT "movil_id_tipo_vehiculo_fkey" FOREIGN KEY ("id_tipo_vehiculo") REFERENCES "logistica"."tipo_vehiculo"("id_tipo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistica"."movil" ADD CONSTRAINT "movil_id_uso_fkey" FOREIGN KEY ("id_uso") REFERENCES "logistica"."uso"("id_uso") ON DELETE RESTRICT ON UPDATE CASCADE;
