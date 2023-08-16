/*
  Warnings:

  - Made the column `barrio` on table `barrios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `motivo` on table `motivos` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `url` to the `permisos` table without a default value. This is not possible if the table is not empty.
  - Made the column `permiso` on table `permisos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `barrio` on table `vicente_lopez` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cp` on table `vicente_lopez` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."barrios" ALTER COLUMN "barrio" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."motivos" ALTER COLUMN "motivo" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."permisos" ADD COLUMN     "url" VARCHAR NOT NULL,
ALTER COLUMN "permiso" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."vicente_lopez" ALTER COLUMN "barrio" SET NOT NULL,
ALTER COLUMN "cp" SET NOT NULL;
