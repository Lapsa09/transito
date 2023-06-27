/*
  Warnings:

  - You are about to alter the column `legajo_carga` on the `registros` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `legajo_a_cargo` on the `operativos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `legajo_planilla` on the `operativos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `licencia` on the `registros` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `acta` on the `registros` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `lpcarga` on the `registros` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `lp` on the `operativos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `lpcarga` on the `registros` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `legajo_a_cargo` on the `operativos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `legajo_planilla` on the `operativos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `licencia` on the `registros` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `acta` on the `registros` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `lpcarga` on the `registros` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `operarios_servicios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `recibo` on the `operarios_servicios` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `recibos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `recibo` on the `recibos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `recibo` on the `servicios` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "sueldos"."operarios_servicios" DROP CONSTRAINT "operarios_servicios_recibo_fkey";

-- DropForeignKey
ALTER TABLE "sueldos"."servicios" DROP CONSTRAINT "servicios_recibo_fkey";

-- AlterTable
ALTER TABLE "camiones"."registros" ALTER COLUMN "legajo_carga" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "motos"."operativos" ALTER COLUMN "legajo_a_cargo" SET DATA TYPE INTEGER,
ALTER COLUMN "legajo_planilla" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "motos"."registros" ALTER COLUMN "licencia" SET DATA TYPE INTEGER,
ALTER COLUMN "acta" SET DATA TYPE INTEGER,
ALTER COLUMN "lpcarga" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "nuevo_control"."operativos" ALTER COLUMN "lp" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "nuevo_control"."registros" ALTER COLUMN "lpcarga" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "operativos"."operativos" ALTER COLUMN "legajo_a_cargo" SET DATA TYPE INTEGER,
ALTER COLUMN "legajo_planilla" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "operativos"."registros" ALTER COLUMN "licencia" SET DATA TYPE INTEGER,
ALTER COLUMN "acta" SET DATA TYPE INTEGER,
ALTER COLUMN "lpcarga" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "sueldos"."operarios_servicios" DROP CONSTRAINT "operarios_servicios_pkey",
ALTER COLUMN "recibo" SET DATA TYPE INTEGER,
ADD CONSTRAINT "operarios_servicios_pkey" PRIMARY KEY ("legajo", "id_servicio", "recibo");

-- AlterTable
ALTER TABLE "sueldos"."recibos" DROP CONSTRAINT "recibos_pkey",
ALTER COLUMN "recibo" SET DATA TYPE INTEGER,
ADD CONSTRAINT "recibos_pkey" PRIMARY KEY ("recibo");

-- AlterTable
ALTER TABLE "sueldos"."servicios" ALTER COLUMN "recibo" SET DATA TYPE INTEGER;

-- AddForeignKey
ALTER TABLE "sueldos"."operarios_servicios" ADD CONSTRAINT "operarios_servicios_recibo_fkey" FOREIGN KEY ("recibo") REFERENCES "sueldos"."recibos"("recibo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sueldos"."servicios" ADD CONSTRAINT "servicios_recibo_fkey" FOREIGN KEY ("recibo") REFERENCES "sueldos"."recibos"("recibo") ON DELETE NO ACTION ON UPDATE NO ACTION;
