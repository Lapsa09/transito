/*
  Warnings:

  - The `graduacion_alcoholica` column on the `registros` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `operarios_servicios` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "operativos"."registros" DROP COLUMN "graduacion_alcoholica",
ADD COLUMN     "graduacion_alcoholica" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "sueldos"."operarios_servicios" DROP CONSTRAINT "operarios_servicios_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "legajo" DROP NOT NULL,
ADD CONSTRAINT "operarios_servicios_pkey" PRIMARY KEY ("id");
