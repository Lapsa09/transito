/*
  Warnings:

  - The primary key for the `legajos` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_legajo_fkey";

-- AlterTable
ALTER TABLE "public"."legajos" DROP CONSTRAINT "legajos_pkey",
ALTER COLUMN "legajo" SET DATA TYPE BIGINT,
ADD CONSTRAINT "legajos_pkey" PRIMARY KEY ("legajo");

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "legajo" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_legajo_fkey" FOREIGN KEY ("legajo") REFERENCES "public"."legajos"("legajo") ON DELETE NO ACTION ON UPDATE NO ACTION;
