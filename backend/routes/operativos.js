const router = require("express").Router();
const pool = require("../pool");
require("luxon");

router.get("/zonas/vl", async (req, res) => {
  try {
    const zonas = await pool.query(
      "select * from operativos.zonas where cp is not null"
    );
    res.json(zonas.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/licencias", async (req, res) => {
  try {
    const licencias = await pool.query("select * from operativos.licencias");
    res.json(licencias.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/zonas/all", async (req, res) => {
  try {
    const zonas = await pool.query("select * from operativos.zonas");
    res.json(zonas.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
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
        `${direccion}, ${cp}, Vicente Lopez, Buenos Aires, Argentina`,
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
