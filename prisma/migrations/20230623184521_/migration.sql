-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_legajo_fkey" FOREIGN KEY ("legajo") REFERENCES "public"."legajos"("legajo") ON DELETE NO ACTION ON UPDATE NO ACTION;
