const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookMongoController");

router.get("/", bookController.getAllBooks);
router.post("/", bookController.createBook);

module.exports = router;
