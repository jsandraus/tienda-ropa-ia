const db = require("../db");

exports.getProductos = (req, res) => {

    const query = "SELECT * FROM producto";

    db.query(query, (err, results) => {

        if (err) {
            console.error(err);
            res.status(500).json({error: "Error en la base de datos"});
            return;
        }

        res.json(results);

    });

};