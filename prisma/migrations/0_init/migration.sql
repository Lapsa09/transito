-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "camiones";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "motos";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "nuevo_control";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "operativos";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "camiones"."motivos_camion" AS ENUM ('DISCAPACITADO', 'LICENCIA', 'CONTRAMANO', 'FALTA DE CHAPA PATENTE', 'FUERA DE LA RED DE TRANSITO PESADO', 'SIN CATEGORIA HABILITANTE', 'SE DA A LA FUGA');

-- CreateEnum
CREATE TYPE "nuevo_control"."motivo" AS ENUM ('VELOCIDAD', 'ESTACIONAMIENTO');

-- CreateEnum
CREATE TYPE "operativos"."del" AS ENUM ('VILO', 'FUERA DEL MUNICIPIO');

-- CreateEnum
CREATE TYPE "operativos"."resultado" AS ENUM ('NEGATIVA', 'PUNITIVA', 'NO PUNITIVA');

-- CreateEnum
CREATE TYPE "operativos"."tipo_vehiculo" AS ENUM ('Moto', 'Auto', 'Profesional');

-- CreateEnum
CREATE TYPE "public"."resolucion" AS ENUM ('ACTA', 'PREVENCION', 'REMITIDO');

-- CreateEnum
CREATE TYPE "public"."roles" AS ENUM ('INSPECTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."seguridad" AS ENUM ('POLICIA', 'PREFECTURA', 'SECRETARIA DE SEGURIDAD', 'NO');

-- CreateEnum
CREATE TYPE "public"."turnos" AS ENUM ('MAÑANA', 'TARDE', 'NOCHE');

-- CreateEnum
CREATE TYPE "public"."turnos_old" AS ENUM ('MAÑANA', 'TARDE', 'NOCHE', 'ADMIN', 'SEÑALAMIENTO', 'OPERATIVO');

-- CreateTable
CREATE TABLE "camiones"."operativos" (
    "id_op" SERIAL NOT NULL,
    "fecha" DATE,
    "turno" "public"."turnos_old",
    "legajo" VARCHAR,
    "direccion" VARCHAR,
    "id_localidad" INTEGER,
    "direccion_full" VARCHAR,
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,

    CONSTRAINT "operativos_pkey" PRIMARY KEY ("id_op")
);

-- CreateTable
CREATE TABLE "camiones"."registros" (
    "id" SERIAL NOT NULL,
    "hora" TIME(6),
    "dominio" VARCHAR,
    "origen" VARCHAR,
    "destino" VARCHAR,
    "licencia" VARCHAR,
    "remito" BOOLEAN,
    "carga" BOOLEAN,
    "resolucion" VARCHAR,
    "acta" VARCHAR,
    "hora_carga" TIME(6),
    "legajo_carga" BIGINT,
    "mes" INTEGER,
    "semana" INTEGER,
    "direccion_full" VARCHAR,
    "latitud" VARCHAR,
    "longitud" VARCHAR,
    "id_localidad_origen" INTEGER,
    "id_localidad_destino" INTEGER,
    "id_motivo" INTEGER,
    "id_operativo" INTEGER,

    CONSTRAINT "registros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motos"."moto_motivo" (
    "id_registro" INTEGER NOT NULL,
    "id_motivo" INTEGER NOT NULL,

    CONSTRAINT "moto_motivo_pkey" PRIMARY KEY ("id_registro","id_motivo")
);

-- CreateTable
CREATE TABLE "motos"."operativos" (
    "id_op" SERIAL NOT NULL,
    "fecha" DATE,
    "hora" TIME(6),
    "qth" VARCHAR,
    "legajo_a_cargo" BIGINT,
    "legajo_planilla" BIGINT,
    "turno" "public"."turnos_old",
    "seguridad" "public"."seguridad",
    "id_zona" INTEGER,
    "direccion_full" VARCHAR,
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,

    CONSTRAINT "operativos_pkey" PRIMARY KEY ("id_op")
);

-- CreateTable
CREATE TABLE "motos"."registros" (
    "dominio" VARCHAR,
    "licencia" BIGINT,
    "acta" BIGINT,
    "resolucion" "public"."resolucion",
    "fechacarga" TIMESTAMP(6),
    "lpcarga" BIGINT,
    "mes" INTEGER,
    "semana" INTEGER,
    "id" SERIAL NOT NULL,
    "direccion_full" VARCHAR,
    "latitud" VARCHAR,
    "longitud" VARCHAR,
    "id_licencia" INTEGER,
    "id_zona_infractor" INTEGER,
    "id_operativo" INTEGER,

    CONSTRAINT "registros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nuevo_control"."operativos" (
    "id_op" SERIAL NOT NULL,
    "fecha" DATE,
    "motivo" "nuevo_control"."motivo",
    "lp" BIGINT,
    "turno" "public"."turnos_old",

    CONSTRAINT "operativos_pkey" PRIMARY KEY ("id_op")
);

-- CreateTable
CREATE TABLE "nuevo_control"."registros" (
    "id" SERIAL NOT NULL,
    "hora" TIME(6),
    "dominio" VARCHAR,
    "acta" VARCHAR,
    "resolucion" "public"."resolucion",
    "fechacarga" VARCHAR,
    "lpcarga" BIGINT,
    "mes" INTEGER,
    "id_localidad" INTEGER,
    "id_operativo" INTEGER,
    "id_zona" INTEGER,

    CONSTRAINT "registros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nuevo_control"."zonas" (
    "id_zona" SERIAL NOT NULL,
    "zona" VARCHAR,

    CONSTRAINT "zonas_pkey" PRIMARY KEY ("id_zona")
);

-- CreateTable
CREATE TABLE "operativos"."operativos" (
    "id_op" SERIAL NOT NULL,
    "fecha" DATE,
    "qth" VARCHAR,
    "turno" "public"."turnos",
    "legajo_a_cargo" BIGINT,
    "legajo_planilla" BIGINT,
    "id_localidad" INTEGER,
    "seguridad" "public"."seguridad",
    "hora" TIME(6),
    "direccion_full" VARCHAR,
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,

    CONSTRAINT "operativos_pkey" PRIMARY KEY ("id_op")
);

-- CreateTable
CREATE TABLE "operativos"."registros" (
    "dominio" VARCHAR,
    "licencia" BIGINT,
    "acta" BIGINT,
    "graduacion_alcoholica" VARCHAR,
    "resolucion" "public"."resolucion",
    "fechacarga" TIMESTAMP(6),
    "lpcarga" BIGINT,
    "mes" INTEGER,
    "semana" INTEGER,
    "es_del" "operativos"."del",
    "resultado" "operativos"."resultado",
    "id" SERIAL NOT NULL,
    "direccion_full" VARCHAR,
    "latitud" VARCHAR,
    "longitud" VARCHAR,
    "id_licencia" INTEGER,
    "id_zona_infractor" INTEGER,
    "id_operativo" INTEGER,
    "id_motivo" INTEGER,

    CONSTRAINT "registros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."asd" (
    "id" SERIAL NOT NULL,
    "zona" VARCHAR,
    "id_zona" INTEGER,

    CONSTRAINT "asd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."barrios" (
    "id_barrio" SERIAL NOT NULL,
    "barrio" VARCHAR,

    CONSTRAINT "barrios_pkey" PRIMARY KEY ("id_barrio")
);

-- CreateTable
CREATE TABLE "public"."legajos" (
    "legajo" BIGINT NOT NULL,
    "turno" "public"."turnos",
    "rol" "public"."roles",
    "id_rol" INTEGER,

    CONSTRAINT "legajos_pkey" PRIMARY KEY ("legajo")
);

-- CreateTable
CREATE TABLE "public"."mensual" (
    "id" SERIAL NOT NULL,
    "mes" VARCHAR,
    "año" INTEGER,
    "monto" INTEGER,

    CONSTRAINT "mensual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."motivos" (
    "id_motivo" SERIAL NOT NULL,
    "motivo" VARCHAR,

    CONSTRAINT "motivos_pkey" PRIMARY KEY ("id_motivo")
);

-- CreateTable
CREATE TABLE "public"."operario" (
    "legajo" INTEGER NOT NULL,
    "nombre" VARCHAR,

    CONSTRAINT "operario_pkey" PRIMARY KEY ("legajo")
);

-- CreateTable
CREATE TABLE "public"."permisos" (
    "id" SERIAL NOT NULL,
    "permiso" VARCHAR,

    CONSTRAINT "permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."primeros" (
    "count" BIGINT
);

-- CreateTable
CREATE TABLE "public"."puntajes" (
    "id" SERIAL NOT NULL,
    "interaccion_publico" INTEGER,
    "jerarquicos" INTEGER,
    "errores_actas" INTEGER,
    "destacado" INTEGER,
    "llamados_atencion" INTEGER,
    "asistencia" INTEGER,
    "a_percibir" DOUBLE PRECISION,
    "legajo" INTEGER,
    "id_mes" INTEGER,

    CONSTRAINT "puntajes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tipo_licencias" (
    "id_tipo" SERIAL NOT NULL,
    "tipo" VARCHAR,
    "vehiculo" VARCHAR,

    CONSTRAINT "tipo_licencias_pkey" PRIMARY KEY ("id_tipo")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "legajo" BIGINT NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "apellido" VARCHAR NOT NULL,
    "user_password" VARCHAR(255) NOT NULL,
    "telefono" BIGINT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("legajo")
);

-- CreateTable
CREATE TABLE "public"."vicente_lopez" (
    "id_barrio" SERIAL NOT NULL,
    "barrio" VARCHAR,
    "cp" VARCHAR,

    CONSTRAINT "vicente_lopez_pkey" PRIMARY KEY ("id_barrio")
);

-- AddForeignKey
ALTER TABLE "camiones"."registros" ADD CONSTRAINT "registros_id_localidad_destino_fkey" FOREIGN KEY ("id_localidad_destino") REFERENCES "public"."barrios"("id_barrio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "camiones"."registros" ADD CONSTRAINT "registros_id_localidad_origen_fkey" FOREIGN KEY ("id_localidad_origen") REFERENCES "public"."barrios"("id_barrio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "camiones"."registros" ADD CONSTRAINT "registros_id_motivo_fkey" FOREIGN KEY ("id_motivo") REFERENCES "public"."motivos"("id_motivo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "camiones"."registros" ADD CONSTRAINT "registros_id_operativo_fkey" FOREIGN KEY ("id_operativo") REFERENCES "camiones"."operativos"("id_op") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "motos"."moto_motivo" ADD CONSTRAINT "moto_motivo_id_motivo_fkey" FOREIGN KEY ("id_motivo") REFERENCES "public"."motivos"("id_motivo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "motos"."moto_motivo" ADD CONSTRAINT "moto_motivo_id_registro_fkey" FOREIGN KEY ("id_registro") REFERENCES "motos"."registros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

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
ALTER TABLE "operativos"."registros" ADD CONSTRAINT "fk_licencia" FOREIGN KEY ("id_licencia") REFERENCES "public"."tipo_licencias"("id_tipo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "operativos"."registros" ADD CONSTRAINT "fk_zona_infractor" FOREIGN KEY ("id_zona_infractor") REFERENCES "public"."barrios"("id_barrio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "operativos"."registros" ADD CONSTRAINT "registros_id_motivo_fkey" FOREIGN KEY ("id_motivo") REFERENCES "public"."motivos"("id_motivo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "operativos"."registros" ADD CONSTRAINT "registros_id_operativo_fkey" FOREIGN KEY ("id_operativo") REFERENCES "operativos"."operativos"("id_op") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."legajos" ADD CONSTRAINT "legajos_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "public"."permisos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."puntajes" ADD CONSTRAINT "puntajes_id_mes_fkey" FOREIGN KEY ("id_mes") REFERENCES "public"."mensual"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."puntajes" ADD CONSTRAINT "puntajes_legajo_fkey" FOREIGN KEY ("legajo") REFERENCES "public"."operario"("legajo") ON DELETE NO ACTION ON UPDATE NO ACTION;

