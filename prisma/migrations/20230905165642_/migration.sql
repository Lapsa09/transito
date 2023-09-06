/*
  Warnings:

  - The `turno` column on the `operativos` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "operativos"."operativos" DROP COLUMN "turno",
ADD COLUMN     "turno" "public"."turnos_old";
