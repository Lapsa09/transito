const router = require("express").Router;
const pool = require("../pool");
require("luxon");

router.get("/api/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const enums = await pool.query(
      "select distinct e.enumlabel from pg_type t join pg_enum e on t.oid = e.enumtypid join pg_catalog.pg_namespace n ON n.oid = t.typnamespace where t.typname=$1",
      [type]
    );
    res.json(enums.rows);
  } catch (error) {
    console.log(error);
    res.status(400).send("Not found");
  }
});

router.post("/operativos", async (req, res) => {
  try {
    const {
      fecha,
      hora,
      direccion,
      legajo_a_cargo,
      legajo_planilla,
      turno,
      seguridad,
      dominio,
      licencia,
      acta,
      motivo,
      graduacion_alcoholica,
      resolucion,
      lpcarga,
      es_del,
      resultado,
      cp,
      direccion_full,
      latitud,
      longitud,
      tipo_licencia,
      zona,
      zona_infractor,
    } = req.body;

    await pool.query(
      "insert into operativos.registros(fecha,hora,direccion,legajo_a_cargo,legajo_planilla,turno,seguridad,dominio,licencia,acta,motivo,graduacion_alcoholica,resolucion,fechacarga,lpcarga,mes,semana,es_del,resultado,cp,direccion_full,latitud,longitud,id_licencia,id_zona,id_zona_infractor) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)",
      [
        fecha,
        hora,
        direccion,
        legajo_a_cargo,
        legajo_planilla,
        turno,
        seguridad,
        dominio,
        licencia,
        acta,
        motivo,
        graduacion_alcoholica,
        resolucion,
        DateTime.now(),
        lpcarga,
        DateTime.fromISO(fecha).month,
        DateTime.fromISO(fecha).week,
        es_del,
        resultado,
        cp,
        direccion_full,
        latitud,
        longitud,
        tipo_licencia,
        zona,
        zona_infractor,
      ]
    );
    res.json("Success");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
