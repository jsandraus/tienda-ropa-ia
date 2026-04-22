const db = require("../db");

/* Obtener todos los registros */
exports.getAll = async (req, res) => {

  const tabla = req.params.tabla;

  try {

    const [rows] = await db.query(`SELECT * FROM ${tabla}`);

    res.json(rows);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Error en base de datos" });

  }

};


/* Obtener registro por ID */
exports.getById = async (req, res) => {

  const { tabla, id } = req.params;

  try {

    const [cols] = await db.query(
      `SHOW KEYS FROM ${tabla} WHERE Key_name = 'PRIMARY'`
    );

    const pk = cols[0].Column_name;

    const [rows] = await db.query(
      `SELECT * FROM ${tabla} WHERE ${pk} = ?`,
      [id]
    );

    res.json(rows[0]);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Error en base de datos" });

  }

};


/* Crear registro */
exports.create = async (req, res) => {

  const tabla = req.params.tabla;
  const data = req.body;

  try {

    const [result] = await db.query(
      `INSERT INTO ${tabla} SET ?`,
      data
    );

    res.json({
      mensaje: "Registro creado",
      id: result.insertId
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Error al insertar" });

  }

};


/* Eliminar registro */
exports.delete = async (req, res) => {

  const { tabla, id } = req.params;

  try {

    const [cols] = await db.query(
      `SHOW KEYS FROM ${tabla} WHERE Key_name = 'PRIMARY'`
    );

    const pk = cols[0].Column_name;

    await db.query(
      `DELETE FROM ${tabla} WHERE ${pk} = ?`,
      [id]
    );

    res.json({ mensaje: "Registro eliminado" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Error al eliminar" });

  }

};