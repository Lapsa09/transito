const router = require("express").Router;
const pool = require("../pool");

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

module.exports = router;
