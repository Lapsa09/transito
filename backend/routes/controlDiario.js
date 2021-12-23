const router = require("express").Router();
const { DateTime } = require("luxon");
const pool = require("../pool");

router.get("/zonas", async (req, res) => {
  try {
    const zonas = await pool.query("select * from control_diario.localidades");
    res.json(zonas.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/motivos", async (req, res) => {
  try {
    const motivos = await pool.query("select * from control_diario.motivos");
    res.json(motivos.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  const {
    fecha,
    hora,
    direccion,
    dominio,
    lp,
    acta,
    resolucion,
    turno,
    lpcarga,
    motivo,
    otroMotivo,
    localidadInfractor,
  } = req.body;

  try {
    await pool.query(
      "insert into control_diario.control(fecha, hora, direccion, dominio, lp, acta, resolucion, turno, fechacarga, lpcarga, mes, id_motivo, otro_motivo, id_localidad) values($1, $2, $3, $4, $5, $6, $7, $8, now(), $9, $10, $11, $12, $13)",
      [
        fecha,
        hora,
        direccion,
        dominio,
        lp,
        acta,
        resolucion,
        turno,
        lpcarga,
        DateTime.fromFormat(fecha, "D", { locale: "es-AR" }).month,
        motivo,
        otroMotivo,
        localidadInfractor,
      ]
    );
    res.send("Success");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/paseo", async (req, res) => {
  const {
    fecha,
    hora,
    direccion,
    dominio,
    lp,
    acta,
    resolucion,
    turno,
    lpcarga,
    motivo,
    otroMotivo,
    localidadInfractor,
  } = req.body;

  try {
    await pool.query(
      "insert into nuevo_control.registros(fecha, hora, direccion, motivo, dominio, lp, acta, resolucion, turno, fechacarga, lpcarga, mes, id_localidad) values($1, $2, $3, $4, $5, $6, $7, $8, $9, now(), $10, $11, $12)",
      [
        fecha,
        hora,
        direccion,
        motivo,
        dominio,
        lp,
        acta,
        resolucion,
        turno,
        lpcarga,
        DateTime.fromFormat(fecha, "D", { locale: "es-AR" }).month,
        localidadInfractor,
      ]
    );
    res.send("Success");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
