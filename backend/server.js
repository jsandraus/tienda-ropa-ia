const express = require("express");
const cors = require("cors");
const db = require("./db");

const crudRoutes = require("./routes/crudRoutes");
const productoRoutes = require("./routes/productoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", productoRoutes);
app.use("/api", crudRoutes);

app.get("/", (req, res) => {
    res.send("API tienda de ropa funcionando");
});


app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SHOW TABLES");
    res.json(rows);
  } catch (error) {
    console.error("ERROR REAL:", error); // 👈 importante
    res.status(500).json({ error: error.message }); // 👈 mostrar error real
  }
});

app.get("/api/:tablas", async (req, res) => {
  const { tabla } = req.params;

  const tablaSegura = tabla === "Order" ? "`Order`" : tabla;

  try {
    const [rows] = await db.query(`SELECT * FROM ${tablaSegura}`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

app.delete("/api/:tabla/:id", async (req, res) => {
  const { tabla, id } = req.params;

  const tablaSegura = tabla === "Order" ? "`Order`" : tabla;

  try {

    const [cols] = await db.query(`SHOW KEYS FROM ${tabla} WHERE Key_name = 'PRIMARY'`);
    const pk = cols[0].Column_name;

    await db.query(`DELETE FROM ${tabla} WHERE ${pk} = ?`, [id]);

    res.json({ mensaje: "Registro eliminado" });

  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/api/:tabla", async (req, res) => {
  const { tabla } = req.params;
  const datos = req.body;
  console.log("tabla:", tabla);
  console.log("datos:", datos);

  const tablaSegura = tabla === "Order" ? "`Order`" : tabla;

  try {

    const columnas = Object.keys(datos).join(", ");
    const valores = Object.values(datos);
    const placeholders = valores.map(() => "?").join(", ");

    const query = `
      INSERT INTO ${tabla} (${columnas})
      VALUES (${placeholders})
    `;

    const [result] = await db.query(query, valores);

    res.json({ id: result.insertId });

  } catch (err) {
    res.status(500).json(err);
  }
});

app.put("/api/:tabla/:id", async (req, res) => {
  const { tabla, id } = req.params;
  const datos = req.body;

  const tablaSegura = tabla === "Order" ? "`Order`" : tabla;

  try {

    const [cols] = await db.query(`SHOW KEYS FROM ${tabla} WHERE Key_name='PRIMARY'`);
    const pk = cols[0].Column_name;

    const set = Object.keys(datos)
      .map((col) => `${col} = ?`)
      .join(", ");

    const valores = Object.values(datos);

    await db.query(
      `UPDATE ${tabla} SET ${set} WHERE ${pk} = ?`,
      [...valores, id]
    );

    res.json({ mensaje: "actualizado" });

  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/api/tablas", async (req, res) => {

  const tablaSegura = tabla === "Order" ? "`Order`" : tabla;

  try {

    const [rows] = await db.query("SHOW TABLES");

    const tablas = rows.map(obj => Object.values(obj)[0]);

    res.json(tablas);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Error obteniendo tablas" });

  }

});

const PORT = 5000;

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto", PORT);
});