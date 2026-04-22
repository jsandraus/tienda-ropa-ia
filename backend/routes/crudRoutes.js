const express = require("express");
const router = express.Router();

const crud = require("../controllers/crudController");

router.get("/:tabla", crud.getAll);

router.get("/:tabla/:id", crud.getById);

router.post("/:tabla", crud.create);

router.delete("/:tabla/:id", crud.delete);

module.exports = router;