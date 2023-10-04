/*
  Warnings:

  - You are about to drop the `sector` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "waze";

-- DropForeignKey
ALTER TABLE "logistica"."movil" DROP CONSTRAINT "movil_id_uso_fkey";

-- DropTable
DROP TABLE "logistica"."sector";

-- CreateTable
CREATE TABLE "logistica"."uso" (
    "id_uso" SERIAL NOT NULL,
    "uso" VARCHAR,
    "id_dependencia" INTEGER NOT NULL,

    CONSTRAINT "uso_pkey" PRIMARY KEY ("id_uso")
);

-- CreateTable
CREATE TABLE "waze"."calles" (
    "id" SERIAL NOT NULL,
    "calles" VARCHAR NOT NULL,

    CONSTRAINT "calles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waze"."dia" (
    "id" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,

    CONSTRAINT "dia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waze"."horarios" (
    "id" SERIAL NOT NULL,
    "horario" TIME(6) NOT NULL,

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waze"."nivel_trafico" (
    "id" SERIAL NOT NULL,
    "nivel" VARCHAR NOT NULL,

    CONSTRAINT "nivel_trafico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waze"."recorrido" (
    "id" SERIAL NOT NULL,
    "id_calles" INTEGER NOT NULL,
    "id_reporte" INTEGER NOT NULL,
    "tiempo" INTEGER NOT NULL,
    "tiempo_hist" INTEGER NOT NULL,
    "velocidad" INTEGER NOT NULL,
    "velocidad_hist" INTEGER NOT NULL,
    "id_trafico" INTEGER NOT NULL,

    CONSTRAINT "recorrido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waze"."reporte" (
    "id" SERIAL NOT NULL,
    "id_horario" INTEGER NOT NULL,
    "id_dia" INTEGER NOT NULL,

    CONSTRAINT "reporte_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "logistica"."movil" ADD CONSTRAINT "movil_id_uso_fkey" FOREIGN KEY ("id_uso") REFERENCES "logistica"."uso"("id_uso") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistica"."uso" ADD CONSTRAINT "uso_id_dependencia_fkey" FOREIGN KEY ("id_dependencia") REFERENCES "logistica"."dependencia"("id_dependencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waze"."recorrido" ADD CONSTRAINT "recorrido_id_calles_fkey" FOREIGN KEY ("id_calles") REFERENCES "waze"."calles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "waze"."recorrido" ADD CONSTRAINT "recorrido_id_reporte_fkey" FOREIGN KEY ("id_reporte") REFERENCES "waze"."reporte"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "waze"."recorrido" ADD CONSTRAINT "recorrido_id_trafico_fkey" FOREIGN KEY ("id_trafico") REFERENCES "waze"."nivel_trafico"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "waze"."reporte" ADD CONSTRAINT "reporte_id_dia_fkey" FOREIGN KEY ("id_dia") REFERENCES "waze"."dia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "waze"."reporte" ADD CONSTRAINT "reporte_id_horario_fkey" FOREIGN KEY ("id_horario") REFERENCES "waze"."horarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
