/*
  Warnings:

  - You are about to drop the column `direccion_full` on the `registros` table. All the data in the column will be lost.
  - You are about to drop the column `latitud` on the `registros` table. All the data in the column will be lost.
  - You are about to drop the column `longitud` on the `registros` table. All the data in the column will be lost.
  - You are about to alter the column `graduacion_alcoholica` on the `registros` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Real`.
  - Made the column `dominio` on table `registros` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id_zona_infractor` on table `registros` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id_operativo` on table `registros` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "logistica";

-- DropForeignKey
ALTER TABLE "camiones"."operativos" DROP CONSTRAINT "operativos_id_localidad_fkey";

-- DropForeignKey
ALTER TABLE "motos"."moto_motivo" DROP CONSTRAINT "moto_motivo_id_motivo_fkey";

-- DropForeignKey
ALTER TABLE "motos"."moto_motivo" DROP CONSTRAINT "moto_motivo_id_registro_fkey";

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
ALTER TABLE "public"."legajos" DROP CONSTRAINT "legajos_id_rol_fkey";

-- DropForeignKey
ALTER TABLE "public"."puntajes" DROP CONSTRAINT "puntajes_id_mes_fkey";

-- DropForeignKey
ALTER TABLE "public"."puntajes" DROP CONSTRAINT "puntajes_legajo_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_legajo_fkey";

-- DropForeignKey
ALTER TABLE "sueldos"."servicios" DROP CONSTRAINT "servicios_id_cliente_fkey";

-- AlterTable
ALTER TABLE "operativos"."registros" DROP COLUMN "direccion_full",
DROP COLUMN "latitud",
DROP COLUMN "longitud",
ALTER COLUMN "dominio" SET NOT NULL,
ALTER COLUMN "acta" SET DATA TYPE BIGINT,
ALTER COLUMN "resolucion" SET DEFAULT 'PREVENCION',
ALTER COLUMN "fechacarga" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id_zona_infractor" SET NOT NULL,
ALTER COLUMN "id_operativo" SET NOT NULL,
ALTER COLUMN "graduacion_alcoholica" SET DATA TYPE REAL;

-- CreateTable
CREATE TABLE "logistica"."dependencia" (
    "id_dependencia" SERIAL NOT NULL,
    "dependencia" VARCHAR,

    CONSTRAINT "dependencia_pkey" PRIMARY KEY ("id_dependencia")
);

-- CreateTable
CREATE TABLE "logistica"."kilometraje_vehiculos" (
    "id" SERIAL NOT NULL,
    "patente" TEXT NOT NULL,
    "fecha" DATE,
    "km" INTEGER,
    "kit_poly_v" INTEGER,
    "proximo_cambio_poly_v" INTEGER,
    "kit_distribucion" INTEGER,
    "proximo_cambio_distribucion" INTEGER,
    "filtro_aceite" INTEGER,
    "proximo_cambio_filtro" INTEGER,
    "interno" VARCHAR,

    CONSTRAINT "kilometraje_vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistica"."movil" (
    "patente" VARCHAR NOT NULL,
    "marca" VARCHAR,
    "nro_movil" VARCHAR,
    "modelo" VARCHAR,
    "año" INTEGER,
    "tipo_combustible" VARCHAR,
    "id_uso" INTEGER,
    "tipo_motor" DOUBLE PRECISION,
    "empresa_seguimiento" VARCHAR,
    "km/dia" INTEGER,
    "plan_renovacion" BOOLEAN,
    "id_tipo_vehiculo" INTEGER,
    "id_dependencia" INTEGER,
    "no_chasis" BIGINT,
    "id_megatrans" VARCHAR,

    CONSTRAINT "movil_pkey" PRIMARY KEY ("patente")
);

-- CreateTable
CREATE TABLE "logistica"."proveedor" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR,
    "tipo" VARCHAR,
    "marcas" VARCHAR,
    "ciudad" VARCHAR,
    "provincia" VARCHAR,
    "email" VARCHAR,
    "email_alternativo" VARCHAR,
    "direccion" VARCHAR,
    "telefono" VARCHAR,
    "horarios" VARCHAR,

    CONSTRAINT "proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistica"."reparaciones" (
    "id" SERIAL NOT NULL,
    "fecha" DATE,
    "concepto" VARCHAR,
    "estado" VARCHAR,
    "articulo" INTEGER NOT NULL,
    "patente" VARCHAR,
    "retira" VARCHAR,
    "observacion" VARCHAR,

    CONSTRAINT "reparaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistica"."sector" (
    "id_sector" SERIAL NOT NULL,
    "sector" VARCHAR,

    CONSTRAINT "sector_pkey" PRIMARY KEY ("id_sector")
);

-- CreateTable
CREATE TABLE "logistica"."pedido_repuesto" (
    "id" SERIAL NOT NULL,
    "orden_compra" INTEGER,
    "fecha_pedido" DATE,
    "fecha_entrega" DATE,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "id_proveedor" INTEGER NOT NULL,

    CONSTRAINT "pedido_repuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistica"."repuesto" (
    "id" SERIAL NOT NULL,
    "id_tipo_repuesto" INTEGER NOT NULL,
    "item" VARCHAR,
    "stock" INTEGER DEFAULT 0,

    CONSTRAINT "repuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistica"."tipo_repuesto" (
    "id_tipo_repuesto" SERIAL NOT NULL,
    "tipo" VARCHAR NOT NULL,

    CONSTRAINT "tipo_repuesto_pkey" PRIMARY KEY ("id_tipo_repuesto")
);

-- CreateTable
CREATE TABLE "logistica"."tipo_vehiculo" (
    "id_tipo" SERIAL NOT NULL,
    "tipo" VARCHAR,

    CONSTRAINT "tipo_vehiculo_pkey" PRIMARY KEY ("id_tipo")
);

-- CreateTable
CREATE TABLE "logistica"."vtv" (
    "id" SERIAL NOT NULL,
    "patente" VARCHAR NOT NULL,
    "nro_movil" VARCHAR,
    "fecha_emision" DATE,
    "observacion" VARCHAR,
    "vencimiento" DATE,
    "condicion" VARCHAR,
    "estado" VARCHAR,

    CONSTRAINT "vtv_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reparaciones_articulo_key" ON "logistica"."reparaciones"("articulo");

-- AddForeignKey
ALTER TABLE "camiones"."operativos" ADD CONSTRAINT "operativos_id_localidad_fkey" FOREIGN KEY ("id_localidad") REFERENCES "public"."vicente_lopez"("id_barrio") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motos"."moto_motivo" ADD CONSTRAINT "moto_motivo_id_motivo_fkey" FOREIGN KEY ("id_motivo") REFERENCES "public"."motivos"("id_motivo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motos"."moto_motivo" ADD CONSTRAINT "moto_motivo_id_registro_fkey" FOREIGN KEY ("id_registro") REFERENCES "motos"."registros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motos"."operativos" ADD CONSTRAINT "operativos_id_zona_fkey" FOREIGN KEY ("id_zona") REFERENCES "public"."vicente_lopez"("id_barrio") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motos"."registros" ADD CONSTRAINT "fk_licencia" FOREIGN KEY ("id_licencia") REFERENCES "public"."tipo_licencias"("id_tipo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motos"."registros" ADD CONSTRAINT "fk_zona_infractor" FOREIGN KEY ("id_zona_infractor") REFERENCES "public"."barrios"("id_barrio") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motos"."registros" ADD CONSTRAINT "registros_id_operativo_fkey" FOREIGN KEY ("id_operativo") REFERENCES "motos"."operativos"("id_op") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nuevo_control"."registros" ADD CONSTRAINT "fk_localidad" FOREIGN KEY ("id_localidad") REFERENCES "public"."barrios"("id_barrio") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nuevo_control"."registros" ADD CONSTRAINT "registros_id_operativo_fkey" FOREIGN KEY ("id_operativo") REFERENCES "nuevo_control"."operativos"("id_op") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nuevo_control"."registros" ADD CONSTRAINT "registros_id_zona_fkey" FOREIGN KEY ("id_zona") REFERENCES "nuevo_control"."zonas"("id_zona") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."puntajes" ADD CONSTRAINT "puntajes_id_mes_fkey" FOREIGN KEY ("id_mes") REFERENCES "public"."mensual"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."puntajes" ADD CONSTRAINT "puntajes_legajo_fkey" FOREIGN KEY ("legajo") REFERENCES "public"."operario"("legajo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."legajos" ADD CONSTRAINT "legajos_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "public"."permisos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_legajo_fkey" FOREIGN KEY ("legajo") REFERENCES "public"."legajos"("legajo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sueldos"."servicios" ADD CONSTRAINT "servicios_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "sueldos"."clientes"("id_cliente") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistica"."kilometraje_vehiculos" ADD CONSTRAINT "kilometraje_vehiculos_patente_fkey" FOREIGN KEY ("patente") REFERENCES "logistica"."movil"("patente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistica"."movil" ADD CONSTRAINT "movil_id_dependencia_fkey" FOREIGN KEY ("id_dependencia") REFERENCES "logistica"."dependencia"("id_dependencia") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistica"."movil" ADD CONSTRAINT "movil_id_tipo_vehiculo_fkey" FOREIGN KEY ("id_tipo_vehiculo") REFERENCES "logistica"."tipo_vehiculo"("id_tipo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistica"."movil" ADD CONSTRAINT "movil_id_uso_fkey" FOREIGN KEY ("id_uso") REFERENCES "logistica"."sector"("id_sector") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistica"."reparaciones" ADD CONSTRAINT "reparaciones_patente_fkey" FOREIGN KEY ("patente") REFERENCES "logistica"."movil"("patente") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistica"."pedido_repuesto" ADD CONSTRAINT "pedido_repuesto_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "logistica"."proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistica"."repuesto" ADD CONSTRAINT "fk_pedido" FOREIGN KEY ("id") REFERENCES "logistica"."pedido_repuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistica"."repuesto" ADD CONSTRAINT "repuesto_id_tipo_repuesto_fkey" FOREIGN KEY ("id_tipo_repuesto") REFERENCES "logistica"."tipo_repuesto"("id_tipo_repuesto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistica"."repuesto" ADD CONSTRAINT "repuesto_id_fkey" FOREIGN KEY ("id") REFERENCES "logistica"."reparaciones"("articulo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistica"."vtv" ADD CONSTRAINT "vtv_patente_fkey" FOREIGN KEY ("patente") REFERENCES "logistica"."movil"("patente") ON DELETE NO ACTION ON UPDATE NO ACTION;
